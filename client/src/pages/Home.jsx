import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ProductsSection from '../components/ProductsSection';
import WhyChooseUsSection from '../components/WhyChooseUsSection';
import CertificationsSection from '../components/CertificationsSection';
import TestimonialSlider from '../components/TestimonialSlider';
import CounterSection from '../components/CounterSection';
import FAQAccordion from '../components/FAQAccordion';
import InquiryForm from '../components/InquiryForm';
import ContactSection from '../components/ContactSection';

const Home = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProductsSection />
      <WhyChooseUsSection />
      <CertificationsSection />
      <TestimonialSlider />
      <CounterSection />
      <InquiryForm />
      <FAQAccordion />
      <ContactSection />
    </>
  );
};

export default Home;
