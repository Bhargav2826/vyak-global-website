import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

const InquiryForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    product: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission for static site
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', company: '', email: '', phone: '', product: '', message: '' });
    }, 5000);
  };

  return (
    <section id="inquiry" className="py-16 md:py-24 bg-brand-cream/40 dark:bg-gray-800/50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-5/12 bg-brand-brown text-white p-10 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">Request a Quote</h3>
              <p className="text-gray-300 mb-8">
                Interested in our premium spices for your business? Fill out the form, and our sales team will get back to you within 24 hours.
              </p>
              <div className="space-y-4">
                <p className="flex items-center gap-3"><span className="text-brand-gold text-xl">✓</span> Best wholesale pricing</p>
                <p className="flex items-center gap-3"><span className="text-brand-gold text-xl">✓</span> Customized packaging</p>
                <p className="flex items-center gap-3"><span className="text-brand-gold text-xl">✓</span> Fast global shipping</p>
              </div>
            </div>
          </div>
          
          <div className="md:w-7/12 p-10 relative">
            <AnimatePresence>
              {isSubmitted && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white dark:bg-gray-900 z-10 flex flex-col items-center justify-center p-8 text-center"
                >
                  <FiCheckCircle className="text-6xl text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Inquiry Sent Successfully!</h3>
                  <p className="text-gray-600 dark:text-gray-400">Thank you for your interest. Our export executive will contact you shortly.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name*</label>
                  <input type="text" required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-gold dark:text-white transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                  <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-gold dark:text-white transition-colors" placeholder="ABC Corp" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address*</label>
                  <input type="email" required name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-gold dark:text-white transition-colors" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number*</label>
                  <input type="tel" required name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-gold dark:text-white transition-colors" placeholder="+1 234 567 8900" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interested Product*</label>
                <select required name="product" value={formData.product} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-gold dark:text-white transition-colors">
                  <option value="">Select a product</option>
                  <option value="Black Pepper">Black Pepper</option>
                  <option value="Turmeric">Turmeric</option>
                  <option value="Red Chilli">Red Chilli</option>
                  <option value="Coriander">Coriander</option>
                  <option value="Multiple/Assorted">Multiple / Assorted Products</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message / Requirements</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows="4" className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-gold dark:text-white transition-colors" placeholder="Tell us about your estimated quantity and packaging needs..."></textarea>
              </div>

              <button type="submit" className="w-full bg-brand-gold hover:bg-yellow-500 text-white font-bold py-4 rounded-lg shadow-md transition-colors hover:shadow-lg">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InquiryForm;
