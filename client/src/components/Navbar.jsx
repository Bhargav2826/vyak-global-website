import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiMoon, HiSun } from 'react-icons/hi';

const Navbar = ({ toggleDarkMode, isDarkMode }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Products', href: '#products' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <a href="#home" className={`text-2xl font-bold font-heading transition-colors ${isScrolled ? 'text-brand-brown dark:text-brand-cream' : 'text-brand-brown dark:text-white'}`}>
          VYAK <span className="text-brand-gold">Global</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className={`font-medium hover:text-brand-gold transition-colors ${isScrolled ? 'text-gray-800 dark:text-gray-200' : 'text-gray-900 dark:text-white'}`}>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          
          <button onClick={toggleDarkMode} className={`p-2 rounded-full transition-colors ${isScrolled ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-yellow-400' : 'bg-white/20 text-brand-brown dark:text-yellow-400'}`}>
            {isDarkMode ? <HiSun size={20} /> : <HiMoon size={20} />}
          </button>

          <a href="#inquiry" className="bg-brand-gold hover:bg-yellow-500 text-white px-6 py-2 rounded-full font-medium transition-transform hover:scale-105 shadow-lg">
            Get a Quote
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-yellow-400">
            {isDarkMode ? <HiSun size={20} /> : <HiMoon size={20} />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`${isScrolled ? 'text-gray-800 dark:text-white' : 'text-gray-900 dark:text-white'}`}>
            {isMobileMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-gray-900 shadow-xl overflow-hidden"
          >
            <ul className="flex flex-col py-4 px-6 space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-800 dark:text-gray-200 font-medium hover:text-brand-gold"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <a 
                  href="#inquiry"
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="block text-center bg-brand-gold text-white px-6 py-3 rounded-md font-medium mt-4"
                >
                  Get a Quote
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
