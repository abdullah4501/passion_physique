import { Button } from '@/components/ui/button';
import trainerImage from '@/assets/trainer-image.png';
import icon1 from "@/assets/about/icon1.png"
import icon2 from "@/assets/about/icon2.png"
import icon3 from "@/assets/about/icon3.png"

const AboutSection = () => {
  const features = [
    {
      icon: <img src={icon1} className="w-[36px] h-[36px] text-primary mb-3 mt-6" />,
      text: "Tailored programs based on individual needs"
    },
    {
      icon: <img src={icon2} className="w-[36px] h-[36px] text-primary mb-3 mt-6" />,
      text: "Combines sports science and technology"
    },
    {
      icon: <img src={icon3} className="w-[36px] h-[36px] text-primary mb-3 mt-6" />,
      text: "Specialized support for women at all life stages"
    }
  ];
  

  return (
    <section className="py-[30px] bg-[#000000]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3  items-center">
          {/* Content */}
          <div className="animate-slide-in-left">
            <h2 className="section-heading">
              Keep Your Body Fit with{' '}
              <span className="text-primary">PASSION PHYSIQUE</span>
            </h2>
            
            <p className="text-white/80 text-[15px] mb-8 leading-relaxed">
              Petros Pasiollari and Eirini Stergia Kanoniou lead The Passion Physique, offering personalized, science-based 
              coaching. Petros blends fitness, tech, and blockchain, while Eirini specializes in women's health and fitness. 
              Together, they help clients achieve lasting balance and strength.
            </p>
            
            
            <Button className="hero-button px-[45px]">
              READ MORE
            </Button>
          </div>    
          {/* Image */}
          <div className="relative animate-slide-in-right">
            <div className="flex justify-center">
              <img 
                src={trainerImage} 
                alt="Fitness Training" 
                className=""
              />
            </div>
          </div>
          <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className=" animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {feature.icon}
                  <span className="text-white font-light text-[15px]">{feature.text}</span>
                </div>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;