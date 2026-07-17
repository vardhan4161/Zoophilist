import { motion } from "framer-motion";
import { Star, Heart, ArrowRight, Sparkles, Quote } from "lucide-react";
import { PageTransition, AuroraBackground, StaggerContainer, StaggerItem, FadeInUp, SectionLabel } from "@/components/animations";
import { Link } from "wouter";

const STORIES = [
  {
    name: "Priya Sharma",
    pet: "Max",
    petType: "Golden Retriever",
    location: "Mumbai",
    service: "Monthly Subscription",
    rating: 5,
    story: "Max used to absolutely dread grooming trips. He'd hide under the bed the moment we'd take out the carrier. Ever since we switched to Zoophilist, he waits at the door every session day! The groomer is so gentle and patient with him. Max has never looked better.",
    result: "Zero anxiety, perfectly groomed coat",
    avatar: "P",
    color: "from-pink-500 to-rose-500",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80&auto=format&fit=crop",
    featured: true,
  },
  {
    name: "Rohan Mehra",
    pet: "Whiskers",
    petType: "Persian Cat",
    location: "Bangalore",
    service: "Full Grooming",
    rating: 5,
    story: "Whiskers is notoriously difficult to groom — most salons refused to take her. Zoophilist's groomer spent extra time building trust with her before even starting. The results were incredible. I've never seen Whiskers so calm and comfortable.",
    result: "Silky coat, calm and stress-free",
    avatar: "R",
    color: "from-violet-500 to-indigo-500",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80&auto=format&fit=crop",
    featured: false,
  },
  {
    name: "Ananya Patel",
    pet: "Coco",
    petType: "Pomeranian",
    location: "Hyderabad",
    service: "Spa Bath",
    rating: 5,
    story: "The subscription plan is the best investment I've made for Coco. Two months of premium service at a discounted price. Coco smells amazing, her fur is so soft, and she's always in a great mood after her sessions. Worth every rupee!",
    result: "Fluffy coat, subscription savings of ₹2000",
    avatar: "A",
    color: "from-amber-500 to-orange-500",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80&auto=format&fit=crop",
    featured: false,
  },
  {
    name: "Vikram Singh",
    pet: "Bruno",
    petType: "German Shepherd",
    location: "Mumbai",
    service: "Medical Bath",
    rating: 5,
    story: "Bruno had a severe tick infestation and I was desperate. Other groomers didn't have the expertise for medical baths. Zoophilist's groomer was incredibly knowledgeable and thorough. Within 2 sessions, Bruno was completely tick-free and his coat was healthier than ever.",
    result: "Completely tick-free, healthy coat restored",
    avatar: "V",
    color: "from-blue-500 to-cyan-500",
    image: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400&q=80&auto=format&fit=crop",
    featured: false,
  },
  {
    name: "Deepika Nair",
    pet: "Luna",
    petType: "Shih Tzu",
    location: "Bangalore",
    service: "Hair Cut",
    rating: 5,
    story: "Luna's hair grows so fast and she'd always come back from salon trips looking stressed and matted. With Zoophilist's doorstep service, she gets her haircut in the living room where she's most comfortable. The stylist is brilliant — Luna looks like a show dog!",
    result: "Perfectly styled, no matting issues",
    avatar: "D",
    color: "from-emerald-500 to-teal-500",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80&auto=format&fit=crop",
    featured: false,
  },
  {
    name: "Arjun Kumar",
    pet: "Milo",
    petType: "Beagle",
    location: "Hyderabad",
    service: "Spa Bath",
    rating: 5,
    story: "Milo is a curious, energetic dog who makes grooming challenging. The Zoophilist groomer came prepared with everything and handled Milo's energy with so much patience. The bath, blow dry, and nail clipping were done in record time. Amazing service!",
    result: "Clean, fresh, well-behaved",
    avatar: "A",
    color: "from-rose-500 to-pink-500",
    image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&q=80&auto=format&fit=crop",
    featured: false,
  },
];

const STATS = [
  { value: "500+", label: "Happy Pets" },
  { value: "4.9★", label: "Average Rating" },
  { value: "98%", label: "Would Recommend" },
  { value: "0", label: "Complaints" },
];

export default function SuccessStories() {
  const featured = STORIES.find(s => s.featured)!;
  const rest = STORIES.filter(s => !s.featured);

  return (
    <PageTransition className="pb-24">
      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <AuroraBackground className="opacity-40" />
        <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <SectionLabel>
            <Heart className="w-3.5 h-3.5 fill-current" /> Success Stories
          </SectionLabel>
          <FadeInUp>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5 tracking-tight">
              Happy Pets,<br />
              <span className="text-gradient">Happy Parents</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Real stories from real pet parents who experienced the Zoophilist difference.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-white/[0.015] py-8 mb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="text-3xl font-black text-primary mb-1">{s.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured story */}
      <section className="container mx-auto px-4 mb-16">
        <FadeInUp>
          <div className="relative rounded-[2rem] overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/5">
            <div className="absolute top-6 left-6 z-10">
              <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wide">
                ⭐ Featured Story
              </span>
            </div>
            <div className="grid md:grid-cols-2">
              <div className="relative h-72 md:h-auto">
                <img
                  src={featured.image}
                  alt={featured.pet}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80 hidden md:block" />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <Quote className="w-10 h-10 text-primary/30 mb-4" />
                <p className="text-lg text-gray-200 leading-relaxed mb-6 italic">
                  "{featured.story}"
                </p>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: featured.rating }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${featured.color} flex items-center justify-center text-white font-black text-lg`}>
                    {featured.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white">{featured.name}</div>
                    <div className="text-sm text-muted-foreground">{featured.location} · {featured.petType} owner</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 w-fit">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">{featured.result}</span>
                </div>
              </div>
            </div>
          </div>
        </FadeInUp>
      </section>

      {/* Rest of stories */}
      <section className="container mx-auto px-4 mb-16">
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((story, i) => (
            <StaggerItem key={i}>
              <div className="glass-card rounded-2xl p-7 h-full flex flex-col hover:border-white/10 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex gap-1">
                    {Array.from({ length: story.rating }).map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground px-2 py-1 rounded-full border border-white/8 bg-white/4">
                    {story.service}
                  </span>
                </div>
                <Quote className="w-6 h-6 text-primary/30 mb-3" />
                <p className="text-sm text-gray-300 leading-relaxed flex-grow mb-5 italic">
                  "{story.story}"
                </p>
                <div className="flex items-center gap-2 text-xs text-primary mb-5 px-3 py-2 rounded-xl bg-primary/8 border border-primary/15">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  {story.result}
                </div>
                <div className="flex items-center gap-3 border-t border-white/5 pt-5">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${story.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                    {story.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{story.name}</div>
                    <div className="text-xs text-muted-foreground">{story.location} · {story.pet} ({story.petType})</div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4">
        <FadeInUp>
          <div className="relative rounded-[2rem] border border-white/8 overflow-hidden text-center p-12 md:p-16">
            <AuroraBackground className="opacity-30" />
            <div className="relative z-10">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Your Pet's Story<br />
                <span className="text-gradient">Starts Here</span>
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                Join hundreds of happy pet parents. Book your first session and see the Zoophilist difference.
              </p>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 h-14 px-10 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 transition-all"
              >
                Book an Appointment
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </FadeInUp>
      </section>
    </PageTransition>
  );
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
