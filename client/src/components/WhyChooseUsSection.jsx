import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fadeUpVariant, staggerContainer } from '../hooks/useScrollReveal';
import { FiStar, FiDroplet, FiCheckSquare, FiSend, FiDollarSign, FiHeart } from 'react-icons/fi';

const reasons = [
  { icon: <FiStar />, title: "Premium Raw Materials", desc: "Handpicked spices from the most fertile regions of India." },
  { icon: <FiDroplet />, title: "Hygienic Processing", desc: "State-of-the-art machinery ensuring zero human touch." },
  { icon: <FiCheckSquare />, title: "Quality Assurance", desc: "Rigorous lab testing for purity and aroma." },
  { icon: <FiSend />, title: "Global Shipping", desc: "Reliable logistics partners for on-time delivery." },
  { icon: <FiDollarSign />, title: "Competitive Pricing", desc: "Direct from farm to facility pricing advantages." },
  { icon: <FiHeart />, title: "Customer Satisfaction", desc: "Dedicated support and long-term partnership focus." }
];

const WhyChooseUsSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="why-us" className="py-16 md:py-24 bg-brand-brown text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#D4AF37 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div 
          variants={fadeUpVariant}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h4 className="text-brand-gold font-semibold uppercase tracking-wider mb-2">Our Advantage</h4>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Why Choose VYAK Global?</h2>
          <p className="text-gray-300 text-lg">
            We don't just sell spices; we deliver trust, quality, and the true essence of Indian flavors to your doorstep.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {reasons.map((reason, idx) => (
            <motion.div 
              key={idx}
              variants={fadeUpVariant}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-brand-gold/20 text-brand-gold rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-white transition-all">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{reason.title}</h3>
              <p className="text-gray-300">{reason.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
