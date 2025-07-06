'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

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
        setMessage({ type: 'success', text: 'Your seed has been planted. Welcome to the grove!' })
        setEmail('')
      } else {
        setMessage({ type: 'error', text: 'The seed couldn\'t find its place. Please try again.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'The grove is resting. Please try again later.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-warm-sand via-warm-white to-sage-mist/20" />
      
      {/* Organic shape overlays */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sage-mist/30 rounded-organic blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-dawn/20 rounded-organic blur-3xl animate-pulse animation-delay-400" />
      
      <div className="container-grove relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tagline */}
          <p className="text-sage-primary text-body-lg mb-6 animate-fade-in">
            A Sacred Digital Sanctuary
          </p>
          
          {/* Main heading */}
          <h1 className="font-serif text-display-lg md:text-display text-sage-deep mb-8 animate-fade-in animation-delay-200">
            Where Memories Bloom Eternal
          </h1>
          
          {/* Description */}
          <p className="text-text-secondary text-body-lg md:text-body-lg max-w-2xl mx-auto mb-12 animate-fade-in animation-delay-400">
            Preserve your essence, share your wisdom, and ensure your love lives on 
            through voice, story, and connection. Create a living legacy that nurtures 
            future generations.
          </p>
          
          {/* Email capture form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto animate-fade-in animation-delay-600">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
                disabled={isSubmitting}
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="whitespace-nowrap"
              >
                {isSubmitting ? 'Planting...' : 'Begin Your Grove'}
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
          
          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-text-light text-caption animate-fade-in animation-delay-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Your memories are sacred & secure</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Preserved for generations</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Created with reverence</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}