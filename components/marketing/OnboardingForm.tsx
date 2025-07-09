'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useRouter } from 'next/navigation'

export default function OnboardingForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    intention: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalSteps = 3

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}
    
    switch (step) {
      case 1:
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'Your name helps us personalize your experience'
        }
        break
      case 2:
        if (!formData.email.trim()) {
          newErrors.email = 'We need your email to create your grove'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address'
        }
        if (!formData.password.trim()) {
          newErrors.password = 'A password keeps your memories safe'
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password should be at least 8 characters'
        }
        break
      case 3:
        if (!formData.intention.trim()) {
          newErrors.intention = 'Sharing your intention helps us guide you better'
        }
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Here you would integrate with Supabase auth
      // For now, we'll simulate a successful signup
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Redirect to a success or dashboard page
      router.push('/dashboard')
    } catch (error) {
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="bg-warm-white rounded-organic p-8 md:p-12 shadow-gentle">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-caption text-sage-primary">Step {currentStep} of {totalSteps}</span>
          <span className="text-caption text-text-light">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="h-2 bg-sage-mist rounded-full overflow-hidden">
          <div 
            className="h-full bg-sage-primary transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Name */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-serif text-h2 text-sage-deep mb-2">
                Let&apos;s start with your name
              </h2>
              <p className="text-body-sm text-text-secondary">
                This helps us create a personal space just for you.
              </p>
            </div>
            
            <div>
              <label htmlFor="firstName" className="block text-body-sm text-text-primary mb-2">
                First Name
              </label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={errors.firstName ? 'border-accent-earth' : ''}
                autoFocus
              />
              {errors.firstName && (
                <p className="mt-2 text-caption text-accent-earth">{errors.firstName}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Account Details */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-serif text-h2 text-sage-deep mb-2">
                Create your secure grove
              </h2>
              <p className="text-body-sm text-text-secondary">
                Your memories deserve the highest protection.
              </p>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-body-sm text-text-primary mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'border-accent-earth' : ''}
                autoFocus
              />
              {errors.email && (
                <p className="mt-2 text-caption text-accent-earth">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-body-sm text-text-primary mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Choose a secure password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={errors.password ? 'border-accent-earth' : ''}
              />
              {errors.password && (
                <p className="mt-2 text-caption text-accent-earth">{errors.password}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Intention */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-serif text-h2 text-sage-deep mb-2">
                What brings you to Memory Grove?
              </h2>
              <p className="text-body-sm text-text-secondary">
                This helps us provide the right guidance for your journey.
              </p>
            </div>
            
            <div>
              <label htmlFor="intention" className="block text-body-sm text-text-primary mb-2">
                I want to preserve memories for...
              </label>
              <select
                id="intention"
                value={formData.intention}
                onChange={(e) => handleChange('intention', e.target.value)}
                className="w-full px-4 py-3 rounded-full border border-warm-pebble/30 focus:border-sage-primary focus:outline-none transition-colors"
              >
                <option value="">Choose one...</option>
                <option value="children">My children and their children</option>
                <option value="spouse">My spouse or partner</option>
                <option value="family">My extended family</option>
                <option value="self">Myself, to reflect and remember</option>
                <option value="other">A specific person or occasion</option>
              </select>
              {errors.intention && (
                <p className="mt-2 text-caption text-accent-earth">{errors.intention}</p>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="mt-4 p-4 bg-accent-dawn/20 rounded-lg">
            <p className="text-body-sm text-accent-earth">{errors.submit}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Back
            </Button>
          )}
          
          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={handleNext}
              className="flex-1"
            >
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Creating Your Grove...' : 'Begin Your Journey'}
            </Button>
          )}
        </div>
      </form>

      {/* Help Text */}
      <p className="text-center text-caption text-text-light mt-6">
        By continuing, you agree to our{' '}
        <a href="/terms" className="text-sage-primary hover:text-sage-deep">
          Terms
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-sage-primary hover:text-sage-deep">
          Privacy Policy
        </a>
      </p>
    </div>
  )
}