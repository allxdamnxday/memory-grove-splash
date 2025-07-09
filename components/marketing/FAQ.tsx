import FAQItem from '@/components/ui/FAQItem'
import { faqs } from '@/lib/data/faq'

export default function FAQ() {
  return (
    <section className="section-spacing bg-warm-white">
      <div className="container-grove">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-serif text-h1 md:text-display-sm text-sage-deep mb-6">
            Gentle Answers to Important Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              delay={index * 100}
            />
          ))}
        </div>

        <div className="text-center mt-16 animate-fade-in animation-delay-600">
          <p className="text-body text-text-secondary mb-6">
            Have more questions? We&apos;re here to help with compassion and understanding.
          </p>
          <a 
            href="mailto:support@memorygrove.com" 
            className="text-sage-primary hover:text-sage-deep transition-colors font-sans text-body-sm"
          >
            support@memorygrove.com
          </a>
        </div>
      </div>
    </section>
  )
}