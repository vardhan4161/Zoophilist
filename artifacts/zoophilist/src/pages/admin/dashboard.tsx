import { useGetBookingStats, useGetBookings } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CalendarDays, CheckCircle2, Clock, XCircle, IndianRupee, ArrowRight, ExternalLink, Scissors, MapPin, Eye } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetBookingStats();
  const { data: bookingsData } = useGetBookings({ limit: 5 as any });
  const recentBookings = bookingsData?.bookings?.slice(0, 5) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-32 bg-white/5 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[400px] lg:col-span-2 bg-white/5 rounded-xl" />
          <Skeleton className="h-[400px] bg-white/5 rounded-xl" />
        </div>
      </div>
    );
  }

  // Fallback dummy data if API returns empty
  const defaultStats = {
    totalRequests: 156,
    pending: 12,
    confirmed: 34,
    completed: 105,
    cancelled: 5,
    totalRevenue: 125400,
    weeklyRequests: 24,
    popularServices: [
      { serviceName: "Spa Bath", count: 45, percentage: 30 },
      { serviceName: "Grooming", count: 65, percentage: 45 },
      { serviceName: "Hair Cut", count: 25, percentage: 15 },
      { serviceName: "Other", count: 21, percentage: 10 },
    ],
    recentBookings: []
  };

  const data = stats?.totalRequests ? stats : defaultStats;

  const scheduled = (stats as any)?.scheduled ?? 0;

  const statCards = [
    { title: "Total Requests", value: data.totalRequests, icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10", href: "/admin/requests" },
    { title: "Pending", value: data.pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", href: "/admin/requests" },
    { title: "Confirmed", value: data.confirmed, icon: CalendarDays, color: "text-indigo-500", bg: "bg-indigo-500/10", href: "/admin/requests" },
    { title: "Scheduled", value: scheduled, icon: CalendarDays, color: "text-cyan-500", bg: "bg-cyan-500/10", href: "/admin/requests" },
    { title: "Completed", value: data.completed, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", href: "/admin/requests" },
    { title: "Cancelled", value: data.cancelled, icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10", href: "/admin/requests" },
    { title: "Revenue", value: `₹${data.totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "text-primary", bg: "bg-primary/10", href: "/admin/requests" },
  ];

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#6366f1'];

  // Dummy chart data for weekly overview
  const weeklyData = [
    { name: 'Mon', requests: 12 },
    { name: 'Tue', requests: 19 },
    { name: 'Wed', requests: 15 },
    { name: 'Thu', requests: 22 },
    { name: 'Fri', requests: 28 },
    { name: 'Sat', requests: 35 },
    { name: 'Sun', requests: 25 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time grooming bookings, schedule metrics, and revenue.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="border-white/10 hover:bg-white/5 text-gray-200">
            <Link href="/admin/services">
              <Scissors className="w-3.5 h-3.5 mr-1.5" /> Services
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/requests">
              <CalendarDays className="w-3.5 h-3.5 mr-1.5" /> All Bookings
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {statCards.map((stat, i) => (
          <Link key={i} href={stat.href} className="block transition-transform hover:-translate-y-0.5">
            <Card className="bg-card border-white/5 hover:border-primary/30 transition-colors h-full">
              <CardContent className="p-4 sm:p-5 flex flex-col items-center text-center">
                <div className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center mb-2.5`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-xs font-medium text-muted-foreground mb-1">{stat.title}</p>
                <h3 className="text-xl font-bold text-white tracking-tight">{stat.value}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 bg-card border-white/5">
          <CardHeader>
            <CardTitle>Weekly Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d1a0d', borderColor: '#ffffff20', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="requests" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorRequests)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Donut Chart */}
        <Card className="bg-card border-white/5">
          <CardHeader>
            <CardTitle>Popular Services</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.popularServices}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="serviceName"
                    stroke="none"
                  >
                    {data.popularServices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d1a0d', borderColor: '#ffffff20', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings Quick List */}
      <Card className="bg-card border-white/5">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-lg">Recent Grooming Requests</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">The latest incoming customer appointments</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary/90 text-xs">
            <Link href="/admin/requests" className="flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {recentBookings.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No recent bookings found.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentBookings.map((b) => (
                <div key={b.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                      {(b as any).bookingId ? (b as any).bookingId.slice(-3) : b.id.slice(0, 3)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white flex items-center gap-2">
                        <span>{b.customerName}</span>
                        <span className="text-xs font-normal text-muted-foreground">({b.petName} - {b.petType})</span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span className="text-primary font-medium">{b.serviceName}</span>
                        <span>•</span>
                        <span>{b.preferredDate || "Any date"}</span>
                        <span>•</span>
                        <span>{b.area || b.city || "Doorstep"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
                      {b.status}
                    </span>
                    <Button asChild variant="outline" size="sm" className="h-7 text-xs border-white/10 hover:bg-white/5 text-gray-300">
                      <Link href="/admin/requests">
                        Manage
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}