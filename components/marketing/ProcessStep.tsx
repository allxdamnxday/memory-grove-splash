interface ProcessStepProps {
  number: number
  title: string
  subtitle: string
  description: string
  details: string[]
  icon: string
  isLast: boolean
  delay?: number
}

export default function ProcessStep({ 
  number, 
  title, 
  subtitle, 
  description, 
  details, 
  icon, 
  isLast,
  delay = 0 
}: ProcessStepProps) {
  const getIcon = () => {
    switch (icon) {
      case 'microphone':
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.5 10.5h1m11 0h1m-6.5-5v1" className="opacity-50" />
          </svg>
        )
      case 'tree':
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v18M5 7h14m0 4H5m14 4H5m14 4H5" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3l7-1v20l-7-1m14-18l-7-1v20l7-1" />
            <circle cx="12" cy="8" r="1" fill="currentColor" />
            <circle cx="9" cy="12" r="1" fill="currentColor" />
            <circle cx="15" cy="12" r="1" fill="currentColor" />
            <circle cx="12" cy="16" r="1" fill="currentColor" />
          </svg>
        )
      case 'calendar':
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" className="scale-50 origin-center translate-x-2 -translate-y-3" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="relative animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex flex-col md:flex-row gap-8 mb-16">
        {/* Step Number & Icon */}
        <div className="flex-shrink-0">
          <div className="relative">
            {/* Step Number Circle */}
            <div className="w-24 h-24 bg-sage-mist rounded-full flex items-center justify-center">
              <span className="font-sans text-display-sm text-sage-deep">{number}</span>
            </div>
            {/* Icon Badge */}
            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-warm-white rounded-full shadow-soft flex items-center justify-center text-sage-primary">
              {getIcon()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-serif text-h1 text-sage-deep mb-2">
            {title}
          </h3>
          <p className="text-body-lg text-sage-primary mb-4">
            {subtitle}
          </p>
          <p className="text-body text-text-secondary mb-6">
            {description}
          </p>
          
          {/* Details List */}
          <ul className="space-y-3">
            {details.map((detail, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-5 h-5 text-sage-primary mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-body-sm text-text-secondary">{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Connecting Line */}
      {!isLast && (
        <div className="hidden md:block absolute left-12 top-28 bottom-0 w-0.5 bg-sage-light/30" />
      )}
    </div>
  )
}