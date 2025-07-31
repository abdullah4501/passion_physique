import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bannerImg from '@/assets/gallery/register.png';
import SectionImg from '@/assets/registerSection.png';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const titleVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 }
};

const Register = () => {
    const heroRef = useRef(null);
    const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            setSuccess('Registration successful!');
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: ''
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <section className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
                <img
                    src={bannerImg}
                    alt="terms and conditions"
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
                        <span className="text-primary">Register</span>{" "}
                        <span className="text-white">Now</span>
                    </motion.h1>
                    <motion.div
                        variants={titleVariants}
                        initial="hidden"
                        animate={heroInView ? "visible" : "hidden"}
                        transition={{ duration: 1, delay: 0.14, ease: [0.42, 0, 0.2, 1] }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-white font-bold text-[26px] leading-[26px] breadcrumbs">
                            Home / Register
                        </span>
                    </motion.div>
                </div>
            </section>
            <section className="w-full py-[125px] bg-black">
                <div className="container px-5">
                    <h2 className="text-white font-[700] leading-[30px] tracking-[4%] text-[36px] mb-12 mt-6">
                        Register
                    </h2>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-[120px]'>
                        <div className="flex flex-col justify-center col-span-1">
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-6 w-full">
                                    <div>
                                        <label className="block text-white font-[400] text-[16px] mb-2" htmlFor="firstName">
                                            First Name*
                                        </label>
                                        <input
                                            id="firstName"
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full bg-[#333] text-white h-[42px] px-4 text-lg font-medium border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                                            autoComplete="off"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-[400] text-[16px] mb-2" htmlFor="lastName">
                                            Last Name*
                                        </label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full bg-[#333] text-white h-[42px] px-4 text-lg font-medium border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                                            autoComplete="off"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-[400] text-[16px] mb-2" htmlFor="email">
                                            Email Address*
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-[#333] text-white h-[42px] px-4 text-lg font-medium border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                                            autoComplete="off"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-[400] text-[16px] mb-2" htmlFor="password">
                                            Password*
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full bg-[#333] text-white h-[42px] px-4 text-lg font-medium border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold text-lg mb-2" htmlFor="confirmPassword">
                                            Confirm Password*
                                        </label>
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full bg-[#333] text-white h-[42px] px-4 text-lg font-medium border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                                            required
                                        />
                                    </div>
                                    {error && <p className="text-red-500 mt-2">{error}</p>}
                                    {success && <p className="text-green-500 mt-2">{success}</p>}
                                    <button
                                        type="submit"
                                        className="w-full bg-[#ff3c33] hover:bg-[#e03228] text-white font-[700] text-[16px] h-[50px] transition-all duration-200 mt-2"
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating Account...' : 'Create Account'}
                                    </button>
                                </div>
                                <div className="mt-6">
                                    <p className="text-white text-[16px] font-[400]">
                                        You already have an account?{' '}
                                        <Link
                                            to={"/login"}
                                            className="underline text-white hover:text-[#ff3c33] transition-all"
                                        >
                                            Login to your account
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                        <div className='md:flex flex-col items-center justify-center col-span-1 hidden'>
                            <img
                                src={SectionImg}
                                alt="Register Section"
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Register;