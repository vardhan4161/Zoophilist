import { Link, useRoute } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export function SharedShell({ children }: { children: React.ReactNode }) {
  const [isAdmin] = useRoute("/admin*");
  
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[100dvh] flex flex-col relative selection:bg-primary/30">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
