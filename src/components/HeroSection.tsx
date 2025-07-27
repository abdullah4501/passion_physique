import React, { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion, AnimatePresence } from 'framer-motion'; // << add this!
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

const HeroSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 30
    },
    // [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  return (
    <section className="relative min-h-[screen] overflow-hidden">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {slides.map((slide, index) => {
            const isActive = selectedIndex === index;
            return (
              <div
                key={slide.id}
                className={`embla__slide relative min-h-[80vh] flex items-center justify-center flex-[0_0_100%] transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                  isActive
                    ? "opacity-100 translate-x-0 z-20"
                    : "opacity-0 pointer-events-none -translate-x-10 z-10"
                }`}
                style={{ transitionProperty: "opacity, transform" }}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 z-0 w-full transition-transform duration-1000 ease-out"
                  style={{
                    backgroundImage: `url(${slide.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                />
                {/* Content */}
                <div className="relative z-20 text-center md:px-4 px-0 w-full mx-auto transition-all duration-1000 ease-out">
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <>
                        <motion.h1
                          key={`heading-${index}`}
                          className="lg:text-[66px] md:text-[45px] text-[30px] font-bold text-white mb-0 lg:leading-[80px] md:leading-[60px] leading-[40px] mb-2"
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={headingVariants}
                        >
                          {slide.title}
                        </motion.h1>
                        <motion.p
                          key={`desc-${index}`}
                          className="text-[16px] text-white mb-8 lg:max-w-[55%] mx-auto leading-[26px]"
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={textVariants}
                        >
                          {slide.description}
                        </motion.p>
                        <motion.div
                          key={`btn-${index}`}
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1, transition: { delay: 0.32, duration: 0.45, ease: [0.42, 0, 0.2, 1] } }}
                          exit={{ opacity: 0, scale: 0.92 }}
                        >
                          <Button className="hero-button hover:animate-glow px-[25px] transition-all duration-300 hover:scale-105">
                            {slide.buttonText}
                          </Button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Navigation Dots */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-1 rounded-full transition-all duration-500 ease-out hover:scale-110 ${
              selectedIndex === index
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
