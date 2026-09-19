import { useState } from "react";
import { useGetBookings, useUpdateBookingStatus, getGetBookingsQueryKey, type Booking } from "@workspace/api-client-react";
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
import { Search, Loader2, MapPin, ExternalLink, Eye, Phone, Mail, Calendar, Clock, PawPrint, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function AdminRequests() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
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
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking(prev => prev ? { ...prev, status: newStatus } : null);
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
        <div>
          <h1 className="text-3xl font-bold text-white">Bookings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage pet grooming appointments, verify locations, and update statuses.</p>
        </div>
        <Button asChild className="gap-2">
          <a href="/zoophilist/book" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4" /> Book New Appointment
          </a>
        </Button>
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
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedBooking(booking)}
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                            title="View Full Booking Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Select 
                            value={booking.status} 
                            onValueChange={(val) => handleStatusChange(booking.id, val)}
                            disabled={updateStatus.isPending}
                          >
                            <SelectTrigger className="w-[125px] h-8 text-xs bg-black/20 border-white/10">
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Booking Details Modal */}
      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl bg-card border-white/10 text-white max-h-[90vh] overflow-y-auto">
          {selectedBooking && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                      <span>Booking {(selectedBooking as any).bookingId || `#${selectedBooking.id.slice(0, 8)}`}</span>
                      {getStatusBadge(selectedBooking.status)}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground mt-1">
                      Received on {format(new Date(selectedBooking.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 pt-3 text-sm">
                {/* Customer & Location */}
                <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Customer & Doorstep Location
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground block">Customer Name</span>
                      <span className="text-white font-medium text-sm">{selectedBooking.customerName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Phone</span>
                      <a href={`tel:${selectedBooking.customerPhone}`} className="text-emerald-400 font-medium hover:underline flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {selectedBooking.customerPhone}
                      </a>
                    </div>
                    {selectedBooking.customerEmail && (
                      <div>
                        <span className="text-muted-foreground block">Email</span>
                        <a href={`mailto:${selectedBooking.customerEmail}`} className="text-gray-300 hover:underline flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {selectedBooking.customerEmail}
                        </a>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground block">City / Area</span>
                      <span className="text-white font-medium">{[selectedBooking.area, selectedBooking.city].filter(Boolean).join(", ") || "—"}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-muted-foreground block">Complete Address</span>
                      <span className="text-gray-200">{selectedBooking.address || "—"}</span>
                    </div>
                  </div>

                  {((selectedBooking as any).mapUrl || ((selectedBooking as any).latitude && (selectedBooking as any).longitude)) && (
                    <div className="pt-2 border-t border-white/5">
                      <a
                        href={(selectedBooking as any).mapUrl || `https://www.google.com/maps?q=${(selectedBooking as any).latitude},${(selectedBooking as any).longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Open Doorstep Location in Google Maps</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Pet & Service Details */}
                <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <PawPrint className="w-3.5 h-3.5" /> Pet & Appointment
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground block">Pet Name & Type</span>
                      <span className="text-white font-medium text-sm">{selectedBooking.petName} ({selectedBooking.petType})</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Breed & Age</span>
                      <span className="text-gray-300">{[selectedBooking.breed, selectedBooking.age ? `${selectedBooking.age} yrs` : null].filter(Boolean).join(" • ") || "—"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Requested Service</span>
                      <span className="text-primary font-semibold text-sm">{selectedBooking.serviceName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Scheduled Slot</span>
                      <span className="text-white font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" /> {selectedBooking.preferredDate || "Flexible"}
                        <Clock className="w-3 h-3 text-muted-foreground ml-1.5" /> {selectedBooking.preferredTime || "Anytime"}
                      </span>
                    </div>
                    {selectedBooking.aggressive && (
                      <div className="sm:col-span-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-amber-400 text-xs">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>Pet may show aggressive or nervous behavior. Extra grooming precautions recommended.</span>
                      </div>
                    )}
                    {selectedBooking.notes && (
                      <div className="sm:col-span-2">
                        <span className="text-muted-foreground block">Customer Notes</span>
                        <p className="text-gray-300 italic bg-black/20 p-2.5 rounded-lg border border-white/5 mt-1">"{selectedBooking.notes}"</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Media attachments */}
                {((selectedBooking.photoUrls && selectedBooking.photoUrls.length > 0) || (selectedBooking.videoUrls && selectedBooking.videoUrls.length > 0)) && (
                  <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">Attached Media</h4>
                    {selectedBooking.photoUrls && selectedBooking.photoUrls.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedBooking.photoUrls.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border border-white/10 hover:border-primary transition-colors">
                            <img src={url} alt={`Pet Photo ${i + 1}`} className="w-20 h-20 object-cover" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Status Control */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-xs text-muted-foreground">Update status for this booking:</span>
                  <Select 
                    value={selectedBooking.status} 
                    onValueChange={(val) => handleStatusChange(selectedBooking.id, val)}
                    disabled={updateStatus.isPending}
                  >
                    <SelectTrigger className="w-[140px] h-8 text-xs bg-black/20 border-white/10">
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
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}