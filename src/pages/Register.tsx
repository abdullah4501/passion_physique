import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bannerImg from '@/assets/gallery/register.png';
import SectionImg from '@/assets/registerSection.png';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const titleVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const Register = () => {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: '-100px' });
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const passwordIsValid = (password) => {
    return /^(?=.*\d)(?=.*[-_.+=!@#$%^&*()\/?><.,'])[A-Za-z\d\-_.+=!@#$%^&*()\/?><.,']{8,}$/.test(password);
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
      // --- Password validation here ---
  if (!passwordIsValid(form.password)) {
    setError("Password must be at least 8 characters long, contain at least one number and one special character.");
    setLoading(false);
    return;
  }
  if (form.password !== form.confirmPassword) {
    setError("Passwords do not match.");
    setLoading(false);
    return;
  }
  
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/pre-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setEmail(form.email);
      setShowOtpModal(true); // Show modal!
    } else {
      setError(data.msg || 'Something went wrong');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setVerifyingOtp(true);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const data = await res.json();
    setVerifyingOtp(false);
    if (res.ok) {
      setShowOtpModal(false);
      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => navigate('/login'), 1200);
    } else {
      setError(data.msg || "Invalid OTP");
    }
  };

  const OtpModal = ({ open, otp, setOtp, loading, error, onSubmit, onClose }) => {
    if (!open) return null;
    return (
      <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/70">
        <div className="bg-[#1a1a1a] rounded-xl shadow-2xl px-7 py-9 min-w-[340px] max-w-[95vw] relative">
          <button
            className="absolute top-3 right-3 text-[#ff3c33] text-2xl font-bold"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            ×
          </button>
          <h3 className="text-white text-2xl mb-5 font-bold text-center">Verify Email</h3>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <label className="block text-white text-sm mb-1" htmlFor="otp">Enter the OTP sent to your email</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="w-full bg-[#333] text-white h-[42px] px-4 text-lg font-medium border-none outline-none focus:ring-2 focus:ring-primary rounded-md transition-all duration-200 tracking-widest text-center text-xl"
              maxLength={6}
              required
              autoFocus
              inputMode="numeric"
              pattern="\d*"
              placeholder="6-digit code"
            />
            {error && <div className="text-red-500 mt-1 text-center">{error}</div>}
            <button
              type="submit"
              className="w-full bg-[#ff3c33] hover:bg-[#e03228] text-white font-[700] text-[16px] h-[48px] rounded-md transition-all duration-200 mt-2 flex items-center justify-center"
              disabled={loading}
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
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
              )}
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        </div>
      </div>
    );
  };


  return (
    <>
      <Header />
      <section className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
        <img
          src={bannerImg}
          alt="register"
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
            animate={heroInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.85, ease: [0.42, 0, 0.2, 1] }}
          >
            <span className="text-primary">Register</span> <span className="text-white">Now</span>
          </motion.h1>
          <motion.div
            variants={titleVariants}
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[120px]">
            <div className="flex flex-col justify-center col-span-1">
              <form onSubmit={handleRegister}>
                <div className="flex flex-col gap-6 w-full">
                  <div>
                    <label className="block text-white font-[400] text-[16px] mb-2" htmlFor="firstName">
                      First Name*
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className="w-full bg-[#333] text-white h-[42px] px-4 text-lg font-medium border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
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
                      value={form.lastName}
                      onChange={handleChange}
                      className="w-full bg-[#333] text-white h-[42px] px-4 text-lg font-medium border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
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
                      value={form.email}
                      onChange={handleChange}
                      className="w-full bg-[#333] text-white h-[42px] px-4 text-lg font-medium border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
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
                      value={form.password}
                      onChange={handleChange}
                      className="w-full bg-[#333] text-white h-[42px] px-4 text-lg font-medium border-none outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                      required
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
                      value={form.confirmPassword}
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
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
                <div className="mt-6">
                  <p className="text-white text-[16px] font-[400]">
                    You already have an account?{' '}
                    <Link to="/login" className="underline text-white hover:text-[#ff3c33] transition-all">
                      Login to your account
                    </Link>
                  </p>
                </div>
              </form>

            </div>
            <div className="md:flex flex-col items-center justify-center col-span-1 hidden">
              <img src={SectionImg} alt="Register Section" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>
      <OtpModal
        open={showOtpModal}
        otp={otp}
        setOtp={setOtp}
        loading={verifyingOtp}
        error={error}
        onSubmit={handleVerify}
        onClose={() => setShowOtpModal(false)}
      />
      <Footer />
    </>
  );
};

export default Register;