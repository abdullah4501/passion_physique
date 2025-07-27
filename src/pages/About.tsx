import { Button } from '@/components/ui/button';
import bannerImg from '@/assets/about/banner.png';
import Header from '@/components/Header';
import image1 from "@/assets/about/img1.png";
import image2 from "@/assets/about/img2.png";
import symbol from "@/assets/icons/symbol.png";
import Footer from '@/components/Footer';


const About = () => {
    return (
        <>
            <Header />
            {/* About Us Banner Section */}
            <section className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
                {/* Banner Image */}
                <img
                    src={bannerImg}
                    alt="About Us Banner"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    draggable={false}
                />

                {/* Overlay for extra darkening (if needed) */}
                <div className="absolute inset-0 " />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full">
                    <h1 className="text-[66px] font-bold uppercase leading-[80px] mb-4 select-none page-title">
                        <span className="text-primary">About</span>{" "}
                        <span className="text-white">Us</span>
                    </h1>
                    <div className="flex flex-col items-center">
                        <span className="text-white font-bold text-[26px] leading-[26px] breadcrumbs">
                            Home / About Us
                        </span>
                    </div>
                </div>
            </section>
            <section className="relative overflow-x-clip md:py-[120px] py-[60px]">
                <div className="container mx-auto flex flex-col py-0">
                    {/* First Row */}
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-[80px]">
                        {/* Text Block */}
                        <div className="flex flex-col justify-center lg:pl-[55px] pl-0 py-[85px] z-10">
                            <h2 className="section-heading">
                                Professional Introduction<br />
                                <span className="text-[#ED232A] uppercase">Petros Pasiollari</span>
                            </h2>
                            <p className="text-[#ffffff] text-[15px] leading-[25px] my-4  font-normal">
                                I’m Petros Pasiollari, a multidisciplinary coach blending sports science, engineering, and blockchain. I hold a Bachelor’s in Electronic Engineering (ASPAITE, Athens), an MSc in Clinical Practice & Technology in Health (Democritus University of Thrace, Komotini), and an MSc in Blockchain & Digital Currency (University of Nicosia, Cyprus). I’m currently completing a Tech MBA in Illinois, USA. Certified in NASM PBC, PN1, and J3 University – Level 1, I’ve spent over three years working with IFBB Pros, gaining insights into various training systems. I also studied posing and presentation with IFBB Pro Pete Hartwig, refining the art of physique expression. Through my Dubai-based platform, The Passion Physique, I offer evidence-based, fully personalized coaching. I reject one-size-fits-all plans — every client has unique digestion, metabolism, time, and routines. My goal is to deliver sustainable, individualized strategies that work. Looking ahead, I’m building a blockchain-powered Lift2Earn DApp — where effort becomes measurable value, and training means more than just results. It means purpose.
                            </p>
                        </div>
                        {/* Image Block */}
                        <div className="flex items-center justify-center ">
                            <img
                                src={image1}
                                alt="Petros Pasiollari"
                                className="w-full h-full object-cover rounded-none"
                            />
                        </div>
                    </div>

                    {/* Second Row */}
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-[80px] ">
                        {/* Image Block (left on desktop) */}
                        <div className="flex items-center justify-center md:order-1 order-2">
                            <img
                                src={image2}
                                alt="Eirini Kanonidou"
                                className="w-full h-full object-cover rounded-none"
                            />
                        </div>
                        {/* Text Block */}
                        <div className="flex flex-col justify-center lg:pr-[55px] pr-0 pl-0 py-[85px] z-10 md:order-2 order-1">
                            <h2 className="section-heading">
                                Professional Introduction<br />
                                <span className="text-[#ED232A] uppercase">Petros Pasiollari</span>
                            </h2>
                            <p className="text-[#ffffff] text-[15px] leading-[25px] my-4  font-normal">
                                Eirini Stergia Kanonidou is more than a coach — she’s lived the journey. For over a year, she’s stood by my side, personally and professionally, transforming her body and mindset while losing over 10 kilograms. As I always say: “It’s not just about the number on the scale — it’s about health, mindset, strength, and only then, shape.”
                                <br />
                                Certified as a NASM Women’s Fitness Specialist, Eirini is trained to support women through every life stage — with tailored programs, assessments, and communication that builds confidence and trust.
                                <br />
                                Her coaching is rooted in empathy and real experience. She helps women feel stronger, healthier, and more in control — physically and mentally. I’m proud she chose to join my mission — helping people reclaim balance in a fast-paced world that often pulls us away from ourselves
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default About;