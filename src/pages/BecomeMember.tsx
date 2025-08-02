import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bannerImg from '@/assets/loginSection.png';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { authFetch } from '@/utils/authFetch';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import PaymentSuccessModal from "@/components/PaymentSuccessModal"; // adjust the path if needed


const paymentOptions = [
    { key: "uae", label: "UAE Bank Transfer (SEPA)" },
    { key: "payoneer", label: "Payoneer" },
    { key: "stripe", label: "Stripe" },
];

const BecomeMember = () => {
    const { planId } = useParams(); // must match route: /become-member/:planId
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [stripeError, setStripeError] = useState("");
    const [successModalOpen, setSuccessModalOpen] = useState(false);


    // Plan state
    const [plan, setPlan] = useState(null);
    const [planLoading, setPlanLoading] = useState(true);
    const [planError, setPlanError] = useState("");

    // Form state (You can auto-fill user info here)
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        cardNumber: "",
        expDate: "",
        cvv: "",
        paymentMethod: "uae",
        saveInfo: false,
        agreed: false,
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            // Not logged in, redirect to login
            navigate("/login", { replace: true });
            return;
        }
    }, [navigate]);
    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            authFetch(
                `${import.meta.env.VITE_API_URL}/api/auth/user/${user.id}`,
                {},
                navigate // pass navigate so authFetch can redirect on token issues
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

    // Fetch plan info from backend
    useEffect(() => {
        setPlanLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/api/coachingplans/${planId}`)
            .then(res => res.json())
            .then(data => {
                setPlan(data.plan);
                setPlanLoading(false);
            })
            .catch(() => {
                setPlanError("Could not load plan details");
                setPlanLoading(false);
            });
    }, [planId]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // For CVV: allow only numbers and max 3 digits
        if (name === "cvv") {
            // Remove any non-digit characters, limit to 3
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


    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        setStripeError("");
        if (!form.agreed) {
            alert("Please agree to the Privacy & Terms.");
            return;
        }

        if (form.paymentMethod === "stripe") {
            // Stripe logic
            if (!stripe || !elements) {
                setStripeError("Stripe is not loaded");
                return;
            }
            setProcessing(true);

            // 1. Create PaymentIntent on server
            let clientSecret;
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/create-payment-intent`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        amount: Math.round(Number(plan.price) * 100),
                        currency: "eur",
                        planId: plan._id,
                        // any additional info
                    }),
                });
                const data = await res.json();
                if (!data.clientSecret) throw new Error(data.error || "Could not get payment info.");
                clientSecret = data.clientSecret;
            } catch (err) {
                setStripeError("Failed to start payment: " + err.message);
                setProcessing(false);
                return;
            }

            // 2. Confirm card payment
            const cardNumberElement = elements.getElement(CardNumberElement);
            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardNumberElement,
                    billing_details: {
                        name: form.firstName + " " + form.lastName,
                        email: form.email,
                    },
                },
            });

            if (error) {
                setStripeError(error.message);
                setProcessing(false);
                return;
            }
            if (paymentIntent.status === "succeeded") {
                const token = localStorage.getItem("token");
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/members`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        planId: plan._id,
                        transactionId: paymentIntent.id,
                        paymentStatus: "paid",
                        amount: plan.price,
                        startDate: new Date().toISOString(),
                        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
                    })                    
                });
                const data = await res.json();
                if (res.ok) {
                    setSuccessModalOpen(true); // Show modal only if member saved!
                } else {
                    setStripeError(data.error || "Failed to save member. Please contact support.");
                }
                setProcessing(false);
                return;
            }

        } else {
            return;
        }
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
                        <span className="text-primary">Become a </span>
                        <span className="text-white">Member</span>
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
                            Home / Coaching Plans / Become A Member / Payment
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
                                {/* Add user loading logic if needed */}
                                <>
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
                                </>

                                {/* Payment Info */}
                                <div className="border-b border-[#acacac] mb-7 pb-3 mt-4">
                                    <h2 className="text-white text-[24px] font-[600]">Payment Info</h2>
                                </div>
                                <div>
                                    <span className="block text-[#ccc] text-[16px] mb-2 font-light">Pay With:</span>
                                    <div className="flex gap-7">
                                        {paymentOptions.map((opt) => (
                                            <label key={opt.key} className="flex items-center gap-2 cursor-pointer select-none">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={opt.key}
                                                    checked={form.paymentMethod === opt.key}
                                                    onChange={handleChange}
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
                                                        let value = e.target.value.replace(/\D/g, ''); // only digits
                                                        if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                                        // validate month
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
                                {/* Checkboxes */}
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
                                        I reeded the{" "}
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
                                        plan ? `Pay €${plan.price}` : "Pay"
                                    )}
                                </Button>

                            </form>
                        </div>

                        {/* Plan summary */}
                        <div className='lg:col-span-1 col-span-2 w-full order-1 lg:order-2'>
                            <div className='pt-10'>
                                {planLoading ? (
                                    <div className="text-[#ccc] text-lg pt-8">Loading plan details...</div>
                                ) : planError ? (
                                    <div className="text-red-500 text-lg pt-8">{planError}</div>
                                ) : plan ? (
                                    <>
                                        <div
                                            className="bg-[#2E2E2E] md:px-[45px] px-[15px] py-[40px] transition-all duration-300 md:flex-row flex-col justify-between h-full mb-10"
                                        >
                                            <div>
                                                <div className="flex justify-between items-start mb-4 md:flex-row flex-col">
                                                    <div className="flex-1 md:pr-6 pr-0 ">
                                                        <h3 className="text-[26px] font-light text-white mb-3">{plan.name}</h3>
                                                        <p className="text-white text-[14px] font-light leading-relaxed mb-4 md:pr-6 pr-0">
                                                            {plan.description}
                                                        </p>
                                                    </div>
                                                    <div className="text-right pricing-info">
                                                        <div className="text-[36px] font-light text-white">€{plan.price}</div>
                                                        <div className="text-white text-[18px] font-light">{plan.period}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between md:flex-row flex-col">
                                                <p className="text-primary text-[14px] font-medium">{plan.note}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 border-t border-[#acacac] pt-5">
                                            <div className="flex items-center justify-between text-[15px] font-normal">
                                                <span className="text-[#fff] text-[16px] font-[500] ">Subtotal</span>
                                                <span className="text-[#fff] text-[16px] font-[500] ">€{plan.price}</span>
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
                                                <span className="text-white text-[36px] font-[500]">€{plan.price}</span>
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
                    // Optionally redirect or refresh membership
                    navigate("/workout-library"); // Or wherever you want to send them
                }}
            />
            <Footer />
        </>
    );
};

export default BecomeMember;
