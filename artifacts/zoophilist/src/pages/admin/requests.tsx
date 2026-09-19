import { useState } from "react";
import { useGetBookings, useUpdateBookingStatus, getGetBookingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Search, Loader2, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminRequests() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const queryParams = statusFilter === "all" ? {} : { status: statusFilter as any };
  const { data: response, isLoading } = useGetBookings(queryParams);
  const bookings = response?.bookings || [];
  
  const updateStatus = useUpdateBookingStatus();
  const queryClient = useQueryClient();

  const handleStatusChange = (id: string, newStatus: any) => {
    updateStatus.mutate({
      id,
      data: { status: newStatus }
    }, {
      onSuccess: () => {
        // Invalidate both all and specific status queries
        queryClient.invalidateQueries({ queryKey: getGetBookingsQueryKey({}) });
        if (statusFilter !== "all") {
          queryClient.invalidateQueries({ queryKey: getGetBookingsQueryKey({ status: statusFilter as any }) });
        }
      }
    });
  };

  const filteredBookings = bookings.filter(b => {
    const q = searchTerm.toLowerCase();
    return (
      b.customerName.toLowerCase().includes(q) ||
      b.petName.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q) ||
      ((b as any).bookingId ?? "").toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "pending": return <Badge className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/20">Pending</Badge>;
      case "confirmed": return <Badge className="bg-indigo-500/20 text-indigo-500 hover:bg-indigo-500/20">Confirmed</Badge>;
      case "completed": return <Badge className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20">Completed</Badge>;
      case "scheduled": return <Badge className="bg-cyan-500/20 text-cyan-500 hover:bg-cyan-500/20">Scheduled</Badge>;
      case "cancelled": return <Badge className="bg-rose-500/20 text-rose-500 hover:bg-rose-500/20">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Bookings</h1>
        <Button>Add Request</Button>
      </div>

      <Card className="bg-card border-white/5">
        <CardContent className="p-0">
          <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between gap-4">
            <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto">
              <TabsList className="bg-black/20">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                className="pl-9 bg-black/20 border-white/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-gray-400">ID / Date</TableHead>
                  <TableHead className="text-gray-400">Customer</TableHead>
                  <TableHead className="text-gray-400">Pet & Service</TableHead>
                  <TableHead className="text-gray-400">Preferred Slot</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-right text-gray-400">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                    </TableCell>
                  </TableRow>
                ) : filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No bookings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking.id} className="border-white/5 hover:bg-white/[0.02]">
                      <TableCell>
                        <div className="font-mono font-semibold text-primary text-xs">
                          {(booking as any).bookingId || `#${booking.id.slice(0, 6)}`}
                        </div>
                        <div className="text-xs text-muted-foreground">{format(new Date(booking.createdAt), "MMM d, yyyy")}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-white">{booking.customerName}</div>
                        <div className="text-xs text-muted-foreground">{booking.customerPhone}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[150px]" title={booking.area}>{booking.area}</div>
                        {((booking as any).mapUrl || ((booking as any).latitude && (booking as any).longitude)) && (
                          <div className="mt-1">
                            <a
                              href={(booking as any).mapUrl || `https://www.google.com/maps?q=${(booking as any).latitude},${(booking as any).longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 px-2 py-0.5 rounded transition-colors"
                              title="Open pinned location in Google Maps"
                            >
                              <MapPin className="w-3 h-3 text-emerald-400" />
                              <span>Doorstep Pin ↗</span>
                            </a>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-white">{booking.petName} <span className="text-xs text-muted-foreground">({booking.petType})</span></div>
                        <div className="text-sm text-primary">{booking.serviceName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-white">{booking.preferredDate}</div>
                        <div className="text-xs text-muted-foreground">{booking.preferredTime}</div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(booking.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Select 
                          value={booking.status} 
                          onValueChange={(val) => handleStatusChange(booking.id, val)}
                          disabled={updateStatus.isPending}
                        >
                          <SelectTrigger className="w-[130px] h-8 text-xs ml-auto bg-black/20 border-white/10">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}