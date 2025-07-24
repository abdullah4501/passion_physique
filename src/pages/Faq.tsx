import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bannerImg from '@/assets/bg/faq.png';
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
                    alt="FAQs"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    draggable={false}
                />

                {/* Overlay for extra darkening (if needed) */}
                <div className="absolute inset-0 " />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full">
                    <h1 className="text-[66px] font-bold uppercase leading-[80px] mb-4 select-none">
                        <span className="text-primary">FAQs</span>
                    </h1>
                    <div className="flex flex-col items-center">
                        <span className="text-white font-bold text-[26px] leading-[26px]">
                            Home / FAQs
                        </span>
                    </div>
                </div>
            </section>
            {/* Accordian Section */}
            <section className="py-[120px] ">
                <div className="container px-4">
                    <Accordion
                        type="single"
                        collapsible
                        defaultValue="item-1"
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
                                <AccordionContent className="px-6 lg:w-[60%] w-full">
                                    <div className="text-[#ffffffd6] font-[400] text-[15px] leading-[25px] whitespace-pre-line">
                                        {item.answer}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                        ))}
                    </Accordion>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Faq;