import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Premium Spices" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center lg:text-left pt-24 md:pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-block py-1 px-3 rounded-full bg-brand-gold/20 text-brand-gold border border-brand-gold font-medium mb-6 backdrop-blur-sm"
          >
            Welcome to VYAK Global
          </motion.span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Premium Quality Spices <br className="hidden md:block"/> 
            <span className="text-brand-gold">Exported Worldwide</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl font-light">
            We manufacture, supply, and export authentic Indian spices with uncompromising quality. Bringing the rich flavors of India to your global business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a href="#products" className="bg-brand-gold hover:bg-yellow-500 text-white px-8 py-4 rounded-full font-medium transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:-translate-y-1 text-center">
              Explore Products
            </a>
            <a href="#contact" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-8 py-4 rounded-full font-medium transition-all hover:-translate-y-1 text-center">
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>


    </section>
  );
};

export default HeroSection;
