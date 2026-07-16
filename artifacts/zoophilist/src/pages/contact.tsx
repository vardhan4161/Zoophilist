import { PageTransition } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function Contact() {
  return (
    <PageTransition className="pt-32 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            Have a question or need to reschedule? We're here to help. Reach out to our support team.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-[2rem] p-8 h-full">
              <h3 className="text-2xl font-bold text-white mb-8">Contact Information</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Phone Number</h4>
                    <a href="tel:+919515247704" className="text-lg font-bold text-white hover:text-primary transition-colors">+91 9515247704</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Email Address</h4>
                    <a href="mailto:zoophilistpetservice@gmail.com" className="text-lg font-bold text-white hover:text-primary transition-colors break-all">zoophilistpetservice<br/>@gmail.com</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Operating Hours</h4>
                    <p className="text-lg font-bold text-white">Mon-Sun: 8 AM - 6 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Service Areas</h4>
                    <p className="text-lg font-bold text-white">Premium localities across major cities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form & Map */}
          <div className="lg:col-span-3 space-y-8">
            <div className="glass-card rounded-[2rem] p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Name</label>
                    <Input placeholder="John Doe" className="bg-background/50 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Phone</label>
                    <Input placeholder="+91 98765 43210" className="bg-background/50 border-white/10 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Subject</label>
                  <Input placeholder="General Inquiry" className="bg-background/50 border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Message</label>
                  <Textarea placeholder="How can we help you?" className="min-h-[120px] bg-background/50 border-white/10 text-white" />
                </div>
                <Button type="button" size="lg" className="w-full rounded-xl gap-2 mt-4">
                  <Send className="w-4 h-4" /> Send Message
                </Button>
              </form>
            </div>

            {/* Map Placeholder */}
            <div className="glass-card rounded-[2rem] p-2 h-[300px] overflow-hidden relative">
              <div className="absolute inset-0 bg-accent/5 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary/50 mx-auto mb-2" />
                  <p className="text-muted-foreground font-medium">Interactive Map Area</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-[url('https://api.maptiler.com/maps/basic/256/0/0/0.png')] opacity-10 bg-cover bg-center pointer-events-none filter invert contrast-100 grayscale"></div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}