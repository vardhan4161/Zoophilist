import { useState, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Phone, Mail, MapPin, PawPrint, Calendar, Clock,
  FileText, UploadCloud, CheckCircle2, ArrowRight, ArrowLeft,
  Loader2, Sparkles, X, Image as ImageIcon, Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PageTransition, AuroraBackground, FadeInUp } from "@/components/animations";
import { useGetServices, useCreateBooking } from "@workspace/api-client-react";
import { STATIC_SERVICES } from "@/lib/constants";

const bookingSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerPhone: z.string().min(10, "Valid 10-digit phone number required"),
  customerEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  city: z.string().min(2, "City is required"),
  area: z.string().min(2, "Area/Locality is required"),
  address: z.string().min(10, "Complete address required (min 10 characters)"),
  petName: z.string().min(2, "Pet name required"),
  petType: z.string().min(1, "Pet type required"),
  breed: z.string().optional(),
  age: z.string().optional(),
  aggressive: z.enum(["yes", "no"]),
  serviceId: z.string().min(1, "Please select a service"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a time slot"),
  notes: z.string().optional(),
});
type BookingFormValues = z.infer<typeof bookingSchema>;

const STEPS = [
  { id: 1, label: "Your Details", icon: User },
  { id: 2, label: "Pet Details", icon: PawPrint },
  { id: 3, label: "Service", icon: Sparkles },
  { id: 4, label: "Photos", icon: ImageIcon },
];

const TIME_SLOTS = [
  "Morning (8:00 – 10:00 AM)",
  "Late Morning (10:00 AM – 12:00 PM)",
  "Afternoon (12:00 – 2:00 PM)",
  "Late Afternoon (2:00 – 4:00 PM)",
  "Evening (4:00 – 6:00 PM)",
];

