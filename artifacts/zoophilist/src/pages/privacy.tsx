import { PageTransition, FadeInUp, SectionLabel } from "@/components/animations";
import { Shield } from "lucide-react";

const SECTIONS = [
  {
    title: "Information We Collect",
    content: `When you book a grooming service with Zoophilist, we collect the following information:
    
• **Personal Information**: Your full name, phone number, and email address (optional)
• **Address Information**: Your city, area, and complete address for doorstep service delivery
• **Pet Information**: Your pet's name, type, breed, age, and behavioral information
• **Service Preferences**: Selected services, preferred dates, times, and special instructions
• **Media**: Photos and videos you upload to help our groomers prepare for your pet's session`,
  },
  {
    title: "How We Use Your Information",
    content: `We use the information we collect to:

• Confirm and schedule your grooming appointment
• Assign the most suitable certified groomer for your pet
• Send booking confirmations and appointment reminders
• Contact you about your appointment status
• Improve our services based on your feedback
• Comply with legal obligations

We do not sell, rent, or share your personal information with third parties for marketing purposes.`,
  },
  {
    title: "Data Security",
    content: `We take the security of your personal data seriously. Your information is:

• Stored on secure, encrypted servers
• Accessible only to authorized Zoophilist staff involved in your service
• Protected by industry-standard security measures
• Never shared with unauthorized parties

We retain your data only as long as necessary to provide our services and comply with legal requirements.`,
  },
  {
    title: "Media & Uploads",
    content: `Photos and videos you upload of your pets are used solely to help our groomers prepare for your session. These files are:

• Stored securely on our servers
• Accessible only to the assigned groomer and administrative staff
• Used exclusively for grooming preparation purposes
• Not shared publicly without your explicit written consent`,
  },
  {
    title: "Your Rights",
    content: `You have the right to:

• Access the personal information we hold about you
• Request correction of inaccurate or incomplete information
• Request deletion of your personal data (subject to legal requirements)
• Opt out of non-essential communications
• Lodge a complaint with relevant data protection authorities

To exercise any of these rights, please contact us at zoophilistpetservice@gmail.com or call +91 9515247704.`,
  },
  {
    title: "Cookies & Analytics",
    content: `Our website may use cookies and similar tracking technologies to:

• Improve your browsing experience
• Analyze website traffic and usage patterns
• Remember your preferences

You can control cookie settings through your browser preferences. Disabling cookies may affect certain website functionality.`,
  },
  {
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy periodically to reflect changes in our practices or for legal compliance. We will notify you of significant changes by:

• Posting the updated policy on our website
• Sending an email notification (if you've provided an email address)
• Displaying a notice on our booking page

The date of the most recent update is shown at the bottom of this page.`,
  },
  {
    title: "Contact Us",
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your personal data, please contact us:

• **Phone**: +91 9515247704
• **Email**: zoophilistpetservice@gmail.com
• **Response Time**: We aim to respond to all privacy-related queries within 48 hours`,
  },
];

export default function Privacy() {
  return (
    <PageTransition className="pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-12 text-center">
          <SectionLabel>
            <Shield className="w-3.5 h-3.5" /> Legal
          </SectionLabel>
          <FadeInUp>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: July 17, 2026 · Effective immediately
            </p>
          </FadeInUp>
        </div>

        <FadeInUp>
          <div className="glass-card rounded-2xl p-8 mb-8">
            <p className="text-gray-300 leading-relaxed">
              At Zoophilist, we are committed to protecting your privacy and the personal information you share with us. 
              This Privacy Policy explains how we collect, use, store, and protect your data when you use our doorstep pet grooming services.
              By booking a service with us, you agree to the terms described in this policy.
            </p>
          </div>
        </FadeInUp>

        <div className="space-y-6">
          {SECTIONS.map((section, i) => (
            <FadeInUp key={i} delay={i * 0.05}>
              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-4">{i + 1}. {section.title}</h2>
                <div className="text-gray-300 leading-relaxed whitespace-pre-line text-sm">
                  {section.content.split("**").map((part, j) =>
                    j % 2 === 0 ? part : <strong key={j} className="text-white font-semibold">{part}</strong>
                  )}
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
