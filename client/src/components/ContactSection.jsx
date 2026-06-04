import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const ContactSection = () => {
  return (
    <section id="contact" className="py-16 md:py-24 bg-brand-cream/30 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h4 className="text-brand-gold font-semibold uppercase tracking-wider mb-2">Get In Touch</h4>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            We are always ready to assist you with your export inquiries. Reach out to our dedicated team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
              <FiMapPin />
            </div>
            <h3 className="text-xl font-bold mb-3 dark:text-white">Head Office</h3>
            <p className="text-gray-600 dark:text-gray-400">VYAK Global<br/>Gujarat, India</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
              <FiPhone />
            </div>
            <h3 className="text-xl font-bold mb-3 dark:text-white">Phone</h3>
            <p className="text-gray-600 dark:text-gray-400">+91 XXXXXXXXXX<br/>Mon - Sat, 9am - 6pm</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
              <FiMail />
            </div>
            <h3 className="text-xl font-bold mb-3 dark:text-white">Email</h3>
            <p className="text-gray-600 dark:text-gray-400">info@vyakglobal.com<br/>sales@vyakglobal.com</p>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden shadow-lg relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <FiMapPin className="text-4xl mb-2" />
            <p className="font-medium">Interactive Map Placeholder</p>
            <p className="text-sm">Gujarat, India</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
