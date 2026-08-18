import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Loader2, Phone, Mail, MapPin, Clock, Instagram, Facebook, Youtube, MessageCircle, Bot, Cloud, Settings2, Search, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE_URL = import.meta.env.BASE_URL ?? "/zoophilist/";

function getAdminToken(): string {
  return localStorage.getItem("adminToken") ?? "";
}

async function fetchSettings() {
  const res = await fetch(`${BASE_URL}api/settings`, {
    headers: { Authorization: `Bearer ${getAdminToken()}` },
  });
  if (!res.ok) throw new Error("Failed to load settings");
  return res.json();
}

async function saveSettings(data: Record<string, string>) {
  const res = await fetch(`${BASE_URL}api/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAdminToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save settings");
  return res.json();
}

type Section = {
  title: string;
  description: string;
  icon: any;
  fields: { key: string; label: string; placeholder?: string; type?: string; multiline?: boolean }[];
};

const SECTIONS: Section[] = [
  {
    title: "Contact Information",
    description: "Your public-facing contact details shown across the website.",
    icon: Phone,
    fields: [
      { key: "phone", label: "Phone Number", placeholder: "+91 9515247704" },
      { key: "email", label: "Email Address", placeholder: "zoophilistpetservice@gmail.com" },
      { key: "address", label: "Service Area / Address", placeholder: "Doorstep service across major cities in India", multiline: true },
    ],
  },
  {
    title: "Working Hours",
    description: "When your team is available to accept and serve bookings.",
    icon: Clock,
    fields: [
      { key: "workingHoursStart", label: "Opening Time", placeholder: "08:00", type: "time" },
      { key: "workingHoursEnd", label: "Closing Time", placeholder: "20:00", type: "time" },
      { key: "workingDays", label: "Working Days", placeholder: "Monday–Sunday" },
    ],
  },
  {
    title: "Social Media Links",
    description: "Links shown in the website footer and contact page.",
    icon: Instagram,
    fields: [
      { key: "instagramUrl", label: "Instagram URL", placeholder: "https://instagram.com/zoophilist" },
      { key: "facebookUrl", label: "Facebook URL", placeholder: "https://facebook.com/zoophilist" },
      { key: "youtubeUrl", label: "YouTube URL", placeholder: "https://youtube.com/zoophilist" },
      { key: "whatsappNumber", label: "WhatsApp Number", placeholder: "+919515247704" },
    ],
  },
  {
    title: "SEO & Meta",
    description: "Search engine and social media metadata for your website.",
    icon: Search,
    fields: [
      { key: "seoTitle", label: "Page Title", placeholder: "Zoophilist — Premium Doorstep Pet Grooming" },
      { key: "seoDescription", label: "Meta Description", placeholder: "India's #1 premium doorstep pet grooming platform.", multiline: true },
    ],
  },
  {
    title: "Telegram Notifications",
    description: "Receive instant Telegram notifications when a new booking is placed. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID as environment variables for production.",
    icon: Bot,
    fields: [
      { key: "telegramBotToken", label: "Bot Token", placeholder: "Set via env var TELEGRAM_BOT_TOKEN", type: "password" },
      { key: "telegramChatId", label: "Chat ID", placeholder: "e.g. -1001234567890" },
    ],
  },
  {
    title: "Email Notifications (Resend)",
    description: "Send booking confirmation emails to customers and notify your team. Set RESEND_API_KEY as an environment variable.",
    icon: Mail,
    fields: [
      { key: "resendApiKey", label: "Resend API Key", placeholder: "Set via env var RESEND_API_KEY", type: "password" },
      { key: "adminEmail", label: "Admin Notification Email", placeholder: "zoophilistpetservice@gmail.com" },
    ],
  },
  {
    title: "Cloudinary (Media Storage)",
    description: "Cloudinary is used to store pet photos and videos uploaded during booking. Set credentials as environment variables.",
    icon: Cloud,
    fields: [
      { key: "cloudinaryCloudName", label: "Cloud Name", placeholder: "Set via env var CLOUDINARY_CLOUD_NAME" },
      { key: "cloudinaryApiKey", label: "API Key", placeholder: "Set via env var CLOUDINARY_API_KEY", type: "password" },
    ],
  },
];

export default function AdminSettings() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings()
      .then((data) => { setValues(data); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, []);

  const handleChange = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSettings(values);
      toast({ title: "Settings saved", description: "All changes have been saved successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to save settings. Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your business configuration, integrations, and notifications.</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      {SECTIONS.map((section) => (
        <Card key={section.title} className="bg-card border-white/5">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <section.icon className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">{section.title}</CardTitle>
                <CardDescription className="text-xs mt-0.5">{section.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`grid gap-4 ${section.fields.length >= 3 && !section.fields.some(f => f.multiline) ? "sm:grid-cols-2" : "grid-cols-1"}`}>
              {section.fields.map((field) => (
                <div key={field.key} className={`space-y-2 ${field.multiline ? "sm:col-span-2" : ""}`}>
                  <Label className="text-gray-300 text-sm">{field.label}</Label>
                  {field.multiline ? (
                    <Textarea
                      rows={2}
                      placeholder={field.placeholder}
                      value={values[field.key] ?? ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="bg-background/50 border-white/10 focus:border-primary/50 resize-none text-sm"
                    />
                  ) : (
                    <Input
                      type={field.type ?? "text"}
                      placeholder={field.placeholder}
                      value={values[field.key] ?? ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="bg-background/50 border-white/10 focus:border-primary/50 text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Admin credentials note */}
      <Card className="bg-card border-white/5">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Shield className="w-4.5 h-4.5 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-base">Admin Credentials</CardTitle>
              <CardDescription className="text-xs mt-0.5">Admin credentials are managed via environment variables for security.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4 text-sm text-amber-200">
            <p className="font-medium mb-1">To change admin credentials:</p>
            <p className="text-amber-200/70">Update the <code className="bg-black/30 px-1 py-0.5 rounded text-xs">ADMIN_USERNAME</code> and <code className="bg-black/30 px-1 py-0.5 rounded text-xs">ADMIN_PASSWORD</code> environment variables in your deployment environment.</p>
          </div>
        </CardContent>
      </Card>

      {/* Save button at bottom */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>
    </div>
  );
}
