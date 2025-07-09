interface TestimonialCardProps {
  quote: string
  attribution: string
  role: string
  delay?: number
}

export default function TestimonialCard({ quote, attribution, role, delay = 0 }: TestimonialCardProps) {
  return (
    <div 
      className="bg-warm-white rounded-organic p-8 shadow-gentle hover:shadow-soft transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Quote marks */}
      <div className="text-sage-mist mb-4">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      
      {/* Quote */}
      <p className="text-body text-text-primary mb-6 font-serif">
        {quote}
      </p>
      
      {/* Attribution */}
      <div className="border-t border-sage-mist/30 pt-4">
        <p className="text-body-sm font-sans">
          <span className="text-sage-primary font-medium">{attribution}</span>
          <span className="text-text-secondary">, {role}</span>
        </p>
      </div>
    </div>
  )
}