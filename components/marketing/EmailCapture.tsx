'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function EmailCapture() {
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
    <section className="py-16 bg-gradient-to-b from-warm-white to-sage-mist/20">
      <div className="container-grove">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-h2 md:text-h1 text-sage-deep mb-4">
            Start Your Voice Legacy Today
          </h2>
          <p className="text-body-lg text-text-secondary mb-8">
            Join thousands preserving their voices for the moments that matter most.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 min-h-[56px] text-lg"
                aria-label="Email address"
                disabled={isSubmitting}
              />
              <Button 
                type="submit" 
                size="lg" 
                disabled={isSubmitting}
                className="min-w-[140px]"
              >
                {isSubmitting ? 'Starting...' : 'Get Started'}
              </Button>
            </div>
            
            {message && (
              <p className={`mt-4 text-body-sm animate-fade-in ${
                message.type === 'success' ? 'text-sage-primary' : 'text-error-primary'
              }`}>
                {message.text}
              </p>
            )}
          </form>
          
          <p className="text-body-sm text-text-tertiary mt-6">
            Free to start • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
}