import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// ─── Page Transition ───────────────────────────────────────────────────────
export function PageTransition({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger Container ─────────────────────────────────────────────────────
export function StaggerContainer({
  children,
  className,
  delay = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        visible: { transition: { staggerChildren: delay } },
        hidden: {},
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger Item ──────────────────────────────────────────────────────────
export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Fade In Up ────────────────────────────────────────────────────────────
export function FadeInUp({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Fade In ───────────────────────────────────────────────────────────────
export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Animated Counter ──────────────────────────────────────────────────────
export function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2,
  className,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionValue.set(target);
  }, [inView, target, motionValue]);

  useEffect(() => {
    return springValue.on("change", (v) => setDisplay(Math.round(v)));
  }, [springValue]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}

// ─── Aurora Background ─────────────────────────────────────────────────────
export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className ?? ""}`}>
      <div
        className="absolute -top-[30%] -left-[15%] w-[55%] h-[55%] rounded-full bg-primary/20 blur-[140px] animate-blob mix-blend-screen opacity-60"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="absolute top-[10%] -right-[15%] w-[45%] h-[65%] rounded-full bg-emerald-500/15 blur-[140px] animate-blob-slow mix-blend-screen opacity-50"
        style={{ animationDelay: "3s" }}
      />
      <div
        className="absolute -bottom-[25%] left-[15%] w-[65%] h-[55%] rounded-full bg-accent/15 blur-[140px] animate-blob-reverse mix-blend-screen opacity-40"
        style={{ animationDelay: "6s" }}
      />
      <div
        className="absolute top-[40%] left-[35%] w-[35%] h-[40%] rounded-full bg-primary/10 blur-[100px] animate-blob mix-blend-screen opacity-30"
        style={{ animationDelay: "9s" }}
      />
    </div>
  );
}

// ─── MeshGradient (legacy compat) ──────────────────────────────────────────
export function MeshGradient() {
  return <AuroraBackground />;
}

// ─── Gradient Border Card ──────────────────────────────────────────────────
export function GradientBorderCard({
  children,
  className,
  glowOnHover = false,
}: {
  children: React.ReactNode;
  className?: string;
  glowOnHover?: boolean;
}) {
  return (
    <motion.div
      whileHover={glowOnHover ? { scale: 1.02 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`gradient-border ${glowOnHover ? "hover:glow-green-sm" : ""} transition-all duration-300 ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}

// ─── Floating Card ─────────────────────────────────────────────────────────
export function FloatingCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Scale In ─────────────────────────────────────────────────────────────
export function ScaleIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Slide In Left ────────────────────────────────────────────────────────
export function SlideInLeft({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Slide In Right ───────────────────────────────────────────────────────
export function SlideInRight({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-6"
    >
      {children}
    </motion.div>
  );
}
