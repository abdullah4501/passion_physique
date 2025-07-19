import { Button } from '@/components/ui/button';

const SessionSection = () => {
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

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* 1-on-1 Session */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                1-on-1 Session
              </h2>
              <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-6">
                Q&A VIDEO CALL
              </h3>
              <p className="text-white/80 text-base mb-8 leading-relaxed">
                This is a professional, science-based consultation designed to 
                provide real clarity and practical direction for your fitness journey.
              </p>
              
              <div className="grid grid-cols-2 gap-y-3 mb-8">
                {sessionFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-white text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button className="hero-button">
                READ MORE
              </Button>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt="Gym Training" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Supplement Guidance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Our Supplement
              </h2>
              <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-6">
                GUIDANCE
              </h3>
              <p className="text-white/80 text-base mb-8 leading-relaxed">
                This is not a list of products — it's a science-based consultation 
                tailored to your individual needs. We break down:
              </p>
              
              <div className="grid grid-cols-2 gap-y-3 mb-8">
                {supplementFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-white text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button className="hero-button">
                READ MORE
              </Button>
            </div>
            
            <div className="relative lg:order-1">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt="Supplements" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SessionSection;