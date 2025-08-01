import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bannerImg from '@/assets/bg/profileBg.png';
import { motion, useInView } from 'framer-motion';

const titleVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 }
};

const tabList = [
    { key: 'info', label: 'Your Info' },
    { key: 'payment', label: 'Payment Info' },
    { key: 'library', label: 'Your Library' },
    { key: 'ebook', label: 'Your E-Book' },
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
            setInfoLoading(true);
            setInfoError('');
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user/${id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.msg || 'Failed to fetch profile');
                setInfo({
                    firstName: data.user.firstName,
                    lastName: data.user.lastName,
                    email: data.user.email,
                });
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
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(info),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Failed to update profile');
            setInfoMsg('Profile updated successfully!');
            // Optionally update localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({ ...user, ...info }));
        } catch (err) {
            setInfoError(err.message);
        }
    };

    // Password change form
    const handlePwChange = (e) => {
        setPwForm({ ...pwForm, [e.target.id]: e.target.value });
    };
    const handlePwSave = async (e) => {
        e.preventDefault();
        setPwMsg('');
        setPwError('');
        setPwLoading(true);
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            setPwError('New passwords do not match.');
            setPwLoading(false);
            return;
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user/${id}/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pwForm),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Failed to change password');
            setPwMsg('Password changed successfully!');
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setPwError(err.message);
        }
        setPwLoading(false);
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
            <section className="w-full py-[125px] bg-black">
                <div className="container grid grid-cols-4 gap-16">
                    {/* Vertical Tabs */}
                    <div className="col-span-1">
                        <div className="flex flex-col gap-1 bg-[#2e2e2e] rounded-[2px] py-6 px-6">
                            {tabList.map((tab) => (
                                <button
                                    key={tab.key}
                                    className={`text-left px-3 py-3 text-[16px] font-[400] rounded-none transition-colors duration-200
                    ${activeTab === tab.key
                                            ? "bg-[#000] text-white"
                                            : "bg-transparent text-[#fff] hover:bg-[#222]"
                                        }
                  `}
                                    style={{ letterSpacing: 0.2 }}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Tab Content */}
                    <div className="col-span-3 w-full">
                        {activeTab === 'info' && (
                            <>
                                <div className="border-b border-[#acacac] mb-7 pb-1">
                                    <h2 className="text-white text-[24px] font-[600]">Change Your Info</h2>
                                </div>
                                {infoLoading ? (
                                    <div className="text-[#ccc] text-lg pt-8">Loading...</div>
                                ) : (
                                    <form className="flex flex-col gap-5 mb-8" onSubmit={handleInfoSave}>
                                        <div>
                                            <label className="block text-[#ccc] font-light text-[16px] mb-2" htmlFor="firstName">
                                                First Name*
                                            </label>
                                            <input
                                                id="firstName"
                                                type="text"
                                                name="firstName"
                                                value={info.firstName}
                                                onChange={handleInfoChange}
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
                                                type="text"
                                                name="lastName"
                                                value={info.lastName}
                                                onChange={handleInfoChange}
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
                                                type="email"
                                                name="email"
                                                value={info.email}
                                                onChange={handleInfoChange}
                                                className="w-full bg-[#363636] text-white h-[38px] px-4 text-[14px] font-normal border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200 rounded-none"
                                                autoComplete="off"
                                                required
                                            />
                                        </div>
                                        {infoError && <div className="text-red-500 text-[15px]">{infoError}</div>}
                                        {infoMsg && <div className="text-green-500 text-[15px]">{infoMsg}</div>}
                                        <button
                                            type="submit"
                                            className="w-[120px] h-[45px] mt-2 bg-[#ff3c33] hover:bg-[#e03228] text-white font-[600] text-[16px] transition-all duration-150 rounded-none"
                                        >
                                            Save
                                        </button>
                                    </form>
                                )}
                                <div className="border-b border-[#acacac] mb-7 pb-1">
                                    <h2 className="text-white text-[24px] font-[600]">Change Your Password</h2>
                                </div>
                                <form className="flex flex-col gap-5 mb-8" onSubmit={handlePwSave}>
                                    <div>
                                        <label className="block text-[#ccc] font-light text-[16px] mb-2" htmlFor="currentPassword">
                                            Current Password*
                                        </label>
                                        <input
                                            id="currentPassword"
                                            type="password"
                                            value={pwForm.currentPassword}
                                            onChange={handlePwChange}
                                            placeholder="Type your current password here"
                                            className="w-full bg-[#363636] text-white h-[38px] px-4 text-[14px] font-normal border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200 rounded-none"
                                            autoComplete="off"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[#ccc] font-light text-[16px] mb-2" htmlFor="newPassword">
                                            New Password*
                                        </label>
                                        <input
                                            id="newPassword"
                                            type="password"
                                            value={pwForm.newPassword}
                                            onChange={handlePwChange}
                                            placeholder="Type your new password here"
                                            className="w-full bg-[#363636] text-white h-[38px] px-4 text-[14px] font-normal border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200 rounded-none"
                                            autoComplete="off"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[#ccc] font-light text-[16px] mb-2" htmlFor="confirmPassword">
                                            Confirm Password*
                                        </label>
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            value={pwForm.confirmPassword}
                                            onChange={handlePwChange}
                                            placeholder="Type your password confirmation here"
                                            className="w-full bg-[#363636] text-white h-[38px] px-4 text-[14px] font-normal border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200 rounded-none"
                                            autoComplete="off"
                                            required
                                        />
                                    </div>
                                    {pwError && <div className="text-red-500 text-[15px]">{pwError}</div>}
                                    {pwMsg && <div className="text-green-500 text-[15px]">{pwMsg}</div>}
                                    <button
                                        type="submit"
                                        className="w-[120px] h-[45px] mt-2 bg-[#ff3c33] hover:bg-[#e03228] text-white font-[600] text-[16px] transition-all duration-150 rounded-none"
                                        disabled={pwLoading}
                                    >
                                        {pwLoading ? "Saving..." : "Save"}
                                    </button>
                                </form>
                            </>
                        )}

                        {activeTab !== 'info' && activeTab !== 'password' && (
                            <div className="text-[#ccc] text-lg pt-8">
                                This section will be available soon.
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default Profile;
