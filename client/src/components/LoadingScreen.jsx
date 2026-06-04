import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-brand-brown flex flex-col items-center justify-center">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5] 
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut"
        }}
        className="w-24 h-24 rounded-full border-4 border-brand-gold flex items-center justify-center mb-8 relative"
      >
        <div className="absolute inset-0 bg-brand-gold/20 rounded-full animate-ping"></div>
        <span className="text-3xl font-bold font-heading text-brand-cream">V</span>
      </motion.div>
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-2xl md:text-4xl font-bold font-heading text-white tracking-widest"
      >
        VYAK <span className="text-brand-gold">Global</span>
      </motion.h2>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: 200 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="h-1 bg-brand-gold mt-6 rounded-full"
      ></motion.div>
    </div>
  );
};

export default LoadingScreen;
