import React from "react";

const PaymentSuccessModal = ({ open, onClose }) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70">
        <div className="bg-[#232323] rounded-xl shadow-lg p-8 md:w-[400px] w-[90vw] flex flex-col items-center">
          <svg width={70} height={70} className="mb-3" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="#ff3131" />
            <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="text-white text-[32px] font-bold mb-2 text-center">Congratulations!</h2>
          <p className="text-[#ccc] text-lg mb-6 text-center">Your payment was successful.<br />Welcome to your membership!</p>
          <button
            className="w-full h-[45px] bg-[#ff3131] hover:bg-[#e03228] text-white font-[600] text-[16px] rounded-none transition-all duration-150"
            onClick={onClose}
          >
            Let's go next &rarr;
          </button>
        </div>
      </div>
    );
  };
  
  export default PaymentSuccessModal;