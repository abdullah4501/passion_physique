import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bannerImg from '@/assets/ebooks/bg.png';
import Book1 from '@/assets/ebooks/ebook-1.png';
import Book2 from '@/assets/ebooks/ebook-2.png';
import DownloadIcon from '@/assets/icons/download.png';
import { Button } from '@/components/ui/button';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const plans = [
    {
        name: "Coaching E-Book 1",
        price: "50.00",
        description: "Lorem ipsum dolor sit amet consectetur. Posuere pretium bibendum nulla facilisis ligula. Sit habitasse congue ultrices condimentum in duis.",
        note: "FOR ALL",
        img: Book1,
        forAll: true,
    },
    {
        name: "Coaching E-Book 2",
        price: "70.00",
        description: "Lorem ipsum dolor sit amet consectetur. Posuere pretium bibendum nulla facilisis ligula. Sit habitasse congue ultrices condimentum in duis.",
        note: "FOR MEMBERS ONLY",
        img: Book2,
        forAll: false,
    },
    {
        name: "Coaching E-Book 3",
        price: "70.00",
        description: "Lorem ipsum dolor sit amet consectetur. Posuere pretium bibendum nulla facilisis ligula. Sit habitasse congue ultrices condimentum in duis.",
        note: "FOR MEMBERS ONLY",
        img: Book2,
        forAll: false,
    },
    {
        name: "Coaching E-Book 4",
        price: "70.00",
        description: "Lorem ipsum dolor sit amet consectetur. Posuere pretium bibendum nulla facilisis ligula. Sit habitasse congue ultrices condimentum in duis.",
        note: "FOR MEMBERS ONLY",
        img: Book2,
        forAll: false,
    },
];

// Card animation variant
const cardVariants = {
    hidden: { opacity: 0, y: 42, scale: 0.97 },
    visible: (idx) => ({
        opacity: 1,
        y: 0,
        scale: 1,

    })
};

// Title animation variant
const titleVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 }
};

const Ebooks = () => {
    // For staggered cards
    const cardsRef = useRef(null);
    const cardsInView = useInView(cardsRef, { once: false, margin: "-100px" });

    // For animated title
    const titleRef = useRef(null);
    const titleInView = useInView(titleRef, { once: true, margin: "-100px" });

    return (
        <>
            <Header />
            <section className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
                {/* Banner Image */}
                <img
                    src={bannerImg}
                    alt="Coaching E-Books"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    draggable={false}
                />

                {/* Overlay for extra darkening (if needed) */}
                <div className="absolute inset-0 " />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full">
                    <motion.h1
                        ref={titleRef}
                        className="text-[66px] font-bold uppercase leading-[80px] mb-4 select-none page-title"
                        variants={titleVariants}
                        transition={{ duration: 0.85, ease: [0.42, 0, 0.2, 1] }}
                        initial="hidden"
                        animate={titleInView ? "visible" : "hidden"}
                    >
                        <span className="text-primary">Coaching</span>{" "}
                        <span className="text-white">E-Books</span>
                    </motion.h1>
                    <motion.div
                        className="flex flex-col items-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, margin: "-80px" }}
                        variants={titleVariants}
                        transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1], delay: 0.08 }}
                    >
                        <span className="text-white font-bold text-[26px] leading-[26px] breadcrumbs">
                            Home / Coaching E-Books
                        </span>
                    </motion.div>

                </div>
            </section>
            <section className="bg-primary py-5">
                <div className=" mx-auto ">
                    <p className='uppercase text-white text-center font-[16px] font-bold'>If you are a member of The Passion Physique, please log in to access all books </p>
                </div>
            </section>
            {/* Books Section */}
            <section className="py-[120px] ">
                <div className="container px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-7" ref={cardsRef}>
                        {plans.map((plan, idx) => (
                            <motion.div
                                key={idx}
                                className="bg-[#2E2E2E] md:px-[45px] px-[15px] py-[40px] flex md:flex-row flex-col items-center rounded-none shadow-none p-6 relative min-h-[180px] gap-4"
                                style={{ minHeight: 180 }}
                                variants={cardVariants}
                                transition={{
                                    duration: 0.65,
                                    ease: [0.42, 0, 0.2, 1],
                                    delay: idx * 0.13,
                                }}
                                initial="hidden"
                                animate={cardsInView ? "visible" : "hidden"}
                                custom={idx}
                                whileHover={{
                                    scale: 1.03,
                                    boxShadow: "0 6px 32px 0 rgba(237,35,42,0.16)"
                                }}
                            >
                                {/* Book Cover */}
                                <div className=" overflow-hidden">
                                    <img
                                        src={plan.img}
                                        alt={plan.name}
                                        className="h-[180px] object-contain"
                                        draggable={false}
                                    />
                                </div>

                                {/* Info Side */}
                                <div className="flex-1 flex flex-col justify-center h-full relative">
                                    {/* Top: Badge, Title, Download, Price */}
                                    <div className="flex flex-row items-start justify-between">
                                        <div>
                                            <span className={`block text-[14px] font-semibold mb-1 uppercase tracking-wide text-primary`}>
                                                {plan.forAll ? "FOR ALL" : "FOR MEMBERS ONLY"}
                                            </span>
                                            <span className="block text-white text-[20px] font-normal mb-1">{plan.name}</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-3">
                                            {/* Download icon */}
                                            <img
                                                src={DownloadIcon}
                                                alt="Download"
                                                className=" object-contain"
                                                draggable={false}
                                            />
                                            <span className="text-white text-[17px] font-normal ml-2">
                                                €{plan.price}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Description */}
                                    <div className="text-white text-[14px] font-normal mt-2 mb-0 leading-[24px] pr-0 md:pr-[25px]">
                                        {plan.description}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Ebooks;
