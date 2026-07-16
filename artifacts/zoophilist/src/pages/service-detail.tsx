import { PageTransition } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Link, useRoute } from "wouter";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { useGetServiceById, getGetServiceByIdQueryKey } from "@workspace/api-client-react";
import { STATIC_SERVICES } from "@/lib/constants";

export default function ServiceDetail() {
  const [, params] = useRoute("/services/:id");
  const id = params?.id;

  const { data: apiService, isLoading } = useGetServiceById(id || "", { query: { enabled: !!id && !id.startsWith('s'), queryKey: getGetServiceByIdQueryKey(id || "") } });
  
  // Fallback to static if it's a seed ID or API fails
  const staticService = STATIC_SERVICES.find(s => s.id === id);
  const service = apiService || staticService;

  if (isLoading && !staticService) {
    return (
      <PageTransition className="pt-32 pb-24 min-h-[70vh]">
        <div className="container mx-auto px-4 animate-pulse">
          <div className="w-32 h-6 bg-white/10 rounded mb-12"></div>
          <div className="glass-card rounded-[2rem] p-8 md:p-12">
            <div className="w-1/3 h-12 bg-white/10 rounded mb-6"></div>
            <div className="w-1/4 h-16 bg-white/10 rounded mb-8"></div>
            <div className="space-y-4 max-w-2xl">
              <div className="w-full h-4 bg-white/10 rounded"></div>
              <div className="w-full h-4 bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!service) {
    return (
      <PageTransition className="pt-32 pb-24 min-h-[70vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-white mb-4">Service Not Found</h1>
        <Button asChild variant="outline">
          <Link href="/services"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Services</Link>
        </Button>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button asChild variant="ghost" className="mb-8 -ml-4 text-muted-foreground hover:text-white">
          <Link href="/services"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Services</Link>
        </Button>

        <div className="glass-card rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
          {service.badge && (
            <div className="absolute top-8 right-8 bg-primary text-primary-foreground text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              {service.badge}
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{service.name}</h1>
          
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-5xl font-bold text-primary">₹{service.price}</span>
            {service.originalPrice && (
              <span className="text-muted-foreground line-through text-2xl">₹{service.originalPrice}</span>
            )}
          </div>
          
          {service.description && (
            <p className="text-xl text-gray-300 mb-12 max-w-2xl leading-relaxed">
              {service.description}
            </p>
          )}
          
          <div className="border-t border-white/10 pt-8 mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">What's Included</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {service.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  <span className="text-base text-gray-200">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="rounded-xl h-14 px-8 text-lg w-full sm:w-auto" asChild>
              <Link href={`/book?service=${service.id}`}>Book This Service</Link>
            </Button>
            <div className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start px-4">
              Requires ~{service.features.length * 15} mins
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}