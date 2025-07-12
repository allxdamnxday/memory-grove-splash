'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import heroMetadata from '@/public/images/hero/Hero_Image_Raw.meta.json'

export default function Hero() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Your journey begins. Welcome to the grove!' })
        setEmail('')
      } else {
        setMessage({ type: 'error', text: 'The path is unclear. Please try again.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'The grove is resting. Please try again later.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden section-spacing">
      {/* Hero Background Image */}
      <div className="absolute inset-0">
        <OptimizedImage
          src="/images/hero/Hero_Image_Raw-original.webp"
          alt="Peaceful grove with morning light filtering through trees"
          width={heroMetadata.width}
          height={heroMetadata.height}
          priority
          className="object-cover w-full h-full"
          containerClassName="w-full h-full"
          sizes="100vw"
          blurDataURL={heroMetadata.blurDataURL}
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-sage-deep/20 via-warm-white/60 to-warm-sand/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-warm-white/40 to-transparent" />
      </div>
      
      {/* Organic shape overlays */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sage-mist/20 rounded-organic blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-dawn/10 rounded-organic blur-3xl animate-pulse animation-delay-400" />
      
      <div className="container-grove relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main heading */}
          <h1 className="font-serif text-display-lg md:text-display text-sage-deep mb-8 animate-fade-in">
            Your Voice. Their Comfort. Forever.
          </h1>
          
          {/* Subheading */}
          <p className="text-text-secondary text-body-lg md:text-body-lg max-w-3xl mx-auto mb-12 animate-fade-in animation-delay-200">
            Every day, someone desperately searches for just one more voicemail from someone they&apos;ve lost. 
            Today, while voices are strong and stories are fresh, you can ensure your love speaks across time.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 animate-fade-in animation-delay-400">
            <Button href="/start" size="lg">
              Start Your Legacy
            </Button>
            <Button href="/stories/emma" variant="secondary" size="lg">
              Listen to Emma&apos;s Story
            </Button>
          </div>
          
          {/* Micro-copy */}
          <p className="text-body-sm text-text-light mb-8 animate-fade-in animation-delay-500">
            No credit card required. Begin with a single recording.
          </p>
          
          {/* Email Form */}
          <div className="max-w-md mx-auto animate-fade-in animation-delay-600">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                  aria-label="Email address"
                  disabled={isSubmitting}
                />
                <Button type="submit" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? 'Starting...' : 'Get Started'}
                </Button>
              </div>
              {message && (
                <p className={`mt-4 text-body-sm animate-fade-in ${
                  message.type === 'success' ? 'text-sage-primary' : 'text-accent-earth'
                }`}>
                  {message.text}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}