import { Metadata } from 'next'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password - Memory Grove',
  description: 'Reset your Memory Grove password to regain access to your digital sanctuary.',
}

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-h2 font-serif text-sage-deep mb-2">Reset your password</h1>
        <p className="text-body text-text-secondary">
          We&apos;ll help you get back to your grove
        </p>
      </div>
      <div className="bg-white shadow-soft rounded-lg p-8">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}