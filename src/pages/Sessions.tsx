import { Button } from '@/components/ui/button';
import bannerImg from '@/assets/session/banner.png';
import Header from '@/components/Header';
import symbol from "@/assets/icons/symbol.png";
import Footer from '@/components/Footer';
import bg from "@/assets/bg/Plans.png";
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const sessionFeatures = [
    "Training strategy & program analysis",
    "Supplementation (science-backed)",
    "Posing critique & adjustments",
    "Any personal concerns or roadblocks",
    "Nutrition & meal structure",
    "Sleep, recovery, & stress balance",
    "Digestion & gut health",
    "Routine, lifestyle habits, & time management"
];

// Animation Variants
const heroVariants = {
    hidden: { opacity: 0, y: 44, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 }
};
const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 }
};
const sectionFade = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
};
const featureItemVariants = {
    hidden: { opacity: 0, x: -28 },
    visible: { opacity: 1, x: 0 }
};

const Sessions = () => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/sessions`)
            .then(res => res.json())
            .then(data => {
                if (data.sessions && data.sessions.length > 0) {
                  setSession(data.sessions[0]);
                }
                setLoading(false);
              })
              
            .catch(() => setLoading(false));
    }, []);
    // Animation refs
    const heroRef = useRef(null);
    const heroInView = useInView(heroRef, { once: true, margin: "-100px" });

    const cardsRef = useRef(null);
    const cardsInView = useInView(cardsRef, { once: false, margin: "-100px" });

    const featuresRef = useRef(null);
    const featuresInView = useInView(featuresRef, { once: false, margin: "-100px" });

    return (<>
        <Header />
        {/* HERO/BANNER */}
        <section className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
            <img
                src={bannerImg}
                alt="1-on-1 session"
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
                    <span className="text-primary">1-on-1</span>{" "}
                    <span className="text-white">Session</span>
                </motion.h1>
                <motion.div
                    variants={heroVariants}
                    initial="hidden"
                    animate={heroInView ? "visible" : "hidden"}
                    transition={{ duration: 1, delay: 0.15, ease: [0.42, 0, 0.2, 1] }}
                    className="flex flex-col items-center"
                >
                    <span className="text-white font-bold text-[26px] leading-[26px] breadcrumbs">
                        Home / 1-on-1 Session
                    </span>
                </motion.div>
            </div>
        </section>
        {/* Duration, Book, Price Cards */}
        <section className="w-full py-[125px] bg-black">
            <motion.div
                className="container vat_info px-5"
                ref={cardsRef}
                variants={sectionFade}
                initial="hidden"
                animate={cardsInView ? "visible" : "hidden"}
                transition={{ duration: 0.8, ease: [0.42, 0, 0.2, 1] }}
            >
                <motion.p
                    className="text-white text-[15px] font-[400] mb-10"
                    variants={sectionFade}
                    initial="hidden"
                    animate={cardsInView ? "visible" : "hidden"}
                    transition={{ duration: 0.75, delay: 0.07, ease: [0.42, 0, 0.2, 1] }}
                >
                    This is a professional, science-based consultation designed to provide real clarity and practical
                    direction for your fitness journey.
                    Whether you continue with a coaching plan or not, this session will always leave you more informed, more structured, and more focused. <b>(through WhatsApp)</b>
                </motion.p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
                    {loading ? (
                        <div className="text-white col-span-3 text-center">Loading session info...</div>
                    ) : session && (
                        <>
                            {/* Duration */}
                            <motion.div
                                className="bg-[#2e2e2e] flex flex-col items-center justify-center min-h-[250px] px-6 py-12"
                                variants={cardVariants}
                                initial="hidden"
                                animate={cardsInView ? "visible" : "hidden"}
                                transition={{ duration: 0.55, delay: 0 * 0.12, ease: [0.42, 0, 0.2, 1] }}
                            >
                                <span className="text-primary text-[14px] font-[700] tracking-[1px] leading-[25px] uppercase mb-1">Duration</span>
                                <span className="text-white text-[20px] leading-[30px] font-[400] mt-1">{session.duration} minutes</span>
                            </motion.div>
                            {/* Book Now */}
                            <motion.div
                                className="bg-[#ff3131] flex flex-col items-center justify-center min-h-[250px] px-6 py-12"
                                variants={cardVariants}
                                initial="hidden"
                                animate={cardsInView ? "visible" : "hidden"}
                                transition={{ duration: 0.6, delay: 1 * 0.12, ease: [0.42, 0, 0.2, 1] }}
                                whileHover={{ scale: 1.03, boxShadow: "0 4px 24px 0 rgba(237,49,49,0.18)" }}
                            >
                                <span className="text-white text-[14px] font-[700] tracking-[1px] leading-[25px] uppercase mb-1">Book Now</span>
                                <Link to={`/session/payment/${session._id}`}
                                    className="
                                        border border-white 
                                        text-white mt-3
                                        text-[12px] font-[700] leading-[12px] uppercase 
                                        px-[35px] py-[15px]
                                        transition-all duration-200
                                        hover:bg-white hover:text-[#FF3535]
                                        "
                                    style={{
                                        letterSpacing: '1px',
                                        outline: 'none'
                                    }}
                                >
                                    BOOK NOW
                                </Link>
                            </motion.div>
                            {/* Price */}
                            <motion.div
                                className="bg-[#2e2e2e] flex flex-col items-center justify-center min-h-[250px] px-6 py-12"
                                variants={cardVariants}
                                initial="hidden"
                                animate={cardsInView ? "visible" : "hidden"}
                                transition={{ duration: 0.55, delay: 2 * 0.12, ease: [0.42, 0, 0.2, 1] }}
                            >
                                <span className="text-primary text-[14px] font-[700] tracking-[1px] leading-[25px] uppercase mb-1">Price</span>
                                <span className="text-white text-[20px] leading-[30px] font-[400] mt-1">€{session.amount}</span>
                            </motion.div>
                        </>
                    )}

                </div>
            </motion.div>
        </section>
        {/* Features Section */}
        <section className="relative w-full py-[120px]" style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            <motion.div
                className="container z-10 grid grid-cols-1 md:grid-cols-3"
                ref={featuresRef}
                variants={sectionFade}
                initial="hidden"
                animate={featuresInView ? "visible" : "hidden"}
                transition={{ duration: 0.8, ease: [0.42, 0, 0.2, 1] }}
            >
                <div className="flex flex-col justify-center z-10 col-span-2">
                    <motion.h2
                        className="text-white text-[34px] font-medium mb-2 leading-[44px]"
                        variants={sectionFade}
                        initial="hidden"
                        animate={featuresInView ? "visible" : "hidden"}
                        transition={{ duration: 0.8, delay: 0.08, ease: [0.42, 0, 0.2, 1] }}
                    >
                        We'll cover any topics relevant<br />to your goals
                        <span className="text-[#ED232A]"> INCLUDING</span>
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 mb-8 mt-8 max-w-[840px]">
                        <div className="flex flex-col gap-y-3">
                            {sessionFeatures.slice(0, 4).map((feature, i) => (
                                <motion.div
                                    key={i}
                                    className="flex items-center gap-3"
                                    variants={featureItemVariants}
                                    initial="hidden"
                                    animate={featuresInView ? "visible" : "hidden"}
                                    transition={{ duration: 0.56, delay: i * 0.10 + 0.16, ease: [0.42, 0, 0.2, 1] }}
                                >
                                    <img src={symbol} className="inline-block" />
                                    <span className="text-white text-[15px] leading-[32px]">{feature}</span>
                                </motion.div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-y-3">
                            {sessionFeatures.slice(4).map((feature, i) => (
                                <motion.div
                                    key={i}
                                    className="flex items-center gap-3"
                                    variants={featureItemVariants}
                                    initial="hidden"
                                    animate={featuresInView ? "visible" : "hidden"}
                                    transition={{ duration: 0.56, delay: (i + 4) * 0.10 + 0.16, ease: [0.42, 0, 0.2, 1] }}
                                >
                                    <img src={symbol} className="inline-block" />
                                    <span className="text-white text-[15px] leading-[32px]">{feature}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <motion.p
                        className="text-[#ffffff] text-[15px] leading-[25px] my-4 font-normal"
                        variants={sectionFade}
                        initial="hidden"
                        animate={featuresInView ? "visible" : "hidden"}
                        transition={{ duration: 0.7, delay: 0.29, ease: [0.42, 0, 0.2, 1] }}
                    >
                        Beyond the information, this session also acts as a “stress test” — helping you understand how I think, communicate, and coach under pressure. It gives you insight into my mindset and approach, and helps me better understand yours.
                    </motion.p>
                    <motion.div
                        className='flex'
                        variants={sectionFade}
                        initial="hidden"
                        animate={featuresInView ? "visible" : "hidden"}
                        transition={{ duration: 0.7, delay: 0.39, ease: [0.42, 0, 0.2, 1] }}
                    >
                        <Button className="hero-button px-[45px]">
                            BOOK NOW
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </section>
        <Footer />
    </>
    );
}

export default Sessions;
