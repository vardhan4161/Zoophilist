import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  CheckCircle2, Star, ShieldCheck, Clock, Scissors, Heart, ArrowRight,
  Sparkles, MapPin, Calendar, BadgeCheck, ChevronRight, Zap
} from "lucide-react";
import {
  PageTransition, AuroraBackground, StaggerContainer, StaggerItem,
  FadeInUp, SlideInLeft, SlideInRight, AnimatedCounter, SectionLabel, FloatingCard
} from "@/components/animations";
import { STATIC_SERVICES } from "@/lib/constants";
import { useGetServices } from "@workspace/api-client-react";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Book Online",
    desc: "Choose your service, pick a date & time slot, and fill in your pet's details in under 2 minutes.",
    icon: Calendar,
  },
  {
    step: "02",
    title: "We Come To You",
    desc: "Our certified groomer arrives at your doorstep, fully equipped with premium salon-grade tools.",
    icon: MapPin,
  },
  {
    step: "03",
    title: "Sit Back & Relax",
    desc: "Your pet gets pampered in their familiar environment. No travel stress, no waiting rooms.",
    icon: Sparkles,
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "Absolutely incredible service! My Golden Retriever Max used to dread grooming trips. Now he actually waits at the door for them!",
    pet: "Golden Retriever",
    avatar: "P",
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "Rohan Mehra",
    location: "Bangalore",
    rating: 5,
    text: "The groomer was so professional and gentle. My cat Whiskers is usually very anxious but was completely calm throughout.",
    pet: "Persian Cat",
    avatar: "R",
    color: "from-violet-500 to-indigo-500",
  },
  {
    name: "Ananya Patel",
    location: "Hyderabad",
    rating: 5,
    text: "Best decision ever! The monthly subscription is a steal. My Pomeranian looks like she just walked out of a luxury salon every time.",
    pet: "Pomeranian",
    avatar: "A",
    color: "from-amber-500 to-orange-500",
  },
];

const WHY_US = [
  { title: "Doorstep Convenience", desc: "No car rides, no waiting — we come to your home, fully equipped." },
  { title: "Certified Groomers", desc: "Every groomer is trained, background-checked, and a certified animal lover." },
  { title: "Premium Products", desc: "Hypoallergenic, pet-safe shampoos and professional-grade tools only." },
  { title: "Strict Hygiene", desc: "All tools sanitized between appointments. Your pet's safety is our priority." },
];

