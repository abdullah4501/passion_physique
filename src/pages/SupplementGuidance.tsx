import { Button } from '@/components/ui/button';
import bannerImg from '@/assets/bg/guidanceBg.png';
import Header from '@/components/Header';
import symbol from "@/assets/icons/symbol.png";
import Footer from '@/components/Footer';
import bg from "@/assets/bg/Plans.png";
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const guidance = [
    "Each ingredient: what it is, how it works, and why it matters",
    "Timing: when to take each supplement for optimal results",
    "Synergy: which combinations improve absorption and which to avoid",
    "Unnecessary or overhyped products you don’t need",
    "Recommendations based on your digestion, lifestyle, and training style"
];

// Animation variants
const heroVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 }
};
const cardVariants = {
    hidden: { opacity: 0, y: 38, scale: 0.97 },
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

const SupplementGuidance = () => {
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
                alt="supplement guidance"
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
                    <span className="text-primary">Supplement</span>{" "}
                    <span className="text-white">Guidance</span>
                </motion.h1>
                <motion.div
                    variants={heroVariants}
                    initial="hidden"
                    animate={heroInView ? "visible" : "hidden"}
                    transition={{ duration: 1, delay: 0.13, ease: [0.42, 0, 0.2, 1] }}
                    className="flex flex-col items-center"
                >
                    <span className="text-white font-bold text-[26px] leading-[26px] breadcrumbs">
                        Home / Supplement Guidance
                    </span>
                </motion.div>
            </div>
        </section>
        {/* Animated cards */}
        <section className="w-full py-[125px] bg-black">
            <motion.div
                className="container vat_info px-5"
                ref={cardsRef}
                variants={sectionFade}
                initial="hidden"
                animate={cardsInView ? "visible" : "hidden"}
                transition={{ duration: 0.75, ease: [0.42, 0, 0.2, 1] }}
            >
                <motion.p
                    className="text-white text-[15px] font-[400] mb-10"
                    variants={sectionFade}
                    initial="hidden"
                    animate={cardsInView ? "visible" : "hidden"}
                    transition={{ duration: 0.6, delay: 0.07, ease: [0.42, 0, 0.2, 1] }}
                >
                    This is not a list of products — it’s a science-based consultation tailored to your individual
                    needs.
                </motion.p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
                    {/* Description */}
                    <motion.div
                        className="bg-[#2e2e2e] flex flex-col items-center justify-center min-h-[250px] px-6 py-12"
                        variants={cardVariants}
                        initial="hidden"
                        animate={cardsInView ? "visible" : "hidden"}
                        transition={{ duration: 0.6, delay: 0 * 0.14, ease: [0.42, 0, 0.2, 1] }}
                    >
                        <span className="text-primary text-[14px] font-[700] tracking-[1px] leading-[25px] uppercase mb-1">Description</span>
                        <span className="text-white text-[20px] leading-[30px] font-[400] mt-1 text-center">
                            it’s a science-based consultation tailored to your individual
                        </span>
                    </motion.div>
                    {/* Book Now */}
                    <motion.div
                        className="bg-[#ff3131] flex flex-col items-center justify-center min-h-[250px] px-6 py-12"
                        variants={cardVariants}
                        initial="hidden"
                        animate={cardsInView ? "visible" : "hidden"}
                        transition={{ duration: 0.6, delay: 1 * 0.14, ease: [0.42, 0, 0.2, 1] }}
                        whileHover={{ scale: 1.03, boxShadow: "0 4px 24px 0 rgba(237,49,49,0.18)" }}
                    >
                        <span className="text-white text-[14px] font-[700] tracking-[1px] leading-[25px] uppercase mb-1">Book Now</span>
                        <button
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
                        </button>
                    </motion.div>
                    {/* Price */}
                    <motion.div
                        className="bg-[#2e2e2e] flex flex-col items-center justify-center min-h-[250px] px-6 py-12"
                        variants={cardVariants}
                        initial="hidden"
                        animate={cardsInView ? "visible" : "hidden"}
                        transition={{ duration: 0.6, delay: 2 * 0.14, ease: [0.42, 0, 0.2, 1] }}
                    >
                        <span className="text-primary text-[14px] font-[700] tracking-[1px] leading-[25px] uppercase mb-1">Price</span>
                        <span className="text-white text-[20px] leading-[30px] font-[400] mt-1 text-center">
                            Supplement Roadmap<br />€200
                        </span>
                    </motion.div>
                </div>
            </motion.div>
        </section>
        {/* Guidance breakdown */}
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
                        transition={{ duration: 0.8, delay: 0.09, ease: [0.42, 0, 0.2, 1] }}
                    >
                        Supplement Guidance<br />
                        <span className="text-[#ED232A]">BREAKDOWN</span>
                    </motion.h2>
                    <div className="flex flex-col gap-y-3 mb-8 mt-8 max-w-[840px]">
                        {guidance.map((feature, i) => (
                            <motion.div
                                key={i}
                                className="flex items-center gap-3"
                                variants={featureItemVariants}
                                initial="hidden"
                                animate={featuresInView ? "visible" : "hidden"}
                                transition={{ duration: 0.54, delay: i * 0.11 + 0.16, ease: [0.42, 0, 0.2, 1] }}
                            >
                                <img src={symbol} className="inline-block" />
                                <span className="text-white text-[15px] leading-[32px]">{feature}</span>
                            </motion.div>
                        ))}
                    </div>
                    <motion.p
                        className="text-[#ffffff] text-[15px] leading-[25px] my-4 font-normal"
                        variants={sectionFade}
                        initial="hidden"
                        animate={featuresInView ? "visible" : "hidden"}
                        transition={{ duration: 0.7, delay: 0.37, ease: [0.42, 0, 0.2, 1] }}
                    >
                        Everything is explained in a simple yet scientific way — with no sponsorships, no marketing bias.
                    </motion.p>
                    <motion.div
                        className='flex'
                        variants={sectionFade}
                        initial="hidden"
                        animate={featuresInView ? "visible" : "hidden"}
                        transition={{ duration: 0.7, delay: 0.44, ease: [0.42, 0, 0.2, 1] }}
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
export default SupplementGuidance;
