import React from "react";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

export default function MemberRequiredModal({ open, onClose }) {
    if (!open) return null;
    const navigate = useNavigate();

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed pt-6 md:pt-20 inset-0 z-50 flex items-start justify-center bg-white/60">
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.42, 0, 0.2, 1] }}
                        className="bg-[#222] rounded-none max-w-lg w-full mx-3 p-10 md:px-10 px-3 flex flex-col items-center shadow-lg relative"
                    >
                        <h2 className="text-white text-center md:text-[26px] text-[20px] font-[700] leading-[30px] mb-4">
                            You Need To Be A Member To Download This Book
                        </h2>
                        <p className="text-[#ddd] text-center mb-8 text-[14px] font-[400] leading-[24px] max-w-md">
                            Lorem ipsum dolor sit amet consectetur. Posuere pretium bibendum nulla facilisis ligula. Sit habitasse
                        </p>
                        <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
                            <button
                                className="bg-[#ff3c33] text-white text-[12px] px-8 py-2 font-[500] rounded-none hover:bg-[#e03228] transition-all w-full md:w-auto"
                                onClick={() => navigate('/plans?redirect=/e-books')}
                            >
                                JOIN NOW
                            </button>
                            <button
                                className="border border-[#ff3c33] text-[#ff3c33] text-[12px] px-8 py-2 font-[500] rounded-none bg-transparent hover:bg-[#ff3c33] hover:text-white transition-all w-full md:w-auto"
                                onClick={onClose}
                            >
                                CLOSE
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
