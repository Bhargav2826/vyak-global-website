import { FiEye } from 'react-icons/fi';

const ProductCard = ({ product, onViewDetails }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group border border-gray-100 dark:border-gray-700 flex flex-col">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button 
            onClick={() => onViewDetails(product)}
            className="bg-brand-gold text-white px-6 py-2 rounded-full font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
          >
            <FiEye /> View Details
          </button>
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold mb-2 text-brand-brown dark:text-brand-cream">{product.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">{product.shortDescription}</p>
        <button 
          onClick={() => onViewDetails(product)}
          className="text-brand-gold font-semibold hover:text-brand-brown dark:hover:text-white transition-colors text-left flex items-center gap-1"
        >
          View Details <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