export default function Home() {
  const { data: apiServices } = useGetServices();
  const services = apiServices?.length ? apiServices : STATIC_SERVICES;
  const popularServices = services.slice(0, 3);

  return (
    <PageTransition>
      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <AuroraBackground />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

        {/* Cinematic image backdrop (Direction A) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-background/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1600&q=80&auto=format&fit=crop"
            alt="Professional pet grooming"
            className="w-full h-full object-cover object-right opacity-25 mix-blend-luminosity"
            loading="eager"
          />
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Editorial headline (Direction A) */}
            <SlideInLeft>
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-8"
                >
                  <Star className="w-3.5 h-3.5 fill-primary" />
                  <span>India's #1 Premium Doorstep Grooming</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[0.95] text-white mb-6"
                >
                  Because<br />
                  Your Pets<br />
                  <span className="text-gradient">Deserve<br />the Best.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="text-lg text-gray-400 mb-10 max-w-xl leading-relaxed"
                >
                  Professional grooming delivered to your doorstep by certified experts.
                  Stress-free, premium, and completely tailored to your pet.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="flex flex-wrap gap-4"
                >
                  <Link
                    href="/book"
                    className="inline-flex items-center gap-2 h-14 px-8 rounded-full bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-all duration-200 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5"
                  >
                    Book an Appointment
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 h-14 px-8 rounded-full glass border border-white/10 text-white font-semibold text-base hover:bg-white/10 transition-all duration-200"
                  >
                    View Services
                  </Link>
                </motion.div>

                {/* Social proof */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="mt-10 flex items-center gap-6"
                >
                  <div className="flex -space-x-3">
                    {["P", "R", "A", "M"].map((letter, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center text-white text-xs font-bold"
                      >
                        {letter}
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-background bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      +
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-white font-bold text-sm ml-1">4.9</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Trusted by 500+ pet parents</p>
                  </div>
                </motion.div>
              </div>
            </SlideInLeft>

            {/* Right: Floating booking confirmation card (Direction B) */}
            <SlideInRight className="hidden lg:flex flex-col items-center justify-center gap-5">
              <FloatingCard delay={0}>
                <div className="glass-dark rounded-2xl p-5 border border-white/10 shadow-2xl w-80">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      BOOKING CONFIRMED
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/25">
                      <BadgeCheck className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-semibold text-primary">Confirmed</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Premium Spa Bath</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-white font-bold text-sm">
                      R
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Rahul Sharma</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        Senior Stylist
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 ml-1" />
                        <span className="text-amber-400">4.9</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-xs text-muted-foreground mb-1">Date</div>
                      <div className="text-sm font-semibold text-white">Tomorrow, 10 AM</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-xs text-muted-foreground mb-1">Location</div>
                      <div className="text-sm font-semibold text-white">Your Home</div>
                    </div>
                  </div>
                  <div className="border-t border-white/8 pt-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Amount</span>
                    <span className="text-lg font-bold text-primary">₹899</span>
                  </div>
                </div>
              </FloatingCard>

              <FloatingCard delay={1.5}>
                <div className="glass-dark rounded-2xl p-4 border border-white/10 shadow-xl w-72 -mt-3 ml-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Max looks amazing! ✨</div>
                      <div className="text-xs text-muted-foreground">Just groomed • 5 min ago</div>
                    </div>
                  </div>
                </div>
              </FloatingCard>
            </SlideInRight>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ─── STATS STRIP ───────────────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-white/[0.015] py-8">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-white/5">
            {[
              { value: 500, suffix: "+", label: "Happy Pets", icon: Heart },
              { value: 1000, suffix: "+", label: "Sessions Done", icon: Scissors },
              { value: 4.9, suffix: "★", label: "Average Rating", icon: Star },
              { value: 10, suffix: "+", label: "Expert Groomers", icon: ShieldCheck },
            ].map((stat, i) => (
              <StaggerItem key={i} className="flex flex-col items-center text-center px-4 py-2">
                <stat.icon className="w-5 h-5 text-primary mb-2" />
                <div className="text-3xl font-black text-white tabular-nums">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">{stat.label}</div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section className="py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <SectionLabel>Simple Process</SectionLabel>
            <FadeInUp>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                How Zoophilist Works
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Premium grooming at your doorstep in three effortless steps.
              </p>
            </FadeInUp>
          </div>

          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-16 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <StaggerContainer className="grid md:grid-cols-3 gap-8 relative">
              {HOW_IT_WORKS.map((step, i) => (
                <StaggerItem key={i}>
                  <div className="relative text-center group">
                    <div className="relative inline-flex">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 mx-auto group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:scale-110 transition-all duration-300">
                        <step.icon className="w-7 h-7 text-primary" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-white/10 flex items-center justify-center">
                        <span className="text-[10px] font-black text-primary">{step.step}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          <FadeInUp delay={0.3} className="text-center mt-12">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-primary/10 border border-primary/25 text-primary font-semibold hover:bg-primary/20 transition-all duration-200"
            >
              Get Started Today
              <ChevronRight className="w-4 h-4" />
            </Link>
          </FadeInUp>
        </div>
      </section>

      {/* ─── SERVICES PREVIEW ──────────────────────────────────────────── */}
      <section className="py-28 bg-white/[0.015] border-y border-white/5 relative overflow-hidden">
        <AuroraBackground className="opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <SectionLabel>Our Services</SectionLabel>
              <FadeInUp>
                <h2 className="text-4xl md:text-5xl font-black text-white">
                  Premium Grooming<br />Packages
                </h2>
              </FadeInUp>
            </div>
            <FadeInUp>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors shrink-0"
              >
                View all services <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeInUp>
          </div>

          <StaggerContainer className="grid md:grid-cols-3 gap-6">
            {popularServices.map((service) => (
              <StaggerItem key={service.id} className="h-full">
                <div className="relative h-full glass-card rounded-2xl p-7 flex flex-col overflow-hidden group hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
                  {/* Gradient hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

                  {(service as any).badge && (
                    <div className="absolute top-5 right-5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-bold uppercase tracking-wide">
                      {(service as any).badge}
                    </div>
                  )}

                  <div className="mb-2">
                    <h3 className="text-xl font-bold text-white">{service.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-2 mb-5">
                    <span className="text-4xl font-black text-primary">₹{service.price}</span>
                    {(service as any).originalPrice && (
                      <span className="text-muted-foreground line-through text-base">₹{(service as any).originalPrice}</span>
                    )}
                  </div>
                  {service.description && (
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                  )}

                  <div className="space-y-2.5 flex-grow mb-6">
                    {service.features.slice(0, 5).map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-sm text-gray-300">{f}</span>
                      </div>
                    ))}
                    {service.features.length > 5 && (
                      <div className="text-xs text-muted-foreground pl-7">
                        +{service.features.length - 5} more included
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/book?service=${service.id}`}
                    className="flex items-center justify-center gap-2 h-11 rounded-xl bg-primary/10 border border-primary/20 text-primary font-semibold text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                  >
                    Book This Service
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─────────────────────────────────────────────── */}
      <section className="py-28">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image block (Direction A element) */}
            <SlideInLeft>
              <div className="relative">
                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/8">
                  <img
                    src="https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=800&q=80&auto=format&fit=crop"
                    alt="Professional groomer with pet"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>

                {/* Floating stat cards */}
                <FloatingCard className="absolute -bottom-5 -right-5 glass-dark rounded-2xl p-4 border border-white/10 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-white">5,000+</div>
                      <div className="text-xs text-muted-foreground">Pets Groomed</div>
                    </div>
                  </div>
                </FloatingCard>

                <FloatingCard delay={2} className="absolute -top-5 -left-5 glass-dark rounded-2xl p-3.5 border border-white/10 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-white">4.9/5</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">From 500+ reviews</div>
                </FloatingCard>
              </div>
            </SlideInLeft>

            {/* Content */}
            <SlideInRight>
              <SectionLabel>Why Zoophilist</SectionLabel>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                The Premium Choice<br />for Your Pet
              </h2>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                We believe pet grooming should be stress-free and luxurious — not a chore. By coming to you, we eliminate travel anxiety and deliver focused, one-on-one attention your pet deserves.
              </p>

              <div className="space-y-5">
                {WHY_US.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-0.5">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Learn more about us <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </SlideInRight>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="py-28 bg-white/[0.015] border-y border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <SectionLabel>Love from Pet Parents</SectionLabel>
            <FadeInUp>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                What Our Customers Say
              </h2>
            </FadeInUp>
          </div>

          <StaggerContainer className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <StaggerItem key={i}>
                <div className="glass-card rounded-2xl p-7 h-full flex flex-col hover:border-white/10 transition-all duration-300 group">
                  <div className="flex items-center gap-1 mb-5">
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed flex-grow mb-6">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3 border-t border-white/5 pt-5">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.location} · {t.pet}</div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeInUp delay={0.2} className="text-center mt-10">
            <Link
              href="/success-stories"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Read all success stories <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeInUp>
        </div>
      </section>

      {/* ─── CTA SECTION ───────────────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <AuroraBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <FadeInUp>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                Limited Slots Available
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                Give Your Pet the<br />
                <span className="text-gradient">Royal Treatment</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                Join 500+ happy pet parents who trust Zoophilist for premium doorstep grooming. Your pet deserves nothing less.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 h-14 px-10 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all duration-200 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 w-full sm:w-auto justify-center"
                >
                  Book Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="tel:+919515247704"
                  className="inline-flex items-center gap-2 h-14 px-10 rounded-full glass border border-white/10 text-white font-semibold text-base hover:bg-white/10 transition-all duration-200 w-full sm:w-auto justify-center"
                >
                  <Clock className="w-5 h-5" />
                  Call +91 9515247704
                </a>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* ─── FLOATING CTA PILL ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="relative">
          {/* Pulsing ring */}
          <div className="absolute -inset-1 rounded-full bg-primary/40 animate-ping opacity-60" style={{ animationDuration: "2s" }} />
          <Link
            href="/book"
            className="relative flex items-center gap-2 h-13 px-5 rounded-full bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/30 hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-200"
          >
            <Sparkles className="w-4 h-4" />
            Book Now
          </Link>
        </div>
      </motion.div>
    </PageTransition>
  );
}
