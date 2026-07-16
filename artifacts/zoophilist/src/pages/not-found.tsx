import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/animations";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <PageTransition className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="text-9xl font-black text-white/5 mb-8 select-none">404</div>
        <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          Oops! It seems the page you're looking for has wandered off like a curious cat. Let's get you back home.
        </p>
        <Button asChild size="lg" className="rounded-full">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
        </Button>
      </div>
    </PageTransition>
  );
}