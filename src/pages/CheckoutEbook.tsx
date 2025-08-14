import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bannerImg from '@/assets/ebooks/checkoutBg.png';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { authFetch } from '@/utils/authFetch';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import PaymentSuccessModal from "@/components/PaymentSuccessModal";
import AppModal from '@/components/AppModal';

const paymentOptions = [
    { key: "uae", label: "UAE Bank Transfer (SEPA)" },
    { key: "stripe", label: "Stripe" },
];

const EbookCheckout = () => {
    const { ebookId } = useParams(); // from /checkout/ebook/:ebookId
    const navigate = useNavigate();
    const location = useLocation();
    const heroRef = useRef(null);
    const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [stripeError, setStripeError] = useState("");
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [receiptModalOpen, setReceiptModalOpen] = useState(false);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);

    // Ebook state
    const [ebook, setEbook] = useState(null);
    const [ebookLoading, setEbookLoading] = useState(true);
    const [ebookError, setEbookError] = useState("");
    const [savedCards, setSavedCards] = useState([]);
    const [defaultCardId, setDefaultCardId] = useState('');
    const [useSavedCard, setUseSavedCard] = useState(true);
    const defaultCard = savedCards.find(card => card.id === defaultCardId) || savedCards[0];

    // Fetch ebook details
    useEffect(() => {
        if (!ebookId) return;
        setEbookLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/api/ebooks/${ebookId}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data?.ebook) {
                    setEbook(data.ebook);
                    setEbookError("");
                } else {
                    setEbookError("Ebook not found.");
                }
                setEbookLoading(false);
            })
            .catch(() => {
                setEbookError("Could not load ebook details");
                setEbookLoading(false);
            });
    }, [ebookId]);

    // Fetch saved cards & default card
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        fetch(`${import.meta.env.VITE_API_URL}/api/payments/saved-cards`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setSavedCards(data.cards || []));
        fetch(`${import.meta.env.VITE_API_URL}/api/payments/default-card`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setDefaultCardId(data.defaultCardId || ""));
    }, []);

    // Autofill user info (if needed)
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        paymentMethod: "stripe",
        saveInfo: false,
        agreed: false,
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            authFetch(
                `${import.meta.env.VITE_API_URL}/api/auth/user/${user.id}`,
                {},
                navigate
            ).then(data => {
                if (data?.user) {
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

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Payment submit logic (adapts to ebook)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStripeError("");
        setProcessing(true);
    
        try {
            if (!form.agreed) {
                alert("Please agree to the Privacy & Terms.");
                setProcessing(false);
                return;
            }
            const user = JSON.parse(localStorage.getItem("user"));
            const token = localStorage.getItem("token");
            if (!user || !token) {
                setStripeError("Please login again.");
                setProcessing(false);
                return;
            }

            // UAE/SEPA bank transfer flow
            if (form.paymentMethod === "uae") {
                if (!receiptFile) {
                    setStripeError("Please upload your payment receipt.");
                    setProcessing(false);
                    return;
                }
                if (!ebook?._id) {
                    setStripeError("Ebook not found.");
                    setProcessing(false);
                    return;
                }
                const fd = new FormData();
                fd.append("ebookId", ebook._id);
                fd.append("receipt", receiptFile);

                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/receipts/ebook`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: fd,
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error || "Failed to submit receipt");
                setReceiptModalOpen(true);
                setReceiptFile(null);
                setProcessing(false);
                return;
            }

            if (!stripe || !elements) {
                setStripeError("Stripe is not loaded");
                setProcessing(false);
                return;
            }
    
            let paymentMethodId = null;
    
            if (form.paymentMethod === "stripe" && savedCards.length > 0 && useSavedCard) {
                const chosen = savedCards.find(c => c.id === defaultCardId) || savedCards[0];
                paymentMethodId = chosen?.id;
                if (!paymentMethodId) {
                    setStripeError("No saved card found.");
                    setProcessing(false);
                    return;
                }
            } else {
                const cardElement = elements.getElement(CardNumberElement);
                if (!cardElement) {
                    setStripeError("Card input not found");
                    setProcessing(false);
                    return;
                }
                const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
                    type: "card",
                    card: cardElement,
                    billing_details: {
                        name: `${form.firstName} ${form.lastName}`,
                        email: form.email,
                    },
                });
                if (pmError) {
                    setStripeError(pmError.message || "Could not create payment method");
                    setProcessing(false);
                    return;
                }
                paymentMethodId = paymentMethod.id;
            }
    
            // 1. CREATE PAYMENT INTENT (same endpoint as sessions)
            const intentRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/create-payment-intent`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    amount: ebook.price,
                    currency: "eur",
                    saveCard: form.saveInfo,
                    ...(paymentMethodId ? { paymentMethodId } : {}),
                }),
            });
            const { clientSecret, error: intentErr } = await intentRes.json();
            if (!intentRes.ok || !clientSecret) throw new Error(intentErr || "Payment initiation failed.");
    
            // 2. CONFIRM PAYMENT WITH STRIPE
            let confirmResult;
            if (form.paymentMethod === "stripe" && savedCards.length > 0 && useSavedCard) {
                confirmResult = await stripe.confirmCardPayment(clientSecret, { payment_method: paymentMethodId });
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
    
            // 3. MARK PURCHASE (same as sessions)
            const purchaseRes = await fetch(`${import.meta.env.VITE_API_URL}/api/purchases`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user: user.id,
                    itemType: "ebook",
                    itemId: ebook._id.toString(),
                    itemName: ebook.title,
                    amount: ebook.price,
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
        }
        setProcessing(false);
    };

    return (
        <>
            <Header />
            <section className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
                <img
                    src={bannerImg}
                    alt="profile"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    draggable={false}
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 flex flex-col items-center justify-center w-full">
                    <motion.h1
                        ref={heroRef}
                        className="text-[66px] font-bold uppercase leading-[80px] mb-4 select-none page-title"
                        variants={{
                            hidden: { opacity: 0, y: 40, scale: 0.97 },
                            visible: { opacity: 1, y: 0, scale: 1 }
                        }}
                        initial="hidden"
                        animate={heroInView ? "visible" : "hidden"}
                        transition={{ duration: 0.85, ease: [0.42, 0, 0.2, 1] }}
                    >
                        <span className="text-primary">COACHING </span>
                        <span className="text-white">E-BOOKS</span>
                    </motion.h1>
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 40, scale: 0.97 },
                            visible: { opacity: 1, y: 0, scale: 1 }
                        }}
                        initial="hidden"
                        animate={heroInView ? "visible" : "hidden"}
                        transition={{ duration: 1, delay: 0.14, ease: [0.42, 0, 0.2, 1] }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-white font-bold text-[26px] leading-[26px] breadcrumbs">
                            Home / Coaching E-Books / Payment
                        </span>
                    </motion.div>
                </div>
            </section>
            <section className="w-full py-[125px] bg-black">
                <div className="container">
                    <h2 className="text-white font-[700] tracking-[4%] text-[36px] mb-12 mt-6">
                        Payment Details
                    </h2>
                    <div className=" grid grid-cols-2 gap-16">

                        {/* Payment Form */}
                        <div className="lg:col-span-1 col-span-2 w-full order-2 lg:order-1">
                            <form className="flex flex-col gap-5 mb-8" onSubmit={handleSubmit}>
                                {/* Your Info */}
                                <div className="border-b border-[#acacac] mb-7 pb-3">
                                    <h2 className="text-white text-[24px] font-[600]">Your Info</h2>
                                </div>
                                <div>
                                    <label className="block text-[#ccc] font-light text-[16px] mb-2" htmlFor="firstName">
                                        First Name*
                                    </label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        className="w-full bg-[#363636] text-white h-[38px] px-4 text-[14px] font-normal border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200 rounded-none"
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#ccc] font-light text-[16px] mb-2" htmlFor="lastName">
                                        Last Name*
                                    </label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        className="w-full bg-[#363636] text-white h-[38px] px-4 text-[14px] font-normal border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200 rounded-none"
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#ccc] font-light text-[16px] mb-2" htmlFor="email">
                                        Email Address*
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="w-full bg-[#363636] text-white h-[38px] px-4 text-[14px] font-normal border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200 rounded-none"
                                        autoComplete="off"
                                        required
                                    />
                                </div>

                                {/* Payment Info */}
                                <div className="border-b border-[#acacac]  pb-3 mt-4">
                                    <h2 className="text-white text-[24px] font-[600]">Payment Info</h2>
                                </div>
                                <div>
                                    <span className="block text-[#fff] text-[18px] font-[600]">Pay With:</span>
                                </div>
                                {form.paymentMethod === "stripe" && savedCards.length > 0 && useSavedCard ? (
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-white text-lg">
                                            {defaultCard?.brand?.charAt(0).toUpperCase() + defaultCard?.brand?.slice(1)}
                                            {" xxxx xxxx xxxx "}
                                            {defaultCard?.last4}
                                            {" end at "}
                                            {String(defaultCard?.exp_month).padStart(2, "0")}/{String(defaultCard?.exp_year).slice(-2)}
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
                                                            className="flex-1 "
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
                                                <p className="text-white text-[16px] mb-4">
                                                    Transfer via bank and upload your payment receipt. Your ebook will unlock after verification.
                                                </p>
                                                <div>
                                                    <label className="block text-[#ccc] font-light text-[16px] mb-2" >
                                                        Account Holder
                                                    </label>
                                                    <p className="w-full bg-[#363636] text-white h-[38px] px-4 text-[16px] font-semibold border-none outline-none transition-all rounded-none flex items-center">
                                                        The Passion Physique LLC
                                                    </p>
                                                </div>
                                                <div className="flex justify-between">
                                                    <div className="w-[48%]">
                                                        <label className="block text-[#ccc] font-light text-[16px] mb-2">
                                                            Account number
                                                        </label>
                                                        <p className="w-full bg-[#363636] text-white h-[38px] px-4 text-[16px] font-semibold border-none outline-none transition-all rounded-none flex items-center">
                                                            9012850782
                                                        </p>
                                                    </div>
                                                    <div className="w-[48%]">
                                                        <label className="block text-[#ccc] font-light text-[16px] mb-2" >
                                                            IBAN
                                                        </label>
                                                        <p className="w-full bg-[#363636] text-white h-[38px] px-4 text-[16px] font-semibold border-none outline-none transition-all rounded-none flex items-center">AE500860000009012850782</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-[#ccc] font-light text-[16px] mb-2" >
                                                        BIC
                                                    </label>
                                                    <p className="w-full bg-[#363636] text-white h-[38px] px-4 text-[16px] font-semibold border-none outline-none transition-all rounded-none flex items-center">
                                                        WIOBAEADXXX
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="block text-[#ccc] font-light text-[16px] mb-2" >
                                                        Bank Address
                                                    </label>
                                                    <p className="w-full bg-[#363636] text-white h-[38px] px-4 text-[16px] font-semibold border-none outline-none transition-all rounded-none flex items-center">
                                                        Etihad Airways Centre 5th Floor, Abu Dhabi, UAE
                                                    </p>
                                                </div>
                                                <div className="mb-4">
                                                    <input
                                                        id="receipt"
                                                        type="file"
                                                        accept="image/png,image/jpeg"
                                                        className="hidden"
                                                        onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                                                    />
                                                    <label
                                                        htmlFor="receipt"
                                                        className="inline-flex items-center justify-center bg-[#ff3c33] hover:bg-[#e03228] text-white font-[600] text-[16px] px-6 h-[42px] rounded-none cursor-pointer transition-all"
                                                    >
                                                        Upload Payment Receipt
                                                    </label>
                                                    {receiptFile && (
                                                        <div className="mt-2 text-[#ccc] text-sm">
                                                            Selected: <span className="text-white">{receiptFile.name}</span>
                                                        </div>
                                                    )}
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
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        form.paymentMethod === "uae"
                                            ? "Submit"
                                            : (ebook ? `Pay €${ebook.price}` : "Pay")
                                    )}
                                </Button>
                            </form>
                        </div>

                        {/* Ebook summary */}
                        <div className='lg:col-span-1 col-span-2 w-full order-1 lg:order-2'>
                            <div className='pt-10'>
                                {ebookLoading ? (
                                    <div className="text-[#ccc] text-lg pt-8">Loading ebook details...</div>
                                ) : ebookError ? (
                                    <div className="text-red-500 text-lg pt-8">{ebookError}</div>
                                ) : ebook ? (
                                    <>
                                        <div
                                            className="bg-[#2E2E2E] md:px-[45px] px-[15px] py-[40px] transition-all duration-300 md:flex-row flex-col justify-between h-full mb-10"
                                        >
                                            <div className="flex justify-between items-start mb-4 md:flex-row flex-col">
                                                <div className="flex-1 md:pr-6 pr-0 ">
                                                    <h3 className="text-[26px] font-light text-white mb-3">{ebook.title}</h3>
                                                    <p className="text-white text-[14px] font-light leading-relaxed mb-4 md:pr-6 pr-0">
                                                        {ebook.description}
                                                    </p>
                                                </div>
                                                <div className="text-right pricing-info">
                                                    <div className="text-[36px] font-light text-white">€{ebook.price}</div>
                                                    <div className="text-white text-[18px] font-light">E-Book</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between md:flex-row flex-col">
                                                <p className="text-primary text-[14px] font-medium">{ebook.forMembersOnly ? "FOR MEMBERS ONLY" : "FOR ALL"}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 border-t border-[#acacac] pt-5">
                                            <div className="flex items-center justify-between text-[15px] font-normal">
                                                <span className="text-[#fff] text-[16px] font-[500] ">Subtotal</span>
                                                <span className="text-[#fff] text-[16px] font-[500] ">€{ebook.price}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-[15px] font-normal">
                                                <span className="text-[#fff] text-[16px] font-[500] ">Additional processing fee</span>
                                                <span className="text-[#fff] text-[16px] font-[500] ">€0</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-3 border-t border-[#acacac] pt-5">
                                                <div className=''>
                                                    <span className="block text-[#fff] text-[16px] font-[500] ">Total</span>
                                                    <span className="block text-[#acacac] text-[14px] font-[400]">
                                                        Including €0 in taxes
                                                    </span>
                                                </div>
                                                <span className="text-white text-[36px] font-[500]">€{ebook.price}</span>
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <PaymentSuccessModal
                open={successModalOpen}
                onClose={() => {
                    setSuccessModalOpen(false);
                    navigate("/e-books"); // or redirect to download page if needed
                }}
            />
            <AppModal
                open={receiptModalOpen}
                onClose={() => { setReceiptModalOpen(false); navigate("/e-books"); }}
                variant="success"
                title="Receipt Submitted!"
                message="Thanks for uploading your payment receipt. We’ll verify it shortly and unlock your ebook."
                primaryText="Okay, got it →"
            />
            <Footer />
        </>
    );
};

export default EbookCheckout;

