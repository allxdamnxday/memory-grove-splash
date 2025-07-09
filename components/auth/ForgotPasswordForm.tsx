'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/update-password`,
      })

      if (error) {
        setErrorMessage('We encountered an issue sending the reset email. Please try again.')
        return
      }

      setSuccessMessage(
        'If an account exists with this email, you will receive password reset instructions. ' +
        'Please check your inbox and follow the link to create a new password.'
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
        <div className="text-center">
          <Link href="/login" className="text-sage-primary hover:text-sage-deep transition-colors text-body-sm">
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <p className="text-body text-text-secondary mb-6">
          Enter your email address and we&apos;ll send you instructions to reset your password and regain access to your grove.
        </p>
        
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
        {isLoading ? 'Sending instructions...' : 'Send reset instructions'}
      </button>

      <p className="text-center text-body-sm text-text-secondary">
        Remember your password?{' '}
        <Link href="/login" className="text-sage-primary hover:text-sage-deep transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  )
}