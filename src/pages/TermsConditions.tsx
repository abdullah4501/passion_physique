import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bannerImg from '@/assets/bg/termsBg.png';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";


const Faq = () => {
    const faqData = [
        {
            id: "item-1",
            question: "1. What's the difference between Basic and Full plans?",
            answer: "Basic Includes Nutrition, Supplements, Cardio, Recovery, Posing, Weekly Chats, Form Checks, And Updates — But No Workout Plan.\nFull Includes Everything, Plus A Custom Workout Program And More Interaction."
        },
        {
            id: "item-2",
            question: "2. How do I pay?",
            answer: "Payment information and methods will be provided here."
        },
        {
            id: "item-3",
            question: "3. Will I receive an invoice?",
            answer: "Invoice information will be provided here."
        },
        {
            id: "item-4",
            question: "4. Are refunds possible?",
            answer: "Refund policy information will be provided here."
        },
        {
            id: "item-5",
            question: "5. Can I contact you during the plan?",
            answer: "Contact information and availability will be provided here."
        },
        {
            id: "item-6",
            question: "6. Is my data private?",
            answer: "Data privacy and security information will be provided here."
        },
        {
            id: "item-7",
            question: "7. How do I start?",
            answer: "Getting started instructions will be provided here."
        },
        {
            id: "item-8",
            question: "8. What if I have injuries or a unique schedule?",
            answer: "Information about accommodations for injuries and unique schedules will be provided here."
        },
        {
            id: "item-9",
            question: "9. Do I need a gym?",
            answer: "Gym requirements and alternatives will be provided here."
        },
        {
            id: "item-10",
            question: "10. Are eBooks included?",
            answer: "eBook information and inclusions will be provided here."
        }
    ];
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
                    <h1 className="text-[66px] font-bold uppercase leading-[80px] mb-4 select-none">
                        <span className="text-primary">Terme &</span>{" "}
                        <span className="text-white">CONDITIONS</span>
                    </h1>
                    <div className="flex flex-col items-center">
                        <span className="text-white font-bold text-[26px] leading-[26px]">
                            Home / Terms & Conditions
                        </span>
                    </div>
                </div>
            </section>
            <section className="w-full py-[125px] bg-black">
                <div className="container px-5">
                    {/* Terms, Conditions & Refund Policy */}
                    <div className="mb-12 max-w-[1600px] mx-auto">
                        <h2 className="text-white font-bold text-[18px] mb-6">
                            Terms, Conditions & Refund Policy
                        </h2>
                        <p className="text-[#ffffffc7] text-[16px] leading-[35px] mb-1">
                            By enrolling in any service provided by The Passion Physique, you agree to the following terms:
                        </p>
                        <ol className="list-decimal pl-8 text-[#ffffffc7] text-[16px] leading-[35px] ">
                            <li className="mb-1">
                                All payments are final. No refunds will be issued under any circumstances, including partial use or early cancellation of any plan.
                            </li>
                            <li className="mb-1">
                                Services are personalized and time-based, and preparation begins immediately once payment is received.
                            </li>
                            <li className="mb-1">
                                Decimal overpayments (e.g., cents or fils) made via bank transfer are non-refundable.
                            </li>
                            <li className="mb-1">
                                Prices may vary depending on the EUR/AED exchange rate at the time of payment.
                            </li>
                            <li className="mb-1">
                                Upon payment, you will immediately receive an invoice, followed by access to a private, customized questionnaire required to begin your plan.
                            </li>
                            <li className="mb-1">
                                In accordance with Federal Decree-Law No. 8 of 2017 on VAT (UAE) and international consumer protection standards, every client has the legal right to receive an invoice after payment. Refusal to issue one may result in reporting to the UAE Federal Tax Authority (FTA) or the relevant authority in the client’s country.
                            </li>
                            <li className="mb-1">
                                Trust is the foundation of this coaching relationship. I expect 100% honesty and transparency from each client to ensure accurate and effective program design.
                            </li>
                            <li className="mb-1">
                                Any form of disrespect, dishonesty, or repeated non-cooperation may lead me to reconsider continuing the coaching partnership. No refunds will be provided in such cases.
                            </li>
                            <li className="mb-1">
                                All coaching materials, plans, and communication are strictly confidential and may not be shared, copied, or published without my written permission (Petros Pasiollari).
                            </li>
                        </ol>
                    </div>
                </div>
            </section>


            <Footer />
        </>
    );
}

export default Faq;