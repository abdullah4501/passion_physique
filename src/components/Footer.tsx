import { Phone, Mail, Instagram, Facebook } from 'lucide-react';
import logo from '@/assets/logo-footer.png';

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
    <footer className="bg-background border-t border-border">
      {/* Image Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 h-40 mb-12">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="relative overflow-hidden">
            <img 
              src="/placeholder.svg" 
              alt={`Gallery ${i}`}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <img src={logo} alt="Passion Physique"  />
              
            </div>
            
            <p className="text-white/80 text-sm mb-8 leading-relaxed">
              The Passion Physique — Personalized coaching that empowers your fitness journey with science, passion, and purpose.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-white text-sm">05000000000</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-white text-sm">info@thepassionphysique.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links 1 */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">USEFUL LINK</h3>
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
          <div>
            <h3 className="text-white font-bold text-lg mb-6">USEFUL LINK</h3>
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

          {/* Social Media */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Follow Us:</h3>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-6 h-6 text-white" />
              </a>
              <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-6 h-6 text-white" />
              </a>
              <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <span className="text-white font-bold text-lg">X</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;