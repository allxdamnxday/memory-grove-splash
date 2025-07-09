import Button from '@/components/ui/Button'

interface PricingCardProps {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  cta: string
  variant: 'primary' | 'secondary'
  popular?: boolean
  delay?: number
}

export default function PricingCard({ 
  name, 
  price, 
  period, 
  description, 
  features, 
  cta, 
  variant, 
  popular = false,
  delay = 0 
}: PricingCardProps) {
  return (
    <div 
      className={`relative bg-warm-white rounded-organic p-8 transition-all duration-300 animate-scale-in ${
        popular ? 'shadow-soft transform scale-105' : 'shadow-gentle hover:shadow-soft'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-sage-primary text-warm-white px-4 py-1 rounded-full text-caption font-sans">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="font-serif text-h3 text-sage-deep mb-2">{name}</h3>
        <p className="text-body-sm text-text-secondary mb-4">{description}</p>
        <div className="mb-6">
          <span className="font-serif text-display-sm text-sage-primary">{price}</span>
          {period && <span className="text-body text-text-secondary">{period}</span>}
        </div>
      </div>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="w-5 h-5 text-sage-primary mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-body-sm text-text-secondary">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        href="/start" 
        variant={variant} 
        size="md" 
        className="w-full"
      >
        {cta}
      </Button>
    </div>
  )
}