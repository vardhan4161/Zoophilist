import { PageTransition, StaggerContainer, StaggerItem } from "@/components/animations";
import { Award, Heart, Shield, Users } from "lucide-react";

export default function About() {
  return (
    <PageTransition className="pt-32 pb-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Story</h1>
          <p className="text-lg text-muted-foreground">
            Zoophilist was born out of a simple observation: pet grooming was often stressful for both pets and their parents. We decided to change that by bringing a premium salon experience directly to your home.
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden mb-24 border border-white/10">
          <img src="/images/hero.jpg" alt="About Zoophilist" className="w-full h-full object-cover object-center opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent flex items-end p-8 md:p-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-white mb-4">Because Your Pets Deserve the Best</h2>
              <p className="text-gray-300">
                Our name "Zoophilist" means a lover of animals. Every decision we make, every groomer we hire, and every product we use stems from this core philosophy.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Core Values</h2>
          </div>
          
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: "Compassion First", desc: "We treat every pet as if they were our own. Patience and love are our primary tools." },
              { icon: Award, title: "Premium Quality", desc: "From our shampoos to our styling tools, we never compromise on quality." },
              { icon: Shield, title: "Safety & Hygiene", desc: "Strict sanitization protocols ensure a safe environment for your furry family members." }
            ].map((value, i) => (
              <StaggerItem key={i} className="glass-card p-8 rounded-3xl text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Stats */}
        <div className="glass-card rounded-[2rem] p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 blur-[100px] rounded-full" />
          
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "Happy Pets" },
              { value: "3+", label: "Cities Served" },
              { value: "10+", label: "Expert Groomers" },
              { value: "4.9", label: "Average Rating" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-gray-300 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}