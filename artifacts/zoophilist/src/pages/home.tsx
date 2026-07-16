import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PageTransition, MeshGradient, StaggerContainer, StaggerItem } from "@/components/animations";
import { CheckCircle2, Star, ShieldCheck, Clock, Scissors, Heart, ArrowRight } from "lucide-react";
import { STATIC_SERVICES } from "@/lib/constants";
import { useGetServices } from "@workspace/api-client-react";

export default function Home() {
  const { data: apiServices } = useGetServices();
  const services = apiServices?.length ? apiServices : STATIC_SERVICES;
  const popularServices = services.slice(0, 3);

  return (
    <PageTransition className="pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
        <MeshGradient />
        
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <img 
            src="/images/hero.jpg" 
            alt="Happy pets" 
            className="w-full h-full object-cover object-right opacity-40 mix-blend-luminosity"
          />
        </div>

        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-6 animate-fade-in">
              <Star className="w-4 h-4 fill-primary" />
              <span>India's Premium Doorstep Pet Grooming</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              Because Your Pets <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Deserve the Best.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
              Experience stress-free, professional pet grooming right at your doorstep. We bring the salon to you, ensuring your furry friends receive royal treatment in their comfort zone.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" asChild className="text-lg h-14 px-8 rounded-full">
                <Link href="/book">Book an Appointment <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button size="lg" variant="glass" asChild className="text-lg h-14 px-8 rounded-full">
                <Link href="/services">View Services</Link>
              </Button>
            </div>
            
            <div className="mt-12 flex items-center gap-8">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-background overflow-hidden bg-muted">
                    <img src={`/images/gallery-${i}.jpg`} alt="Happy pet" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-2 border-background bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  500+
                </div>
              </div>
              <div className="text-sm">
                <div className="flex items-center text-yellow-400 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-gray-400">4.9/5 from 500+ happy parents</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Happy Pets", value: "500+", icon: Heart },
              { label: "Services Completed", value: "1000+", icon: Scissors },
              { label: "Customer Rating", value: "4.9★", icon: Star },
              { label: "Expert Groomers", value: "10+", icon: ShieldCheck },
            ].map((stat, i) => (
              <StaggerItem key={i} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Popular Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our curated grooming packages designed to cater to every pet's needs. All services are performed by certified professionals.
            </p>
          </div>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {popularServices.map((service) => (
              <StaggerItem key={service.id} className="h-full">
                <div className="glass-card rounded-3xl p-8 h-full flex flex-col relative overflow-hidden group hover:border-primary/50 transition-colors">
                  {service.badge && (
                    <div className="absolute top-6 right-6 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {service.badge}
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-2">{service.name}</h3>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-bold text-primary">₹{service.price}</span>
                    {service.originalPrice && (
                      <span className="text-muted-foreground line-through text-lg">₹{service.originalPrice}</span>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-8 min-h-[48px]">{service.description}</p>
                  
                  <div className="space-y-3 mb-8 flex-grow">
                    {service.features.slice(0, 5).map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                    {service.features.length > 5 && (
                      <div className="text-sm text-muted-foreground italic pl-8">
                        + {service.features.length - 5} more features
                      </div>
                    )}
                  </div>
                  
                  <Button className="w-full rounded-xl" asChild>
                    <Link href={`/services/${service.id}`}>Details & Booking</Link>
                  </Button>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="rounded-full" asChild>
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 relative">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 relative">
                <img src="/images/gallery-5.jpg" alt="Professional groomer" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 glass rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                      <Heart className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-bold text-white">Stress-Free Grooming</div>
                      <div className="text-sm text-gray-300">In their comfort zone</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Zoophilist is the Best Choice for Your Pet</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                We believe pet grooming shouldn't be a chore—it should be a pampering experience. By bringing the salon to your home, we eliminate travel anxiety and provide focused, one-on-one attention.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "Convenience at Your Doorstep", desc: "No more messy cars or stressful car rides. We come to you fully equipped." },
                  { title: "Certified Professional Groomers", desc: "Our team consists of highly trained, background-checked pet lovers." },
                  { title: "Premium Products", desc: "We use only high-quality, pet-safe, hypoallergenic shampoos and conditioners." },
                  { title: "Hygiene & Sanitization", desc: "All tools are thoroughly sanitized before and after every grooming session." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex flex-shrink-0 items-center justify-center mt-1">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating CTA */}
      <div className="fixed bottom-8 right-8 z-50 animate-bounce">
        <Button size="lg" className="rounded-full shadow-2xl h-14 px-6 gap-2" asChild>
          <Link href="/book">
            <Clock className="w-5 h-5" />
            <span className="font-bold">Book Now</span>
          </Link>
        </Button>
      </div>
    </PageTransition>
  );
}
