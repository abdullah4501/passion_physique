import { Button } from '@/components/ui/button';
import { CheckCircle, Users, Activity } from 'lucide-react';
import trainerImage from '@/assets/trainer-image.jpg';

const AboutSection = () => {
  const features = [
    {
      icon: <CheckCircle className="w-6 h-6 text-primary" />,
      text: "Tailored programs based on individual needs"
    },
    {
      icon: <Activity className="w-6 h-6 text-primary" />,
      text: "Combines sports science and technology"
    },
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      text: "Specialized support for women at all life stages"
    }
  ];

  return (
    <section className="py-20 bg-section-bg">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-slide-in-left">
            <h2 className="section-heading text-white">
              Keep Your Body Fit with{' '}
              <span className="text-primary">PASSION PHYSIQUE</span>
            </h2>
            
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Petros Pasiollari and Eirini Stergia Kanoniou lead The Passion Physique, offering personalized, science-based 
              coaching. Petros blends fitness, tech, and blockchain, while Eirini specializes in women's health and fitness. 
              Together, they help clients achieve lasting balance and strength.
            </p>
            
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {feature.icon}
                  <span className="text-white">{feature.text}</span>
                </div>
              ))}
            </div>
            
            <Button className="hero-button">
              READ MORE
            </Button>
          </div>
          
          {/* Image */}
          <div className="relative animate-slide-in-right">
            <div className="relative z-10">
              <img 
                src={trainerImage} 
                alt="Fitness Training" 
                className="w-full h-auto rounded-lg shadow-hero"
              />
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/20 rounded-lg blur-xl scale-105 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;