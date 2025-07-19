import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: "BASIC 12 M",
      price: "3000",
      period: "per month",
      description: "A personalized training plan with monthly check-ins, basic nutrition guidance, and access to free eBooks and workouts to build consistency and progress.",
      note: "*Monthly 12 Basic",
      features: [
        "Personalized training plan",
        "Monthly check-ins", 
        "Basic nutrition guidance",
        "Access to free eBooks",
        "Basic workout library"
      ]
    },
    {
      name: "FULL 12 M", 
      price: "4800",
      period: "per month",
      description: "A comprehensive program with custom training and nutrition, bi-weekly reviews, 1-on-1 consultations, priority support, and full access to premium resources for lasting transformation.",
      note: "*Monthly 12 Full",
      features: [
        "Custom training and nutrition",
        "Bi-weekly reviews",
        "1-on-1 consultations", 
        "Priority support",
        "Premium resource access",
        "Supplement guidance"
      ],
      featured: true
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="animate-slide-in-left">
            <h2 className="section-heading text-white">
              Choose Your Best &{' '}
              <span className="text-primary">SUITABLE PACKAGE</span>
            </h2>
            
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Our coaching plans offer fully personalized training and nutrition programs tailored to your goals, lifestyle, and 
              body needs. Each plan includes expert guidance, regular check-ins, and ongoing support to ensure 
              sustainable results and long-term success—whether you're aiming for fat loss, muscle gain, or overall health.
            </p>
            
            <Button className="hero-button">
              VIEW ALL PLANS
            </Button>
          </div>
          
          {/* Right Content - Pricing Cards */}
          <div className="space-y-6 animate-slide-in-right">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`price-card transition-all duration-300 hover:scale-105 ${
                  plan.featured ? 'ring-2 ring-primary' : ''
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {plan.description}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">€{plan.price}</div>
                    <div className="text-white/60 text-sm">{plan.period}</div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-primary text-sm font-semibold">{plan.note}</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-white/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button className="hero-button w-full">
                  JOIN NOW
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;