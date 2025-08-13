import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bannerImg from '@/assets/loginSection.png';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { authFetch } from '@/utils/authFetch';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import PaymentSuccessModal from "@/components/PaymentSuccessModal"; // adjust the path if needed
import AppModal from '@/components/AppModal';

const paymentOptions = [
    { key: "uae", label: "UAE Bank Transfer (SEPA)" },
    // { key: "payoneer", label: "Payoneer" },
    { key: "stripe", label: "Stripe" },
];

const BecomeMember = () => {
    const { planId } = useParams(); // must match route: /become-member/:planId
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


    // Plan state
    const [plan, setPlan] = useState(null);
    const [planLoading, setPlanLoading] = useState(true);
    const [planError, setPlanError] = useState("");
    const [savedCards, setSavedCards] = useState([]);
    const [defaultCardId, setDefaultCardId] = useState('');
    const [useSavedCard, setUseSavedCard] = useState(true); // Show saved card by default if any
    const defaultCard = savedCards.find(card => card.id === defaultCardId) || savedCards[0];
    const [activePlan, setActivePlan] = useState<null | {
        priceId: string;
        subscriptionId?: string;
    }>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`${import.meta.env.VITE_API_URL}/api/payments/active`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data?.plan) {
                    setActivePlan({
                        priceId: data.plan.priceId || data.plan.plan, // your /active returns .priceId
                        subscriptionId: data.plan.subscriptionId,     // add this in /active if you want
                    });
                }
            })
            .catch(() => { });
    }, []);


    // Form state (You can auto-fill user info here)
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

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Fetch saved cards
        fetch(`${import.meta.env.VITE_API_URL}/api/payments/saved-cards`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setSavedCards(data.cards || []);
            });

        // Fetch default card
        fetch(`${import.meta.env.VITE_API_URL}/api/payments/default-card`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setDefaultCardId(data.defaultCardId || "");
            });
    }, []);



    useEffect(() => {
        const token = localStorage.getItem("token");
        const priceId = sessionStorage.getItem("selectedPlanPriceId");
        if (!token) {
            navigate(`/login?redirect=/plans/become-a-member/payment/${priceId}`, { replace: true });
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
        fetch(`${import.meta.env.VITE_API_URL}/api/coachingplans/stripe`)
            .then(res => res.json())
            .then(data => {
                const found = (data.plans || []).find(p => p.priceId === planId);
                if (found) {
                    setPlan(found);
                } else {
                    setPlanError("Plan not found.");
                }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStripeError("");
        setProcessing(true);

        try {
            if (!form.agreed) {
                alert("Please agree to the Privacy & Terms.");
                return;
            }

            const user = JSON.parse(localStorage.getItem("user"));
            const token = localStorage.getItem("token");
            if (!user || !token) {
                setStripeError("Please login again.");
                return;
            }

            // ── SEPA (UAE Bank Transfer) flow ───────────────────────────────────────────
            if (form.paymentMethod === "uae") {
                if (!receiptFile) {
                    setStripeError("Please upload your payment receipt.");
                    return;
                }
                if (!plan?.priceId) {
                    setStripeError("Plan not found.");
                    return;
                }

                const fd = new FormData();
                fd.append("priceId", plan.priceId);
                fd.append("receipt", receiptFile);

                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/receipts`, {
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
            // ────────────────────────────────────────────────────────────────────────────

            // Stripe branch (unchanged)
            if (!stripe || !elements) {
                setStripeError("Stripe is not loaded");
                return;
            }

            let paymentMethodId: string | null = null;
            if (form.paymentMethod === "stripe" && savedCards.length > 0 && useSavedCard) {
                const chosen = savedCards.find(c => c.id === defaultCardId) || savedCards[0];
                paymentMethodId = chosen?.id;
                if (!paymentMethodId) {
                    setStripeError("No saved card found.");
                    return;
                }
            } else {
                const cardElement = elements.getElement(CardNumberElement);
                if (!cardElement) {
                    setStripeError("Card input not found");
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
                    return;
                }
                paymentMethodId = paymentMethod.id;
            }

            let activePlanPriceId: string | null = null;
            try {
                const activeRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/active`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const activeData = await activeRes.json();
                if (activeRes.ok && activeData?.plan) {
                    activePlanPriceId = activeData.plan.priceId || activeData.plan.plan;
                }
            } catch { }

            if (activePlanPriceId && activePlanPriceId === plan.priceId) {
                setStripeError("You're already on this plan.");
                return;
            }

            let subRes: Response;
            if (activePlanPriceId) {
                subRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/upgrade-subscription`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        priceId: plan.priceId,
                        paymentMethodId,
                    }),
                });
            } else {
                subRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/create-subscription`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        priceId: plan.priceId,
                        paymentMethodId,
                        saveCard: form.saveInfo,
                    }),
                });
            }

            const data = await subRes.json();
            if (!subRes.ok) throw new Error(data?.error || "Could not start/upgrade subscription");

            const clientSecret =
                data?.subscription?.latest_invoice?.payment_intent?.client_secret ||
                data?.clientSecret ||
                null;

            if (clientSecret) {
                let confirmResult;
                if (form.paymentMethod === "stripe" && savedCards.length > 0 && useSavedCard) {
                    confirmResult = await stripe.confirmCardPayment(clientSecret, { payment_method: paymentMethodId! });
                } else {
                    const cardElement = elements.getElement(CardNumberElement);
                    confirmResult = await stripe.confirmCardPayment(clientSecret, {
                        payment_method: {
                            card: cardElement!,
                            billing_details: { name: `${form.firstName} ${form.lastName}`, email: form.email },
                        },
                    });
                }

                const { paymentIntent: confirmedPI, error } = confirmResult;
                if (error) {
                    setStripeError(error.message || "Payment confirmation failed");
                    return;
                }
                if (confirmedPI?.status !== "succeeded") {
                    setStripeError("Payment not completed.");
                    return;
                }
                setSuccessModalOpen(true);
            } else {
                setSuccessModalOpen(true);
            }
        } catch (err) {
            console.error("Stripe/SEPA flow error:", err);
            setStripeError(err?.message || "Payment failed");
        } finally {
            setProcessing(false);
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
                                <div className="border-b border-[#acacac]  pb-3 mt-4">
                                    <h2 className="text-white text-[24px] font-[600]">Payment Info</h2>
                                </div>
                                <div>
                                    <span className="block text-[#fff] text-[18px] font-[600]">Pay With:</span>

                                </div>

                                {form.paymentMethod === "stripe" && savedCards.length > 0 && useSavedCard ? (
                                    // SHOW SAVED CARD
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
                                    // SHOW CARD FORM FIELDS (stripe or manual)
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
                                                            // Reset useSavedCard when payment method is changed
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
                                                {/* "Back to saved card" button if a card exists */}
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
                                                    Transfer via bank and upload your payment receipt. Your membership activates after verification.
                                                </p>
                                                <div>
                                                    <label className="block text-[#ccc] font-light text-[16px] mb-2" >
                                                        Account Holder
                                                    </label>
                                                    <p className="w-full bg-[#363636] text-white h-[38px] px-4 text-[16px] font-semibold border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200 rounded-none flex items-center">
                                                        The Passion Physique LLC
                                                    </p>
                                                </div>
                                                <div className="flex justify-between">
                                                    <div className="w-[48%]">
                                                        <label className="block text-[#ccc] font-light text-[16px] mb-2">
                                                            Account number
                                                        </label>
                                                        <p className="w-full bg-[#363636] text-white h-[38px] px-4 text-[16px] font-semibold border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200 rounded-none flex items-center">
                                                            9012850782
                                                        </p>
                                                    </div>
                                                    <div className="w-[48%]">
                                                        <label className="block text-[#ccc] font-light text-[16px] mb-2" >
                                                            IBAN
                                                        </label>
                                                        <p className="w-full bg-[#363636] text-white h-[38px] px-4 text-[16px] font-semibold border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200 rounded-none flex items-center">AE500860000009012850782</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-[#ccc] font-light text-[16px] mb-2" >
                                                        BIC
                                                    </label>
                                                    <p className="w-full bg-[#363636] text-white h-[38px] px-4 text-[16px] font-semibold border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200 rounded-none flex items-center">
                                                        WIOBAEADXXX
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="block text-[#ccc] font-light text-[16px] mb-2" >
                                                        Bank Address
                                                    </label>
                                                    <p className="w-full bg-[#363636] text-white h-[38px] px-4 text-[16px] font-semibold border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200 rounded-none flex items-center">
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
                                        {/* Save card info checkbox only for new card entry with Stripe */}
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
                                {/* Agreement and error */}
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
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        form.paymentMethod === "uae"
                                            ? "Submit"
                                            : (plan ? `Pay €${plan.amount}` : "Pay")
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
                                                        <div className="text-[36px] font-light text-white">€{plan.amount}</div>
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
                                                <span className="text-[#fff] text-[16px] font-[500] ">€{plan.amount}</span>
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
                                                <span className="text-white text-[36px] font-[500]">€{plan.amount}</span>
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
            <AppModal
                open={receiptModalOpen}
                onClose={() => { setReceiptModalOpen(false); navigate("/"); }}
                variant="success"
                title="Receipt Submitted!"
                message="Thanks for uploading your payment receipt. We’ll verify it shortly and activate your membership."
                primaryText="Okay, got it →"
            />
            <Footer />
        </>
    );
};

export default BecomeMember;