import { Link } from "wouter";
import { motion } from "framer-motion";
import { Home, ArrowLeft, PawPrint } from "lucide-react";
import { AuroraBackground } from "@/components/animations";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <AuroraBackground />
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center max-w-lg">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8"
        >
          <PawPrint className="w-12 h-12 text-primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-8xl font-black text-white/10 mb-4 leading-none select-none">404</div>
          <h1 className="text-4xl font-black text-white mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-10 leading-relaxed">
            Oops! This page wandered off like a curious pet. Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
            >
              <Home className="w-4 h-4" /> Go Home
            </Link>
            <button
              onClick={() => history.back()}
              className="inline-flex items-center gap-2 h-12 px-7 rounded-full glass border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
