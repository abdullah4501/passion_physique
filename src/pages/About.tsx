import { Button } from '@/components/ui/button';
import bannerImg from '@/assets/about/banner.png';
import Header from '@/components/Header';
import image1 from "@/assets/about/img1.png";
import image2 from "@/assets/about/img2.png";
import Footer from '@/components/Footer';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';

const headingVariants = {
  hidden: { opacity: 0, y: 42 },
  visible: { opacity: 1, y: 0 }
};
const textLeft = {
  hidden: { opacity: 0, x: -64 },
  visible: { opacity: 1, x: 0 }
};
const textRight = {
  hidden: { opacity: 0, x: 64 },
  visible: { opacity: 1, x: 0 }
};
const imgRight = {
  hidden: { opacity: 0, x: 64, scale: 0.96 },
  visible: { opacity: 1, x: 0, scale: 1 }
};
const imgLeft = {
  hidden: { opacity: 0, x: -64, scale: 0.96 },
  visible: { opacity: 1, x: 0, scale: 1 }
};

const About = () => {
  // First Row Animation Controls
  const row1Ref = useRef(null);
  const row1InView = useInView(row1Ref, { once: false, margin: "-100px" });
  const textLeftControls = useAnimation();
  const imgRightControls = useAnimation();

  useEffect(() => {
    if (row1InView) {
      textLeftControls.start("visible");
      imgRightControls.start("visible");
    } else {
      textLeftControls.start("hidden");
      imgRightControls.start("hidden");
    }
  }, [row1InView, textLeftControls, imgRightControls]);

  // Second Row Animation Controls
  const row2Ref = useRef(null);
  const row2InView = useInView(row2Ref, { once: false, margin: "-100px" });
  const textRightControls = useAnimation();
  const imgLeftControls = useAnimation();

  useEffect(() => {
    if (row2InView) {
      textRightControls.start("visible");
      imgLeftControls.start("visible");
    } else {
      textRightControls.start("hidden");
      imgLeftControls.start("hidden");
    }
  }, [row2InView, textRightControls, imgLeftControls]);

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
            <span className="text-primary">About</span>{" "}
            <span className="text-white">Us</span>
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
              Home / About Us
            </span>
          </motion.div>

        </div>
      </section>
      <section className="relative overflow-x-clip md:py-[120px] py-[60px]">
        <div className="container mx-auto flex flex-col py-0 gap-[60px] lg:gap-0">
          {/* First Row */}
          <div ref={row1Ref} className="relative grid grid-cols-1 md:grid-cols-2 lg:gap-[80px] md:gap-[20px]">
            {/* Text Block */}
            <motion.div
              animate={textLeftControls}
              initial="hidden"
              variants={textLeft}
              transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col justify-center lg:pl-[55px] pl-0 lg:py-[85px] md:py-[40px] z-10"
            >
              <h2 className="section-heading">
                Professional Introduction<br />
                <span className="text-[#ED232A] uppercase">Petros Pasiollari</span>
              </h2>
              <p className="text-[#ffffff] text-[15px] leading-[25px] my-4  font-normal">
                I’m Petros Pasiollari, a multidisciplinary coach blending sports science, engineering, and blockchain. I hold a Bachelor’s in Electronic Engineering (ASPAITE, Athens), an MSc in Clinical Practice & Technology in Health (Democritus University of Thrace, Komotini), and an MSc in Blockchain & Digital Currency (University of Nicosia, Cyprus). I’m currently completing a Tech MBA in Illinois, USA. Certified in NASM PBC, PN1, and J3 University – Level 1, I’ve spent over three years working with IFBB Pros, gaining insights into various training systems. I also studied posing and presentation with IFBB Pro Pete Hartwig, refining the art of physique expression. Through my Dubai-based platform, The Passion Physique, I offer evidence-based, fully personalized coaching. I reject one-size-fits-all plans — every client has unique digestion, metabolism, time, and routines. My goal is to deliver sustainable, individualized strategies that work. Looking ahead, I’m building a blockchain-powered Lift2Earn DApp — where effort becomes measurable value, and training means more than just results. It means purpose.
              </p>
            </motion.div>
            {/* Image Block */}
            <motion.div
              animate={imgRightControls}
              initial="hidden"
              variants={imgRight}
              transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-center justify-center "
            >
              <img
                src={image1}
                alt="Petros Pasiollari"
                className="w-full h-full object-cover rounded-none"
              />
            </motion.div>
          </div>
          {/* Second Row */}
          <div ref={row2Ref} className="relative grid grid-cols-1 md:grid-cols-2 lg:gap-[80px] md:gap-[20px] gap-0 ">
            {/* Image Block (left on desktop) */}
            <motion.div
              animate={imgLeftControls}
              initial="hidden"
              variants={imgLeft}
              transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-center justify-center md:order-1 order-2"
            >
              <img
                src={image2}
                alt="Eirini Kanonidou"
                className="w-full h-full object-cover rounded-none"
              />
            </motion.div>
            {/* Text Block */}
            <motion.div
              animate={textRightControls}
              initial="hidden"
              variants={textRight}
              transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col justify-center lg:pr-[55px] pr-0 pl-0 lg:py-[85px] md:py-[40px] z-10 md:order-2 order-1"
            >
              <h2 className="section-heading">
                Professional Introduction<br />
                <span className="text-[#ED232A] uppercase">Eirini Kanonidou</span>
              </h2>
              <p className="text-[#ffffff] text-[15px] leading-[25px] my-4  font-normal">
                Eirini Stergia Kanonidou is more than a coach — she’s lived the journey. For over a year, she’s stood by my side, personally and professionally, transforming her body and mindset while losing over 10 kilograms. As I always say: “It’s not just about the number on the scale — it’s about health, mindset, strength, and only then, shape.”
                <br />
                Certified as a NASM Women’s Fitness Specialist, Eirini is trained to support women through every life stage — with tailored programs, assessments, and communication that builds confidence and trust.
                <br />
                Her coaching is rooted in empathy and real experience. She helps women feel stronger, healthier, and more in control — physically and mentally. I’m proud she chose to join my mission — helping people reclaim balance in a fast-paced world that often pulls us away from ourselves
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default About;
