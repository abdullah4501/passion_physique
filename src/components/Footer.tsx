import { Phone, Mail, Instagram, Facebook } from 'lucide-react';
import logo from '@/assets/logo-footer.png';
import phone from '@/assets/icons/phone.png';
import email from '@/assets/icons/email.png';
import instagram from '@/assets/icons/instagram.png';
import facebook from '@/assets/icons/facebook.png';
import X from '@/assets/icons/x-twitter.png';

const Footer = () => {
  const quickLinks1 = [
    "Homepage",
    "About Us", 
    "Coaching Plans",
    "E-books",
    "1-on-1 Q&A Video Call",
    "Supplement Guidance"
  ];

  const quickLinks2 = [
    "1-on-1 Q&A Video Call",
    "Privacy Policy",
    "Terms, Conditions & Refund Policy", 
    "FAQs"
  ];

  return (
    <footer className="bg-[#1E1E1E] border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center lg:items-start lg:flex-row flex-wrap gap-8 justify-between">
          {/* Company Info */}
          <div className="w-full lg:w-[30%] flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex items-center gap-2 mb-2">
              <img src={logo} alt="Passion Physique" />
            </div>
            <p className="text-white text-[14px] mb-4 leading-[24px] tracking-[1px]">
              The Passion Physique — Personalized coaching that empowers your fitness journey with science, passion, and purpose.
            </p>
            <div className="space-y-4 w-full flex flex-col items-center lg:items-start">
              <div className="flex items-center gap-3">
                <img src={phone} />
                <span className="text-white text-sm">05000000000</span>
              </div>
              <div className="flex items-center gap-3">
                <img src={email} />
                <span className="text-white text-sm">info@thepassionphysique.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links Wrapper for md and below */}
          <div className="w-full flex flex-col md:flex-row md:justify-center items-start lg:w-[40%] gap-8 px-[40px] lg:pt-[40px]">
            {/* Quick Links 1 */}
            <div className="w-full md:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h3 className="text-white font-semibold text-[18px] tracking-[3px] leading-[24px] mb-6">USEFUL LINKS</h3>
              <ul className="space-y-3">
                {quickLinks1.map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-white/80 hover:text-primary transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Quick Links 2 */}
            <div className="w-full md:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h3 className="text-white font-semibold text-[18px] tracking-[3px] leading-[24px] mb-6">USEFUL LINKS</h3>
              <ul className="space-y-3">
                {quickLinks2.map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-white/80 hover:text-primary transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Media */}
          <div className="w-full lg:w-[20%] flex flex-col items-center lg:items-start text-center lg:text-left lg:pt-[40px]">
            <h3 className="text-white font-normal leading-[28px] text-[16px] mb-6">Follow Us:</h3>
            <div className="flex w-[75%] justify-between">
              <a href="#" className='text-[14px] '>
                <img src={instagram}  />
              </a>
              <a href="#" className='text-[14px] '>
                <img src={facebook}  />
              </a>
              <a href="#" className='text-[14px] '>
                <img src={X} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
