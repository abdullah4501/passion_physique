import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import logo from '@/assets/logo.png';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Plans', href: '/plans' },
  { label: 'Books', href: '/e-books' },
  { label: '1-on-1 Session', href: '/sessions' },
  { label: 'Supplement Guidance', href: '/supplement-guidance' },
  { label: 'Library', href: '/workout-library' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Certificate', href: '/certificate' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-[#000000]' : ''}`}>
      <div className=" mx-auto px-[45px]">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={logo} alt="Passion Physique" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-[30px] main-navbar">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`
                  ${currentPath === item.href ? 'active text-primary' : 'text-[#F0F0F0]'}
                  hover:text-primary transition-colors duration-300 text-[14px] font-semibold tracking-wide
                `}
              >
                {item.label}
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
          <div className="lg:hidden py-4 border-t border-border animate-fade-in bg-[#000000]">
            <nav className="flex flex-col gap-4 main-navbar">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={`
                    ${currentPath === item.href ? 'active text-primary' : 'text-[#F0F0F0]'}
                    hover:text-primary transition-colors duration-300 text-sm font-medium uppercase tracking-wide py-2
                  `}
                >
                  {item.label}
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
