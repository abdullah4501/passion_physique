import { Button } from '@/components/ui/button';
import bg from "@/assets/gallery/PlansBg.png";
import SectionWrapper from '@/components/SectionWrapper'; // <-- Import this
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";



const PricingSection = () => {
    const [plans, setPlans] = useState([]);
    const [activePlan, setActivePlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/coachingplans/stripe`)
      .then(res => res.json())
      .then(data => {
        setPlans(data.plans?.slice(0, 2) || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

      useEffect(() => {
        // Only run if user is logged in!
        const fetchActivePlan = async () => {
            const token = localStorage.getItem("token");
            if (!token) return; // skip if not logged in
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/active`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            // You may need to adapt the property name below:
            setActivePlan(data.plan); // or setActivePlan(data.activePlan)
        };
        fetchActivePlan();

    }, []);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">

          {/* LEFT Content (with fade from left) */}
          <SectionWrapper
            variants={{
              hidden: { opacity: 0, x: -60 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.42, 0, 0.2, 1] } }
            }}
            className="lg:pr-[120px] lg:mb-0 mb-8"
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

            <Link to={'/plans'} className="hero-button px-[45px]">
              READ MORE
            </Link>
          </SectionWrapper>

          {/* RIGHT Content - Pricing Cards */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-white text-lg">Loading plans...</div>
            ) : plans.length === 0 ? (
              <div className="text-white text-lg">No plans found.</div>
            ) : (
              plans.map((plan, idx) => (
                <SectionWrapper
                  key={plan.priceId || plan.name}
                  variants={{
                    hidden: { opacity: 0, y: 40, scale: 0.95 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }
                  }}
                  className={`${idx === 1 ? 'bg-[#000000]' : 'bg-[#2E2E2E]'
                    } md:px-[45px] px-[15px] py-[40px] transition-all duration-300 hover:scale-105 shadow-lg shadow-black/30`}

                >
                  <div className="flex md:flex-row flex-col justify-between items-start mb-4">
                    <div className="flex-1 md:pr-6 pr-0">
                      <h3 className="text-[26px] font-light text-white mb-3">{plan.name}</h3>
                      <p className="text-white text-[14px] font-light leading-relaxed mb-4 line-clamp-4 overflow-hidden text-ellipsis">
                        {plan.description}
                      </p>
                    </div>
                    <div className="text-right pricing-info">
                      <div className="text-[36px] font-light text-white">€{plan.amount}</div>
                      <div className="text-white text-[18px] font-light">{plan.period}</div>
                    </div>
                  </div>
                  <div className='flex items-center justify-between md:flex-row flex-col'>
                    <p className="text-primary text-[14px] font-medium">{plan.note}</p>
                    {
                      plan.priceId === (activePlan?.priceId || activePlan?.plan)
                        ? <span className="text-green-500 font-bold">ACTIVE</span>
                        : <Link
                          to={`/plans/become-a-member/payment/${plan.priceId}`}
                          className="bg-primary hover:bg-primary/90 text-white py-3 px-10 text-[12px] font-[600] transition-all duration-300 rounded-none md:w-auto w-full md:mt-0 mt-4"
                        >{activePlan ? "UPGRADE" : "JOIN NOW"}</Link>
                    }
                  </div>
                </SectionWrapper>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
