import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70 z-10" />
      
      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
          <span className="text-primary">TRANSFORM</span> WITH SCIENCE,
          <br />
          BUILT BY <span className="text-primary">PASSION.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in">
          We use science-backed methods and passionate coaching to transform bodies and minds. Every 
          program is personalized, rooted in research, & built to help you achieve sustainable fitness results.
        </p>
        
        <Button className="hero-button animate-fade-in hover:animate-glow">
          START YOUR JOURNEY
        </Button>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
      
        {/* Navigation Dots */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          <div className="w-8 h-1 bg-white/50 rounded-full" />
          <div className="w-8 h-1 bg-primary rounded-full" />
          <div className="w-8 h-1 bg-white/50 rounded-full" />
        </div>
    </section>
  );
};

export default HeroSection;