import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { PawPrint, Menu, X, Phone, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeSelector } from "./theme-selector";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location]);

  // Never render the public website floating navbar when on admin routes
  if (location.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20 pointer-events-none"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0 pointer-events-auto">
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center border border-primary/25 group-hover:bg-primary/25 group-hover:border-primary/40 transition-all duration-300">
            <PawPrint className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Zoophilist
          </span>
        </Link>

        {/* Desktop: Glass pill nav */}
        <nav
          className={cn(
            "hidden md:flex items-center gap-1 px-3 py-2 rounded-full transition-all duration-500 pointer-events-auto",
            scrolled
              ? "bg-black/60 backdrop-blur-2xl border border-white/10 shadow-xl shadow-black/30"
              : "bg-white/5 backdrop-blur-md border border-white/8"
          )}
        >
          {navLinks.map((link) => {
            const active = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  active
                    ? "text-primary-foreground"
                    : "text-gray-400 hover:text-white"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-primary"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop: Right actions */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0 pointer-events-auto">
          <ThemeSelector />

          <Link
            href="/admin"
            id="nav-admin-portal-link"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-semibold transition-all hover:border-primary/40"
            title="Admin Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Admin</span>
          </Link>

          <a
            href="tel:+919515247704"
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1"
          >
            <Phone className="w-3.5 h-3.5 text-primary" />
            <span className="hidden lg:inline">+91 9515247704</span>
          </a>

          <Link
            href="/book"
            className="inline-flex items-center justify-center h-9 px-4 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile: Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors pointer-events-auto"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-24 left-4 right-4 z-50 md:hidden rounded-2xl bg-card/95 backdrop-blur-2xl border border-white/10 shadow-2xl p-4"
            >
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const active = location === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors",
                        active
                          ? "bg-primary/15 text-primary"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-xs text-gray-400">Color Theme</span>
                  <ThemeSelector />
                </div>

                <Link
                  href="/admin"
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-sm font-medium transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>Admin Portal</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-primary/20 text-primary">Login</span>
                </Link>

                <a
                  href="tel:+919515247704"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  <span>+91 9515247704</span>
                </a>
                <Link
                  href="/book"
                  className="flex items-center justify-center h-11 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors text-sm shadow-lg shadow-primary/20"
                >
                  Book an Appointment
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
