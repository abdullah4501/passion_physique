import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bannerImg from '@/assets/bg/profileBg.png';
import { motion, useInView } from 'framer-motion';
import { authFetch } from '@/utils/authFetch';
import PaymentInfo from '@/components/PaymentInfo';
import ActivePlan from '@/components/ActivePlan';
import SavedLibrary from '@/components/SavedLibrary';
import PurchasedEbooks from '@/components/PurchasedEbooks';
import OtpModal from "@/components/OtpModal";



const titleVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 }
};

const tabList = [
    { key: 'info', label: 'Your Info' },
    { key: 'payment', label: 'Payment Info' },
    { key: 'library', label: 'Your Library' },
    { key: 'ebook', label: 'Your E-Book' },
    { key: 'activePlan', label: 'Active Plan' },
];

const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
    const [activeTab, setActiveTab] = useState('info');

    // Auth and info state
    const [info, setInfo] = useState({ firstName: '', lastName: '', email: '' });
    const [infoLoading, setInfoLoading] = useState(true);
    const [infoMsg, setInfoMsg] = useState('');
    const [infoError, setInfoError] = useState('');

    // Password state
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [pwMsg, setPwMsg] = useState('');
    const [pwError, setPwError] = useState('');
    const [pwLoading, setPwLoading] = useState(false);
    const [otpModal, setOtpModal] = useState({
        open: false,
        mode: null, // "profile" or "password"
        pendingInfo: null,
        pendingPw: null,
    });
    const [otp, setOtp] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [infoSaving, setInfoSaving] = useState(false);
    const [pwSendingOtp, setPwSendingOtp] = useState(false);


    // Redirect if user not logged in or ID doesn't match
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.id !== id) {
            navigate('/login');
            return;
        }
    }, [id, navigate]);

    // Fetch user info
    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const data = await authFetch(
                    `${import.meta.env.VITE_API_URL}/api/auth/user/${id}`,
                    {},
                    navigate
                );
                if (data) {
                    setInfo({
                        firstName: data.user.firstName,
                        lastName: data.user.lastName,
                        email: data.user.email,
                    });
                }
            } catch (err) {
                setInfoError(err.message);
            }
            setInfoLoading(false);
        };
        fetchInfo();
    }, [id]);

    // Profile info form
    const handleInfoChange = (e) => {
        setInfo({ ...info, [e.target.name]: e.target.value });
    };
    const handleInfoSave = async (e) => {
        e.preventDefault();
        setInfoMsg('');
        setInfoError('');
        setInfoSaving(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const normalizedEmail = (info.email || '').trim().toLowerCase();

            // 0. (Optional) quick client-side validation
            if (!normalizedEmail) {
                setInfoError('Please enter a valid email.');
                setInfoSaving(false);
                return;
            }

            // 1. Call check-email first (so we don't send OTP to an email that already exists)
            const checkRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/check-email`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: normalizedEmail }),
            });
            const checkData = await parseJsonOrThrow(checkRes);
            if (checkData.exists) {
                setInfoError('Email already registered by another user. Please choose a different email.');
                setInfoSaving(false);
                return;
            }

            // 2. Send OTP (since email is free or owned by current user)
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/send-otp-for-update`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ email: normalizedEmail }),
            });
            const data = await parseJsonOrThrow(res);

            // 3. Open OTP modal and store pending info
            setOtp('');
            setOtpError('');
            setOtpModal({ open: true, mode: "profile", pendingInfo: { ...info, email: normalizedEmail }, pendingPw: null });
        } catch (err) {
            setInfoError(err.message || 'Failed to start update');
        } finally {
            setInfoSaving(false);
        }
    };
    async function parseJsonOrThrow(res) {
        const text = await res.text();
        try {
            const json = JSON.parse(text || '{}');
            if (!res.ok) throw new Error(json.msg || `Request failed (${res.status})`);
            return json;
        } catch (err) {
            const preview = text ? text.substring(0, 300) : `Status ${res.status}`;
            throw new Error(`Unexpected server response: ${preview}`);
        }
    }


    // Password change form
    const handlePwChange = (e) => {
        setPwForm({ ...pwForm, [e.target.id]: e.target.value });
    };
    const handlePwSave = async (e) => {
        e.preventDefault();
        setPwMsg('');
        setPwError('');
        setPwLoading(true);
        setPwSendingOtp(true);

        if (pwForm.newPassword !== pwForm.confirmPassword) {
            setPwError('New passwords do not match.');
            setPwLoading(false);
            setPwSendingOtp(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }

            const normalizedEmail = (info.email || '').trim().toLowerCase();

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/send-otp-for-password-change`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ email: normalizedEmail }), // still needed to match backend, or just omit body
            });

            const data = await parseJsonOrThrow(res);

            setOtp('');
            setOtpError('');
            setOtpModal({ open: true, mode: "password", pendingInfo: null, pendingPw: { ...pwForm } });
        } catch (err) {
            setPwError(err.message || 'Failed to request OTP');
        } finally {
            setPwLoading(false);
            setPwSendingOtp(false);
        }
    };

    const handleOtpSubmit = async () => {
        setOtpError('');
        setOtpLoading(true);
        const token = localStorage.getItem('token');
        if (otpModal.mode === "profile" && otpModal.pendingInfo) {
            // Submit profile update + OTP
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...otpModal.pendingInfo, otp }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.msg || 'Failed to update profile');
                setInfoMsg('Profile updated successfully!');
                const user = JSON.parse(localStorage.getItem('user'));
                localStorage.setItem('user', JSON.stringify({ ...user, ...otpModal.pendingInfo }));
                setOtpModal({ open: false, mode: null, pendingInfo: null, pendingPw: null });
            } catch (err) {
                setOtpError(err.message);
            }
        } else if (otpModal.mode === "password" && otpModal.pendingPw) {
            // Submit password change + OTP
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user/${id}/change-password`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...otpModal.pendingPw, otp, email: info.email }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.msg || 'Failed to change password');
                setPwMsg('Password changed successfully!');
                setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setOtpModal({ open: false, mode: null, pendingInfo: null, pendingPw: null });
            } catch (err) {
                setOtpError(err.message);
            }
        }
        setOtpLoading(false);
    };


    return (
        <>
            <Header />
            <section className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
                <img
                    src={bannerImg}
                    alt="profile"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    draggable={false}
                />
                <div className="absolute inset-0" />
                <div className="relative z-10 flex flex-col items-center justify-center w-full">
                    <motion.h1
                        ref={heroRef}
                        className="text-[66px] font-bold uppercase leading-[80px] mb-4 select-none page-title"
                        variants={titleVariants}
                        initial="hidden"
                        animate={heroInView ? "visible" : "hidden"}
                        transition={{ duration: 0.85, ease: [0.42, 0, 0.2, 1] }}
                    >
                        <span className="text-primary">Your </span>
                        <span className="text-white">Profile</span>
                    </motion.h1>
                    <motion.div
                        variants={titleVariants}
                        initial="hidden"
                        animate={heroInView ? "visible" : "hidden"}
                        transition={{ duration: 1, delay: 0.14, ease: [0.42, 0, 0.2, 1] }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-white font-bold text-[26px] leading-[26px] breadcrumbs">
                            Home / Your Profile
                        </span>
                    </motion.div>
                </div>
            </section>
            <section className="w-full py-[60px] md:py-[125px] bg-background">
                <div className="container mx-auto px-4">

                    {/* Mobile Tabs - Horizontal scrollable */}
                    <div className="block md:hidden mb-8">
                        <div className="overflow-x-auto">
                            <div className="flex bg-muted min-w-max">
                                {tabList.map((tab) => (
                                    <button
                                        key={tab.key}
                                        className={`text-left px-3 py-3 text-[12px] font-[600] rounded-none transition-colors duration-200 border-r border-gray-600
                                        ${activeTab === tab.key
                                                ? "bg-[#ED2C2C] text-white"
                                                : "bg-transparent text-[#fff] hover:bg-[#222]"
                                            }
                                        `}
                                        onClick={() => setActiveTab(tab.key)}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Desktop and Mobile Content Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16">

                        {/* Desktop Vertical Tabs */}
                        <div className="hidden md:block md:col-span-1">
                            <div className="flex flex-col gap-1 bg-muted rounded-lg py-6 px-6">
                                {tabList.map((tab) => (
                                    <button
                                        key={tab.key}
                                        className={`text-left px-3 py-3 text-[16px] font-[400] rounded-none transition-colors duration-200
                                        ${activeTab === tab.key
                                                ? "bg-[#000] text-white"
                                                : "bg-transparent text-[#fff] hover:bg-primary"
                                            }
                                        `}
                                        onClick={() => setActiveTab(tab.key)}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="col-span-1 md:col-span-3 w-full">
                            {activeTab === 'info' && (
                                <>
                                    <div className="border-b border-border mb-7 pb-3">
                                        <h2 className="text-foreground text-[24px] font-semibold">Change Your Info</h2>
                                    </div>
                                    {infoLoading ? (
                                        <div className="text-muted-foreground text-lg pt-8">Loading...</div>
                                    ) : (
                                        <form className="flex flex-col gap-5 mb-8" onSubmit={handleInfoSave}>
                                            <div>
                                                <label className="block text-muted-foreground font-medium text-[16px] mb-2" htmlFor="firstName">
                                                    First Name*
                                                </label>
                                                <input
                                                    id="firstName"
                                                    type="text"
                                                    name="firstName"
                                                    value={info.firstName}
                                                    onChange={handleInfoChange}
                                                    className="w-full bg-muted text-foreground h-[42px] px-4 text-[14px] font-normal border border-border rounded-md outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                                                    autoComplete="off"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-muted-foreground font-medium text-[16px] mb-2" htmlFor="lastName">
                                                    Last Name*
                                                </label>
                                                <input
                                                    id="lastName"
                                                    type="text"
                                                    name="lastName"
                                                    value={info.lastName}
                                                    onChange={handleInfoChange}
                                                    className="w-full bg-muted text-foreground h-[42px] px-4 text-[14px] font-normal border border-border rounded-md outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                                                    autoComplete="off"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-muted-foreground font-medium text-[16px] mb-2" htmlFor="email">
                                                    Email Address*
                                                </label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    value={info.email}
                                                    onChange={handleInfoChange}
                                                    className="w-full bg-muted text-foreground h-[42px] px-4 text-[14px] font-normal border border-border rounded-md outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                                                    autoComplete="off"
                                                    required
                                                />
                                            </div>
                                            {infoError && <div className="text-destructive text-[15px]">{infoError}</div>}
                                            {infoMsg && <div className="text-green-600 text-[15px]">{infoMsg}</div>}
                                            <button
                                                type="submit"
                                                className="w-[120px] h-[45px] mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-[16px] transition-all duration-200 rounded-md"
                                                disabled={infoSaving}
                                            >
                                                {infoSaving ? 'Sending OTP...' : 'Save'}
                                            </button>
                                        </form>
                                    )}

                                    <div className="border-b border-border mb-7 pb-3">
                                        <h2 className="text-foreground text-[24px] font-semibold">Change Your Password</h2>
                                    </div>
                                    <form className="flex flex-col gap-5 mb-8" onSubmit={handlePwSave}>
                                        <div>
                                            <label className="block text-muted-foreground font-medium text-[16px] mb-2" htmlFor="currentPassword">
                                                Current Password*
                                            </label>
                                            <input
                                                id="currentPassword"
                                                type="password"
                                                value={pwForm.currentPassword}
                                                onChange={handlePwChange}
                                                placeholder="Type your current password here"
                                                className="w-full bg-muted text-foreground h-[42px] px-4 text-[14px] font-normal border border-border rounded-md outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                                                autoComplete="off"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-muted-foreground font-medium text-[16px] mb-2" htmlFor="newPassword">
                                                New Password*
                                            </label>
                                            <input
                                                id="newPassword"
                                                type="password"
                                                value={pwForm.newPassword}
                                                onChange={handlePwChange}
                                                placeholder="Type your new password here"
                                                className="w-full bg-muted text-foreground h-[42px] px-4 text-[14px] font-normal border border-border rounded-md outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                                                autoComplete="off"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-muted-foreground font-medium text-[16px] mb-2" htmlFor="confirmPassword">
                                                Confirm Password*
                                            </label>
                                            <input
                                                id="confirmPassword"
                                                type="password"
                                                value={pwForm.confirmPassword}
                                                onChange={handlePwChange}
                                                placeholder="Type your password confirmation here"
                                                className="w-full bg-muted text-foreground h-[42px] px-4 text-[14px] font-normal border border-border rounded-md outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                                                autoComplete="off"
                                                required
                                            />
                                        </div>
                                        {pwError && <div className="text-destructive text-[15px]">{pwError}</div>}
                                        {pwMsg && <div className="text-green-600 text-[15px]">{pwMsg}</div>}
                                        <button
                                            type="submit"
                                            className="w-[120px] h-[45px] mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-[16px] transition-all duration-200 rounded-md"
                                            disabled={pwLoading}
                                        >
                                            {pwLoading ? "Saving..." : "Save"}
                                        </button>
                                    </form>
                                </>
                            )}

                            {activeTab === 'payment' && (
                                <PaymentInfo />
                            )}

                            {activeTab === 'activePlan' && (
                                <ActivePlan />
                            )}

                            {activeTab === 'ebook' && (
                                <PurchasedEbooks />
                            )}

                            {activeTab === 'library' && (
                                <SavedLibrary />
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            <OtpModal
                open={otpModal.open}
                onClose={() => setOtpModal({ open: false, mode: null, pendingInfo: null, pendingPw: null })}
                onSubmit={handleOtpSubmit}
                value={otp}
                onChange={e => setOtp(e.target.value)}
                loading={otpLoading}
                error={otpError}
            />

        </>
    );
};

export default Profile;
