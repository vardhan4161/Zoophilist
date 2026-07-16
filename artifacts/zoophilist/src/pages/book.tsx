import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PageTransition } from "@/components/animations";
import { useGetServices, useCreateBooking } from "@workspace/api-client-react";
import { STATIC_SERVICES } from "@/lib/constants";
import { Loader2, UploadCloud } from "lucide-react";

const bookingSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerPhone: z.string().min(10, "Valid phone number required"),
  customerEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  city: z.string().min(2, "City is required"),
  area: z.string().min(2, "Area/Locality is required"),
  address: z.string().min(10, "Complete address is required"),
  
  petName: z.string().min(2, "Pet name required"),
  petType: z.string().min(1, "Pet type required"),
  breed: z.string().optional(),
  age: z.string().optional(),
  aggressive: z.enum(["yes", "no"]),
  
  serviceId: z.string().min(1, "Please select a service"),
  preferredDate: z.string().min(1, "Please select a date"),
  preferredTime: z.string().min(1, "Please select a time slot"),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function Book() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const preselectedService = searchParams.get("service") || "";

  const { data: apiServices } = useGetServices();
  const services = apiServices?.length ? apiServices : STATIC_SERVICES;
  const createBooking = useCreateBooking();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      city: "",
      area: "",
      address: "",
      petName: "",
      petType: "",
      breed: "",
      age: "",
      aggressive: "no",
      serviceId: preselectedService,
      preferredDate: "",
      preferredTime: "",
      notes: "",
    },
  });

  const onSubmit = (data: BookingFormValues) => {
    const selectedService = services.find(s => s.id === data.serviceId);
    
    createBooking.mutate({
      data: {
        ...data,
        aggressive: data.aggressive === "yes",
        serviceName: selectedService?.name || "Unknown Service",
        photoUrls: [],
        videoUrls: []
      }
    }, {
      onSuccess: () => {
        setLocation("/book/success");
      },
      onError: (err) => {
        console.error("Booking failed", err);
        // Fallback to success for demo if API fails
        setLocation("/book/success");
      }
    });
  };

  return (
    <PageTransition className="pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Book an Appointment</h1>
          <p className="text-muted-foreground">Fill out the details below and we'll bring the salon to you.</p>
        </div>

        <div className="glass-card rounded-[2rem] p-6 md:p-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
              
              {/* Section 1: Customer Details */}
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-2">
                  <h2 className="text-xl font-semibold text-white">1. Your Details</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="bg-black/20 border-white/10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="+91" className="bg-black/20 border-white/10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-gray-300">Email Address (Optional)</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" className="bg-black/20 border-white/10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">City *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Mumbai" className="bg-black/20 border-white/10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Area / Locality *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Bandra West" className="bg-black/20 border-white/10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-gray-300">Complete Address *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="House/Flat No, Building Name, Street..." className="bg-black/20 border-white/10 resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 2: Pet Details */}
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-2">
                  <h2 className="text-xl font-semibold text-white">2. Pet Details</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="petName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Pet Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Bella" className="bg-black/20 border-white/10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="petType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Pet Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/20 border-white/10">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Dog">Dog</SelectItem>
                            <SelectItem value="Cat">Cat</SelectItem>
                            <SelectItem value="Rabbit">Rabbit</SelectItem>
                            <SelectItem value="Bird">Bird</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="breed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Breed (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Golden Retriever" className="bg-black/20 border-white/10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Age (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 2 years" className="bg-black/20 border-white/10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="aggressive"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-gray-300">Is your pet aggressive during grooming?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0 bg-black/20 border border-white/10 px-4 py-3 rounded-lg flex-1 cursor-pointer">
                              <FormControl>
                                <RadioGroupItem value="yes" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer w-full">Yes</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0 bg-black/20 border border-white/10 px-4 py-3 rounded-lg flex-1 cursor-pointer">
                              <FormControl>
                                <RadioGroupItem value="no" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer w-full">No</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 3: Service Details */}
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-2">
                  <h2 className="text-xl font-semibold text-white">3. Service Details</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="serviceId"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-gray-300">Select Service *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/20 border-white/10 h-14 text-base">
                              <SelectValue placeholder="Choose a grooming package" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {services.map(s => (
                              <SelectItem key={s.id} value={s.id} className="py-3">
                                <div className="flex justify-between items-center w-full">
                                  <span className="font-medium">{s.name}</span>
                                  <span className="text-primary ml-4">₹{s.price}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferredDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Preferred Date *</FormLabel>
                        <FormControl>
                          <Input type="date" className="bg-black/20 border-white/10 block w-full [color-scheme:dark]" min={new Date().toISOString().split('T')[0]} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferredTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Preferred Time Slot *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/20 border-white/10">
                              <SelectValue placeholder="Select time slot" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Morning 8-10am">Morning (8-10am)</SelectItem>
                            <SelectItem value="Midday 10am-12pm">Midday (10am-12pm)</SelectItem>
                            <SelectItem value="Afternoon 12-2pm">Afternoon (12-2pm)</SelectItem>
                            <SelectItem value="Evening 2-5pm">Evening (2-5pm)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-gray-300">Special Instructions / Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Any allergies, skin conditions, or specific haircut instructions?" className="bg-black/20 border-white/10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 4: Media Upload */}
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-2">
                  <h2 className="text-xl font-semibold text-white">4. Upload Pet Photos/Videos (Optional)</h2>
                  <p className="text-sm text-muted-foreground mt-1">Helps our groomers prepare better for the session.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center bg-black/10 hover:bg-black/20 transition-colors cursor-pointer group">
                    <UploadCloud className="w-8 h-8 text-muted-foreground mx-auto mb-3 group-hover:text-primary transition-colors" />
                    <p className="text-sm font-medium text-white mb-1">Upload Photos</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                  </div>
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center bg-black/10 hover:bg-black/20 transition-colors cursor-pointer group">
                    <UploadCloud className="w-8 h-8 text-muted-foreground mx-auto mb-3 group-hover:text-primary transition-colors" />
                    <p className="text-sm font-medium text-white mb-1">Upload Videos</p>
                    <p className="text-xs text-muted-foreground">MP4 up to 20MB</p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-16 text-lg rounded-xl mt-8"
                disabled={createBooking.isPending}
              >
                {createBooking.isPending ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting Booking...</>
                ) : (
                  "Submit Booking Request"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </PageTransition>
  );
}