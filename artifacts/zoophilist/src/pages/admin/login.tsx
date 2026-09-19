import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, Link } from "wouter";
import { useAdminLogin } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PawPrint, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const login = useAdminLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    login.mutate({ data }, {
      onSuccess: (res) => {
        localStorage.setItem("adminToken", res.token);
        setLocation("/admin/dashboard");
      },
      onError: (err: any) => {
        toast({
          title: "Login failed",
          description: err?.message || "Invalid credentials",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <PawPrint className="w-10 h-10 text-primary" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
          Zoophilist Admin
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Sign in to manage bookings and services
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-card py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-white/10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Username</FormLabel>
                    <FormControl>
                      <Input className="bg-background/50 border-white/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Password</FormLabel>
                    <FormControl>
                      <Input type="password" className="bg-background/50 border-white/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold" 
                disabled={login.isPending}
              >
                {login.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
              </Button>

              <div className="pt-2 flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-9 text-xs border-white/10 hover:bg-white/5 text-gray-300"
                  onClick={() => {
                    form.setValue("username", "admin");
                    form.setValue("password", "zoophilist2024");
                  }}
                >
                  ⚡ Auto-Fill Credentials (admin / zoophilist2024)
                </Button>

                <div className="text-center mt-2">
                  <Link href="/" className="text-xs text-primary hover:underline font-medium">
                    ← Back to Zoophilist Website
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}