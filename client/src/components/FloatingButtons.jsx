import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';

const FloatingButtons = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      <a 
        href="tel:+91XXXXXXXXXX" 
        className="w-14 h-14 bg-brand-brown hover:bg-brand-cinnamon text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        aria-label="Call Now"
      >
        <FaPhoneAlt size={22} />
      </a>
      <a 
        href="https://wa.me/91XXXXXXXXXX" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        aria-label="WhatsApp"
      >
        <FaWhatsapp size={28} />
      </a>
    </div>
  );
};

export default FloatingButtons;
