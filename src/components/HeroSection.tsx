import { Button } from '@/components/ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

import heroImage from '@/assets/hero-bg2.png';
import heroImage2 from '@/assets/hero-bg.png';
import heroImage3 from '@/assets/hero-bg.png';

const slides = [
  {
    id: 1,
    backgroundImage: heroImage,
    title: (
      <>
        <span className="text-primary">TRANSFORM</span> WITH SCIENCE,
        <br />
        BUILT BY <span className="text-primary">PASSION.</span>
      </>
    ),
    description: "We use science-backed methods and passionate coaching to transform bodies and minds. Every program is personalized, rooted in research, & built to help you achieve sustainable fitness results.",
    buttonText: "START YOUR JOURNEY"
  },
  {
    id: 2,
    backgroundImage: heroImage2,
    title: (
      <>
        <span className="text-primary">UNLOCK</span> YOUR POTENTIAL,
        <br />
        ACHIEVE <span className="text-primary">GREATNESS.</span>
      </>
    ),
    description: "Push beyond your limits with our expert-designed training programs. Backed by cutting-edge research and delivered with unwavering passion for your success.",
    buttonText: "BEGIN TRANSFORMATION"
  },
  {
    id: 3,
    backgroundImage: heroImage3,
    title: (
      <>
        <span className="text-primary">ELEVATE</span> YOUR FITNESS,
        <br />
        EMBRACE <span className="text-primary">EXCELLENCE.</span>
      </>
    ),
    description: "Experience the perfect fusion of scientific methodology and passionate mentorship. Transform not just your body, but your entire relationship with fitness.",
    buttonText: "DISCOVER MORE"
  }
];

const headingVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.75, ease: [0.42, 0, 0.2, 1] } }
};
const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.6, ease: [0.42, 0, 0.2, 1] } }
};

import React, { useState } from 'react';

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative min-h-screen overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full h-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={slide.id}>
            <div className="relative min-h-screen flex items-center justify-center">
              {/* Background Image */}
              <div
                className="absolute inset-0 z-0 w-full h-full transition-transform duration-1000 ease-out"
                style={{
                  backgroundImage: `url(${slide.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              />

              {/* Content */}
              <div className="relative z-20 w-full mx-auto text-center px-2 md:px-4">
                <AnimatePresence mode="wait">
                  {activeIndex === idx && (
                    <motion.div
                      // This key makes sure the block is remounted on each slide, retriggering animation
                      key={activeIndex}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <motion.h1
                        className="lg:text-[66px] md:text-[45px] text-[30px] font-bold text-white mb-0 lg:leading-[80px] md:leading-[60px] leading-[40px] mb-2"
                        variants={headingVariants}
                      >
                        {slide.title}
                      </motion.h1>
                      <motion.p
                        className="text-[16px] text-white mb-8 lg:max-w-[55%] mx-auto leading-[26px]"
                        variants={textVariants}
                      >
                        {slide.description}
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1, transition: { delay: 0.32, duration: 0.45, ease: [0.42, 0, 0.2, 1] } }}
                        exit={{ opacity: 0, scale: 0.92 }}
                      >
                        <Button className="hero-button hover:animate-glow px-[25px] transition-all duration-300 hover:scale-105">
                          {slide.buttonText}
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Custom navigation dots */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => document.querySelector('.swiper')?.swiper.slideToLoop(index)}
            className={`h-1 rounded-full transition-all duration-500 ease-out hover:scale-110 ${
              activeIndex === index
                ? 'w-[80px] bg-primary shadow-lg shadow-primary/30'
                : 'w-[30px] bg-white hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
