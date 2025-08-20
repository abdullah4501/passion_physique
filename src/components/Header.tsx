import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, User } from 'lucide-react';
import profile from '@/assets/icons/profile.png';
import logo from '@/assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Plans', href: '/plans' },
  { label: 'E-Books', href: '/e-books' },
  { label: '1-on-1 Session', href: '/session' },
  { label: 'Supplement Guidance', href: '/supplement-guidance' },
  { label: 'Library', href: '/workout-library' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Certificate', href: '/certificate' },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // profile dropdown state & refs
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);

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
    setOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // outside click & escape handling
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (open && containerRef.current && !containerRef.current.contains(t)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // focus first menu item when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const first = menuRef.current?.querySelector<HTMLElement>('button, a');
        first?.focus();
      }, 0);
    }
  }, [open]);

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
                  hover:text-primary transition-colors duration-300 text-[14px] font-semibold tracking-wide nav-link
                `}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button or Profile/Logout */}
          <div className="hidden lg:block">
            {user ? (
              // containerRef now wraps the entire hero-button and dropdown
              <div ref={containerRef} className="relative inline-block">
                <div className=" bg-[#ED2C2C] h-[35px] hover:bg-red-700 flex items-center gap-3 justify-center cursor-pointer" >
                  <Link to={`/profile/${user.id}`} className="flex items-center gap-3 text-center justify-center px-[25px] text-[12px] font-[600] h-full">
                    <img src={profile} alt="profile" />
                    PROFILE
                  </Link>
                  <button
                    onClick={() => setOpen((s) => !s)}
                    aria-haspopup="true"
                    aria-expanded={open}
                    aria-label={open ? 'Close menu' : 'Open menu'}
                    className="h-full p-0 px-2 border-l border-gray-300"
                    type="button"
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>

                {/* dropdown (positioned below the whole hero-button, width matches button) */}
                {open && (
                  <ul
                    ref={menuRef}
                    role="menu"
                    aria-label="Profile menu"
                    className="absolute left-0 top-full mt-2 w-full bg-[#fff] border rounded shadow-md z-50 overflow-hidden"
                  >
                    <li role="none">
                      <button
                        role="menuitem"
                        onClick={() => {
                          handleLogout();
                        }}
                        className="w-full text-center text-[#FF3131] font-bold px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none"
                        type="button"
                      >
                        Logout
                      </button>
                    </li>
                    {/* add more menu items here if needed */}
                  </ul>
                )}
              </div>
            ) : (
              <Button onClick={() => {
                localStorage.setItem('redirectAfterAuth', window.location.pathname + window.location.search);
                navigate('/register');
              }} className="hero-button px-[25px] hover:bg-red-700" >
                LOGIN OR REGISTER
              </Button>
            )}
          </div>
          <div className='flex gap-4 items-center lg:hidden'>
            {user && (
              <Link to={`/profile/${user.id}`} >
                <User size={20} className="text-foreground" />
              </Link>
            )}
            <button
              className="text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>
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
                <Link to="/profile" className=" mr-0 w-full">
                  PROFILE
                </Link>
                <Button onClick={handleLogout} className=" bg-red-600 hover:bg-red-700 mr-0 w-full">
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
