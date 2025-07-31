import React, { useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bannerImg from '@/assets/bg/profileBg.png';
import { motion, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

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
    const heroRef = useRef(null);
    const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
    const [activeTab, setActiveTab] = useState('info');
    // Hardcoded user data for demo. In real app, fetch from backend/user context.
    const [info, setInfo] = useState({
        firstName: 'Randy',
        lastName: 'Culhane',
        email: 'randyculhane@gmail.com',
    });

    const handleInfoChange = (e) => {
        setInfo({ ...info, [e.target.name]: e.target.value });
    };

    const handleInfoSave = (e) => {
        e.preventDefault();
        // Save logic here
        // Show a toast/message if needed
    };
    return (
        <>
            <Header />
            <section className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
                <img
                    src={bannerImg}
                    alt="login"
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
                        <div className="flex flex-col gap-1 bg-[#363636] rounded-[2px] py-6 px-0">
                            {tabList.map((tab) => (
                                <button
                                    key={tab.key}
                                    className={`text-left px-6 py-3 text-base font-normal rounded-none transition-colors duration-200
                                        ${activeTab === tab.key
                                            ? "bg-[#222] text-white font-[500]"
                                            : "bg-transparent text-[#ccc] hover:bg-[#222] hover:text-white"
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
                                <div className="border-b border-[#444] mb-7 pb-2">
                                    <h2 className="text-white text-[24px] font-semibold tracking-tight">Change Your Info</h2>
                                </div>
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
                                            className="w-full bg-[#363636] text-white h-[38px] px-4 text-base font-normal border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200 rounded-none"
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
                                            className="w-full bg-[#363636] text-white h-[38px] px-4 text-base font-normal border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200 rounded-none"
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
                                            className="w-full bg-[#363636] text-white h-[38px] px-4 text-base font-normal border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200 rounded-none"
                                            autoComplete="off"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-[130px] h-[40px] mt-2 bg-[#ff3c33] hover:bg-[#e03228] text-white font-bold text-[17px] transition-all duration-150 rounded-none"
                                    >
                                        Save
                                    </button>
                                </form>
                            </>
                        )}

                        {/* Placeholder for other tabs */}
                        {activeTab !== 'info' && (
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
}

export default Profile;
