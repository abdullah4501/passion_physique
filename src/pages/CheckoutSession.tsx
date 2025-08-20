import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bannerImg from '@/assets/session/banner.png';
import bannerImg2 from '@/assets/bg/guidanceBg.png';
import bg from "@/assets/bg/Plans.png";
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { authFetch } from '@/utils/authFetch';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import PaymentSuccessModal from "@/components/PaymentSuccessModal";

const paymentOptions = [
    { key: "stripe", label: "Stripe" },
];

const CheckoutSession = () => {
    const { productId } = useParams(); // Changed from sessionId to productId for generic use
    const navigate = useNavigate();
    const location = useLocation();
    const heroRef = useRef(null);
    const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [stripeError, setStripeError] = useState("");
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [savedCards, setSavedCards] = useState([]);
    const [defaultCardId, setDefaultCardId] = useState('');
    const [useSavedCard, setUseSavedCard] = useState(true);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        cardNumber: "",
        expDate: "",
        cvv: "",
        paymentMethod: "stripe",
        saveInfo: false,
        agreed: false,
    });
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Determine product type from URL
    const productType = location.pathname.includes('session') ? 'session' : 'supplement-guidance';
    const apiEndpoint = productType === 'session' ? `/api/sessions` : `/api/guidance`;
    const pageTitle = productType === 'session' ? '1-on-1 Session' : 'Supplement Guidance';
    const breadcrumbPath = productType === 'session' ? 'Home / 1-on-1 Session / Payment' : 'Home / Supplement Guidance / Payment';

    // Fetch saved cards and default card
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`${import.meta.env.VITE_API_URL}/api/payments/saved-cards`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setSavedCards(data.cards || []);
            });

        fetch(`${import.meta.env.VITE_API_URL}/api/payments/default-card`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setDefaultCardId(data.defaultCardId || "");
            });
    }, []);

    // Redirect to login if no token
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login", { replace: true });
            return;
        }
    }, [navigate]);

    // Fetch user info
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            authFetch(
                `${import.meta.env.VITE_API_URL}/api/auth/user/${user.id}`,
                {},
                navigate
            ).then(data => {
                if (data) {
                    setForm(prev => ({
                        ...prev,
                        firstName: data.user.firstName,
                        lastName: data.user.lastName,
                        email: data.user.email
                    }));
                }
            });
        }
    }, [navigate]);

    // Fetch product data
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}${apiEndpoint}`)
            .then(res => res.json())
            .then(data => {
                setProduct(productType === 'session' ? data.sessions[0] : data.supplementGuidance[0]);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [apiEndpoint, productType]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "cvv") {
            const numericValue = value.replace(/\D/g, "").slice(0, 4);
            setForm((prev) => ({
                ...prev,
                [name]: numericValue,
            }));
            return;
        }
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handle payment submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStripeError("");
        setProcessing(true);

        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        if (!token || !user) {
            setStripeError("Please log in to continue.");
            setProcessing(false);
            return;
        }
        if (!form.agreed) {
            setStripeError("Please agree to the Privacy & Terms.");
            setProcessing(false);
            return;
        }
        if (!stripe || !elements) {
            setStripeError("Stripe is not loaded");
            setProcessing(false);
            return;
        }
        try {
            let paymentMethodId = null;

            if (form.paymentMethod === "stripe" && savedCards.length > 0 && useSavedCard) {
                const defaultCard = savedCards.find(card => card.id === defaultCardId) || savedCards[0];
                paymentMethodId = defaultCard.id;
            } else {
                const cardElement = elements.getElement(CardNumberElement);
                const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
                    type: "card",
                    card: cardElement,
                    billing_details: {
                        name: `${form.firstName} ${form.lastName}`,
                        email: form.email,
                    },
                });
                if (pmError) throw pmError;
                paymentMethodId = paymentMethod.id;
            }

            const intentRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/create-payment-intent`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    amount: product.amount,
                    currency: "eur",
                    saveCard: form.saveInfo,
                    ...(paymentMethodId ? { paymentMethodId } : {}),
                }),
            });
            const { clientSecret, error: intentErr } = await intentRes.json();
            if (!intentRes.ok || !clientSecret) throw new Error(intentErr || "Payment initiation failed.");

            let confirmResult;
            if (form.paymentMethod === "stripe" && savedCards.length > 0 && useSavedCard) {
                confirmResult = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: paymentMethodId,
                });
            } else {
                const cardElement = elements.getElement(CardNumberElement);
                confirmResult = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: `${form.firstName} ${form.lastName}`,
                            email: form.email,
                        }
                    }
                });
            }

            const { paymentIntent, error: confirmError } = confirmResult;
            if (confirmError) throw confirmError;
            if (!paymentIntent || paymentIntent.status !== "succeeded") {
                throw new Error("Payment did not succeed. Please try again.");
            }

            const purchaseRes = await fetch(`${import.meta.env.VITE_API_URL}/api/purchases`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user: user.id,
                    itemType: productType,
                    itemId: product._id,
                    itemName: product.name,
                    amount: product.amount,
                    stripePaymentId: paymentIntent.id,
                }),
            });
            if (!purchaseRes.ok) {
                const { error } = await purchaseRes.json();
                throw new Error(error || "Failed to save purchase.");
            }

            setSuccessModalOpen(true);
        } catch (err) {
            setStripeError(err.message || "Payment failed.");
            console.error("Payment error:", err);
        }
        setProcessing(false);
    };

    const heroVariants = {
        hidden: { opacity: 0, y: 44, scale: 0.96 },
        visible: { opacity: 1, y: 0, scale: 1 }
    };

    return (
        <>
            <Header />
            <section className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
                <img
                    src={productType==='session'? bannerImg : bannerImg2}
                    alt={pageTitle}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    draggable={false}
                />
                <div className="absolute inset-0" />
                <div className="relative z-10 flex flex-col items-center justify-center w-full">
                    <motion.h1
                        ref={heroRef}
                        className="text-[66px] font-bold uppercase leading-[80px] mb-4 select-none page-title"
                        variants={heroVariants}
                        initial="hidden"
                        animate={heroInView ? "visible" : "hidden"}
                        transition={{ duration: 0.85, ease: [0.42, 0, 0.2, 1] }}
                    >
                        <span className="text-primary">{pageTitle.split(' ')[0]}</span>{" "}
                        <span className="text-white">{pageTitle.split(' ')[1]}</span>
                    </motion.h1>
                    <motion.div
                        variants={heroVariants}
                        initial="hidden"
                        animate={heroInView ? "visible" : "hidden"}
                        transition={{ duration: 1, delay: 0.15, ease: [0.42, 0, 0.2, 1] }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-white font-bold text-[26px] leading-[26px] breadcrumbs">
                            {breadcrumbPath}
                        </span>
                    </motion.div>
                </div>
            </section>
            <section className="w-full py-[125px] bg-black">
                <div className="container">
                    <h2 className="text-white font-[700] tracking-[4%] text-[36px] mb-12 mt-6">
                        Payment Details
                    </h2>
                    <div className="grid grid-cols-2 gap-16">
                        {/* Payment Form */}
                        <div className="lg:col-span-1 col-span-2 w-full order-2 lg:order-1">
                            <form className="flex flex-col gap-5 mb-8" onSubmit={handleSubmit}>
                                <div className="border-b border-[#acacac] pb-3">
                                    <h2 className="text-white text-[24px] font-[600]">Your Info</h2>
                                </div>
                                <>
                                    <div>
                                        <label className="block text-[#fff] font-[600] text-[18px] mb-2" htmlFor="firstName">
                                            First Name:
                                        </label>
                                        <p className='mt-4 text-[16px] font-[400]'>{form.firstName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-[#fff] font-[600] text-[18px] mb-2" htmlFor="lastName">
                                            Last Name:
                                        </label>
                                        <p className='mt-4 text-[16px] font-[400]'>{form.lastName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-[#fff] font-[600] text-[18px] mb-2" htmlFor="email">
                                            Email Address:
                                        </label>
                                        <p className='mt-4 text-[16px] font-[400]'>{form.email}</p>
                                    </div>
                                </>
                                <div className="border-b border-[#acacac] pb-3 mt-4">
                                    <h2 className="text-white text-[24px] font-[600]">Payment Info</h2>
                                </div>
                                <div>
                                    <span className="block text-[#fff] text-[18px] font-[600]">Pay With:</span>
                                </div>
                                {form.paymentMethod === "stripe" && savedCards.length > 0 && useSavedCard ? (
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-white text-lg">
                                            {(savedCards.find(card => card.id === defaultCardId) || savedCards[0]).brand.charAt(0).toUpperCase() +
                                                (savedCards.find(card => card.id === defaultCardId) || savedCards[0]).brand.slice(1)}
                                            {" xxxx xxxx xxxx "}
                                            {(savedCards.find(card => card.id === defaultCardId) || savedCards[0]).last4}
                                            {" end at "}
                                            {String((savedCards.find(card => card.id === defaultCardId) || savedCards[0]).exp_month).padStart(2, "0")}/
                                            {String((savedCards.find(card => card.id === defaultCardId) || savedCards[0]).exp_year).slice(-2)}
                                        </span>
                                        <Button
                                            type="button"
                                            className="ml-6 bg-[#ff3c33] hover:bg-[#e03228] text-white font-[600] text-[16px] px-8 py-2 rounded-none"
                                            onClick={() => setUseSavedCard(false)}
                                        >
                                            Use Another Payment Way
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex gap-7">
                                            {paymentOptions.map((opt) => (
                                                <label key={opt.key} className="flex items-center gap-2 cursor-pointer select-none">
                                                    <input
                                                        type="radio"
                                                        name="paymentMethod"
                                                        value={opt.key}
                                                        checked={form.paymentMethod === opt.key}
                                                        onChange={e => {
                                                            handleChange(e);
                                                            if (opt.key === "stripe") setUseSavedCard(true);
                                                        }}
                                                        className="sr-only"
                                                    />
                                                    <span
                                                        className={`
                                                            w-5 h-5 rounded-full border-2
                                                            flex items-center justify-center
                                                            transition-all relative
                                                            ${form.paymentMethod === opt.key
                                                                ? "border-[#ff3c33]"
                                                                : "border-[#fff]"
                                                            }`}
                                                    >
                                                        {form.paymentMethod === opt.key && (
                                                            <span className="absolute left-1/2 top-1/2 w-3 h-3 bg-[#ff3c33] rounded-full -translate-x-1/2 -translate-y-1/2"></span>
                                                        )}
                                                    </span>
                                                    <span
                                                        className={`ml-1 text-[17px] font-medium transition-all ${form.paymentMethod === opt.key
                                                            ? "text-white"
                                                            : "text-[#cccccc]"
                                                            }`}
                                                    >
                                                        {opt.label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                        {form.paymentMethod === "stripe" ? (
                                            <>
                                                <div>
                                                    <label className="block text-[#ccc] font-light text-[16px] mb-2">Card Number*</label>
                                                    <div className="w-full bg-[#363636] text-white h-[38px] px-4 flex items-center focus:ring-2 focus:ring-primary transition-all duration-200 rounded-none">
                                                        <CardNumberElement
                                                            className="flex-1"
                                                            options={{
                                                                style: {
                                                                    base: {
                                                                        fontSize: "16px",
                                                                        color: "#fff",
                                                                        "::placeholder": { color: "#aaa" }
                                                                    },
                                                                    invalid: { color: "#ff3131" }
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between gap-3">
                                                    <div className="w-[48%]">
                                                        <label className="block text-[#ccc] font-light text-[16px] mb-2">Expiration Date*</label>
                                                        <div className="w-full bg-[#363636] text-white h-[38px] px-4 flex items-center rounded-none">
                                                            <CardExpiryElement
                                                                className="flex-1 focus:ring-2 focus:ring-primary transition-all duration-200"
                                                                options={{
                                                                    style: {
                                                                        base: {
                                                                            fontSize: "16px",
                                                                            color: "#fff",
                                                                            "::placeholder": { color: "#aaa" }
                                                                        },
                                                                        invalid: { color: "#ff3131" }
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="w-[48%]">
                                                        <label className="block text-[#ccc] font-light text-[16px] mb-2">CVV*</label>
                                                        <div className="w-full bg-[#363636] text-white h-[38px] px-4 flex items-center rounded-none">
                                                            <CardCvcElement
                                                                className="flex-1 focus:ring-2 focus:ring-primary transition-all duration-200"
                                                                options={{
                                                                    style: {
                                                                        base: {
                                                                            fontSize: "16px",
                                                                            color: "#fff",
                                                                            "::placeholder": { color: "#aaa" }
                                                                        },
                                                                        invalid: { color: "#ff3131" }
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                {savedCards.length > 0 && (
                                                    <Button
                                                        type="button"
                                                        className="mt-3 bg-[#2E2E2E] hover:bg-[#444] text-white text-xs px-5 py-2 rounded-none"
                                                        onClick={() => setUseSavedCard(true)}
                                                    >
                                                        Back to Saved Card
                                                    </Button>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <label className="block text-[#ccc] font-light text-[16px] mb-2" htmlFor="cardNumber">
                                                        Card Number*
                                                    </label>
                                                    <input
                                                        id="cardNumber"
                                                        name="cardNumber"
                                                        value={form.cardNumber}
                                                        onChange={handleChange}
                                                        className="w-full bg-[#363636] text-white h-[38px] px-4 text-[14px] font-normal border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200 rounded-none"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex justify-between">
                                                    <div className="w-[48%]">
                                                        <label className="block text-[#ccc] font-light text-[16px] mb-2" htmlFor="expDate">
                                                            Expiration Date*
                                                        </label>
                                                        <input
                                                            id="expDate"
                                                            name="expDate"
                                                            type="text"
                                                            placeholder="MM/YY"
                                                            value={form.expDate}
                                                            maxLength={5}
                                                            onChange={e => {
                                                                let value = e.target.value.replace(/\D/g, '');
                                                                if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                                                if (value.length >= 2 && parseInt(value.slice(0, 2)) > 12) {
                                                                    value = '12' + value.slice(2);
                                                                }
                                                                setForm(prev => ({ ...prev, expDate: value }));
                                                            }}
                                                            className="w-full bg-[#363636] text-white h-[38px] px-4 text-[14px] font-normal border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200 rounded-none"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="w-[48%]">
                                                        <label className="block text-[#ccc] font-light text-[16px] mb-2" htmlFor="cvv">
                                                            CVV*
                                                        </label>
                                                        <input
                                                            id="cvv"
                                                            name="cvv"
                                                            type="text"
                                                            value={form.cvv}
                                                            onChange={handleChange}
                                                            maxLength={4}
                                                            pattern="\d*"
                                                            inputMode="numeric"
                                                            className="w-full bg-[#363636] text-white h-[38px] px-4 text-[14px] font-normal border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200 rounded-none"
                                                            autoComplete="off"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {form.paymentMethod === "stripe" && (!savedCards.length || !useSavedCard) && (
                                            <label className="flex items-center gap-2 mt-2 text-white text-[15px]">
                                                <input
                                                    type="checkbox"
                                                    name="saveInfo"
                                                    checked={form.saveInfo}
                                                    onChange={handleChange}
                                                    className="w-4 h-4 accent-[#ff3131]"
                                                />
                                                <span className="text-white">Save this information for faster check-out next time</span>
                                            </label>
                                        )}
                                    </>
                                )}
                                <label className="flex items-center gap-2 mt-2 text-white text-[15px]">
                                    <input
                                        type="checkbox"
                                        name="agreed"
                                        checked={form.agreed}
                                        onChange={handleChange}
                                        className="w-4 h-4 accent-[#ff3131]"
                                        required
                                    />
                                    <span>
                                        I read the{" "}
                                        <a
                                            href="#"
                                            className="underline text-white hover:text-[#ff3131] transition-all"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Privacy & Terms, Conditions & Refund Policy
                                        </a>
                                    </span>
                                </label>
                                {stripeError && <div className="text-red-500 mt-2">{stripeError}</div>}
                                <Button
                                    type="submit"
                                    className="w-full h-[45px] mt-2 bg-[#ff3131] hover:bg-[#e03228] text-white font-[600] text-[16px] transition-all duration-150 rounded-none flex items-center justify-center"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="none"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v8z"
                                                />
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        product ? `Pay €${product.amount}` : "Pay"
                                    )}
                                </Button>
                            </form>
                        </div>
                        <div className='lg:col-span-1 col-span-2 w-full order-1 lg:order-2'>
                            <div className='pt-10'>
                                {loading ? (
                                    <div className="text-[#ccc] text-lg pt-8">Loading product details...</div>
                                ) : !product ? (
                                    <div className="text-red-500 text-lg pt-8">Currently there is no product available!</div>
                                ) : (
                                    
                                    <>
                                    
                                        <div
                                            className="bg-[#2E2E2E] md:px-[45px] px-[15px] py-[40px] transition-all duration-300 md:flex-row flex-col justify-between h-full mb-10"
                                        >
                                            <div>
                                                <div className="flex justify-between items-start mb-4 md:flex-row flex-col">
                                                    <div className="flex-1 md:pr-6 pr-0">
                                                        <p className="text-primary text-[14px] font-bold tracking-[1px]">FOR ALL</p>
                                                        <h3 className="text-[26px] font-light text-white mb-3">{product.name}</h3>
                                                        <p className="text-white text-[14px] font-light leading-relaxed mb-4 md:pr-6 pr-0">
                                                            {product.description}
                                                        </p>
                                                    </div>
                                                    <div className="text-right pricing-info">
                                                        <div className="text-[36px] font-light text-white">€{product.amount}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 border-t border-[#acacac] pt-5">
                                            <div className="flex items-center justify-between text-[15px] font-normal">
                                                <span className="text-[#fff] text-[16px] font-[500]">Subtotal</span>
                                                <span className="text-[#fff] text-[16px] font-[500]">€{product.amount}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-[15px] font-normal">
                                                <span className="text-[#fff] text-[16px] font-[500]">Additional processing fee</span>
                                                <span className="text-[#fff] text-[16px] font-[500]">€0</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-3 border-t border-[#acacac] pt-5">
                                                <div className=''>
                                                    <span className="block text-[#fff] text-[16px] font-[500]">Total</span>
                                                    <span className="block text-[#acacac] text-[14px] font-[400]">
                                                        Including €0 in taxes
                                                    </span>
                                                </div>
                                                <span className="text-white text-[36px] font-[500]">€{product.amount}</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <PaymentSuccessModal
                open={successModalOpen}
                onClose={() => {
                    setSuccessModalOpen(false);
                   productType == 'session'? navigate("/session") : navigate("/supplement-guidance")
                }}
            />
            <Footer />
        </>
    );
};

export default CheckoutSession;