import { PageTransition, FadeInUp, SectionLabel } from "@/components/animations";
import { FileText } from "lucide-react";

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    content: `By accessing our website or booking a grooming service with Zoophilist, you confirm that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.

These terms constitute a legally binding agreement between you and Zoophilist Pet Services. We reserve the right to modify these terms at any time, with changes effective upon posting to our website.`,
  },
  {
    title: "Services",
    content: `Zoophilist provides professional doorstep pet grooming services including but not limited to:

• Spa Bath and Blow Dry
• Full Grooming and Styling
• Haircuts and Trimming
• Medical Bath and Anti-Tick Treatment
• Monthly Subscription Packages

All services are performed by certified, trained groomers at the customer's designated address. Service availability may vary by location.`,
  },
  {
    title: "Booking & Appointments",
    content: `**Booking Confirmation**: Bookings are not confirmed until you receive explicit confirmation from our team via phone or WhatsApp.

**Cancellations**: We request at least 24 hours notice for cancellations or rescheduling. Last-minute cancellations may result in a cancellation fee.

**No-Shows**: If our groomer arrives and cannot access your premises, a no-show fee may apply.

**Time Slots**: Appointment times are estimates. Our groomers may arrive within 30 minutes of the scheduled time due to traffic or previous session overruns.`,
  },
  {
    title: "Pet Safety & Responsibility",
    content: `**Your Responsibilities**: You must disclose accurate information about your pet's health, behavior, aggression history, known allergies, and any medical conditions prior to the session.

**Health Requirements**: Pets with contagious conditions (ringworm, kennel cough, etc.) must not be groomed. We reserve the right to refuse or discontinue service if a pet shows signs of illness.

**Aggressive Pets**: While our groomers are trained to handle difficult pets, we reserve the right to stop a session and charge a partial fee if safety is compromised.

**Senior & Medical Pets**: Grooming can be physically demanding. We are not liable for health issues arising in senior or medically compromised pets. Consult your veterinarian before booking.`,
  },
  {
    title: "Pricing & Payment",
    content: `**Pricing**: All prices listed are in Indian Rupees (₹) and are subject to change. Prices may vary based on pet size, coat condition, and additional services required.

**Payment**: Payment is due at the time of service. We accept cash, UPI, and bank transfers.

**Subscription Plans**: Subscription packages are non-refundable once the first session has been completed. Unused sessions do not carry over after the subscription period ends.

**Additional Charges**: Extra charges may apply for severely matted coats, aggressive behavior, or services not included in the booked package.`,
  },
  {
    title: "Liability & Disclaimers",
    content: `**Limitation of Liability**: Zoophilist and its groomers are not liable for pre-existing conditions discovered or exacerbated during grooming.

**Accidents**: While we take every precaution, minor nicks or skin irritation can occasionally occur during grooming. We will inform you immediately of any incident.

**Property**: We take care to protect your property but are not liable for accidental damage to furniture, flooring, or other items.

**Service Guarantee**: If you are unsatisfied with our service, please contact us within 24 hours and we will work to make it right.`,
  },
  {
    title: "Privacy",
    content: `Your use of our services is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.`,
  },
  {
    title: "Governing Law",
    content: `These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes arising from these terms or your use of our services shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana, India.`,
  },
  {
    title: "Contact",
    content: `For questions about these Terms of Service, please contact us:

• **Phone**: +91 9515247704
• **Email**: zoophilistpetservice@gmail.com

We aim to resolve all queries within 48 business hours.`,
  },
];

export default function Terms() {
  return (
    <PageTransition className="pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-12 text-center">
          <SectionLabel>
            <FileText className="w-3.5 h-3.5" /> Legal
          </SectionLabel>
          <FadeInUp>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">
              Last updated: July 17, 2026 · Please read carefully before using our services
            </p>
          </FadeInUp>
        </div>

        <FadeInUp>
          <div className="glass-card rounded-2xl p-8 mb-8">
            <p className="text-gray-300 leading-relaxed">
              Welcome to Zoophilist. These Terms of Service govern your use of our website and doorstep pet grooming services.
              These terms protect both you and Zoophilist, ensuring a safe, transparent, and professional service experience.
            </p>
          </div>
        </FadeInUp>

        <div className="space-y-6">
          {SECTIONS.map((section, i) => (
            <FadeInUp key={i} delay={i * 0.04}>
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
