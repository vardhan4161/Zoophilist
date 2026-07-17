import { useRoute, Link } from "wouter";
import { CheckCircle2, ArrowRight, ArrowLeft, Star, Clock, Shield, Sparkles } from "lucide-react";
import { PageTransition, AuroraBackground, FadeInUp, SlideInLeft, SlideInRight, SectionLabel } from "@/components/animations";
import { useGetServices } from "@workspace/api-client-react";
import { STATIC_SERVICES } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";

const SERVICE_ICONS: Record<string, string> = {
  "Spa Bath": "🛁",
  "Grooming": "✂️",
  "Hair Cut": "💇",
  "Medical Bath": "💊",
  "Subscription": "⭐",
};

const RELATED_INFO: Record<string, { duration: string; bestFor: string; image: string }> = {
  "Spa Bath": { duration: "60–90 mins", bestFor: "All pets · Coat maintenance", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80" },
  "Full Grooming": { duration: "2–3 hours", bestFor: "Dogs & Cats · Complete makeover", image: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=800&q=80" },
  "Hair Cut": { duration: "60–90 mins", bestFor: "Long-haired breeds", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80" },
  "Medical Bath": { duration: "90–120 mins", bestFor: "Skin issues · Tick treatment", image: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800&q=80" },
  "Subscription": { duration: "Bi-weekly", bestFor: "All pets · Best value", image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&q=80" },
};

export default function ServiceDetail() {
  const [match, params] = useRoute("/services/:id");
  const { data: apiServices, isLoading } = useGetServices();
  const services = apiServices?.length ? apiServices : STATIC_SERVICES;

  const service = services.find((s) => s.id === params?.id) ?? services[0];
  const info = RELATED_INFO[service?.name] ?? { duration: "60–90 mins", bestFor: "All pets", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80" };
  const emoji = SERVICE_ICONS[service?.name] ?? "🐾";

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-36 pb-24">
        <Skeleton className="h-[500px] rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 pt-36 pb-24 text-center">
        <p className="text-muted-foreground">Service not found.</p>
        <Link href="/services" className="text-primary mt-4 inline-block">View all services</Link>
      </div>
    );
  }

  const otherServices = services.filter(s => s.id !== service.id).slice(0, 3);

  return (
    <PageTransition className="pb-24">
      {/* Hero */}
      <section className="relative pt-24 overflow-hidden">
        <div className="relative h-[420px] md:h-[500px] overflow-hidden">
          <AuroraBackground className="opacity-30" />
          <img
            src={info.image}
            alt={service.name}
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 flex items-end pb-12">
            <div className="container mx-auto px-4">
              <Link href="/services" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" /> All Services
              </Link>
              <FadeInUp>
                <div className="text-5xl mb-4">{emoji}</div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">{service.name}</h1>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-4xl font-black text-primary">₹{service.price}</span>
                  {(service as any).originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">₹{(service as any).originalPrice}</span>
                  )}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {info.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                    <span className="text-white font-bold text-sm ml-1">4.9</span>
                  </div>
                </div>
              </FadeInUp>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-10 mt-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <SlideInLeft>
              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-2xl font-black text-white mb-4">About This Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description ?? `Our ${service.name} is a comprehensive grooming experience designed to keep your pet looking and feeling their absolute best. Performed by certified groomers at your doorstep, this service uses only premium, pet-safe products tailored to your pet's specific coat type and needs.`}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {[info.bestFor.split(" · ")].flat().map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </SlideInLeft>

            {/* What's included */}
            <SlideInLeft delay={0.1}>
              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-2xl font-black text-white mb-6">What's Included</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {service.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                      <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SlideInLeft>

            {/* Process */}
            <SlideInLeft delay={0.15}>
              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-2xl font-black text-white mb-6">How the Session Works</h2>
                <div className="space-y-5">
                  {[
                    { step: "1", title: "Groomer Arrives", desc: "Your certified groomer arrives at your doorstep, fully equipped." },
                    { step: "2", title: "Pet Assessment", desc: "We assess your pet's coat, skin, and temperament to tailor the session." },
                    { step: "3", title: "Grooming Session", desc: "The complete grooming is performed with care, patience, and premium products." },
                    { step: "4", title: "Final Touches", desc: "Finishing touches, perfume spritz, and a bow — your pet is show-ready!" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                        <span className="text-xs font-black text-primary">{item.step}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm mb-0.5">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SlideInLeft>
          </div>

          {/* Booking sidebar */}
          <div className="space-y-5">
            <SlideInRight>
              <div className="sticky top-24 space-y-5">
                {/* Price card */}
                <div className="glass-card rounded-2xl p-6 border border-primary/20">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-black text-primary">₹{service.price}</span>
                    {(service as any).originalPrice && (
                      <span className="text-muted-foreground line-through text-base">₹{(service as any).originalPrice}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-5">Doorstep service · All products included</p>
                  <Link
                    href={`/book?service=${service.id}`}
                    className="flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
                  >
                    Book Now <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="tel:+919515247704"
                    className="flex items-center justify-center gap-2 h-11 rounded-xl border border-white/10 text-gray-300 font-semibold text-sm hover:bg-white/5 transition-colors mt-3"
                  >
                    Call to Book
                  </a>
                </div>

                {/* Guarantees */}
                <div className="glass-card rounded-2xl p-6">
                  <h4 className="font-bold text-white mb-4 text-sm">Included Guarantee</h4>
                  <div className="space-y-3">
                    {[
                      { icon: Shield, text: "100% satisfaction guarantee" },
                      { icon: Star, text: "Certified & experienced groomer" },
                      { icon: Sparkles, text: "Premium, pet-safe products only" },
                      { icon: CheckCircle2, text: "Fully equipped mobile setup" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                        <item.icon className="w-4 h-4 text-primary shrink-0" />
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SlideInRight>
          </div>
        </div>

        {/* Other services */}
        {otherServices.length > 0 && (
          <div className="mt-16">
            <SectionLabel>You May Also Like</SectionLabel>
            <FadeInUp>
              <h2 className="text-3xl font-black text-white mb-8">Other Services</h2>
            </FadeInUp>
            <div className="grid md:grid-cols-3 gap-5">
              {otherServices.map(s => (
                <Link key={s.id} href={`/services/${s.id}`} className="glass-card rounded-2xl p-6 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
                  <div className="text-3xl mb-3">{SERVICE_ICONS[s.name] ?? "🐾"}</div>
                  <h3 className="font-black text-white mb-1">{s.name}</h3>
                  <div className="text-primary font-bold text-xl">₹{s.price}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
