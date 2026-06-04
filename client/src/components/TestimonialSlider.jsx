import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fadeUpVariant } from '../hooks/useScrollReveal';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import testimonials from '../data/testimonials.json';

const TestimonialSlider = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-brand-cream/40 dark:bg-gray-900/80 overflow-hidden">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div 
          variants={fadeUpVariant}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h4 className="text-brand-gold font-semibold uppercase tracking-wider mb-2">Testimonials</h4>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">What Our Global Clients Say</h2>
        </motion.div>

        <motion.div 
          variants={fadeUpVariant}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto relative"
        >
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12 relative z-10 min-h-[300px] flex items-center">
            <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 md:-translate-x-6 w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center text-gray-800 dark:text-white hover:bg-brand-gold hover:text-white transition-colors z-20">
              <FiChevronLeft size={20} className="sm:w-6 sm:h-6" />
            </button>
            <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 md:translate-x-6 w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center text-gray-800 dark:text-white hover:bg-brand-gold hover:text-white transition-colors z-20">
              <FiChevronRight size={20} className="sm:w-6 sm:h-6" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="w-full text-center"
              >
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-xl mx-1" />
                  ))}
                </div>
                <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 italic mb-8">"{testimonials[currentIndex].review}"</p>
                <div className="flex items-center justify-center flex-col">
                  <img 
                    src={testimonials[currentIndex].image} 
                    alt={testimonials[currentIndex].name} 
                    className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-brand-gold"
                  />
                  <h4 className="font-bold text-lg dark:text-white">{testimonials[currentIndex].name}</h4>
                  <p className="text-brand-gold text-sm font-medium">{testimonials[currentIndex].country}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Decorative shapes */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-brand-brown/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-gold/20 rounded-full blur-2xl"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
