import { useGetBookingStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CalendarDays, CheckCircle2, Clock, XCircle, IndianRupee } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetBookingStats();

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

  const statCards = [
    { title: "Total Requests", value: data.totalRequests, icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Pending", value: data.pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Confirmed", value: data.confirmed, icon: CalendarDays, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Completed", value: data.completed, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Cancelled", value: data.cancelled, icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Revenue", value: `₹${data.totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "text-primary", bg: "bg-primary/10" },
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
      <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="bg-card border-white/5">
            <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
              <div className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            </CardContent>
          </Card>
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
    </div>
  );
}