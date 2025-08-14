import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from '@/assets/logo-footer.png';
import scrollTop from '@/assets/icons/scroll.png';
import phone from '@/assets/icons/phone.png';
import email from '@/assets/icons/email.png';
import instagram from '@/assets/icons/instagram.png';
import facebook from '@/assets/icons/facebook.png';
import X from '@/assets/icons/x-twitter.png';

const Footer = () => {
  const quickLinks1 = [
    { label: 'Homepage', href: '/' },
    { label: 'About Us', href: '/about-us' },
    { label: 'Coaching Plans', href: '/plans' },
    { label: 'E-Books', href: '/e-books' },
    { label: '1-on-1 Session', href: '/sessions' },
    { label: 'Supplement Guidance', href: '/supplement-guidance' },
  ];

  const quickLinks2 = [
    { label: '1-on-1 Q&A Video Call', href: '/' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms, Conditions & Refund Policy', href: '/terms-and-conditions' },
    { label: 'FAQs', href: '/faqs' },
  ];

  // SCROLL TO TOP LOGIC
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Handler for scroll event
    const onScroll = () => {
      if (window.scrollY > 30) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Smooth scroll to top
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#1E1E1E] border-t border-border relative">
      {/* Scroll To Top FAB */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scroll-top"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{
              scale: 1.13,
              boxShadow: "0 6px 28px 0 rgba(237,35,42,0.24)"
            }}
            onClick={handleScrollTop}
            className="
              fixed bottom-8 right-8 z-[120]
              bg-primary transition-all shadow-xl
              w-[40px] h-[40px] flex items-center justify-center cursor-pointer
            "
            aria-label="Scroll to Top"
          >
            <img src={scrollTop} alt="Scroll to top" />
          </motion.button>
        )}
      </AnimatePresence>
      {/* Main Footer */}
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

          {/* Quick Links */}
          <div className="w-full flex flex-col md:flex-row md:justify-center items-start lg:w-[40%] gap-8 px-[40px] lg:pt-[40px]">
            {/* Quick Links 1 */}
            <div className="w-full md:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h3 className="text-white font-semibold text-[18px] tracking-[3px] leading-[24px] mb-6">USEFUL LINKS</h3>
              <ul className="space-y-3">
                {quickLinks1.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-white/80 hover:text-primary transition-colors text-sm">
                      {link.label}
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
                    <a href={link.href} className="text-white/80 hover:text-primary transition-colors text-sm">
                      {link.label}
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
                <img src={instagram} />
              </a>
              <a href="#" className='text-[14px] '>
                <img src={facebook} />
              </a>
              <a href="#" className='text-[14px] '>
                <img src={X} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className='copyright py-8 border-t '>
        <p className=" text-white text-center text-[14px] leading-[24px] tracking-[1.4px]">&copy; {new Date().getFullYear()} the passion physique - Website Designed By <a href="https://www.bmmarketing.ae" className="underline" target="_blank">BM</a></p>
      </div>
    </footer>
  );
};

export default Footer;
