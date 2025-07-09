import { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In - Memory Grove',
  description: 'Sign in to your Memory Grove account to access your digital sanctuary.',
}

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-h2 font-serif text-sage-deep mb-2">Welcome back</h1>
        <p className="text-body text-text-secondary">
          Sign in to tend to your Memory Grove
        </p>
      </div>
      <div className="bg-white shadow-soft rounded-lg p-8">
        <LoginForm />
      </div>
    </div>
  )
}