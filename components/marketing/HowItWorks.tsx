import Button from '@/components/ui/Button'

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Plant Your Voice',
      description: 'Start with what\'s easy—a favorite story, a simple "I love you," or advice for the future. Our gentle prompts guide you.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.5 10.5h1m11 0h1m-6.5-5v1" className="opacity-50" />
        </svg>
      )
    },
    {
      number: '2',
      title: 'Grow Your Grove',
      description: 'Add messages for specific moments: birthdays, graduations, "when you need me" times. Build your legacy naturally, one recording at a time.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v18M5 7h14m0 4H5m14 4H5m14 4H5" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3l7-1v20l-7-1m14-18l-7-1v20l7-1" />
          <circle cx="12" cy="8" r="1" fill="currentColor" />
          <circle cx="9" cy="12" r="1" fill="currentColor" />
          <circle cx="15" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
        </svg>
      )
    },
    {
      number: '3',
      title: 'Set Your Seasons',
      description: 'Choose when messages bloom—immediately, on specific dates, or when life milestones arrive. Your voice, perfectly timed.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" className="scale-50 origin-center translate-x-2 -translate-y-3" />
        </svg>
      )
    }
  ]

  return (
    <section className="section-spacing bg-warm-sand">
      <div className="container-grove">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-serif text-h1 md:text-display-sm text-sage-deep mb-6">
            Three Simple Steps Between Today and Forever
          </h2>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-24 left-12 right-12 h-0.5 bg-sage-light/30 hidden lg:block" />
          
          <div className="grid lg:grid-cols-3 gap-12 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative animate-scale-in" style={{ animationDelay: `${index * 200}ms` }}>
                {/* Step number circle */}
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-sage-mist flex items-center justify-center relative">
                    <span className="font-sans text-h2 text-sage-deep font-medium">{step.number}</span>
                    {/* Icon */}
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-warm-white rounded-full flex items-center justify-center shadow-gentle text-sage-primary">
                      {step.icon}
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <h3 className="font-serif text-h3 text-sage-deep mb-4">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary text-body-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16 animate-fade-in animation-delay-800">
          <Button href="/start" size="lg">
            Begin Recording Today
          </Button>
        </div>
      </div>
    </section>
  )
}