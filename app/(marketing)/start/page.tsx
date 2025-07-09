import { Metadata } from 'next'
import OnboardingForm from '@/components/marketing/OnboardingForm'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Start Your Memory Grove - Begin Your Digital Legacy',
  description: 'Begin preserving your voice, stories, and wisdom for future generations. Start your Memory Grove journey with a simple recording.',
}

export default function StartPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-warm-sand via-warm-white to-sage-mist/20 py-12 md:py-16">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sage-mist/30 rounded-organic blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-dawn/20 rounded-organic blur-3xl animate-pulse animation-delay-400" />
        
        <div className="container-grove relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-display-sm md:text-display text-sage-deep mb-6 animate-fade-in">
              Your Journey Begins Here
            </h1>
            <p className="text-text-secondary text-body-lg md:text-body-lg max-w-2xl mx-auto animate-fade-in animation-delay-200">
              In just a few moments, you&apos;ll plant the first seed of your digital legacy. 
              No pressure, no perfection needed—just your authentic voice and the stories that matter to you.
            </p>
          </div>
        </div>
      </section>

      {/* Onboarding Form Section */}
      <section className="section-spacing">
        <div className="container-grove">
          <div className="max-w-2xl mx-auto">
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 mb-12 text-text-light text-caption animate-fade-in">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Bank-level encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Start in 2 minutes</span>
              </div>
            </div>

            {/* Onboarding Form */}
            <OnboardingForm />
          </div>
        </div>
      </section>

      {/* What Happens Next Section */}
      <section className="section-spacing bg-warm-sand">
        <div className="container-grove">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-h1 text-sage-deep mb-8">
              What Happens After You Start?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-warm-white rounded-organic p-6 shadow-gentle">
                <div className="w-12 h-12 bg-sage-mist rounded-full flex items-center justify-center mb-4">
                  <span className="font-sans text-h3 text-sage-deep">1</span>
                </div>
                <h3 className="font-serif text-h3 text-sage-deep mb-2">
                  Gentle Guidance
                </h3>
                <p className="text-body-sm text-text-secondary">
                  We&apos;ll guide you through your first recording with prompts designed to bring out your authentic voice.
                </p>
              </div>

              <div className="bg-warm-white rounded-organic p-6 shadow-gentle">
                <div className="w-12 h-12 bg-sage-mist rounded-full flex items-center justify-center mb-4">
                  <span className="font-sans text-h3 text-sage-deep">2</span>
                </div>
                <h3 className="font-serif text-h3 text-sage-deep mb-2">
                  Grow Naturally
                </h3>
                <p className="text-body-sm text-text-secondary">
                  Add recordings whenever inspiration strikes. There&apos;s no rush—your grove grows at your pace.
                </p>
              </div>

              <div className="bg-warm-white rounded-organic p-6 shadow-gentle">
                <div className="w-12 h-12 bg-sage-mist rounded-full flex items-center justify-center mb-4">
                  <span className="font-sans text-h3 text-sage-deep">3</span>
                </div>
                <h3 className="font-serif text-h3 text-sage-deep mb-2">
                  Share When Ready
                </h3>
                <p className="text-body-sm text-text-secondary">
                  Choose who receives your messages and when. You&apos;re always in complete control.
                </p>
              </div>
            </div>

            <p className="text-body text-text-secondary mt-12">
              Questions before you begin? 
              <Link href="/how-it-works" className="text-sage-primary hover:text-sage-deep ml-1">
                See how it works
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="section-spacing">
        <div className="container-grove">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-body text-text-secondary mb-8">
              Join over 12,000 families who are preserving their voices and stories for tomorrow
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <p className="font-serif text-display-sm text-sage-primary">98%</p>
                <p className="text-body-sm text-text-secondary">Feel more connected</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-display-sm text-sage-primary">2M+</p>
                <p className="text-body-sm text-text-secondary">Memories preserved</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-display-sm text-sage-primary">5★</p>
                <p className="text-body-sm text-text-secondary">Average rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}