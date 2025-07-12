import Button from '@/components/ui/Button'

export default function UrgencySection() {
  const steps = [
    {
      title: 'Recording Your Voice',
      subtitle: 'Today',
      description: 'Share stories, advice, and love - each word helps preserve your unique voice',
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 6.5c-.3.7-.5 1.5-.5 2.5m10-2.5c.3.7.5 1.5.5 2.5" opacity="0.5" />
          <circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth={0.5} opacity="0.3" />
          <path stroke="currentColor" strokeLinecap="round" strokeWidth={1} d="M9 9h1m4 0h1m-3-2v1m0 2v1" opacity="0.4" />
        </svg>
      ),
      bgColor: 'bg-sage-mist/20',
      iconColor: 'text-sage-primary'
    },
    {
      title: 'The Magic In Between',
      subtitle: 'AI Learning',
      description: 'Your recordings teach our technology your unique voice, tone, and heart - enabling infinite new messages',
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={1} opacity="0.3" />
          <path stroke="currentColor" strokeLinecap="round" strokeWidth={1} d="M10 10.5L12 9l2 1.5M10 13.5l2 1.5 2-1.5" opacity="0.5" />
          <path stroke="currentColor" strokeLinecap="round" strokeWidth={0.5} d="M8 12h8" opacity="0.4" />
        </svg>
      ),
      bgColor: 'bg-gradient-to-br from-sage-mist/20 to-accent-dawn/20',
      iconColor: 'text-gradient'
    },
    {
      title: 'Your Voice Still Speaking',
      subtitle: 'Years Later',
      description: 'New birthday messages every year. Bedtime stories on demand. Comfort during hard times. Your actual voice, saying exactly what they need to hear.',
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7.5c0 .828.448 1.5 1 1.5s1-.672 1-1.5S9.552 6 9 6s-1 .672-1 1.5zM14 7.5c0 .828.448 1.5 1 1.5s1-.672 1-1.5S15.552 6 15 6s-1 .672-1 1.5z" opacity="0.6" />
          <path stroke="currentColor" strokeLinecap="round" strokeWidth={1.5} d="M12 10v3" opacity="0.5" />
          <path stroke="currentColor" strokeLinecap="round" strokeWidth={0.5} d="M10 11h4" opacity="0.4" />
          <path stroke="currentColor" strokeWidth={0.5} d="M6.5 8.5c0-3.5 2.5-6 5.5-6s5.5 2.5 5.5 6" strokeDasharray="1 2" opacity="0.3" />
        </svg>
      ),
      bgColor: 'bg-accent-dawn/20',
      iconColor: 'text-accent-moss'
    }
  ]

  const floatingMessages = [
    { text: "Happy 21st birthday, sweetheart", delay: "0s", position: "top-20 left-10" },
    { text: "Remember, you are loved", delay: "5s", position: "top-32 right-20" },
    { text: "Goodnight, my little star", delay: "10s", position: "bottom-40 left-32" },
    { text: "I'm so proud of you", delay: "15s", position: "top-48 right-10" }
  ]

  return (
    <section className="section-spacing bg-gradient-to-b from-warm-white via-warm-sand/30 to-warm-white relative overflow-hidden">
      {/* Floating background messages */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingMessages.map((message, index) => (
          <div
            key={index}
            className={`absolute ${message.position} text-sage-light/20 font-handwritten text-2xl animate-float opacity-0`}
            style={{ 
              animationDelay: message.delay,
              animationFillMode: 'forwards',
              animationDuration: '20s'
            }}
          >
            &ldquo;{message.text}&rdquo;
          </div>
        ))}
      </div>

      <div className="container-grove relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-serif text-h1 md:text-display-sm text-sage-deep mb-4">
            Every Voice is Temporary.
          </h2>
          <h3 className="font-serif text-h2 text-sage-primary mb-2">
            Your Love Doesn&apos;t Have to Be.
          </h3>
          <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
            Give your voice the power to speak new words of love, forever.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <p className="text-body-lg text-text-secondary text-center mb-16 animate-fade-in animation-delay-200 max-w-3xl mx-auto">
            We tell ourselves there&apos;s always tomorrow to record their stories, 
            capture their laugh, save their advice. But voices change. 
            Memories fade. And sometimes, tomorrow doesn&apos;t come.
          </p>

          <p className="text-body-lg text-text-secondary text-center mb-16 animate-fade-in animation-delay-400 max-w-3xl mx-auto">
            Memory Groves ensures your voice never stops speaking. Not just 
            in old recordings, but with new words - birthday wishes in 2074, 
            bedtime stories for grandchildren not yet born, &apos;I love you&apos; 
            whenever they need to hear it.
          </p>

          <p className="text-body-lg text-sage-deep text-center mb-16 animate-fade-in animation-delay-600 font-medium max-w-2xl mx-auto">
            Because love deserves better than voicemail graveyards and 
            forgotten stories. Love deserves a living voice.
          </p>

          {/* Visual timeline */}
          <div className="relative mb-20">
            {/* Connecting line */}
            <div className="absolute top-20 left-16 right-16 h-0.5 bg-gradient-to-r from-sage-light/30 via-sage-primary/50 to-accent-moss/30 hidden md:block" />
            
            {/* Arrow at the end */}
            <div className="absolute top-20 right-14 w-3 h-3 border-t-2 border-r-2 border-accent-moss/50 transform rotate-45 -translate-y-1.5 hidden md:block" />

            <div className="grid md:grid-cols-3 gap-8 md:gap-4 relative">
              {steps.map((step, index) => (
                <div key={index} className="relative animate-scale-in" style={{ animationDelay: `${index * 300 + 800}ms` }}>
                  <div className={`${step.bgColor} rounded-2xl p-8 text-center h-full flex flex-col`}>
                    <div className={`${step.iconColor} mb-4 flex justify-center`}>
                      {step.icon}
                    </div>
                    <p className="text-caption text-sage-primary uppercase tracking-wider mb-2">{step.subtitle}</p>
                    <h4 className="font-serif text-h3 text-sage-deep mb-4">{step.title}</h4>
                    <p className="text-body-sm text-text-secondary flex-grow">{step.description}</p>
                  </div>
                  
                  {/* Step indicator dot on timeline */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-sage-primary rounded-full hidden md:block" />
                </div>
              ))}
            </div>
          </div>

          {/* Urgency element */}
          <div className="bg-warm-sand/50 rounded-2xl p-8 mb-12 animate-fade-in animation-delay-800">
            <div className="flex items-start gap-4">
              <div className="text-accent-rust flex-shrink-0">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-body text-text-secondary">
                <span className="font-medium text-sage-deep">Most people think they have more time.</span> Today, 
                127 families will lose a voice forever. Don&apos;t let yours be silenced.
              </p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="relative mb-16 animate-fade-in animation-delay-1000">
            <div className="bg-sage-mist/10 rounded-2xl p-8 md:p-10 relative">
              <svg className="absolute top-4 left-4 w-8 h-8 text-sage-light/50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
              </svg>
              <blockquote className="relative z-10">
                <p className="text-body-lg text-sage-deep italic mb-4">
                  My daughter hears new bedtime stories from her grandmother 
                  every night. Grandma passed three years ago, but her voice 
                  is still here, still loving, still grandma.
                </p>
                <footer className="text-body-sm text-text-secondary">
                  — Michael R.
                </footer>
              </blockquote>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center animate-fade-in animation-delay-1200">
            <Button href="/start" size="lg" className="mb-4">
              Begin Your Eternal Voice Today
            </Button>
            <p className="text-body-sm text-text-secondary">
              It takes just 10 minutes to ensure your voice speaks forever
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}