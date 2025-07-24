import { Button } from '@/components/ui/button';
import bannerImg from '@/assets/gallery/plan_banner.png';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bg from "@/assets/bg/Plans.png";


const CoachingPlan = () => {
    const plans = [
        {
            name: "BASIC 12 M",
            price: "3000",
            period: "per month",
            description: "A personalized training plan with monthly check-ins, basic nutrition guidance, and access to free eBooks and workouts to build consistency and progress.",
            note: "*Monthly 12 Basic"
        },
        {
            name: "FULL 12 M",
            price: "4800",
            period: "per month",
            description: "A comprehensive program with custom training and nutrition, bi-weekly reviews, 1-on-1 consultations, priority support, and full access to premium resources for lasting transformation.",
            note: "*Monthly 12 Full"
        },
        {
            name: "BASIC 6 M",
            price: "1600",
            period: "per month",
            description: "A personalized training plan with monthly check-ins, basic nutrition guidance, and access to free eBooks and workouts to build consistency and progress.",
            note: "*Monthly 6 Basic"
        },
        {
            name: "FULL 6 M",
            price: "2500",
            period: "per month",
            description: "A comprehensive program with custom training and nutrition, bi-weekly reviews, 1-on-1 consultations, priority support, and full access to premium resources for lasting transformation.",
            note: "*Monthly 6 Full"
        },
        {
            name: "BASIC 3 M",
            price: "850",
            period: "per month",
            description: "A personalized training plan with monthly check-ins, basic nutrition guidance, and access to free eBooks and workouts to build consistency and progress.",
            note: "*Monthly 3 Basic"
        },
        {
            name: "FULL 3 M",
            price: "1300",
            period: "per month",
            description: "A comprehensive program with custom training and nutrition, bi-weekly reviews, 1-on-1 consultations, priority support, and full access to premium resources for lasting transformation.",
            note: "*Monthly 3 Full"
        },
        {
            name: "BASIC 1 M",
            price: "300",
            period: "per month",
            description: "A personalized training plan with monthly check-ins, basic nutrition guidance, and access to free eBooks and workouts to build consistency and progress.",
            note: "*Monthly 1 Basic"
        },
        {
            name: "FULL 1 M",
            price: "450",
            period: "per month",
            description: "A comprehensive program with custom training and nutrition, bi-weekly reviews, 1-on-1 consultations, priority support, and full access to premium resources for lasting transformation.",
            note: "*Monthly 1 Full"
        },
    ];

    return (
        <>
            <Header />
            <section className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
                {/* Banner Image */}
                <img
                    src={bannerImg}
                    alt="Coaching Plan"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    draggable={false}
                />

                {/* Overlay for extra darkening (if needed) */}
                <div className="absolute inset-0 " />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full">
                    <h1 className="text-[66px] font-bold uppercase leading-[80px] mb-4 select-none">
                        <span className="text-primary">Coaching</span>{" "}
                        <span className="text-white">Plans</span>
                    </h1>
                    <div className="flex flex-col items-center">
                        <span className="text-white font-bold text-[26px] leading-[26px]">
                            Home / Coaching Plans
                        </span>
                    </div>
                </div>
            </section>
            <section className="py-[120px] relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    {/* 2 columns on large screens, 1 column on mobile/tablet */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                        {plans.map((plan, idx) => (
                            <div
                                key={plan.name}
                                className="bg-[#2E2E2E] px-[45px] py-[40px] transition-all duration-300 hover:scale-105 flex flex-col justify-around h-full "
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1 pr-[45px]">
                                            <h3 className="text-[26px] font-light text-white mb-3">{plan.name}</h3>
                                            <p className="text-white text-[14px] font-light leading-relaxed mb-4 pr-[45px]">
                                                {plan.description}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="text-[36px] font-light text-white">€{plan.price}</div>
                                            <div className="text-white text-[18px] font-light">{plan.period}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-primary text-[14px] font-medium">{plan.note}</p>
                                    <Button className="bg-primary hover:bg-primary/90 text-white py-3 px-10 text-[12px] font-[600] transition-all duration-300 rounded-none">
                                        JOIN NOW
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="relative w-full py-[120px]" style={{
                backgroundImage: `url(${bg})`, // replace with your bg path
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}>
                <div className=" container z-10">
                    {/* Heading */}
                    <h2 className="section-heading text-center mb-[55px]">
                        Basic VS Full <span className="text-primary">COACHING PLANS</span>
                    </h2>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-separate border-spacing-0 text-white min-w-[700px]">
                            <thead>
                                <tr>
                                    <th className="bg-[#FF3131] text-white text-[20px] font-medium py-3 px-3 border border-r-[#ffffff] ">FEATURE</th>
                                    <th className="bg-[#FF3131] text-white text-[20px] font-medium py-3 px-3 border border-r-[#ffffff]">BASIC PLAN</th>
                                    <th className="bg-[#FF3131] text-white text-[20px] font-medium py-3 px-3 border border-r-[#ffffff]">FULL PLAN</th>
                                </tr>
                            </thead>
                            <tbody className="bg-[#222] opacity-70 text-base">
                                <tr>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">Diet Plan</td>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">Personalized</td>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">Personalized</td>
                                </tr>
                                <tr>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">Supplement Guidance</td>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">Included</td>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">Included</td>
                                </tr>
                                <tr>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">Cardio & Recovery Protocols</td>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">Included</td>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">Included</td>
                                </tr>
                                <tr>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">Posing Feedback</td>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">Included</td>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">Included</td>
                                </tr>
                                <tr>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">Workout Plan</td>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">Not Included</td>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">Fully Personalized</td>
                                </tr>
                                <tr>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">Coaching Access</td>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">2x mandatory chats per week + from checks</td>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">4x mandatory chats per week + from checks</td>
                                </tr>
                                <tr>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">Workout Library Access</td>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">Included</td>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">Included</td>
                                </tr>
                                <tr>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">Progress Tracking & Adjustments</td>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">Weekly Updates</td>
                                    <td className="py-3 text-[16px] px-3 border border-[#292929] text-center">Weekly Updates</td>
                                </tr>
                            </tbody>
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