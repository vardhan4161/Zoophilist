import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PawPrint, Star, CheckCircle2, ArrowRight, Clock, MapPin, Quote, Play, ChevronRight, Phone, Mail } from 'lucide-react';

export default function DirectionA() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headline = "Because Your Pets Deserve the Best.";
  const words = headline.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60, damping: 20 } }
  };

  const services = [
    { name: "Spa Bath", price: "899", features: ["Deep Cleanse", "Blow Dry", "Ear Cleaning"] },
    { name: "Full Grooming", price: "1599", features: ["Haircut", "Nail Clipping", "Teeth Brushing", "Spa Bath"] },
    { name: "Hair Cut", price: "1199", features: ["Breed Specific Trim", "Sanitary Cut", "Paw Trimming"] }
  ];

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-zinc-200 font-sans selection:bg-green-500/30 selection:text-white">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#0a0f0a]/70 backdrop-blur-xl py-3 border-b border-green-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)]' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative">
              <PawPrint className="w-8 h-8 text-green-500 group-hover:text-green-400 transition-colors" strokeWidth={1.5} />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Zoophilist</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            {['Home', 'About', 'Services', 'Gallery', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-green-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all backdrop-blur-sm border border-white/10 hover:border-white/30 hidden md:block">
            Book Now
          </button>
        </div>
        {scrolled && (
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative w-full h-screen min-h-[700px] flex items-center overflow-hidden">
        {/* Background Image & Gradients */}
        <div className="absolute right-0 top-0 w-full lg:w-[65%] h-full z-0">
          <img 
            src="/images/hero.jpg" 
            alt="Premium Pet Grooming" 
            className="w-full h-full object-cover object-[60%_center] opacity-40 lg:opacity-100"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {/* Horizontal dramatic fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f0a] via-[#0a0f0a]/95 to-transparent"></div>
          {/* Vertical fade for blending */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f0a] via-transparent to-[#0a0f0a]"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 md:px-12 relative z-10 w-full flex pt-20">
          <div className="max-w-3xl w-full lg:w-2/3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 text-sm font-semibold mb-8 shadow-[0_0_20px_rgba(34,197,94,0.15)]"
            >
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></div>
              Premium Doorstep Grooming
            </motion.div>

            <motion.h1 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="text-5xl md:text-7xl lg:text-[96px] font-black leading-[0.9] tracking-[-0.03em] text-white mb-8"
            >
              {words.map((word, i) => (
                <motion.span key={i} variants={wordVariants} className="inline-block mr-[0.25em]">
                  {i > 2 ? (
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-green-300 to-green-600 drop-shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                      {word}
                    </span>
                  ) : (
                    word
                  )}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="text-lg md:text-xl text-zinc-400 max-w-xl mb-10 font-light leading-relaxed"
            >
              Experience the pinnacle of pet care. Expert grooming delivered directly to your doorstep in an environment your pet knows and loves.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex flex-wrap items-center gap-4"
            >
              <button className="group relative px-8 py-4 rounded-full bg-green-500 text-[#0a0f0a] font-bold text-lg overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_50px_rgba(34,197,94,0.5)] transition-all duration-300">
                <span className="relative z-10 flex items-center gap-2">
                  Book Appointment <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <button className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold text-lg hover:bg-white/5 hover:border-white/40 transition-all duration-300 flex items-center gap-2">
                <Play className="w-5 h-5" /> See it in action
              </button>
            </motion.div>

            {/* Social Proof */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-12 flex items-center gap-4"
            >
              <div className="flex -space-x-3">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0f0a] overflow-hidden bg-zinc-800">
                    <img 
                      src={`https://i.pravatar.cc/100?img=${i+10}`} 
                      alt="User avatar" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-green-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-sm font-medium text-zinc-400">Over 500+ Happy Pets</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="relative z-20 -mt-10 mx-6 md:mx-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-zinc-900/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-x-0 md:divide-x divide-white/10"
        >
          {[
            { label: "Happy Pets", value: "500+" },
            { label: "Customer Rating", value: "4.9★" },
            { label: "Active Cities", value: "3" },
            { label: "Doorstep Service", value: "100%" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center px-4">
              <span className="text-zinc-400 text-sm md:text-base font-medium tracking-wide uppercase mb-2">{stat.label}</span>
              <span className="text-4xl md:text-5xl font-black text-white tracking-tight">{stat.value}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-6 md:px-12 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[500px] bg-green-500/5 blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight inline-block relative">
              Our Premium Services
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-green-600 to-green-400 rounded-full"></div>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto mt-8">Bespoke grooming experiences tailored for the comfort and well-being of your companion.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="group bg-zinc-900/40 rounded-[2rem] p-8 md:p-10 transition-all duration-500 hover:bg-zinc-800/80 hover:shadow-[0_0_40px_rgba(34,197,94,0.15)] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 text-green-500">
                  <PawPrint className="w-24 h-24" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2 relative z-10">{service.name}</h3>
                <div className="text-green-500 text-4xl font-black mb-8 relative z-10 tracking-tighter">
                  ₹{service.price}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-10 relative z-10">
                  {service.features.map((feature, fIdx) => (
                    <span key={fIdx} className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-medium text-zinc-300 backdrop-blur-md">
                      {feature}
                    </span>
                  ))}
                </div>

                <button className="w-full py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold group-hover:bg-green-500 group-hover:text-[#0a0f0a] group-hover:border-transparent transition-all duration-300 relative z-10 flex items-center justify-center gap-2">
                  Select Package <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-32 bg-zinc-950 border-y border-white/5 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -left-32 top-1/4 w-[500px] h-[500px] bg-green-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute -top-12 -left-8 text-[180px] font-black text-white/5 leading-none select-none">
                  "
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight relative z-10">
                  The standard of care your pet <span className="text-green-500 italic font-serif font-medium">deserves.</span>
                </h2>
                
                <div className="space-y-8 mt-12 relative z-10">
                  {[
                    { title: "Zero Stress", desc: "No more anxious car rides or unfamiliar cages. We come to your home where your pet feels safe." },
                    { title: "Premium Products", desc: "We exclusively use organic, hypoallergenic shampoos and conditioners suited for your pet's coat." },
                    { title: "Certified Stylists", desc: "Our groomers undergo rigorous training and background checks before they ever meet your companion." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-6 group">
                      <div className="mt-1 flex-shrink-0 w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 group-hover:bg-green-500 group-hover:border-green-500 transition-all duration-300">
                        <CheckCircle2 className="w-6 h-6 text-green-500 group-hover:text-[#0a0f0a] transition-colors" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                        <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            
            <div className="order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative h-[600px] rounded-[3rem] overflow-hidden"
              >
                <img 
                  src="/images/gallery-1.jpg" 
                  alt="Pet Grooming" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=1500&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0a]/90 via-transparent to-transparent"></div>
                
                {/* Overlay Card */}
                <div className="absolute bottom-10 left-10 right-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 text-[#0a0f0a]">
                    <Star className="w-8 h-8 fill-current" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white">4.9/5</div>
                    <div className="text-zinc-300 text-sm font-medium">Average rating from 500+ reviews</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050805] pt-24 pb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <PawPrint className="w-8 h-8 text-green-500" />
                <span className="text-2xl font-bold tracking-tight text-white">Zoophilist</span>
              </div>
              <p className="text-zinc-500 leading-relaxed mb-8">
                Elevating pet care through premium doorstep grooming experiences across India.
              </p>
              <div className="flex items-center gap-4">
                {/* Social icons placeholders */}
                {[1,2,3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-green-500 transition-all cursor-pointer">
                    <div className="w-4 h-4 bg-zinc-400 rounded-sm"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Navigation</h4>
              <ul className="space-y-4">
                {['Home', 'About Us', 'Services', 'Gallery', 'Reviews'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-zinc-400 hover:text-green-400 transition-colors flex items-center gap-2 group">
                      <ChevronRight className="w-3 h-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Services</h4>
              <ul className="space-y-4">
                {['Spa Bath', 'Full Grooming', 'Hair Cut', 'Nail Trimming', 'De-shedding'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-zinc-400 hover:text-green-400 transition-colors flex items-center gap-2 group">
                      <ChevronRight className="w-3 h-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-zinc-400">
                  <MapPin className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Available in Mumbai, Delhi & Bangalore</span>
                </li>
                <li className="flex items-center gap-3 text-zinc-400">
                  <Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-3 text-zinc-400">
                  <Mail className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>hello@zoophilist.in</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-600 text-sm">
              © {new Date().getFullYear()} Zoophilist Premium Pet Care. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-zinc-600">
              <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating CTA */}
      <motion.button 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 200, damping: 20 }}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-green-500 text-[#0a0f0a] px-6 py-4 rounded-full font-bold shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_50px_rgba(34,197,94,0.6)] hover:-translate-y-1 transition-all duration-300 group"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0a0f0a] opacity-40"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0a0f0a]"></span>
        </span>
        Book Now
      </motion.button>
    </div>
  );
}
