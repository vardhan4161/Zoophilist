import { PageTransition, StaggerContainer, StaggerItem } from "@/components/animations";
import { STATIC_SERVICES } from "@/lib/constants";
import { useGetServices } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";

export default function Services() {
  const { data: apiServices, isLoading } = useGetServices();
  const services = apiServices?.length ? apiServices : STATIC_SERVICES;

  return (
    <PageTransition className="pt-32 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Services</h1>
          <p className="text-lg text-muted-foreground">
            Premium doorstep grooming packages tailored for your pet's needs. Choose the perfect spa day for your furry friend.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="glass-card rounded-3xl p-8 h-[400px] animate-pulse">
                <div className="w-1/3 h-8 bg-white/10 rounded mb-4"></div>
                <div className="w-1/4 h-12 bg-white/10 rounded mb-6"></div>
                <div className="space-y-4 mb-8">
                  <div className="w-full h-4 bg-white/10 rounded"></div>
                  <div className="w-full h-4 bg-white/10 rounded"></div>
                  <div className="w-3/4 h-4 bg-white/10 rounded"></div>
                </div>
                <div className="w-full h-12 bg-white/10 rounded mt-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <StaggerItem key={service.id} className="h-full">
                <div className={`glass-card rounded-3xl p-8 h-full flex flex-col relative overflow-hidden group hover:border-primary/50 transition-colors ${service.isSubscription ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
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
                  {service.description && (
                    <p className="text-muted-foreground mb-8">{service.description}</p>
                  )}
                  
                  <div className="space-y-3 mb-8 flex-grow">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full rounded-xl" size="lg" asChild>
                    <Link href={`/book?service=${service.id}`}>Book Now</Link>
                  </Button>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </PageTransition>
  );
}