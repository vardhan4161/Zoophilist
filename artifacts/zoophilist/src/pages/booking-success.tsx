import { PageTransition } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle2, CalendarDays, ArrowRight } from "lucide-react";

export default function BookingSuccess() {
  return (
    <PageTransition className="min-h-[80vh] flex items-center justify-center px-4 pt-20">
      <div className="glass-card rounded-[2rem] p-8 md:p-12 max-w-md w-full text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-primary"></div>
        
        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8 border-[6px] border-card">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Booking Confirmed!</h1>
        <p className="text-gray-300 mb-8 leading-relaxed">
          Thank you for choosing Zoophilist. We've received your booking request and will contact you shortly to confirm the details.
        </p>
        
        <div className="bg-black/20 rounded-xl p-4 mb-8 text-left border border-white/5">
          <div className="flex items-center gap-3 text-sm text-gray-300 mb-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            <span>Our team is reviewing your request</span>
          </div>
          <div className="text-xs text-muted-foreground pl-7">
            You will receive a confirmation call on your provided phone number.
          </div>
        </div>
        
        <div className="space-y-3">
          <Button asChild className="w-full rounded-xl h-12 text-lg">
            <Link href="/">Return Home</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full rounded-xl h-12 text-gray-400 hover:text-white">
            <Link href="/services">Browse More Services</Link>
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}