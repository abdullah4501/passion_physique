import { Button } from '@/components/ui/button';
import bg from "@/assets/bg/plans.png";

const PricingSection = () => {
  const basicPlan = {
    name: "BASIC 12 M",
    price: "3000",
    period: "per month",
    description: "A personalized training plan with monthly check-ins, basic nutrition guidance, and access to free eBooks and workouts to build consistency and progress.",
    note: "*Monthly 12 Basic"
  };

  const fullPlan = {
    name: "FULL 12 M",
    price: "4800",
    period: "per month",
    description: "A comprehensive program with custom training and nutrition, bi-weekly reviews, 1-on-1 consultations, priority support, and full access to premium resources for lasting transformation.",
    note: "*Monthly 12 Full"
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          {/* Left Content */}
          <div className="animate-slide-in-left lg:pr-[120px]">
            <h2 className="section-heading">
              Choose Your Best &{' '}
              <span className="text-primary">SUITABLE PACKAGE</span>
            </h2>
            
            <p className="text-white mb-8 leading-relaxed text-[15px] font-light leading-[25px]">
              Our coaching plans offer fully personalized training and nutrition programs tailored to your goals, lifestyle, and 
              body needs. Each plan includes expert guidance, regular check-ins, and ongoing support to ensure 
              sustainable results and long-term success—whether you're aiming for fat loss, muscle gain, or overall health.
            </p>
            
            <Button className="bg-primary text-[12px] hover:bg-primary/90 text-white px-8 py-3 rounded font-semibold transition-all duration-300 rounded-none">
              VIEW ALL PLANS
            </Button>
          </div>
          
          {/* Right Content - Two Pricing Cards */}
          <div className="space-y-6 animate-slide-in-right">
            {/* Basic Plan Card */}
            <div className="bg-[#2E2E2E] p-6 transition-all duration-300 hover:scale-105">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-6">
                  <h3 className="text-[26px] font-light text-white mb-3">{basicPlan.name}</h3>
                  <p className="text-white text-[14px] font-light leading-relaxed mb-4">
                    {basicPlan.description}
                  </p>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <div className="text-[36px] font-light text-white">€{basicPlan.price}</div>
                  <div className="text-white text-[18px] font-light">{basicPlan.period}</div>
                </div>
              </div>
              
              <div className='flex items-center justify-between'>
                <p className="text-primary text-[14px] font-medium">{basicPlan.note}</p>
                <Button className="bg-primary hover:bg-primary/90 text-white py-3 px-10 text-[12px] font-[600] transition-all duration-300 rounded-none">
                  JOIN NOW
                </Button>

              </div>
            </div>

            {/* Full Plan Card with different styling */}
            <div className="bg-[#000000] p-6 transition-all duration-300 hover:scale-105">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-6">
                  <h3 className="text-[26px] font-light text-white mb-3">{fullPlan.name}</h3>
                  <p className="text-white text-[14px] font-light leading-relaxed mb-4">
                    {fullPlan.description}
                  </p>
                  
                </div>
                
                <div className="text-right flex-shrink-0">
                  <div className="text-[36px] font-light text-white">€{fullPlan.price}</div>
                  <div className="text-white text-[18px] font-light">{fullPlan.period}</div>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <p className="text-primary text-[14px] font-medium">{fullPlan.note}</p>
                <Button className="bg-primary hover:bg-primary/90 text-white py-3 px-10 text-[12px] font-[600] transition-all duration-300 rounded-none">
                  JOIN NOW
                </Button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
