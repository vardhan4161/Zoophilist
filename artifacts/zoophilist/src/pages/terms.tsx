import { PageTransition } from "@/components/animations";

export default function Terms() {
  return (
    <PageTransition className="pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="glass-card rounded-[2rem] p-8 md:p-16 prose prose-invert max-w-none">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Service Acceptance</h2>
          <p>By booking a grooming appointment with Zoophilist, you agree to comply with and be bound by these Terms of Service.</p>

          <h2>2. Doorstep Service Requirements</h2>
          <ul>
            <li>A safe, well-lit area must be provided for the grooming process.</li>
            <li>Access to a power outlet and water supply may be required depending on the service.</li>
            <li>An adult (18+) must be present during the entire grooming session.</li>
          </ul>

          <h2>3. Pet Behavior and Safety</h2>
          <p>For the safety of both your pet and our groomers:</p>
          <ul>
            <li>You must disclose any behavioral issues (e.g., aggression, anxiety) during booking.</li>
            <li>We reserve the right to refuse or stop service if a pet becomes excessively aggressive or poses a safety risk.</li>
            <li>Full payment may still be required if a groom is stopped due to undisclosed aggression.</li>
          </ul>

          <h2>4. Health Conditions</h2>
          <p>Pets must be up-to-date on vaccinations. You must inform us of any pre-existing medical conditions, allergies, or sensitive areas before the grooming begins.</p>

          <h2>5. Cancellations and Rescheduling</h2>
          <p>Please provide at least 24 hours notice for cancellations or rescheduling. Late cancellations may incur a fee.</p>

          <h2>6. Pricing and Payment</h2>
          <p>Prices listed are base prices. Final pricing may vary depending on the pet's size, coat condition, and temperament. Payment is due upon completion of the service.</p>
        </div>
      </div>
    </PageTransition>
  );
}