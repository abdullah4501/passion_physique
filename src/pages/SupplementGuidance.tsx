import { Button } from '@/components/ui/button';
import bannerImg from '@/assets/bg/guidanceBg.png';
import Header from '@/components/Header';
import symbol from "@/assets/icons/symbol.png";
import Footer from '@/components/Footer';
import bg from "@/assets/bg/Plans.png";


const SupplementGuidance = () => {
    const guidance = [
        "Each ingredient: what it is, how it works, and why it matters",
        "Timing: when to take each supplement for optimal results",
        "Synergy: which combinations improve absorption and which to avoid",
        "Unnecessary or overhyped products you don’t need",
        "Recommendations based on your digestion, lifestyle, and training style"
    ];

    return (<>
        <Header />
        <section className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
            {/* Banner Image */}
            <img
                src={bannerImg}
                alt="supplement guidance"
                className="absolute inset-0 w-full h-full object-cover object-center"
                draggable={false}
            />

            {/* Overlay for extra darkening (if needed) */}
            <div className="absolute inset-0 " />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full">
                <h1 className="text-[66px] font-bold uppercase leading-[80px] mb-4 select-none">
                    <span className="text-primary">Supplement</span>{" "}
                    <span className="text-white">Guidance</span>
                </h1>
                <div className="flex flex-col items-center">
                    <span className="text-white font-bold text-[26px] leading-[26px]">
                        Home / Supplement Guidance
                    </span>
                </div>
            </div>
        </section>
        <section className="w-full py-[125px] bg-black">
            <div className="container vat_info px-5 ">
                <p className="text-white text-[15px] font-[400] mb-10">
                    This is not a list of products — it’s a science-based consultation tailored to your individual
                    needs.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
                    {/* DURATION */}
                    <div className="bg-[#2e2e2e] flex flex-col items-center justify-center min-h-[250px] px-6 py-12">
                        <span className="text-primary text-[14px] font-[700] tracking-[1px] leading-[25px] uppercase mb-1">Description</span>
                        <span className="text-white text-[20px] leading-[30px] font-[400] mt-1 text-center">it’s a science-based consultation tailored to your individual</span>
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
                        <span className="text-white text-[20px] leading-[30px] font-[400] mt-1 text-center">Supplement Roadmap<br />€200</span>
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
                        Supplement Guidance<br />
                        <span className="text-[#ED232A]">BREAKDOWN</span>
                    </h2>
                    <div className="flex flex-col gap-y-3 mb-8 mt-8 max-w-[840px]">
                        {guidance.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <img src={symbol} className="inline-block" />
                                <span className="text-white text-[15px] leading-[32px]">{feature}</span>
                            </div>
                        ))}
                    </div>


                    <p className="text-[#ffffff] text-[15px] leading-[25px] my-4  font-normal">
                        Everything is explained in a simple yet scientific way — with no sponsorships, no marketing bias.
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
export default SupplementGuidance;