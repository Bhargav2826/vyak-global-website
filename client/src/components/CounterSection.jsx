import { useCountUp } from '../hooks/useCountUp';

const CounterItem = ({ end, label, suffix = "" }) => {
  const { count, ref } = useCountUp(end);
  return (
    <div ref={ref} className="text-center">
      <h3 className="text-4xl md:text-5xl font-bold text-brand-gold mb-2">
        {count}{suffix}
      </h3>
      <p className="text-lg text-white font-medium">{label}</p>
    </div>
  );
};

const CounterSection = () => {
  return (
    <section className="py-12 md:py-20 bg-brand-brown">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <CounterItem end={500} label="Clients Worldwide" suffix="+" />
          <CounterItem end={25} label="Products" suffix="+" />
          <CounterItem end={15} label="Countries Served" suffix="+" />
          <CounterItem end={10} label="Years Experience" suffix="+" />
        </div>
      </div>
    </section>
  );
};

export default CounterSection;
