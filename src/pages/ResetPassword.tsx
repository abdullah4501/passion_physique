import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import bannerImg from "@/assets/gallery/register.png";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const titleVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 }
};

const ResetPassword = () => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email') || "";
    const [email, setEmail] = useState(emailParam);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Something went wrong");
            setMsg("Password reset successfully! You can now log in.");
            setTimeout(() => {
                navigate("/login");
            }, 1400);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <>
            <Header />
            <section className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
                <img
                    src={bannerImg}
                    alt="Reset Password"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    draggable={false}
                />
                <div className="absolute inset-0" />
                <div className="relative z-10 flex flex-col items-center justify-center w-full">
                    <motion.h1
                        className="text-[54px] font-bold uppercase leading-[72px] mb-4 select-none page-title"
                        variants={titleVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.85, ease: [0.42, 0, 0.2, 1] }}
                    >
                        <span className="text-primary">Reset</span>{" "}
                        <span className="text-white">Password</span>
                    </motion.h1>
                </div>
            </section>
            <section className="w-full py-[90px] bg-black">
                <div className="container px-5">
                    <div className="max-w-lg mx-auto bg-[#232323] rounded-2xl px-9 py-10 shadow-md">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                            <input
                                type="email"
                                required
                                placeholder="Email"
                                value={email}
                                disabled
                                className="bg-[#333] text-white h-[44px] px-4 rounded outline-none border-none text-lg font-medium opacity-80"
                            />
                            <input
                                type="text"
                                required
                                placeholder="OTP (from email)"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                className="bg-[#333] text-white h-[44px] px-4 rounded outline-none border-none focus:ring-2 focus:ring-primary text-lg font-medium"
                            />
                            <input
                                type="password"
                                required
                                placeholder="New Password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="bg-[#333] text-white h-[44px] px-4 rounded outline-none border-none focus:ring-2 focus:ring-primary text-lg font-medium"
                            />
                            <input
                                type="password"
                                required
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="bg-[#333] text-white h-[44px] px-4 rounded outline-none border-none focus:ring-2 focus:ring-primary text-lg font-medium"
                            />
                            {msg && <div className="text-green-500 text-base">{msg}</div>}
                            {error && <div className="text-red-400 text-base">{error}</div>}
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#ff3c33] hover:bg-[#e03228] text-white font-[700] text-[16px] h-[46px] rounded"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default ResetPassword;
