import { motion } from "framer-motion";
import { Heart, Award, Shield, Users, Star, CheckCircle2, Sparkles } from "lucide-react";
import {
  PageTransition, AuroraBackground, StaggerContainer, StaggerItem,
  FadeInUp, SlideInLeft, SlideInRight, SectionLabel
} from "@/components/animations";
import { Link } from "wouter";

const VALUES = [
  {
    icon: Heart,
    title: "Compassion First",
    desc: "We treat every pet as if they were our own. Patience, love, and empathy are our primary tools.",
    color: "from-pink-500/20 to-rose-500/10",
    border: "border-pink-500/20",
    iconBg: "bg-pink-500/15",
    iconColor: "text-pink-400",
  },
  {
    icon: Award,
    title: "Premium Quality",
    desc: "From hypoallergenic shampoos to professional-grade styling tools — we never compromise.",
    color: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/20",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
  },
  {
    icon: Shield,
    title: "Safety & Hygiene",
    desc: "Strict sanitization protocols ensure a clean, safe environment every single session.",
    color: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/20",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
  },
  {
    icon: Users,
    title: "Expert Team",
    desc: "Every groomer is certified, background-checked, and handpicked for their love of animals.",
    color: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/20",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
  },
];

const TEAM = [
  { name: "Arjun Verma", role: "Founder & Head Groomer", exp: "8+ years", avatar: "A", color: "from-primary to-accent" },
  { name: "Priya Reddy", role: "Senior Pet Stylist", exp: "6+ years", avatar: "P", color: "from-pink-500 to-rose-400" },
  { name: "Mohammed Ali", role: "Certified Groomer", exp: "5+ years", avatar: "M", color: "from-amber-500 to-orange-400" },
];

export default function About() {
  return (
    <PageTransition className="pb-24">
      {/* Hero */}
      <section className="relative pt-36 pb-24 overflow-hidden">
        <AuroraBackground className="opacity-40" />
        <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <SectionLabel>
              <Sparkles className="w-3.5 h-3.5" /> Our Story
            </SectionLabel>
            <FadeInUp>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                Born from a<br />
                <span className="text-gradient">Love for Animals</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Zoophilist was founded on a simple truth: pet grooming trips were unnecessarily stressful.
                We set out to change that by bringing a premium salon experience directly to your home —
                eliminating travel anxiety and creating a calm, familiar environment for your furry family.
              </p>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* Cinematic image */}
      <section className="container mx-auto px-4 mb-24">
        <SlideInLeft>
          <div className="relative h-[400px] md:h-[520px] rounded-[2rem] overflow-hidden border border-white/8 group">
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1600&q=80&auto=format&fit=crop"
              alt="Happy dogs running"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                    "Zoophilist" — A Lover of Animals
                  </h2>
                  <p className="text-gray-300 max-w-lg">
                    Our name says everything. Every decision we make is guided by our deep love and respect for animals.
                  </p>
                </div>
                <div className="glass-dark rounded-2xl p-4 text-center min-w-[140px] border border-white/10">
                  <div className="text-2xl font-black text-primary">Pet-first</div>
                  <div className="text-xs text-muted-foreground mt-1">Care comes to you</div>
                </div>
              </div>
            </div>
          </div>
        </SlideInLeft>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-4 mb-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <SlideInLeft>
            <SectionLabel>Our Mission</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Redefining Pet<br />Care in India
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We're building India's most trusted doorstep pet grooming brand — one wagging tail at a time. Our mission is to make premium pet care accessible, stress-free, and a genuinely joyful experience.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We believe your pet's wellbeing matters. That's why we only hire certified groomers, use the finest products, and maintain the highest standards of hygiene and care.
            </p>
            <div className="space-y-3">
              {[
                "Certified groomers with 5+ years experience",
                "Premium hypoallergenic products only",
                "Fully equipped mobile grooming setup",
                "One-on-one attention for every pet",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </SlideInLeft>
          <SlideInRight>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "Doorstep", label: "Care in familiar surroundings", color: "from-primary/20 to-accent/10" },
                { value: "Tailored", label: "Service for your pet’s needs", color: "from-blue-500/20 to-cyan-500/10" },
                { value: "Equipped", label: "Professional tools brought along", color: "from-violet-500/20 to-purple-500/10" },
                { value: "Gentle", label: "Comfort-led handling", color: "from-amber-500/20 to-orange-500/10" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`rounded-2xl bg-gradient-to-br ${stat.color} border border-white/8 p-6 text-center`}
                >
                  <div className="text-4xl font-black text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </SlideInRight>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white/[0.015] border-y border-white/5 py-24 mb-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <SectionLabel>Core Values</SectionLabel>
            <FadeInUp>
              <h2 className="text-4xl md:text-5xl font-black text-white">What We Stand For</h2>
            </FadeInUp>
          </div>
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <StaggerItem key={i}>
                <div className={`h-full rounded-2xl bg-gradient-to-br ${v.color} border ${v.border} p-7 flex flex-col hover:-translate-y-1 transition-transform duration-300`}>
                  <div className={`w-12 h-12 rounded-xl ${v.iconBg} flex items-center justify-center mb-5`}>
                    <v.icon className={`w-6 h-6 ${v.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Team */}
      <section className="container mx-auto px-4 mb-24">
        <div className="text-center mb-16">
          <SectionLabel>Our Team</SectionLabel>
          <FadeInUp>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Meet the Experts</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Passionate animal lovers, certified professionals, and dedicated caretakers.
            </p>
          </FadeInUp>
        </div>
        <StaggerContainer className="grid md:grid-cols-3 gap-6">
          {TEAM.map((member, i) => (
            <StaggerItem key={i}>
              <div className="glass-card rounded-2xl p-8 text-center hover:border-white/10 transition-colors">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-2xl font-black mx-auto mb-5`}>
                  {member.avatar}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-primary text-sm font-medium mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm mb-4">{member.exp} experience</p>
                <div className="flex items-center justify-center gap-1">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4">
        <FadeInUp>
          <div className="relative rounded-[2rem] overflow-hidden border border-white/8">
            <AuroraBackground />
            <div className="relative z-10 p-12 md:p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Ready to Experience<br />
                <span className="text-gradient">Zoophilist?</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Join hundreds of happy pet parents who trust us with their most precious family members.
              </p>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 h-14 px-10 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/25"
              >
                Book an Appointment
              </Link>
            </div>
          </div>
        </FadeInUp>
      </section>
    </PageTransition>
  );
}
