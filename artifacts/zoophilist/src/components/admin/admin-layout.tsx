import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useGetAdminMe, getGetAdminMeQueryKey, setAuthTokenGetter } from "@workspace/api-client-react";
import { Loader2 } from "lucide-react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";

// Setup auth token getter for API client
setAuthTokenGetter(() => localStorage.getItem("adminToken"));

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { data: admin, isLoading, error } = useGetAdminMe({
    query: {
      retry: false,
      queryKey: getGetAdminMeQueryKey(),
    }
  });

  useEffect(() => {
    if (!isLoading && error) {
      setLocation("/admin/login");
    }
  }, [isLoading, error, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!admin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader admin={admin} onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}