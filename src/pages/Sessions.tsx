import { Button } from '@/components/ui/button';
import bannerImg from '@/assets/session/banner.png';
import Header from '@/components/Header';
import symbol from "@/assets/icons/symbol.png";
import Footer from '@/components/Footer';
import bg from "@/assets/bg/Plans.png";


const Sessions = () => {
    const sessionFeatures = [
        "Training strategy & program analysis",
        "Supplementation (science-backed)",
        "Posing critique & adjustments",
        "Any personal concerns or roadblocks",
        "Nutrition & meal structure",
        "Sleep, recovery, & stress balance",
        "Digestion & gut health",
        "Routine, lifestyle habits, & time management"
    ];



    return (<>
        <Header />
        <section className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
            {/* Banner Image */}
            <img
                src={bannerImg}
                alt="1-on-1 session"
                className="absolute inset-0 w-full h-full object-cover object-center"
                draggable={false}
            />

            {/* Overlay for extra darkening (if needed) */}
            <div className="absolute inset-0 " />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full">
                <h1 className="text-[66px] font-bold uppercase leading-[80px] mb-4 select-none">
                    <span className="text-primary">1-on-1</span>{" "}
                    <span className="text-white">Session</span>
                </h1>
                <div className="flex flex-col items-center">
                    <span className="text-white font-bold text-[26px] leading-[26px]">
                        Home / 1-on-1 Session
                    </span>
                </div>
            </div>
        </section>
        <section className="w-full py-[125px] bg-black">
            <div className="container vat_info px-5 ">
                <p className="text-white text-[15px] font-[400] mb-10">
                    This is a professional, science-based consultation designed to provide real clarity and practical
                    direction for your fitness journey.
                    Whether you continue with a coaching plan or not, this session will always leave you more informed, more structured, and more focused. <b>(through WhatsApp)</b>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
                    {/* DURATION */}
                    <div className="bg-[#2e2e2e] flex flex-col items-center justify-center min-h-[250px] px-6 py-12">
                        <span className="text-primary text-[14px] font-[700] tracking-[1px] leading-[25px] uppercase mb-1">Duration</span>
                        <span className="text-white text-[20px] leading-[30px] font-[400] mt-1">60 minutes</span>
                    </div>
                    {/* BOOK NOW (center) */}
                    <div className="bg-[#ff3131] flex flex-col items-center justify-center min-h-[250px] px-6 py-12">
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
                    </div>
                    {/* PRICE */}
                    <div className="bg-[#2e2e2e] flex flex-col items-center justify-center min-h-[250px] px-6 py-12">
                        <span className="text-primary text-[14px] font-[700] tracking-[1px] leading-[25px] uppercase mb-1">Price</span>
                        <span className="text-white text-[20px] leading-[30px] font-[400] mt-1">€300</span>
                    </div>
                </div>
            </div>
        </section>
        <section className="relative w-full py-[120px]" style={{
            backgroundImage: `url(${bg})`, // replace with your bg path
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            <div className="container z-10 grid grid-cols-1 md:grid-cols-3">
                <div className="flex flex-col justify-center z-10 col-span-2">
                    <h2 className="text-white text-[34px] font-medium mb-2 leading-[44px]">
                        We'll cover any topics relevent<br />to your goals
                        <span className="text-[#ED232A]"> INCLUDING</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 mb-8 mt-8 max-w-[840px]">
                        <div className="flex flex-col gap-y-3">
                            {sessionFeatures.slice(0, 4).map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <img src={symbol} className="inline-block" />
                                    <span className="text-white text-[15px] leading-[32px]">{feature}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-y-3">
                            {sessionFeatures.slice(4).map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <img src={symbol} className="inline-block" />
                                    <span className="text-white text-[15px] leading-[32px]">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-[#ffffff] text-[15px] leading-[25px] my-4  font-normal">
                        Beyond the information, this session also acts as a “stress test” — helping you understand how I think, communicate, and coach under pressure. It gives you insight into my mindset and approach, and helps me better understand yours.
                    </p>
                    <div className='flex'>
                        <Button className="hero-button px-[45px]">
                            BOOK NOW
                        </Button>
                    </div>
                </div>
            </div>
        </section>
        <Footer />
    </>
    );
}
export default Sessions;