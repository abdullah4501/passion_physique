import { Button } from '@/components/ui/button';
import image1 from "@/assets/session/image1.png";
import image2 from "@/assets/session/image2.png";
import symbol from "@/assets/icons/symbol.png";

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

export default function SessionSection() {
  return (
    <section className="relative bg-[#1E1E1E] overflow-x-clip"> {/* Ensures images can overflow sides but not upwards */}
      <div className="container mx-auto flex flex-col py-0">
        {/* First Row */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-[65px]">
          {/* Text Block */}
          <div className="flex flex-col justify-center md:px-[55px] py-[85px] z-10">
            <h2 className="text-white text-[38px] font-medium mb-2 leading-[44px] text-[34px]">1-on-1 Session<br />
            <span className="text-[#ED232A]">Q&amp;A VIDEO CALL</span>
            </h2>
            <p className="text-[#ffffff] text-[15px] leading-[25px] my-4  font-normal">
              This is a professional, science-based consultation designed to provide real clarity and practical direction for your fitness journey.
            </p>
            <div className="grid grid-cols-2 gap-y-3 gap-x-8 mb-8 max-w-[440px]">
              {sessionFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={symbol} className="inline-block w-[9px] h-[9px]" />
                  <span className="text-white text-[15px] leading-[32px]">{feature}</span>
                </div>
              ))}
            </div>
            <div className='flex'>
              <Button className="bg-[#ED232A] hover:bg-[#cf171d] text-white rounded-none font-semibold text-[12px] px-8 py-3 mt-2 w-auto">
                READ MORE
              </Button>
            </div>
          </div>
          {/* Image Block */}
          <div className="relative flex items-center justify-center md:static">
            <img
              src={image1}
              alt="Session"
              className="
                md:top-0
                md:rounded-none
                shadow-none
                z-0
              "
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-[65px]">
          {/* Image Block */}
          <div className="relative flex items-center justify-center md:static">
            <img
              src={image2}
              alt="Supplements"
              className="
                md:bottom-0
                md:rounded-none
                shadow-none
                z-0
              "
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
          {/* Text Block */}
          <div className="flex flex-col justify-center md:px-[55px] py-[85px]  z-10">
            <h2 className="text-white text-[38px] font-medium mb-2 leading-[44px] text-[34px]">Our Supplement<br />
              <span className="text-[#ED232A]">GUIDANCE</span>
            </h2>
            <p className="text-[#ffffff] text-[15px] leading-[25px] my-4  font-normal">
              This is not a list of products — it&apos;s a science-based consultation tailored to your individual needs. We break down:
            </p>
            <div className="grid grid-cols-2 gap-y-3 gap-x-8 mb-8 max-w-[440px]">
              {supplementFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={symbol} className="inline-block w-[9px] h-[9px] " />
                  <span className="text-white text-[15px] leading-[32px]">{feature}</span>
                </div>
              ))}
            </div>
            <div className='flex'>
              <Button className="bg-[#ED232A] hover:bg-[#cf171d] text-white rounded-none font-semibold text-[12px] px-8 py-3 mt-2 w-auto">
                READ MORE
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
