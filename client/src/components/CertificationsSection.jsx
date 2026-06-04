import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fadeUpVariant, staggerContainer } from '../hooks/useScrollReveal';
import certData from '../data/certifications.json';
import { FiAward } from 'react-icons/fi';

const CertificationsSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="certifications" className="py-16 md:py-24 bg-white dark:bg-gray-900 relative">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div 
          variants={fadeUpVariant}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h4 className="text-brand-gold font-semibold uppercase tracking-wider mb-2">Quality Standards</h4>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Certifications</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Committed to international standards of food safety, quality, and hygiene.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {certData.map((cert) => (
            <motion.div 
              key={cert.id}
              variants={fadeUpVariant}
              className="bg-brand-cream/50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center hover:shadow-xl transition-shadow group"
            >
              <div className="w-20 h-20 bg-white dark:bg-gray-700 shadow-md rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FiAward className="text-4xl text-brand-gold" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">{cert.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{cert.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CertificationsSection;
