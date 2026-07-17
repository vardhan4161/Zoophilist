import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Phone, ArrowRight, Sparkles, Star, Heart, Hash } from "lucide-react";
import { PageTransition, AuroraBackground } from "@/components/animations";

export default function BookingSuccess() {
  const bookingRef = new URLSearchParams(window.location.search).get("ref");

  return (
    <PageTransition>
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <AuroraBackground />
        <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center max-w-2xl py-24">
          {/* Animated success icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="relative mb-8"
          >
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/40">
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </div>
            {/* Orbiting stars */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }}
                style={{
                  top: "50%",
                  left: "50%",
                  transformOrigin: `${50 + (i + 1) * 20}px 0px`,
                  marginTop: "-10px",
                  marginLeft: "-10px",
                }}
              >
                <Star className="w-2.5 h-2.5 text-primary fill-primary" />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Booking Received
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              Your Pet is in<br />
              <span className="text-gradient">Good Hands!</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              We've received your booking request and our team will confirm your appointment shortly.
              Expect a call or WhatsApp message within 2 hours.
            </p>

            {/* Booking reference */}
            {bookingRef && (
              <div className="w-full rounded-2xl bg-primary/8 border border-primary/30 p-5 mb-8">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Hash className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">Booking Reference</span>
                </div>
                <div className="text-2xl font-black text-primary tracking-widest">{bookingRef}</div>
                <div className="text-xs text-muted-foreground mt-1">Save this — you'll need it to track your appointment</div>
              </div>
            )}
          </motion.div>

          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid sm:grid-cols-3 gap-4 w-full mb-10"
          >
            {[
              { icon: Phone, title: "Quick Confirmation", desc: "We'll call within 2 hours to confirm your slot." },
              { icon: Calendar, title: "Groomer Assigned", desc: "A certified groomer will be assigned to your pet." },
              { icon: Heart, title: "Ready to Pamper", desc: "Sit back — your pet is about to have an amazing day!" },
            ].map((card, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-sm font-bold text-white mb-1">{card.title}</div>
                <div className="text-xs text-muted-foreground">{card.desc}</div>
              </div>
            ))}
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="w-full rounded-2xl bg-primary/8 border border-primary/20 p-6 mb-10"
          >
            <p className="text-sm text-muted-foreground mb-2">Questions? Reach us directly:</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="tel:+919515247704" className="flex items-center gap-2 text-white font-bold hover:text-primary transition-colors">
                <Phone className="w-4 h-4 text-primary" />
                +91 9515247704
              </a>
              <span className="hidden sm:block text-white/20">|</span>
              <a href="mailto:zoophilistpetservice@gmail.com" className="flex items-center gap-2 text-white font-bold hover:text-primary transition-colors text-sm">
                zoophilistpetservice@gmail.com
              </a>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
            >
              Explore More Services
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 h-12 px-7 rounded-full glass border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
            >
              Back to Home
            </Link>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
