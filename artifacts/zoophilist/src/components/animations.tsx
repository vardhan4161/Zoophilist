import { motion } from "framer-motion";

export function PageTransition({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className, delay = 0.1 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
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

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MeshGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-background">
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-blob mix-blend-screen opacity-50" />
      <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-accent/20 blur-[120px] animate-blob-slow mix-blend-screen opacity-50" style={{ animationDelay: "2s" }} />
      <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-blob mix-blend-screen opacity-50" style={{ animationDelay: "4s" }} />
      <div className="absolute inset-0 bg-background/80 backdrop-blur-[50px]" />
    </div>
  );
}
