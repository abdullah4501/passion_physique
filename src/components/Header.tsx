import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import profile from '@/assets/icons/profile.png';
import logo from '@/assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';

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
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    setUser(userData ? JSON.parse(userData) : null);

    const handleStorage = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-[#000000]' : ''}`}>
      <div className=" mx-auto lg:px-[45px] px-[20px]">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="">
            <img src={logo} alt="Passion Physique" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center main-navbar">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`
                  ${currentPath === item.href ? 'active text-primary' : 'text-[#F0F0F0]'}
                  hover:text-primary transition-colors duration-300 text-[14px] font-semibold tracking-wide
                `}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button or Profile/Logout */}
          <div className="hidden lg:block">
            {user ? (
              <div className="">
                <Link to="/profile" className="hero-button px-[25px] hover:bg-red-700 flex items-center gap-3 text-center justify-center">
                 <img src={profile} />
                  PROFILE
                </Link>
              </div>
            ) : (
              <Link to={'/register'} className="hero-button px-[25px] hover:bg-red-700">
                LOGIN OR REGISTER
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden py-4 px-[20px] h-screen border-t border-border animate-fade-in bg-[#000000]">
          <nav className="flex flex-col gap-4 main-navbar">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`
                  ${currentPath === item.href ? 'active text-primary' : 'text-[#F0F0F0]'}
                  hover:text-primary transition-colors duration-300 text-sm font-medium uppercase tracking-wide py-2
                `}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <div className="flex flex-col gap-3 mt-4">
                <Link to="/profile" className="hero-button">
                  PROFILE
                </Link>
                <Button onClick={handleLogout} className="hero-button bg-red-600 hover:bg-red-700">
                  LOGOUT
                </Button>
              </div>
            ) : (
              <Button
                asChild
                className="hero-button mt-4"
              >
                <Link to="/register">
                  LOGIN OR REGISTER
                </Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