export default function Book() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const preselectedService = searchParams.get("service") || "";
  const [step, setStep] = useState(1);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const { data: apiServices } = useGetServices();
  const services = apiServices?.length ? apiServices : STATIC_SERVICES;
  const createBooking = useCreateBooking();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: "", customerPhone: "", customerEmail: "",
      city: "", area: "", address: "",
      petName: "", petType: "", breed: "", age: "", aggressive: "no",
      serviceId: preselectedService, preferredDate: "", preferredTime: "", notes: "",
    },
    mode: "onTouched",
  });

  const today = new Date().toISOString().split("T")[0];

  const validateStep = async (s: number) => {
    const fieldsByStep: Record<number, (keyof BookingFormValues)[]> = {
      1: ["customerName", "customerPhone", "city", "area", "address"],
      2: ["petName", "petType", "aggressive"],
      3: ["serviceId", "preferredDate", "preferredTime"],
    };
    const fields = fieldsByStep[s];
    if (!fields) return true;
    const valid = await form.trigger(fields);
    return valid;
  };

  const nextStep = async () => {
    const ok = await validateStep(step);
    if (ok) setStep((s) => Math.min(4, s + 1));
  };

  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const onSubmit = (data: BookingFormValues) => {
    const selectedService = services.find((s) => s.id === data.serviceId);
    createBooking.mutate({
      data: {
        ...data,
        aggressive: data.aggressive === "yes",
        serviceName: selectedService?.name ?? "Unknown Service",
        photoUrls: [],
        videoUrls: [],
      },
    }, {
      onSuccess: (data: any) => {
        const ref = data?.bookingId ? `?ref=${encodeURIComponent(data.bookingId)}` : "";
        setLocation(`/book/success${ref}`);
      },
      onError: () => setLocation("/book/success"),
    });
  };

  const selectedService = services.find(s => s.id === form.watch("serviceId"));

  return (
    <PageTransition className="pb-24">
      <section className="relative pt-36 pb-12 overflow-hidden">
        <AuroraBackground className="opacity-30" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <FadeInUp>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Book an Appointment
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Schedule Your Pet's<br />
              <span className="text-gradient">Grooming Session</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Fill in the details below and we'll bring the salon to your doorstep.
            </p>
          </FadeInUp>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-3xl">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-5 h-px bg-white/10 -z-0" />
            {STEPS.map((s) => {
              const done = step > s.id;
              const active = step === s.id;
              return (
                <div key={s.id} className="flex flex-col items-center gap-2 relative z-10">
                  <motion.div
                    animate={{
                      backgroundColor: done ? "hsl(142, 71%, 45%)" : active ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
                      borderColor: done || active ? "hsl(142, 71%, 45%)" : "rgba(255,255,255,0.1)",
                    }}
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-300"
                  >
                    {done ? (
                      <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                    ) : (
                      <s.icon className={`w-4.5 h-4.5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                    )}
                  </motion.div>
                  <span className={`text-xs font-medium hidden sm:block ${active ? "text-primary" : done ? "text-gray-300" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <StepCard key={1} title="Your Details" desc="Tell us how to reach you and where you're located.">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <FormField control={form.control} name="customerName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Rahul Sharma" className="bg-black/20 border-white/10 focus:border-primary/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="customerPhone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 98765 43210" className="bg-black/20 border-white/10 focus:border-primary/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="customerEmail" render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel className="text-gray-300">Email Address <span className="text-muted-foreground text-xs">(optional — for booking confirmation)</span></FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" className="bg-black/20 border-white/10 focus:border-primary/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="city" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">City *</FormLabel>
                        <FormControl>
                          <Input placeholder="Hyderabad" className="bg-black/20 border-white/10 focus:border-primary/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="area" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Area / Locality *</FormLabel>
                        <FormControl>
                          <Input placeholder="Banjara Hills" className="bg-black/20 border-white/10 focus:border-primary/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel className="text-gray-300">Complete Address *</FormLabel>
                        <FormControl>
                          <Textarea rows={3} placeholder="Flat No, Building Name, Street, Landmark..." className="bg-black/20 border-white/10 focus:border-primary/50 resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </StepCard>
              )}

              {step === 2 && (
                <StepCard key={2} title="Pet Details" desc="Help our groomer prepare for your pet's session.">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <FormField control={form.control} name="petName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Pet Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Bella" className="bg-black/20 border-white/10 focus:border-primary/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="petType" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Pet Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/20 border-white/10">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["Dog", "Cat", "Rabbit", "Bird", "Guinea Pig", "Other"].map(t => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="breed" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Breed <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Golden Retriever" className="bg-black/20 border-white/10 focus:border-primary/50" {...field} />
                        </FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="age" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Age <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 2 years" className="bg-black/20 border-white/10 focus:border-primary/50" {...field} />
                        </FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="aggressive" render={({ field }) => (
                      <FormItem className="sm:col-span-2 space-y-3">
                        <FormLabel className="text-gray-300">Is your pet aggressive or anxious during grooming? *</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-2 gap-3">
                            {["yes", "no"].map(val => (
                              <FormItem key={val} className={`relative flex items-center gap-3 rounded-xl border px-4 py-3.5 cursor-pointer transition-colors
                                ${field.value === val ? "border-primary/50 bg-primary/8" : "border-white/10 bg-black/20 hover:border-white/20"}`}>
                                <FormControl>
                                  <RadioGroupItem value={val} className="sr-only" />
                                </FormControl>
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${field.value === val ? "border-primary bg-primary" : "border-white/30"}`}>
                                  {field.value === val && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                                <FormLabel className="font-medium cursor-pointer capitalize">{val === "yes" ? "Yes, a bit" : "No, calm & easy"}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </StepCard>
              )}

              {step === 3 && (
                <StepCard key={3} title="Service Details" desc="Choose your grooming package, date, and preferred time.">
                  <div className="space-y-5">
                    {/* Service cards */}
                    <FormField control={form.control} name="serviceId" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Select Service *</FormLabel>
                        <div className="grid gap-3 mt-1">
                          {services.map(s => (
                            <label key={s.id} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all
                              ${field.value === s.id ? "border-primary/50 bg-primary/8" : "border-white/10 bg-black/20 hover:border-white/20"}`}>
                              <input type="radio" name="serviceId" value={s.id} checked={field.value === s.id} onChange={() => field.onChange(s.id)} className="sr-only" />
                              <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${field.value === s.id ? "border-primary bg-primary" : "border-white/30"}`}>
                                  {field.value === s.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                                <div>
                                  <div className="font-semibold text-white text-sm">{s.name}</div>
                                  <div className="text-xs text-muted-foreground">{s.features.slice(0,2).join(", ")}{s.features.length > 2 ? ` +${s.features.length - 2} more` : ""}</div>
                                </div>
                              </div>
                              <div className="text-right shrink-0 ml-4">
                                <div className="font-black text-primary">₹{s.price}</div>
                                {(s as any).originalPrice && <div className="text-xs text-muted-foreground line-through">₹{(s as any).originalPrice}</div>}
                              </div>
                            </label>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid sm:grid-cols-2 gap-5">
                      <FormField control={form.control} name="preferredDate" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Preferred Date *</FormLabel>
                          <FormControl>
                            <Input type="date" min={today} className="bg-black/20 border-white/10 focus:border-primary/50 [color-scheme:dark]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="preferredTime" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Preferred Time *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-black/20 border-white/10">
                                <SelectValue placeholder="Select a slot" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TIME_SLOTS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="notes" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Special Instructions <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
                        <FormControl>
                          <Textarea rows={3} placeholder="Any allergies, skin issues, preferred styles, or special requests..." className="bg-black/20 border-white/10 focus:border-primary/50 resize-none" {...field} />
                        </FormControl>
                      </FormItem>
                    )} />
                  </div>
                </StepCard>
              )}

              {step === 4 && (
                <StepCard key={4} title="Upload Photos & Videos" desc="Help our groomer prepare — photos of your pet's current coat, and videos of their temperament are incredibly helpful.">
                  <div className="space-y-6">
                    {/* Photo upload */}
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-3">Pet Photos <span className="text-muted-foreground text-xs">(JPG, PNG — max 5MB each)</span></p>
                      <input ref={photoRef} type="file" accept="image/*" multiple className="sr-only" onChange={e => {
                        const files = Array.from(e.target.files ?? []);
                        setPhotoFiles(prev => [...prev, ...files].slice(0, 5));
                      }} />
                      <div
                        onClick={() => photoRef.current?.click()}
                        className="flex flex-col items-center justify-center border-2 border-dashed border-white/15 rounded-2xl p-10 cursor-pointer hover:border-primary/40 hover:bg-primary/4 transition-all duration-200 group"
                      >
                        <ImageIcon className="w-8 h-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                        <p className="text-sm font-medium text-white">Click to upload photos</p>
                        <p className="text-xs text-muted-foreground mt-1">Up to 5 photos</p>
                      </div>
                      {photoFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {photoFiles.map((f, i) => (
                            <div key={i} className="relative group">
                              <img src={URL.createObjectURL(f)} alt="" className="w-16 h-16 object-cover rounded-xl border border-white/10" />
                              <button type="button" onClick={() => setPhotoFiles(prev => prev.filter((_, j) => j !== i))}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <X className="w-3 h-3 text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Video upload */}
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-3">Pet Videos <span className="text-muted-foreground text-xs">(MP4 — max 20MB)</span></p>
                      <input ref={videoRef} type="file" accept="video/*" multiple className="sr-only" onChange={e => {
                        const files = Array.from(e.target.files ?? []);
                        setVideoFiles(prev => [...prev, ...files].slice(0, 2));
                      }} />
                      <div
                        onClick={() => videoRef.current?.click()}
                        className="flex flex-col items-center justify-center border-2 border-dashed border-white/15 rounded-2xl p-10 cursor-pointer hover:border-primary/40 hover:bg-primary/4 transition-all duration-200 group"
                      >
                        <Video className="w-8 h-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                        <p className="text-sm font-medium text-white">Click to upload videos</p>
                        <p className="text-xs text-muted-foreground mt-1">Up to 2 videos</p>
                      </div>
                      {videoFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {videoFiles.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                              <Video className="w-4 h-4 text-primary shrink-0" />
                              <span className="text-xs text-gray-300 max-w-[120px] truncate">{f.name}</span>
                              <button type="button" onClick={() => setVideoFiles(prev => prev.filter((_, j) => j !== i))}>
                                <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Booking summary */}
                    {selectedService && (
                      <div className="rounded-2xl bg-primary/8 border border-primary/20 p-5">
                        <h4 className="font-bold text-white mb-3 text-sm">Booking Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="text-white font-medium">{selectedService.name}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="text-white font-medium">{form.watch("preferredDate") || "—"}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="text-white font-medium">{form.watch("preferredTime") || "—"}</span></div>
                          <div className="flex justify-between border-t border-white/10 pt-2 mt-2"><span className="text-muted-foreground">Total</span><span className="text-primary font-black text-base">₹{selectedService.price}</span></div>
                        </div>
                      </div>
                    )}
                  </div>
                </StepCard>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                type="button"
                onClick={prevStep}
                className={`flex items-center gap-2 h-12 px-6 rounded-xl border border-white/10 text-gray-300 font-semibold text-sm hover:bg-white/5 transition-colors ${step === 1 ? "invisible" : ""}`}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={createBooking.isPending}
                  className="flex items-center gap-2 h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {createBooking.isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" /> Confirm Booking</>
                  )}
                </button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </PageTransition>
  );
}

function StepCard({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card rounded-2xl p-7 mb-6"
    >
      <h2 className="text-xl font-black text-white mb-1">{title}</h2>
      <p className="text-sm text-muted-foreground mb-7">{desc}</p>
      {children}
    </motion.div>
  );
}
