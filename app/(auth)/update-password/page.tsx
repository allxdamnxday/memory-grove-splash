import { Metadata } from 'next'
import UpdatePasswordForm from '@/components/auth/UpdatePasswordForm'

export const metadata: Metadata = {
  title: 'Update Password - Memory Grove',
  description: 'Create a new password for your Memory Grove account.',
}

export default function UpdatePasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-h2 font-serif text-sage-deep mb-2">Create new password</h1>
        <p className="text-body text-text-secondary">
          Choose a secure password to protect your grove
        </p>
      </div>
      <div className="bg-white shadow-soft rounded-lg p-8">
        <UpdatePasswordForm />
      </div>
    </div>
  )
}