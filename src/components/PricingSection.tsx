import { Button } from '@/components/ui/button';
import bg from "@/assets/gallery/PlansBg.png";
import { motion } from 'framer-motion';

const pricingCards = [
  {
    name: "BASIC 12 M",
    price: "3000",
    period: "per month",
    description: "A personalized training plan with monthly check-ins, basic nutrition guidance, and access to free eBooks and workouts to build consistency and progress.",
    note: "*Monthly 12 Basic",
    cardClass: "bg-[#2E2E2E]",
  },
  {
    name: "FULL 12 M",
    price: "4800",
    period: "per month",
    description: "A comprehensive program with custom training and nutrition, bi-weekly reviews, 1-on-1 consultations, priority support, and full access to premium resources for lasting transformation.",
    note: "*Monthly 12 Full",
    cardClass: "bg-[#000000]",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, type: "spring", stiffness: 60 }
  }
};

const leftVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.42,0,0.2,1] } }
};

const PricingSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          {/* Left Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={leftVariants}
            className="lg:pr-[120px]"
          >
            <h2 className="section-heading">
              Choose Your Best &{' '}
              <span className="text-primary">SUITABLE PACKAGE</span>
            </h2>
            
            <p className="text-white mb-8 leading-relaxed text-[15px] font-light leading-[25px]">
              Our coaching plans offer fully personalized training and nutrition programs tailored to your goals, lifestyle, and 
              body needs. Each plan includes expert guidance, regular check-ins, and ongoing support to ensure 
              sustainable results and long-term success—whether you're aiming for fat loss, muscle gain, or overall health.
            </p>
            
            <Button className="hero-button px-[45px]">
              READ MORE
            </Button>
          </motion.div>
          
          {/* Right Content - Pricing Cards with Animation */}
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {pricingCards.map((plan, idx) => (
              <motion.div
                key={plan.name}
                variants={cardVariants}
                className={`${plan.cardClass} px-[45px] py-[40px] transition-all duration-300 hover:scale-105 shadow-lg shadow-black/30`}
                whileHover={{ scale: 1.06, boxShadow: "0 8px 40px 0 rgba(0,0,0,0.25)" }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-6">
                    <h3 className="text-[26px] font-light text-white mb-3">{plan.name}</h3>
                    <p className="text-white text-[14px] font-light leading-relaxed mb-4">
                      {plan.description}
                    </p>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <div className="text-[36px] font-light text-white">€{plan.price}</div>
                    <div className="text-white text-[18px] font-light">{plan.period}</div>
                  </div>
                </div>
                <div className='flex items-center justify-between'>
                  <p className="text-primary text-[14px] font-medium">{plan.note}</p>
                  <Button className="bg-primary hover:bg-primary/90 text-white py-3 px-10 text-[12px] font-[600] transition-all duration-300 rounded-none">
                    JOIN NOW
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
