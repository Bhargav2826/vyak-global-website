import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 md:pt-20 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="space-y-6">
            <a href="#home" className="text-3xl font-bold font-heading">
              VYAK <span className="text-brand-gold">Global</span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium quality spice manufacturing and exporting company. Delivering the authentic taste of India to the world with uncompromised quality and trust.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors">
                <FaFacebookF />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors">
                <FaLinkedinIn />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-gray-400 hover:text-brand-gold transition-colors">Home</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-brand-gold transition-colors">About Us</a></li>
              <li><a href="#products" className="text-gray-400 hover:text-brand-gold transition-colors">Our Products</a></li>
              <li><a href="#certifications" className="text-gray-400 hover:text-brand-gold transition-colors">Certifications</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-brand-gold transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Products</h4>
            <ul className="space-y-3">
              <li><a href="#products" className="text-gray-400 hover:text-brand-gold transition-colors">Black Pepper</a></li>
              <li><a href="#products" className="text-gray-400 hover:text-brand-gold transition-colors">Turmeric Powder</a></li>
              <li><a href="#products" className="text-gray-400 hover:text-brand-gold transition-colors">Red Chilli Powder</a></li>
              <li><a href="#products" className="text-gray-400 hover:text-brand-gold transition-colors">Garam Masala</a></li>
              <li><a href="#products" className="text-gray-400 hover:text-brand-gold transition-colors">Kitchen King Masala</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Contact Info</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-brand-gold mt-1">📍</span>
                <span>VYAK Global<br/>Gujarat, India</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-brand-gold">📞</span>
                <span>+91 XXXXXXXXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-brand-gold">✉️</span>
                <span>info@vyakglobal.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} VYAK Global. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-brand-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-gold transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
