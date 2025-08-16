import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bannerImg from '@/assets/bg/faq.png';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

// Animation Variants
const titleVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
};
const breadcrumbsVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};
const faqSectionVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 }
};
const answerVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.33, ease: [0.42, 0, 0.2, 1] } },
    exit: { opacity: 0, y: 24, scale: 0.97, transition: { duration: 0.2 } }
};

const faqData = [
    {
        id: "item-1",
        question: "1. What's the difference between Basic and Full plans?",
        answer:
            "Basic includes nutrition, supplements, cardio, recovery, posing, weekly chats, form checks, and updates — but no workout plan.\nFull includes everything, plus a custom workout program and more interaction."
    },
    {
        id: "item-2",
        question: "2. How do I pay?",
        answer:
            "Via UAE Bank Transfer (SEPA), Payoneer, or Stripe. A 3–6% fee applies to Payoneer and Stripe."
    },
    {
        id: "item-3",
        question: "3. Will I receive an invoice?",
        answer:
            "Yes, immediately after payment — in line with UAE VAT Law and global consumer protection."
    },
    {
        id: "item-4",
        question: "4. Are refunds possible?",
        answer:
            "No. All payments are final. Please review the Terms before purchasing."
    },
    {
        id: "item-5",
        question: "5. Can I contact you during the plan?",
        answer:
            "Yes. Both plans include mandatory coaching chats and weekly form checks:\n• Basic: 2x/week\n• Full: 4x/week"
    },
    {
        id: "item-6",
        question: "6. Is my data private?",
        answer:
            "Yes. All data is confidential and accessed only by Petros Pasiollari. Nothing is shared without written consent."
    },
    {
        id: "item-7",
        question: "7. How do I start?",
        answer:
            "After payment, you’ll receive your invoice and access to a custom onboarding questionnaire."
    },
    {
        id: "item-8",
        question: "8. What if I have injuries or a unique schedule?",
        answer:
            "Plans are adapted to your lifestyle, training level, and health needs."
    },
    {
        id: "item-9",
        question: "9. Do I need a gym?",
        answer:
            "• Basic: Gym optional but recommended\n• Full: Gym is mandatory"
    },
    {
        id: "item-10",
        question: "10. Are eBooks included?",
        answer:
            "Yes — 1 eBook is free for clients.\n4 additional premium eBooks will be payable."
    },
    {
        id: "item-11",
        question: "11. What if I can’t perform an exercise from the workout library?",
        answer:
            "The library is designed with variety and flexibility in mind. If a specific exercise isn’t possible, I’ll provide alternatives that match your equipment and training style."
    }
];


import { useState } from "react";

const Faq = () => {
    // For section fade in
    const sectionRef = useRef(null);
    const sectionInView = useInView(sectionRef, { once: true, margin: "-120px" });
    // For title and breadcrumbs
    const bannerRef = useRef(null);
    const bannerInView = useInView(bannerRef, { once: true, margin: "-100px" });

    // For managing open state of accordion (Radix Accordion can be controlled or uncontrolled)
    const [open, setOpen] = useState("item-1");

    return (
        <>
            <Header />
            <section className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
                {/* Banner Image */}
                <img
                    src={bannerImg}
                    alt="FAQs"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    draggable={false}
                />
                <div className="absolute inset-0 " />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full">
                    <motion.h1
                        ref={bannerRef}
                        className="text-[66px] font-bold uppercase leading-[80px] mb-4 select-none page-title"
                        variants={titleVariants}
                        initial="hidden"
                        animate={bannerInView ? "visible" : "hidden"}
                        transition={{ duration: 0.85, ease: [0.42, 0, 0.2, 1] }}
                    >
                        <span className="text-primary">FAQs</span>
                    </motion.h1>
                    <motion.div
                        className="flex flex-col items-center"
                        variants={breadcrumbsVariants}
                        initial="hidden"
                        animate={bannerInView ? "visible" : "hidden"}
                        transition={{ duration: 0.8, ease: [0.42, 0, 0.2, 1], delay: 0.08 }}
                    >
                        <span className="text-white font-bold text-[26px] leading-[26px] breadcrumbs">
                            Home / FAQs
                        </span>
                    </motion.div>
                </div>
            </section>
            {/* Accordion Section */}
            <motion.section
                className="py-[120px]"
                ref={sectionRef}
                variants={faqSectionVariants}
                initial="hidden"
                animate={sectionInView ? "visible" : "hidden"}
                transition={{ duration: 0.7, ease: [0.42, 0, 0.2, 1] }}
            >
                <div className="container px-4">
                    <Accordion
                        type="single"
                        collapsible
                        value={open}
                        onValueChange={setOpen}
                        className="space-y-0"
                    >
                        {faqData.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={item.id}
                                className={`
                                    border-b border-[#ffffff29]
                                    data-[state=open]:border-[#FF3131] data-[state=open]:bg-[#2e2e2e] data-[state=open]:border data-[state=open]:py-6 data-[state=open]:mb-4
                                    transition-all duration-300
                                `}
                            >
                                <AccordionTrigger className="text-left py-6 px-6 text-white hover:no-underline hover:bg-transparent text-lg font-medium [&>svg]:hidden group relative">
                                    <span className="flex-1 pr-8 text-[20px] leading-[28px]">{item.question}</span>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                        <div className="w-6 h-6 flex items-center justify-center">
                                            <span className="text-primary text-2xl font-light group-data-[state=open]:hidden">+</span>
                                            <span className="text-primary text-2xl font-light hidden group-data-[state=open]:block">−</span>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                {/* Animate answer with AnimatePresence */}
                                <AnimatePresence initial={false}>
                                    {open === item.id && (
                                        <motion.div
                                            key={item.id}
                                            variants={answerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            transition={{ duration: 0.33, ease: [0.42, 0, 0.2, 1] }}
                                        >
                                            <AccordionContent className="px-6 lg:w-[60%] w-full">
                                                <div className="text-[#ffffffd6] font-[400] text-[15px] leading-[25px] whitespace-pre-line">
                                                    {item.answer}
                                                </div>
                                            </AccordionContent>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </motion.section>
            <Footer />
        </>
    );
}

export default Faq;
