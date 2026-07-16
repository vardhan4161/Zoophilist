import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminLogout } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";

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
      <h2 className="text-lg font-semibold text-white">Admin Panel</h2>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-400" />
          </div>
          <span>{admin.username}</span>
        </div>
        
        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-400 hover:text-white">
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}