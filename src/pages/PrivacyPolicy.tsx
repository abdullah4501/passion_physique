import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bannerImg from '@/assets/bg/termsBg.png';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const titleVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 }
};
const PrivacyPolicy = () => {
    // Animate hero title
    const heroRef = useRef(null);
    const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
    return (
        <>
            <Header />
            <section className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
                {/* Banner Image */}
                <img
                    src={bannerImg}
                    alt="terms and conditions"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    draggable={false}
                />
                {/* Overlay for extra darkening (if needed) */}
                <div className="absolute inset-0 " />
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full">
                    <motion.h1
                        ref={heroRef}
                        className="text-[66px] font-bold uppercase leading-[80px] mb-4 select-none page-title"
                        variants={titleVariants}
                        initial="hidden"
                        animate={heroInView ? "visible" : "hidden"}
                        transition={{ duration: 0.85, ease: [0.42, 0, 0.2, 1] }}
                    >
                        <span className="text-primary">Privacy &</span>{" "}
                        <span className="text-white">Data Policy</span>
                    </motion.h1>
                    <motion.div
                        variants={titleVariants}
                        initial="hidden"
                        animate={heroInView ? "visible" : "hidden"}
                        transition={{ duration: 1, delay: 0.14, ease: [0.42, 0, 0.2, 1] }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-white font-bold text-[26px] leading-[26px] breadcrumbs">
                            Home / Privacy & Data Policy
                        </span>
                    </motion.div>
                </div>
            </section>
            <section className="w-full py-[125px] bg-black">
                <div className="container px-5">
                    {/* Terms, Conditions & Refund Policy */}
                    <div className="mb-12 max-w-[1600px] mx-auto">
                        <h2 className="text-white font-bold text-[18px] mb-6">
                            Privacy & Data Policy
                        </h2>
                        <p className="text-[#ffffffc7] text-[16px] leading-[35px] mb-1">
                            At The Passion Physique, all client data is treated as strictly confidential and handled with the
                            highest level of care.
                        </p>
                        <ul className="list-disc pl-8 text-[#ffffffc7] text-[16px] leading-[35px] mb-8">
                            <li className="mb-3">
                                I consider all personal information — including photos, videos, forms, and communication — as sensitive data.
                            </li>
                            <li className="mb-3">
                                Only I, Petros Pasiollari, have access to this information. It will never be shared, published, or used without your explicit written consent.
                            </li>
                            <li className="mb-3">
                                No data is stored on public platforms or accessed by third parties.
                            </li>
                        </ul>
                        <p className="text-[#ffffffc7] text-[16px] leading-[35px] mb-8">This approach reflects my long-term commitment to privacy. The development of my future blockchain-based Lift2Earn DApp is built on this very principle:<br /> <b>Clients should always retain full control over their personal data and progress.
                        </b></p>
                        <p className="text-[#ffffffc7] text-[16px] leading-[35px]">Your trust is my responsibility — and protecting your privacy is part of my mission</p>

                    </div>
                </div>
            </section>


            <Footer />
        </>
    );
}

export default PrivacyPolicy;