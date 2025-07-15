'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export default function HowItWorks() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  
  const steps = [
    {
      number: '1',
      title: 'Plant Your Voice',
      description: 'Start with what\'s easy—a favorite story, a simple "I love you," or advice for the future. Our gentle prompts guide you.',
      preview: 'Record in minutes',
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
      preview: 'Build your collection',
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
      preview: 'Schedule delivery',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" className="scale-50 origin-center translate-x-2 -translate-y-3" />
        </svg>
      )
    },
    {
      number: '4',
      title: 'Forever Blooming',
      description: 'Already have recordings? Upload voicemails, videos, or voice memos. Let their voice continue speaking new words of love when needed most.',
      preview: 'AI preserves forever',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01" className="opacity-0" />
          <circle cx="12" cy="12" r="9" strokeWidth={1} className="opacity-30" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 10h10M7 14h10" className="opacity-50" />
        </svg>
      )
    }
  ]

  return (
    <section className="section-spacing bg-warm-sand">
      <div className="container-grove">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-serif text-h1 md:text-display-sm text-sage-deep mb-6">
            How Memory Grove Works
          </h2>
          <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
            Four simple steps to preserve your voice forever
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-24 left-12 right-12 h-0.5 bg-sage-light/30 hidden lg:block" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative animate-scale-in group cursor-pointer"
                style={{ animationDelay: `${index * 200}ms` }}
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Step number circle */}
                <div className="flex items-center justify-center mb-6">
                  <div className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center relative transition-all duration-300",
                    hoveredStep === index ? "bg-sage-primary scale-110" : "bg-sage-mist"
                  )}>
                    <span className={cn(
                      "font-sans text-h2 font-medium transition-colors",
                      hoveredStep === index ? "text-white" : "text-sage-deep"
                    )}>
                      {step.number}
                    </span>
                    {/* Icon */}
                    <div className={cn(
                      "absolute -bottom-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center shadow-gentle transition-all duration-300",
                      hoveredStep === index ? "bg-sage-light text-white scale-110" : "bg-warm-white text-sage-primary"
                    )}>
                      {step.icon}
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <h3 className="font-serif text-h3 text-sage-deep mb-2 group-hover:text-sage-primary transition-colors">
                    {step.title}
                  </h3>
                  
                  {/* Preview text on hover */}
                  <div className={cn(
                    "mb-3 overflow-hidden transition-all duration-300",
                    hoveredStep === index ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
                  )}>
                    <p className="text-body-xs font-medium text-sage-primary bg-sage-mist/30 rounded-full px-3 py-1 inline-block">
                      {step.preview}
                    </p>
                  </div>
                  
                  <p className="text-text-secondary text-body-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16 animate-fade-in animation-delay-800">
          <Button href="/start" size="lg" organic="seed" living>
            Begin Recording Today
          </Button>
        </div>
      </div>
    </section>
  )
}