import { Metadata } from 'next'
import SignupForm from '@/components/auth/SignupForm'

export const metadata: Metadata = {
  title: 'Create Account - Memory Grove',
  description: 'Create your Memory Grove account and begin preserving your memories for generations to come.',
}

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-h2 font-serif text-sage-deep mb-2">Begin your grove</h1>
        <p className="text-body text-text-secondary">
          Create your sacred digital sanctuary
        </p>
      </div>
      <div className="bg-white shadow-soft rounded-lg p-8">
        <SignupForm />
      </div>
    </div>
  )
}