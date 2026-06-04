import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fadeUpVariant, staggerContainer } from '../hooks/useScrollReveal';
import { FiAward, FiGlobe, FiTruck, FiShield } from 'react-icons/fi';

const features = [
  { icon: <FiAward className="text-4xl text-brand-gold" />, title: "Premium Quality", desc: "Sourced directly from the best farms ensuring top-tier authentic flavors." },
  { icon: <FiGlobe className="text-4xl text-brand-gold" />, title: "Global Export", desc: "Seamless supply chain network exporting to over 15 countries." },
  { icon: <FiTruck className="text-4xl text-brand-gold" />, title: "Fast Delivery", desc: "Optimized logistics for timely and safe delivery worldwide." },
  { icon: <FiShield className="text-4xl text-brand-gold" />, title: "Certified Products", desc: "ISO, FSSAI, and GMP certified manufacturing processes." }
];

const AboutSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="about" className="py-16 md:py-24 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col lg:flex-row gap-16 items-center"
        >
          <motion.div variants={fadeUpVariant} className="lg:w-1/2">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Spice Manufacturing" 
                className="rounded-2xl shadow-2xl z-10 relative object-cover h-[300px] sm:h-[400px] lg:h-[500px] w-full"
              />
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand-gold/20 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-brand-brown/10 rounded-full blur-3xl -z-10"></div>
            </div>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="lg:w-1/2 space-y-8">
            <div>
              <h4 className="text-brand-gold font-semibold uppercase tracking-wider mb-2">About Our Company</h4>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Pioneering Excellence in Spice Manufacturing</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                VYAK Global is a leading manufacturer, supplier, and exporter of premium quality Indian spices and food products. With years of expertise in the food industry, we have established ourselves as a trusted name globally.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 mb-8">
                <div className="bg-brand-cream dark:bg-gray-800 p-6 rounded-xl border-l-4 border-brand-brown shadow-sm">
                  <h3 className="font-bold text-xl mb-2 text-brand-brown dark:text-brand-gold">Our Mission</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">To provide authentic, pure, and high-quality Indian spices to the world while empowering local farmers.</p>
                </div>
                <div className="bg-brand-cream dark:bg-gray-800 p-6 rounded-xl border-l-4 border-brand-gold shadow-sm">
                  <h3 className="font-bold text-xl mb-2 text-brand-brown dark:text-brand-gold">Our Vision</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">To become the most reliable and globally recognized brand in the spice export industry.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20"
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={idx} 
              variants={fadeUpVariant}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700 group hover:-translate-y-2 duration-300"
            >
              <div className="w-16 h-16 bg-brand-cream dark:bg-gray-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
