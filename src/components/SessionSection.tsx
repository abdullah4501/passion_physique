import { Button } from '@/components/ui/button';
import image1 from "@/assets/session/image3.png";
import image2 from "@/assets/session/image2.png";
import symbol from "@/assets/icons/symbol.png";
import { motion, useAnimation, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';

const sessionFeatures = [
  "Nutrition",
  "Program analysis",
  "Digestion",
  "Training strategy",
  "Supplementation",
  "And more"
];

const supplementFeatures = [
  "Each ingredient",
  "Synergy",
  "Overhyped products",
  "Timing",
  "Unnecessary products",
  "Recommendations"
];

// Animation variants
const textLeft = {
  hidden: { opacity: 0, x: -64 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } }
};
const textRight = {
  hidden: { opacity: 0, x: 64 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } }
};
const imgRight = {
  hidden: { opacity: 0, x: 64, scale: 0.96 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.85, ease: [0.4, 0, 0.2, 1] } }
};
const imgLeft = {
  hidden: { opacity: 0, x: -64, scale: 0.96 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.85, ease: [0.4, 0, 0.2, 1] } }
};

export default function SessionSection() {
  // 1st row animation controls
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

  // 2nd row animation controls
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
    <section className="relative bg-[#1E1E1E] overflow-x-clip mb-[120px] mt-[120px]">
      <div className="container mx-auto flex flex-col py-0 my-[25px]">
        {/* First Row */}
        <div ref={row1Ref} className="relative grid grid-cols-1 md:grid-cols-2 gap-[65px]">
          {/* Text Block */}
          <motion.div
            animate={textLeftControls}
            initial="hidden"
            variants={textLeft}
            className="flex flex-col justify-center lg:px-[55px] lg:py-[85px] py-20 z-10"
          >
            <h2 className="text-white text-[34px] font-medium mb-2 leading-[44px]">
              1-on-1 Session<br />
              <span className="text-[#ED232A]">Q&amp;A VIDEO CALL</span>
            </h2>
            <p className="text-[#ffffff] text-[15px] leading-[25px] my-4  font-normal">
              This is a professional, science-based consultation designed to provide real clarity and practical direction for your fitness journey.
            </p>
            <div className="grid grid-cols-2 gap-y-3 gap-x-8 mb-8 max-w-[440px] session-features">
              {sessionFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={symbol} className="inline-block w-[9px] h-[9px]" />
                  <span className="text-white text-[15px] leading-[32px]">{feature}</span>
                </div>
              ))}
            </div>
            <div className='flex'>
              <Button className="hero-button px-[45px]">
                READ MORE
              </Button>
            </div>
          </motion.div>
          {/* Image Block */}
          <motion.div
            animate={imgRightControls}
            initial="hidden"
            variants={imgRight}
            className="relative flex items-center justify-center md:static"
          >
            <img
              src={image1}
              alt="Session"
              className="
                md:top-0
                md:rounded-none
                shadow-none
                z-0
                lg:absolute
                lg:w-auto
                lg:-top-[60px]
              "
            />
          </motion.div>
        </div>

        {/* Second Row */}
        <div ref={row2Ref} className="relative grid grid-cols-1 md:grid-cols-2 gap-[65px] ">
          {/* Image Block */}
          <motion.div
            animate={imgLeftControls}
            initial="hidden"
            variants={imgLeft}
            className="relative flex items-center justify-center md:static md:order-1 order-2"
          >
            <img
              src={image2}
              alt="Supplements"
              className="
                md:bottom-0
                md:rounded-none
                shadow-none
                z-0
                lg:absolute
                lg:w-auto
                w-full
                lg:-bottom-[60px]
              "
            />
          </motion.div>
          {/* Text Block */}
          <motion.div
            animate={textRightControls}
            initial="hidden"
            variants={textRight}
            className="flex flex-col justify-center lg:px-[55px] lg:py-[85px] py-20  z-10 md:order-2 order-1"
          >
            <h2 className="text-white text-[34px] font-medium mb-2 leading-[44px]">Our Supplement<br />
              <span className="text-[#ED232A]">GUIDANCE</span>
            </h2>
            <p className="text-[#ffffff] text-[15px] leading-[25px] my-4  font-normal">
              This is not a list of products — it&apos;s a science-based consultation tailored to your individual needs. We break down:
            </p>
            <div className="grid grid-cols-2 gap-y-3 gap-x-8 mb-8 max-w-[440px] session-features">
              {supplementFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={symbol} className="inline-block " />
                  <span className="text-white text-[15px] leading-[32px]">{feature}</span>
                </div>
              ))}
            </div>
            <div className='flex'>
              <Button className="hero-button px-[45px]">
                READ MORE
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
