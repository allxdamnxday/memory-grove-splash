'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        if (error.message === 'Invalid login credentials') {
          setErrorMessage('The email or password you entered is incorrect. Please try again.')
        } else if (error.message === 'Email not confirmed') {
          setErrorMessage('Please check your email and confirm your account before signing in.')
        } else {
          setErrorMessage('We encountered an issue signing you in. Please try again.')
        }
        return
      }

      // Successful login - use hard navigation to ensure session is established
      window.location.href = '/account'
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
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
            autoComplete="current-password"
            className="input-field"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-2 text-sm text-error-primary">{errors.password.message}</p>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-lg bg-error-light/10 border border-error-light p-4">
          <p className="text-sm text-error-primary">{errorMessage}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Link
          href="/forgot-password"
          className="text-body-sm text-sage-primary hover:text-sage-deep transition-colors"
        >
          Forgot your password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full"
      >
        {isLoading ? 'Signing in...' : 'Sign in to your grove'}
      </button>

      <p className="text-center text-body-sm text-text-secondary">
        New to Memory Grove?{' '}
        <Link href="/signup" className="text-sage-primary hover:text-sage-deep transition-colors">
          Create an account
        </Link>
      </p>
    </form>
  )
}