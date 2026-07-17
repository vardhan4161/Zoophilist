import { Link } from "wouter";
import { CheckCircle2, ArrowRight, Sparkles, Star } from "lucide-react";
import { PageTransition, StaggerContainer, StaggerItem, FadeInUp, SectionLabel, AuroraBackground } from "@/components/animations";
import { STATIC_SERVICES } from "@/lib/constants";
import { useGetServices } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

const SERVICE_ICONS: Record<string, string> = {
  "Spa Bath": "🛁",
  "Grooming": "✂️",
  "Hair Cut": "💇",
  "Medical Bath": "💊",
  "Subscription": "⭐",
};

export default function Services() {
  const { data: apiServices, isLoading } = useGetServices();
  const services = apiServices?.length ? apiServices : STATIC_SERVICES;

  return (
    <PageTransition className="pb-24">
      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <AuroraBackground className="opacity-40" />
        <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <SectionLabel>
            <Sparkles className="w-3.5 h-3.5" /> Premium Services
          </SectionLabel>
          <FadeInUp>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5 tracking-tight">
              Grooming Packages
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Curated grooming packages delivered to your doorstep by certified professionals.
              Every service uses premium, pet-safe products.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Services grid */}
      <section className="container mx-auto px-4">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-[420px] rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : (
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => {
              const isSubscription = !!(service as any).isSubscription;
              const badge = (service as any).badge;
              const originalPrice = (service as any).originalPrice;
              const emoji = SERVICE_ICONS[service.name] ?? "🐾";

              return (
                <StaggerItem key={service.id} className={`h-full ${isSubscription ? "md:col-span-2 lg:col-span-1" : ""}`}>
                  <div
                    className={`relative h-full flex flex-col rounded-2xl p-7 overflow-hidden transition-all duration-300 hover:-translate-y-1 group
                      ${isSubscription
                        ? "bg-gradient-to-br from-primary/15 via-card to-accent/10 border border-primary/30 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
                        : "glass-card border border-white/5 hover:border-white/10 hover:shadow-xl hover:shadow-black/30"
                      }`}
                  >
                    {/* Glow */}
                    {isSubscription && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Badge */}
                    {badge && (
                      <div className={`absolute top-5 right-5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        ${isSubscription
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/15 border border-primary/25 text-primary"
                        }`}
                      >
                        {badge}
                      </div>
                    )}

                    {/* Emoji */}
                    <div className="text-4xl mb-4">{emoji}</div>

                    <h3 className="text-2xl font-black text-white mb-2">{service.name}</h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-4xl font-black text-primary">₹{service.price}</span>
                      {originalPrice && (
                        <div className="flex flex-col">
                          <span className="text-muted-foreground line-through text-base">₹{originalPrice}</span>
                          <span className="text-xs text-primary font-semibold">Save ₹{originalPrice - service.price}</span>
                        </div>
                      )}
                    </div>

                    {service.description && (
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                    )}

                    {/* Features */}
                    <div className="space-y-2.5 flex-grow mb-7">
                      {service.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-300">{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* Rating row */}
                    <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-xl bg-white/4 border border-white/5">
                      <div className="flex">
                        {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                      </div>
                      <span className="text-xs text-muted-foreground">4.9 avg · 100+ sessions</span>
                    </div>

                    <Link
                      href={`/book?service=${service.id}`}
                      className={`flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-sm transition-all duration-200
                        ${isSubscription
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                          : "bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary"
                        }`}
                    >
                      Book This Service
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </section>

      {/* Guarantee strip */}
      <section className="container mx-auto px-4 mt-16">
        <FadeInUp>
          <div className="glass-card rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-40 bg-primary/10 blur-[60px] pointer-events-none" />
            <div className="relative z-10">
              <div className="text-3xl mb-4">🐾</div>
              <h3 className="text-xl font-black text-white mb-2">100% Satisfaction Guarantee</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                If you or your pet isn't completely happy with the service, we'll make it right — free of charge.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                {["Certified Groomers", "Premium Products", "Doorstep Service", "No Hidden Fees"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeInUp>
      </section>
    </PageTransition>
  );
}
