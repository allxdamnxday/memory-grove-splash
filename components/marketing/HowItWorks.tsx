export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Plant Your Grove',
      description: 'Begin with a simple conversation. Share your name, your story, and what matters most to you. Your grove starts with a single seed of intention.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      number: '02',
      title: 'Nurture Your Memories',
      description: 'Record your voice sharing stories, wisdom, and love. Add photos, write letters, and create a living tapestry of your life that grows richer with time.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )
    },
    {
      number: '03',
      title: 'Watch It Bloom',
      description: 'Share your grove with loved ones when you\'re ready. They\'ll experience your presence, hear your voice, and feel your love blooming across time.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ]

  return (
    <section className="section-spacing bg-warm-sand">
      <div className="container-grove">
        <div className="text-center mb-16">
          <h2 className="font-serif text-h1 text-sage-deep mb-6">
            Your Journey Through The Grove
          </h2>
          <p className="text-text-secondary text-body-lg max-w-3xl mx-auto">
            Creating your digital legacy is as natural as planting a seed. 
            We guide you gently through each step, ensuring your memories are 
            preserved with the care and reverence they deserve.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-24 left-12 right-12 h-0.5 bg-sage-light/30 hidden lg:block" />
          
          <div className="grid lg:grid-cols-3 gap-12 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step number */}
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-sage-mist flex items-center justify-center relative">
                    <span className="font-serif text-h3 text-sage-deep">{step.number}</span>
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

        <div className="text-center mt-16">
          <p className="text-sage-primary text-body-lg mb-8">
            Ready to begin your journey?
          </p>
          <Button href="/join" size="lg">
            Plant Your First Seed
          </Button>
        </div>
      </div>
    </section>
  )
}

import Button from '@/components/ui/Button'