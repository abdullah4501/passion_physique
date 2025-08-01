import { Button } from '@/components/ui/button';
import bannerImg from '@/assets/gallery/plan_banner.png';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bg from "@/assets/bg/Plans.png";
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


// For heading
const tableHeadingVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 }
};
// For tbody container (to stagger children)
const tbodyVariants = {
    visible: {
        transition: { staggerChildren: 0.09 }
    }
};
// For each row
const rowVariants = {
    hidden: { opacity: 0, y: 28, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 }
};

// Animation variants
const cardVariants = {
    hidden: { opacity: 0, y: 48, scale: 0.96 },
    visible: (i: number) => ({
        opacity: 1, y: 0, scale: 1,

    }),
};
const headingVariants = {
    hidden: { opacity: 0, y: 42 },
    visible: { opacity: 1, y: 0 }
};

const CoachingPlan = () => {
    // Plans section animation
    const plansRef = useRef(null);
    const plansInView = useInView(plansRef, { once: false, margin: "-120px" });
    const [controls, setControls] = useState(useAnimation());
    useEffect(() => {
        if (plansInView) controls.start("visible");
        else controls.start("hidden");
    }, [plansInView, controls]);
    const navigate = useNavigate();

    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/api/coachingplans`)
            .then(res => res.json())
            .then(data => {
                setPlans(data.plans || []); // assuming { plans: [...] } in response
                setLoading(false);
            })
            .catch(() => {
                setError("Could not load plans");
                setLoading(false);
            });
    }, []);

    // Heading animation for "Basic VS Full COACHING PLANS"
    const tableSectionRef = useRef(null);
    const tableInView = useInView(tableSectionRef, { once: false, margin: "-100px" });
    const headingControls = useAnimation();
    const tbodyControls = useAnimation();

    useEffect(() => {
        if (tableInView) {
            headingControls.start("visible");
            tbodyControls.start("visible");
        } else {
            headingControls.start("hidden");
            tbodyControls.start("hidden");
        }
    }, [tableInView, headingControls, tbodyControls]);

    return (
        <>
            <Header />
            <section className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
                <img
                    src={bannerImg}
                    alt="Coaching Plan"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    draggable={false}
                />
                <div className="absolute inset-0 " />
                <div className="relative z-10 flex flex-col items-center justify-center w-full">
                    <motion.h1
                        className="text-[66px] font-bold uppercase leading-[80px] mb-4 select-none page-title"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, margin: "-80px" }}
                        variants={headingVariants}
                        transition={{ duration: 0.75, ease: "easeInOut" }}
                    >
                        <span className="text-primary">Coaching</span>{" "}
                        <span className="text-white">Plans</span>
                    </motion.h1>
                    <motion.div
                        className="flex flex-col items-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, margin: "-80px" }}
                        variants={headingVariants}
                        transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1], delay: 0.08 }}
                    >
                        <span className="text-white font-bold text-[26px] leading-[26px] breadcrumbs">
                            Home / Coaching Plans
                        </span>
                    </motion.div>

                </div>
            </section>
            <section className="py-[120px] relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    {/* Animated plans grid */}
                    <div
                        ref={plansRef}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
                    >
                        {loading ? (
                            <div className="text-white text-center col-span-2">Loading plans...</div>
                        ) : error ? (
                            <div className="text-red-500 text-center col-span-2">{error}</div>
                        ) : (
                            plans.map((plan, idx) => (
                                <motion.div
                                    key={plan._id || plan.name}
                                    className="bg-[#2E2E2E] md:px-[45px] px-[15px] py-[40px] transition-all duration-300 hover:scale-105 md:flex-row flex-col justify-between h-full"
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate={plansInView ? "visible" : "hidden"}
                                    custom={idx}
                                    whileHover={{
                                        scale: 1.06,
                                        boxShadow: "0 8px 40px 0 rgba(0,0,0,0.25)",
                                        transition: { duration: 0.15, ease: "easeOut" }  // FAST HOVER!
                                    }}
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-4 md:flex-row flex-col">
                                            <div className="flex-1 md:pr-6 pr-0 ">
                                                <h3 className="text-[26px] font-light text-white mb-3">{plan.name}</h3>
                                                <p className="text-white text-[14px] font-light leading-relaxed mb-4 md:pr-6 pr-0">
                                                    {plan.description}
                                                </p>
                                            </div>
                                            <div className="text-right pricing-info">
                                                <div className="text-[36px] font-light text-white">€{plan.price}</div>
                                                <div className="text-white text-[18px] font-light">{plan.period}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between md:flex-row flex-col">
                                        <p className="text-primary text-[14px] font-medium">{plan.note}</p>
                                        <Button className="bg-primary hover:bg-primary/90 text-white py-3 px-10 text-[12px] font-[600] transition-all duration-300 rounded-none md:w-auto w-full md:mt-0 mt-4">
                                            <Link to={`/plans/become-a-member/payment/${plan._id}`}>JOIN NOW</Link>
                                        </Button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </section>
            <section
                className="relative w-full py-[120px]"
                style={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
                ref={tableSectionRef}
            >
                <div className=" container z-10">
                    {/* Heading */}
                    <motion.h2
                        className="section-heading text-center mb-[55px]"
                        variants={tableHeadingVariants}
                        transition={{ duration: 0.55, ease: [0.42, 0, 0.2, 1] }}
                        initial="hidden"
                        animate={headingControls}
                    >
                        Basic VS Full <span className="text-primary">COACHING PLANS</span>
                    </motion.h2>
                    <div className="overflow-x-auto overflow-y-hidden">
                        {/* The table stays the same */}
                        <table className="w-full border-separate border-spacing-0 text-white min-w-[700px]">
                            <thead>
                                <tr>
                                    <th className="bg-[#FF3131] text-white md:text-[20px] text-[16px] font-medium py-3 px-3 border border-r-[#ffffff] ">FEATURE</th>
                                    <th className="bg-[#FF3131] text-white md:text-[20px] text-[16px] font-medium py-3 px-3 border border-r-[#ffffff] ">BASIC PLAN</th>
                                    <th className="bg-[#FF3131] text-white md:text-[20px] text-[16px] font-medium py-3 px-3 border border-r-[#ffffff] ">FULL PLAN</th>
                                </tr>
                            </thead>
                            <motion.tbody
                                variants={tbodyVariants}
                                initial="hidden"
                                animate={tbodyControls}
                                className="bg-[#222] opacity-70 text-base"
                            >
                                {/* Each row animated */}
                                {[
                                    ["Diet Plan", "Personalized", "Personalized"],
                                    ["Supplement Guidance", "Included", "Included"],
                                    ["Cardio & Recovery Protocols", "Included", "Included"],
                                    ["Posing Feedback", "Included", "Included"],
                                    ["Workout Plan", "Not Included", "Fully Personalized"],
                                    ["Coaching Access", "2x mandatory chats per week + from checks", "4x mandatory chats per week + from checks"],
                                    ["Workout Library Access", "Included", "Included"],
                                    ["Progress Tracking & Adjustments", "Weekly Updates", "Weekly Updates"],
                                ].map((cells, idx) => (
                                    <motion.tr
                                        key={idx}
                                        variants={rowVariants}
                                        transition={{ duration: 0.45, ease: [0.42, 0, 0.2, 1] }}
                                    >
                                        {cells.map((cell, cidx) => (
                                            <td key={cidx} className="py-3 md:text-[16px] text-[14px] px-3 border border-[#292929] text-center">
                                                {cell}
                                            </td>
                                        ))}
                                    </motion.tr>
                                ))}
                            </motion.tbody>
                        </table>
                    </div>
                </div>
            </section>
            <section className="w-full py-[125px] bg-black">
                <div className="container vat_info px-5 ">
                    {/* VAT Information */}
                    <div className="mb-12">
                        <h4 className="text-white   mb-2">VAT Information</h4>
                        <p className="text-white   mb-2">
                            The Passion Physique is a newly established UAE company, registered on 15 May 2025 under Sharjah Media City (SHAMS). In accordance with Federal Decree-Law No. 8 of 2017 on VAT, UAE-based businesses must register for VAT if their taxable turnover exceeds AED 375,000. There is also an optional (voluntary) VAT registration threshold of AED 187,500.
                        </p>
                        <p className="text-white  ">
                            Our current revenue is below that voluntary threshold, so we are not VAT-registered, and no VAT is charged on our services.
                        </p>
                    </div>

                    {/* European B2C Clients */}
                    <div className="mb-12">
                        <h4 className="text-white   mb-2">For European B2C clients:</h4>
                        <ul className="text-white   list-disc list-inside mb-2 space-y-1">
                            <li>
                                Under EU VAT rules for digital services, non-EU businesses may be required to register for VAT in the EU only if their total revenue from EU consumers exceeds €10,000 per year (Directive 2006/112/EC, Articles 58 &amp; 59).
                            </li>
                            <li>
                                Since our current annual revenue from EU-based clients is below this threshold, no VAT is applied to your purchases at this time.
                            </li>
                            <li>
                                All services are billed under UAE export rules as VAT-exempt international digital services.
                            </li>
                        </ul>
                        <p className="text-white  ">
                            We continuously monitor our revenue thresholds, and if EU VAT obligations become applicable, our policies will be updated accordingly.
                        </p>
                    </div>

                    {/* Payment Methods */}
                    <div>
                        <h4 className="text-white   mb-2">Payment Methods &amp; Fees</h4>
                        <p className="text-white   mb-2">We accept payments via:</p>
                        <ul className="text-white   list-disc list-inside mb-2 space-y-1">
                            <li>UAE Bank Transfer (SEPA)</li>
                            <li>Payoneer</li>
                            <li>Stripe</li>
                        </ul>
                        <p className="text-white  ">
                            Please note: Payments made through Payoneer or Stripe may incur an additional processing fee of 3% to 6%, depending on the method and currency used. To avoid this fee, we recommend using direct UAE bank transfer when possible.
                        </p>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default CoachingPlan;
