import { PageTransition } from "@/components/animations";

export default function Privacy() {
  return (
    <PageTransition className="pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="glass-card rounded-[2rem] p-8 md:p-16 prose prose-invert max-w-none">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us when booking our services. This includes:</p>
          <ul>
            <li>Name and contact information (phone number, email address)</li>
            <li>Address for doorstep service delivery</li>
            <li>Pet details (name, breed, age, behavioral traits)</li>
            <li>Media (photos/videos) uploaded during booking</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the collected information for various purposes:</p>
          <ul>
            <li>To provide and maintain our doorstep pet grooming services</li>
            <li>To notify you about changes to our services or your appointment</li>
            <li>To provide customer care and support</li>
            <li>To ensure the safety of our groomers by understanding your pet's behavioral traits</li>
          </ul>

          <h2>3. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information. However, please note that no method of transmission over the internet or electronic storage is 100% secure.</p>

          <h2>4. Sharing of Information</h2>
          <p>We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners.</p>

          <h2>5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p>Email: zoophilistpetservice@gmail.com<br />Phone: +91 9515247704</p>
        </div>
      </div>
    </PageTransition>
  );
}