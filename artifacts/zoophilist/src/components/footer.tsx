import { Link } from "wouter";
import { PawPrint, Instagram, Facebook, Youtube, MapPin, Phone, Mail, ArrowRight } from "lucide-react";

const footerLinks = {
  services: [
    { label: "Spa Bath — ₹899", href: "/services" },
    { label: "Full Grooming — ₹1599", href: "/services" },
    { label: "Hair Cut — ₹1199", href: "/services" },
    { label: "Medical Bath — ₹1699", href: "/services" },
    { label: "Subscription — ₹3899", href: "/services" },
  ],
  company: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="relative bg-card border-t border-white/5 overflow-hidden">
      {/* Subtle aurora glow */}
      <div className="absolute -top-40 left-1/4 w-96 h-96 bg-primary/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-20 right-1/3 w-64 h-64 bg-accent/6 blur-[100px] rounded-full pointer-events-none" />

      {/* CTA strip */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                Ready to pamper your pet?
              </h3>
              <p className="text-muted-foreground">
                Book a premium doorstep grooming session in minutes.
              </p>
            </div>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 shrink-0"
            >
              Book an Appointment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center border border-primary/25">
                <PawPrint className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Zoophilist</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              India's premium doorstep pet grooming platform. Because your pets deserve the very best — in the comfort of their own home.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-gray-400 hover:bg-primary/15 hover:text-primary hover:border-primary/25 transition-all duration-200"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-gray-400 hover:bg-primary/15 hover:text-primary hover:border-primary/25 transition-all duration-200"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-gray-400 hover:bg-primary/15 hover:text-primary hover:border-primary/25 transition-all duration-200"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <nav aria-labelledby="footer-services-heading">
            <h4 id="footer-services-heading" className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-labelledby="footer-company-heading">
            <h4 id="footer-company-heading" className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
              {footerLinks.legal.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+919515247704"
                  className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>+91 9515247704</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:zoophilistpetservice@gmail.com"
                  className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors break-all"
                >
                  <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>zoophilistpetservice@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Doorstep service across major cities in India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} Zoophilist Pet Services. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <span className="text-primary">♥</span> for pets across India
          </p>
        </div>
      </div>
    </footer>
  );
}
