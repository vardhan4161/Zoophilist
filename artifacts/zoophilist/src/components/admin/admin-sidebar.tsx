import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Scissors, 
  Image as ImageIcon, 
  Settings, 
  PawPrint,
  ExternalLink,
} from "lucide-react";

export function AdminSidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/requests", label: "Bookings", icon: CalendarDays },
    { href: "/admin/services", label: "Services", icon: Scissors },
    { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-card border-r border-white/5 flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:bg-primary/30 transition-colors">
            <PawPrint className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Zoophilist
          </span>
        </Link>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-gray-400")} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/5">
        <Link
          href="/"
          className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors border border-white/5"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-primary" />
            <span>Visit Live Site</span>
          </span>
          <span className="text-[10px] text-primary font-bold">↗</span>
        </Link>
      </div>
    </aside>
  );
}