import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import logo from '@/assets/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    'Home',
    'About Us', 
    'Plans',
    'Books',
    '1-on-1 Session',
    'Supplement Guidance',
    'Library',
    'FAQs'
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 ">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={logo} alt="Passion Physique" />
            
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 main-navbar">
            {navItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className="text-foreground hover:text-primary transition-colors duration-300 text-[14px] font-semibold tracking-wide"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button className="hero-button px-[25px]">
              LOGIN OR REGISTER
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-foreground hover:text-primary transition-colors duration-300 text-sm font-medium uppercase tracking-wide py-2"
                >
                  {item}
                </a>
              ))}
              <Button className="hero-button mt-4">
                LOGIN OR REGISTER
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;