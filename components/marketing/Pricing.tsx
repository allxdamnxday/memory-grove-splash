import PricingCard from '@/components/ui/PricingCard'
import { pricingTiers } from '@/lib/data/pricing'

export default function Pricing() {
  return (
    <section className="section-spacing bg-sage-mist/10">
      <div className="container-grove">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-serif text-h1 md:text-display-sm text-sage-deep mb-6">
            Every Family Deserves Forever
          </h2>
          <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
            Choose the plan that grows with your legacy. Start free, upgrade anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <PricingCard
              key={tier.id}
              name={tier.name}
              price={tier.price}
              period={tier.period}
              description={tier.description}
              features={tier.features}
              cta={tier.cta}
              variant={tier.variant}
              popular={tier.popular}
              delay={index * 200}
            />
          ))}
        </div>

        <div className="text-center mt-12 animate-fade-in animation-delay-800">
          <p className="text-body-sm text-text-light">
            All plans include our sacred promise: Your memories are protected with bank-level encryption 
            and will never be sold or shared.
          </p>
        </div>
      </div>
    </section>
  )
}