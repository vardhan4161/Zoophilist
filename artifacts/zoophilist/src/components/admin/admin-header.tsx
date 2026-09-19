import { LogOut, User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminLogout } from "@workspace/api-client-react";
import { useLocation, Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { ThemeSelector } from "@/components/theme-selector";

export function AdminHeader({ admin }: { admin: { username: string } }) {
  const [, setLocation] = useLocation();
  const logout = useAdminLogout();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => {
        localStorage.removeItem("adminToken");
        queryClient.clear();
        setLocation("/admin/login");
      }
    });
  };

  return (
    <header className="h-16 bg-card border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-white">Admin Operations</h2>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
          Authorized
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeSelector />

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-primary" />
          <span>Live Site</span>
        </Link>

        <div className="h-4 w-px bg-white/10" />

        <div className="flex items-center gap-2 text-sm text-gray-300">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-400" />
          </div>
          <span className="hidden sm:inline font-medium">{admin.username}</span>
        </div>
        
        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-400 hover:text-rose-400" title="Sign out">
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}