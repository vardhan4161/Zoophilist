import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Sparkles, MessageSquare } from "lucide-react";
import { PageTransition, AuroraBackground, FadeInUp, SlideInLeft, SlideInRight, SectionLabel } from "@/components/animations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const CONTACT_INFO = [
  {
    icon: Phone,
    label: "Phone",
    value: "+91 9515247704",
    href: "tel:+919515247704",
    desc: "Mon–Sun, 8 AM – 8 PM",
    color: "bg-green-500/15 border-green-500/20 text-green-400",
  },
  {
    icon: Mail,
    label: "Email",
    value: "zoophilistpetservice@gmail.com",
    href: "mailto:zoophilistpetservice@gmail.com",
    desc: "Typically reply within 4 hours",
    color: "bg-blue-500/15 border-blue-500/20 text-blue-400",
  },
  {
    icon: MapPin,
    label: "Service Area",
    value: "Doorstep across India",
    href: undefined,
    desc: "Hyderabad, Bangalore, Mumbai & more",
    color: "bg-violet-500/15 border-violet-500/20 text-violet-400",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "8:00 AM – 8:00 PM",
    href: undefined,
    desc: "7 days a week, including holidays",
    color: "bg-amber-500/15 border-amber-500/20 text-amber-400",
  },
];

const FAQS = [
  {
    q: "How far in advance should I book?",
    a: "We recommend booking at least 24–48 hours in advance for your preferred time slot. Same-day appointments may be available based on groomer availability.",
  },
  {
    q: "What areas do you currently serve?",
    a: "We currently serve Hyderabad, Bangalore, Mumbai, and select suburbs. We're expanding rapidly — contact us to check availability in your area.",
  },
  {
    q: "What if my pet is aggressive or anxious?",
    a: "Our groomers are trained to handle anxious and difficult pets with patience and care. Please mention this when booking so we can prepare appropriately.",
  },
  {
    q: "Do you offer emergency grooming?",
    a: "Yes! For urgent grooming needs, please call us directly at +91 9515247704 and we'll do our best to accommodate you.",
  },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageTransition className="pb-24">
      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <AuroraBackground className="opacity-40" />
        <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <SectionLabel>
            <MessageSquare className="w-3.5 h-3.5" /> Get in Touch
          </SectionLabel>
          <FadeInUp>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5 tracking-tight">
              We'd Love to Hear<br />From You
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Questions about our services? Want to schedule a session? Reach out — our team responds within hours.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Contact info cards */}
      <section className="container mx-auto px-4 mb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONTACT_INFO.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              {item.href ? (
                <a href={item.href} className="block glass-card rounded-2xl p-6 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 group h-full">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">{item.label}</div>
                  <div className="font-bold text-white text-sm mb-1 group-hover:text-primary transition-colors break-all">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </a>
              ) : (
                <div className="glass-card rounded-2xl p-6 h-full">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">{item.label}</div>
                  <div className="font-bold text-white text-sm mb-1">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form + FAQ */}
      <section className="container mx-auto px-4 mb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <SlideInLeft>
            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-black text-white mb-2">Send us a Message</h2>
              <p className="text-muted-foreground text-sm mb-8">We'll get back to you within a few hours.</p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground text-sm">
                    Thank you for reaching out. We'll reply within a few hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", message: "" }); }}
                    className="mt-6 text-sm text-primary hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-gray-300 text-sm">Full Name *</Label>
                      <Input
                        required
                        placeholder="John Doe"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="bg-black/20 border-white/10 focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300 text-sm">Phone *</Label>
                      <Input
                        required
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="bg-black/20 border-white/10 focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm">Email</Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="bg-black/20 border-white/10 focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm">Message *</Label>
                    <Textarea
                      required
                      rows={5}
                      placeholder="Tell us how we can help your pet..."
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="bg-black/20 border-white/10 focus:border-primary/50 resize-none transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </SlideInLeft>

          {/* FAQ */}
          <SlideInRight>
            <div>
              <h2 className="text-2xl font-black text-white mb-8">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {FAQS.map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="glass-card rounded-xl p-6"
                  >
                    <h4 className="font-bold text-white mb-2 text-sm">{faq.q}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                ))}
              </div>

              {/* Direct CTA */}
              <div className="mt-8 rounded-2xl bg-primary/10 border border-primary/20 p-6 text-center">
                <Sparkles className="w-6 h-6 text-primary mx-auto mb-3" />
                <h3 className="font-bold text-white mb-2">Ready to book?</h3>
                <p className="text-sm text-muted-foreground mb-4">Skip the messages — book directly and confirm your slot in minutes.</p>
                <a
                  href="/book"
                  className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors"
                >
                  Book an Appointment
                </a>
              </div>
            </div>
          </SlideInRight>
        </div>
      </section>
    </PageTransition>
  );
}
