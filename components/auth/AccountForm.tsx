'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User } from '@supabase/supabase-js'

const profileSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name').optional(),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores')
    .optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export default function AccountForm({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading profile:', error)
          return
        }

        if (data) {
          setProfile(data)
          setValue('fullName', data.full_name || '')
          setValue('username', data.username || '')
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadProfile()
  }, [user.id, supabase, setValue])

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const updates = {
        id: user.id,
        full_name: data.fullName,
        username: data.username,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(updates)

      if (error) {
        if (error.message.includes('duplicate key value')) {
          setErrorMessage('This username is already taken. Please choose another.')
        } else {
          setErrorMessage('We encountered an issue updating your profile. Please try again.')
        }
        return
      }

      setSuccessMessage('Your grove has been updated successfully.')
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-primary"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-body-sm font-medium text-text-secondary mb-2">
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={user.email}
            disabled
            className="input-field bg-warm-sand/20 cursor-not-allowed"
          />
          <p className="mt-2 text-xs text-text-tertiary">
            Your email cannot be changed at this time
          </p>
        </div>

        <div>
          <label htmlFor="fullName" className="block text-body-sm font-medium text-text-secondary mb-2">
            Full name
          </label>
          <input
            {...register('fullName')}
            type="text"
            id="fullName"
            className="input-field"
            placeholder="Jane Doe"
          />
          {errors.fullName && (
            <p className="mt-2 text-sm text-error-primary">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="username" className="block text-body-sm font-medium text-text-secondary mb-2">
            Username
          </label>
          <input
            {...register('username')}
            type="text"
            id="username"
            className="input-field"
            placeholder="janedoe"
          />
          {errors.username && (
            <p className="mt-2 text-sm text-error-primary">{errors.username.message}</p>
          )}
          <p className="mt-2 text-xs text-text-tertiary">
            This will be your unique identifier in Memory Grove
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="rounded-lg bg-sage-mist/20 border border-sage-soft p-4">
          <p className="text-sm text-sage-deep">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-lg bg-error-light/10 border border-error-light p-4">
          <p className="text-sm text-error-primary">{errorMessage}</p>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary"
        >
          {isLoading ? 'Updating...' : 'Update profile'}
        </button>
      </div>

      <div className="pt-6 border-t border-warm-pebble/20">
        <p className="text-body-sm text-text-secondary mb-4">
          Account created: {new Date(profile?.created_at || user.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
    </form>
  )
}