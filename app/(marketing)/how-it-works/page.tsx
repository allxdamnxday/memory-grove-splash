import { Metadata } from 'next'
import Button from '@/components/ui/Button'
import ProcessStep from '@/components/marketing/ProcessStep'

export const metadata: Metadata = {
  title: 'How Memory Grove Works - Your Journey to Digital Legacy',
  description: 'Discover how Memory Grove helps you preserve your voice, stories, and wisdom for future generations through our simple three-step process.',
}

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      title: 'Plant Your Voice',
      subtitle: 'Start with what feels natural',
      description: 'Begin your journey with a simple recording. No scripts, no pressure—just you sharing what matters most.',
      details: [
        'Choose from gentle prompts or speak freely',
        'Record from any device with a microphone',
        'Pause, re-record, or continue anytime',
        'Your first recording takes less than 2 minutes'
      ],
      icon: 'microphone'
    },
    {
      number: 2,
      title: 'Grow Your Grove',
      subtitle: 'Build your legacy naturally over time',
      description: 'Add new recordings whenever inspiration strikes. Your grove grows richer with each memory you preserve.',
      details: [
        'Create categories for different life moments',
        'Add photos to accompany your stories',
        'Record messages for specific people or occasions',
        'Build playlists of related memories'
      ],
      icon: 'tree'
    },
    {
      number: 3,
      title: 'Set Your Seasons',
      subtitle: 'Control when your memories bloom',
      description: 'Choose exactly when and how your messages are shared. You maintain complete control over your digital legacy.',
      details: [
        'Schedule messages for specific dates or milestones',
        'Set immediate or future delivery options',
        'Choose multiple recipients for each message',
        'Update or modify settings anytime'
      ],
      icon: 'calendar'
    }
  ]

  const features = [
    {
      title: 'Voice-First Design',
      description: 'Our platform is built around the power of your voice, making it natural and easy to preserve your authentic self.',
      icon: 'voice'
    },
    {
      title: 'Bank-Level Security',
      description: 'Your memories are encrypted and protected with the same security standards used by financial institutions.',
      icon: 'security'
    },
    {
      title: 'Eternal Storage',
      description: 'We guarantee your memories will be preserved and accessible for generations to come.',
      icon: 'infinity'
    },
    {
      title: 'Complete Control',
      description: 'You decide who can access your memories and when. Change permissions anytime.',
      icon: 'control'
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-warm-sand via-warm-white to-sage-mist/20 py-20 md:py-32">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sage-mist/30 rounded-organic blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-dawn/20 rounded-organic blur-3xl animate-pulse animation-delay-400" />
        
        <div className="container-grove relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-display-sm md:text-display text-sage-deep mb-6 animate-fade-in">
              How Memory Grove Works
            </h1>
            <p className="text-text-secondary text-body-lg md:text-body-lg max-w-3xl mx-auto animate-fade-in animation-delay-200">
              Preserving your voice and stories is as natural as having a conversation. 
              Our gentle process guides you through creating a digital legacy that truly reflects who you are.
            </p>
            <div className="mt-8 animate-fade-in animation-delay-400">
              <Button href="/start" size="lg">
                Start Your Free Grove
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps Section */}
      <section className="section-spacing">
        <div className="container-grove">
          <div className="max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <ProcessStep
                key={step.number}
                {...step}
                isLast={index === steps.length - 1}
                delay={index * 200}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="section-spacing bg-sage-mist/10">
        <div className="container-grove">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-h1 md:text-display-sm text-sage-deep mb-6">
              See Memory Grove in Action
            </h2>
            <p className="text-text-secondary text-body-lg max-w-2xl mx-auto mb-12">
              Watch how Sarah uses Memory Grove to record birthday messages for her grandchildren&apos;s future birthdays.
            </p>
            
            {/* Video Placeholder */}
            <div className="relative aspect-video bg-warm-white rounded-organic shadow-soft overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-sage-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-warm-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-body text-sage-primary">Watch 2-minute demo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="section-spacing">
        <div className="container-grove">
          <h2 className="font-serif text-h1 md:text-display-sm text-sage-deep mb-12 text-center">
            Built with Love, Secured with Care
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="text-center animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-sage-mist rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 text-sage-primary">
                    {/* Icon placeholder - in production, use proper icons */}
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-serif text-h3 text-sage-deep mb-2">
                  {feature.title}
                </h3>
                <p className="text-body-sm text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="section-spacing bg-warm-sand">
        <div className="container-grove">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-h1 md:text-display-sm text-sage-deep mb-8 text-center">
              Common Questions
            </h2>
            
            <div className="space-y-6">
              <div className="bg-warm-white rounded-organic p-6 shadow-gentle">
                <h3 className="font-serif text-h3 text-sage-deep mb-2">
                  Do I need any special equipment?
                </h3>
                <p className="text-body-sm text-text-secondary">
                  No special equipment needed. Any device with a microphone—your phone, tablet, or computer—works perfectly. 
                  We focus on preserving your authentic voice, not studio-quality production.
                </p>
              </div>
              
              <div className="bg-warm-white rounded-organic p-6 shadow-gentle">
                <h3 className="font-serif text-h3 text-sage-deep mb-2">
                  How long can my recordings be?
                </h3>
                <p className="text-body-sm text-text-secondary">
                  Free accounts can record up to 5 minutes per message with 5 total recordings. 
                  Paid plans offer unlimited recording length and quantity. Most meaningful messages are 2-3 minutes.
                </p>
              </div>
              
              <div className="bg-warm-white rounded-organic p-6 shadow-gentle">
                <h3 className="font-serif text-h3 text-sage-deep mb-2">
                  Can I delete or edit recordings?
                </h3>
                <p className="text-body-sm text-text-secondary">
                  Yes, you have complete control. Delete, re-record, or update any message anytime. 
                  You can also change delivery settings or recipients whenever you wish.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Button href="/faq" variant="secondary">
                View All FAQs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing">
        <div className="container-grove text-center">
          <h2 className="font-serif text-h1 md:text-display-sm text-sage-deep mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-text-secondary text-body-lg max-w-2xl mx-auto mb-8">
            Start with a single recording. No credit card required. 
            Your voice, your stories, preserved forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/start" size="lg">
              Start Your Grove Today
            </Button>
            <Button href="/pricing" variant="secondary" size="lg">
              View Pricing Options
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}