import { Heart, Zap, Target, TrendingUp } from 'lucide-react';
import icon from '@/assets/icon.png';

const FeatureBar = () => {
  const features = [
    {
      icon: <img src={icon} className="w-[40px] h-[40px]" />,
      title: "SCIENCE-BACKED TRAINING"
    },
    {
      icon: <img src={icon} className="w-[40px] h-[40px]" />,
      title: "PASSIONATE COACHING"
    },
    {
      icon: <img src={icon} className="w-[40px] h-[40px]" />,
      title: "SUSTAINABLE RESULTS"
    },
    {
      icon: <img src={icon} className="w-[40px] h-[40px]" />,
      title: "BODY TRANSFORMATION"
    }
  ];

  return (
    <section className="bg-primary py-8">
      <div className=" mx-auto px-[45px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-item justify-center md:justify-start animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-white">
                {feature.icon}
              </div>
              <a href="#" className="text-[#f0f0f0] font-light uppercase tracking-wide text-center md:text-left">
                {feature.title}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureBar;