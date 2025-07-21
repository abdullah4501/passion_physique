import React, { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import heroImage from '@/assets/hero-bg.png';
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
    backgroundImage: heroImage2, // changed!
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
    backgroundImage: heroImage3, // changed!
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

const HeroSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 30
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
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
    <section className="relative min-h-screen overflow-hidden">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {slides.map((slide, index) => {
            const isActive = selectedIndex === index;
            return (
              <div
                key={slide.id}
                className={`embla__slide relative min-h-screen flex items-center justify-center flex-[0_0_100%] transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
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
                  }}
                />
                {/* Content */}
                <div
                  className={`relative z-20 text-center px-4 w-full mx-auto transition-all duration-1000 ease-out`}
                >
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                    {slide.title}
                  </h1>
                  <p className="text-[16px] text-white mb-8 max-w-[55%] mx-auto leading-[26px]">
                    {slide.description}
                  </p>
                  <Button className="hero-button hover:animate-glow px-[25px] transition-all duration-300 hover:scale-105">
                    {slide.buttonText}
                  </Button>
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
