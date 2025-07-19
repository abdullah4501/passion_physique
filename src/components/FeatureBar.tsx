import { Heart, Zap, Target, TrendingUp } from 'lucide-react';

const FeatureBar = () => {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "SCIENCE-BACKED TRAINING"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "PASSIONATE COACHING"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "SUSTAINABLE RESULTS"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "BODY TRANSFORMATION"
    }
  ];

  return (
    <section className="bg-primary py-8">
      <div className="container mx-auto px-4">
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
              <h3 className="text-white font-semibold text-sm uppercase tracking-wide text-center md:text-left">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureBar;