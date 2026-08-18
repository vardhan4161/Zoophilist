import React from 'react';
import { motion } from 'framer-motion';
import { 
  PawPrint, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Scissors, 
  Bath, 
  Sparkles,
  Calendar,
  MapPin,
  ShieldCheck,
  Heart,
  Instagram,
  Twitter,
  Facebook
} from 'lucide-react';

const DirectionB = () => {
  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white font-sans overflow-x-hidden selection:bg-[#22c55e]/30 relative">
      
      {/* Background System */}
      <div className="fixed inset-0 pointer-events-none z-0 flex justify-center">
        {/* Subtle CSS Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        {/* Top Glow */}
        <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-[#22c55e]/[0.03] to-transparent blur-3xl"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl h-14 rounded-full border border-white/10 bg-[#0a0f0a]/60 backdrop-blur-xl flex items-center justify-between px-2 pr-2 shadow-2xl">
        <div className="flex items-center gap-2 pl-4">
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-[#22c55e]">
            <PawPrint size={16} />
          </div>
          <span className="font-semibold tracking-wide text-sm">Zoophilist</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Services</a>
          <a href="#" className="hover:text-white transition-colors">How it Works</a>
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>

        <button className="h-10 px-6 rounded-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-black font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
          Book Now
        </button>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-40 pb-32 px-6 max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-16 min-h-[70vh]">
          {/* Left Column - 55% */}
          <div className="w-full lg:w-[55%]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-gray-300 mb-8"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#22c55e] animate-pulse"></span>
              India's Premium Doorstep Pet Care
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-[72px] leading-[1.1] tracking-tight mb-8"
            >
              <span className="font-normal block text-gray-200">Because Your Pets</span>
              <span className="font-bold block">Deserve the Best<span className="text-[#22c55e]">.</span></span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="text-base md:text-lg text-gray-400 max-w-lg mb-10 leading-relaxed"
            >
              Experience stress-free, professional grooming right at your doorstep. 
              Certified stylists, premium products, and zero travel anxiety.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
              className="flex items-center gap-4"
            >
              <button className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2">
                Schedule a Session <ArrowRight size={18} />
              </button>
              <button className="px-8 py-4 rounded-full border border-white/10 bg-white/[0.02] text-white font-medium hover:bg-white/[0.05] transition-colors">
                View Pricing
              </button>
            </motion.div>
          </div>

          {/* Right Column - 45% (Live Booking UI Mockup) */}
          <div className="w-full lg:w-[45%] relative">
            <motion.div 
              animate={{ y: [-8, 8, -8] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="w-full max-w-sm mx-auto rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl p-6 shadow-[0_0_50px_rgba(34,197,94,0.1)] relative"
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Booking Confirmed</div>
                  <div className="text-xl font-bold">Premium Spa Bath</div>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 text-xs font-medium flex items-center gap-1.5">
                  <CheckCircle2 size={12} /> Confirmed
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" alt="Groomer" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Rahul Sharma</div>
                    <div className="text-xs text-gray-400">Senior Stylist • ⭐ 4.9</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <Calendar size={14} className="text-gray-400 mb-2" />
                    <div className="text-xs text-gray-500 mb-0.5">Date</div>
                    <div className="text-sm font-medium">Tomorrow, 10 AM</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <MapPin size={14} className="text-gray-400 mb-2" />
                    <div className="text-xs text-gray-500 mb-0.5">Location</div>
                    <div className="text-sm font-medium">Home Address</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="text-sm text-gray-400">Total Amount</div>
                <div className="text-lg font-bold">₹899</div>
              </div>
            </motion.div>

            {/* Decorative elements around mockup */}
            <div className="absolute top-10 -right-4 w-24 h-24 bg-[#22c55e]/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-10 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-20 py-8 border-y border-white/5 relative overflow-hidden flex justify-center">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0f0a] to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0f0a] to-transparent z-10"></div>
          
          <div className="flex gap-4 lg:gap-8 items-center animate-[marquee_20s_linear_infinite] whitespace-nowrap px-4">
            {[
              { icon: "🐾", text: "5,000+ Pets Groomed" },
              { icon: "⭐", text: "4.9/5 Average Rating" },
              { icon: "🏠", text: "Doorstep Convenience" },
              { icon: "✅", text: "Certified Professionals" },
              { icon: "🐾", text: "5,000+ Pets Groomed" },
              { icon: "⭐", text: "4.9/5 Average Rating" },
            ].map((badge, i) => (
              <div key={i} className="px-5 py-2.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-sm text-sm text-gray-300 flex items-center gap-2">
                <span>{badge.icon}</span>
                <span className="tracking-wide">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Process Section */}
        <div className="mt-40">
          <div className="text-center mb-16">
            <div className="text-xs font-bold text-[#22c55e] uppercase tracking-[0.2em] mb-4">How It Works</div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Seamless From Start to Finish</h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-[1px] border-t border-dashed border-white/20"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { step: "01", icon: Calendar, title: "Book Online", desc: "Select your service, choose a time slot, and confirm in seconds." },
                { step: "02", icon: MapPin, title: "We Arrive", desc: "Our fully-equipped van arrives at your doorstep on schedule." },
                { step: "03", icon: Heart, title: "Happy Pet", desc: "Your pet enjoys a stress-free grooming session near you." }
              ].map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.6 }}
                  key={item.step} 
                  className="relative z-10 flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 rounded-2xl border border-white/10 bg-[#0a0f0a] flex items-center justify-center mb-6 relative group-hover:border-[#22c55e]/50 transition-colors">
                    <div className="absolute -top-3 -right-3 text-[10px] font-bold text-gray-500 bg-[#0a0f0a] px-1">{item.step}</div>
                    <item.icon className="text-gray-400 group-hover:text-[#22c55e] transition-colors" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-[220px]">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mt-40">
          <div className="mb-16">
            <div className="text-xs font-bold text-[#22c55e] uppercase tracking-[0.2em] mb-4">Our Services</div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-md">Expert care tailored for your companion.</h2>
              <button className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors group pb-2">
                View full menu <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Spa Bath", price: "899", icon: Bath, features: ["Warm water wash", "Blow dry & brush", "Nail clipping", "Ear cleaning"] },
              { name: "Hair Cut", price: "1199", icon: Scissors, features: ["Breed specific cut", "De-shedding", "Sanitary trim", "Paw pad trim"] },
              { name: "Full Grooming", price: "1599", icon: Sparkles, features: ["Everything in Spa Bath", "Everything in Hair Cut", "Teeth brushing", "Perfume spritz"] }
            ].map((service, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                key={service.name}
                className="group relative h-[420px] rounded-2xl bg-[#0d120d] border border-white/5 overflow-hidden flex flex-col p-8 hover:bg-white/[0.03] transition-colors"
              >
                {/* Thin Gradient Top Border */}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#22c55e]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#22c55e]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 flex justify-between items-start mb-auto">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 group-hover:text-[#22c55e] transition-colors">
                    <service.icon size={20} />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Starting at</div>
                    <div className="text-xl font-medium tracking-tight">₹{service.price}</div>
                  </div>
                </div>

                <div className="relative z-10 mt-8">
                  <h3 className="text-2xl font-bold tracking-tight mb-6 group-hover:text-[#22c55e] transition-colors">{service.name}</h3>
                  <ul className="space-y-3">
                    {service.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm text-gray-400">
                        <CheckCircle2 size={14} className="text-[#22c55e]/70" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full mt-8 py-3 rounded-lg border border-white/10 bg-white/[0.02] text-sm font-medium hover:bg-white/[0.08] transition-colors">
                    Select Plan
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why Us Section */}
        <div className="mt-40">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Why Choose Zoophilist</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Clock, title: "Zero Travel Time", desc: "Save hours of commuting and waiting. We bring the entire salon experience directly to your parking lot." },
              { icon: ShieldCheck, title: "Certified Groomers", desc: "Our staff undergo rigorous training and certification to handle pets of all temperaments safely." },
              { icon: Heart, title: "Stress-Free Environment", desc: "No cages, no other pets. Just one-on-one attention in a familiar, comfortable setting for your pet." },
              { icon: Sparkles, title: "Premium Products", desc: "We use only high-end, hypoallergenic shampoos and conditioners tailored to your pet's specific coat type." }
            ].map((feature, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                key={feature.title}
                className={`p-8 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors ${i % 2 === 1 ? 'md:mt-12' : ''}`}
              >
                <div className="w-12 h-12 rounded-full bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 flex items-center justify-center mb-6">
                  <feature.icon size={20} />
                </div>
                <h4 className="text-xl font-medium mb-3 tracking-tight">{feature.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 bg-[#050805] relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            
            {/* Brand Col */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-[#22c55e]">
                  <PawPrint size={16} />
                </div>
                <span className="font-semibold tracking-wide text-lg">Zoophilist</span>
              </div>
              <p className="text-sm text-gray-400 mb-8 max-w-xs leading-relaxed">
                Precision pet grooming delivered to your doorstep. Setting the new standard for pet care in India.
              </p>
              <div className="flex items-center gap-4">
                {[Instagram, Twitter, Facebook].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="md:col-span-2 md:col-start-7">
              <h4 className="text-sm font-semibold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-sm font-semibold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="md:col-span-2">
              <h4 className="text-sm font-semibold mb-6">Contact</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li>support@zoophilist.in</li>
                <li>+91 98765 43210</li>
                <li className="pt-2">
                  <div className="w-2 h-2 rounded-full bg-[#22c55e] inline-block mr-2 animate-pulse"></div>
                  Support available 9AM - 8PM
                </li>
              </ul>
            </div>
            
          </div>

          <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Zoophilist. All rights reserved.</p>
            <p>Designed with <span className="text-[#22c55e]">♥</span> in India.</p>
          </div>
        </div>
      </footer>

      {/* Floating CTA */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button className="relative group px-6 py-3.5 rounded-full bg-white text-black font-semibold text-sm flex items-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
          <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping opacity-20 group-hover:opacity-40"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></div>
          Book Now
        </button>
      </motion.div>

      {/* Keyframes for Marquee */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
};

export default DirectionB;