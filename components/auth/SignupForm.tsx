'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'

const signupSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type SignupFormData = z.infer<typeof signupSchema>

export default function SignupForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      })

      if (error) {
        if (error.message.includes('already registered')) {
          setErrorMessage('This email is already registered. Please sign in instead.')
        } else {
          setErrorMessage('We encountered an issue creating your account. Please try again.')
        }
        return
      }

      setSuccessMessage(
        'Welcome to Memory Grove! Please check your email to confirm your account. ' +
        'Once confirmed, you can begin creating your digital sanctuary.'
      )
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  if (successMessage) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg bg-sage-mist/20 border border-sage-soft p-6">
          <h3 className="text-h4 font-serif text-sage-deep mb-2">Check your email</h3>
          <p className="text-body-sm text-text-secondary">{successMessage}</p>
        </div>
        <p className="text-center text-body-sm text-text-secondary">
          Already confirmed?{' '}
          <Link href="/login" className="text-sage-primary hover:text-sage-deep transition-colors">
            Sign in to your grove
          </Link>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-body-sm font-medium text-text-secondary mb-2">
            Full name
          </label>
          <input
            {...register('fullName')}
            type="text"
            id="fullName"
            autoComplete="name"
            className="input-field"
            placeholder="Jane Doe"
          />
          {errors.fullName && (
            <p className="mt-2 text-sm text-error-primary">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-body-sm font-medium text-text-secondary mb-2">
            Email address
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            autoComplete="email"
            className="input-field"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-error-primary">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-body-sm font-medium text-text-secondary mb-2">
            Password
          </label>
          <input
            {...register('password')}
            type="password"
            id="password"
            autoComplete="new-password"
            className="input-field"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-2 text-sm text-error-primary">{errors.password.message}</p>
          )}
          <p className="mt-2 text-xs text-text-tertiary">
            Must be at least 8 characters with uppercase, lowercase, and numbers
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-body-sm font-medium text-text-secondary mb-2">
            Confirm password
          </label>
          <input
            {...register('confirmPassword')}
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            className="input-field"
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-error-primary">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-lg bg-error-light/10 border border-error-light p-4">
          <p className="text-sm text-error-primary">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full"
      >
        {isLoading ? 'Creating your grove...' : 'Begin your Memory Grove'}
      </button>

      <p className="text-center text-body-sm text-text-secondary">
        Already have an account?{' '}
        <Link href="/login" className="text-sage-primary hover:text-sage-deep transition-colors">
          Sign in
        </Link>
      </p>

      <p className="text-xs text-center text-text-tertiary">
        By creating an account, you agree to our{' '}
        <Link href="/terms" className="underline hover:text-text-secondary">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline hover:text-text-secondary">
          Privacy Policy
        </Link>
      </p>
    </form>
  )
}