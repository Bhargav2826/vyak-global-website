import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fadeUpVariant, staggerContainer } from '../hooks/useScrollReveal';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import productsData from '../data/products.json';

const ProductsSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <section id="products" className="py-16 md:py-24 bg-brand-cream/30 dark:bg-gray-900/50">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div 
          variants={fadeUpVariant}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h4 className="text-brand-gold font-semibold uppercase tracking-wider mb-2">Our Collection</h4>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Premium Export Quality Spices</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Discover our wide range of authentic, hygienically processed spices. Perfect for culinary experts and food industries worldwide.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {productsData.map((product) => (
            <motion.div key={product.id} variants={fadeUpVariant}>
              <ProductCard 
                product={product} 
                onViewDetails={setSelectedProduct} 
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <a href="#inquiry" className="inline-flex items-center gap-2 border-2 border-brand-brown dark:border-brand-gold text-brand-brown dark:text-brand-gold px-8 py-3 rounded-full font-semibold hover:bg-brand-brown hover:text-white dark:hover:bg-brand-gold dark:hover:text-gray-900 transition-colors">
            Request Full Catalog
          </a>
        </div>
      </div>

      <ProductModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </section>
  );
};

export default ProductsSection;
