import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiBox, FiGlobe } from 'react-icons/fi';

const ProductModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-white/20 hover:bg-white/40 text-white md:text-gray-800 md:bg-gray-100 md:hover:bg-gray-200 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full transition-colors"
          >
            <FiX size={24} />
          </button>

          <div className="md:w-1/2 relative h-64 md:h-auto">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
            <h2 className="absolute bottom-4 left-6 text-3xl font-bold text-white md:hidden">{product.name}</h2>
          </div>

          <div className="md:w-1/2 p-6 md:p-10 overflow-y-auto custom-scrollbar">
            <h2 className="hidden md:block text-3xl md:text-4xl font-bold text-brand-brown dark:text-brand-cream mb-4">{product.name}</h2>
            <div className="w-16 h-1 bg-brand-gold mb-6"></div>
            
            <p className="text-gray-700 dark:text-gray-300 text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold flex items-center gap-2 mb-3 dark:text-white">
                  <FiCheckCircle className="text-brand-gold" /> Key Benefits
                </h4>
                <ul className="grid grid-cols-1 gap-2">
                  {product.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                      <span className="text-brand-gold mt-1">•</span> {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-4">
                <div className="flex items-start gap-3">
                  <FiBox className="text-2xl text-brand-gold mt-1" />
                  <div>
                    <h5 className="font-semibold dark:text-white">Packaging Options</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{product.packaging}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiGlobe className="text-2xl text-brand-gold mt-1" />
                  <div>
                    <h5 className="font-semibold dark:text-white">Export Availability</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{product.exportAvailability}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <a 
                href="#inquiry" 
                onClick={onClose}
                className="block w-full text-center bg-brand-brown hover:bg-brand-cinnamon text-white py-4 rounded-xl font-medium transition-colors shadow-lg"
              >
                Inquire About This Product
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductModal;
