import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Authentication Error - Memory Grove',
  description: 'There was an issue with your authentication request.',
}

export default function ErrorPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const errorType = searchParams.type || 'general'

  const errorMessages: { [key: string]: { title: string; message: string } } = {
    email_confirmation: {
      title: 'Email Confirmation Failed',
      message:
        'We couldn&apos;t confirm your email address. The link may have expired or already been used. Please try signing up again or contact support if the issue persists.',
    },
    password_reset: {
      title: 'Password Reset Failed',
      message:
        'The password reset link is invalid or has expired. Please request a new password reset link.',
    },
    general: {
      title: 'Authentication Error',
      message:
        'We encountered an issue with your authentication request. Please try again or contact support if the problem continues.',
    },
  }

  const error = errorMessages[errorType as string] || errorMessages.general

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-light/10 via-sage-mist/20 to-accent-dawn/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-h2 font-serif text-sage-deep mb-2">{error.title}</h1>
          <p className="text-body text-text-secondary">{error.message}</p>
        </div>

        <div className="bg-white shadow-soft rounded-lg p-8">
          <div className="space-y-4">
            <div className="rounded-lg bg-error-light/10 border border-error-light p-4">
              <p className="text-sm text-error-primary">
                If you continue to experience issues, please ensure:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-error-primary list-disc list-inside">
                <li>You&apos;re clicking the most recent email link</li>
                <li>The link hasn&apos;t expired (24 hours for signup)</li>
                <li>You haven&apos;t already used this link</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="btn-primary w-full text-center"
              >
                Go to Login
              </Link>
              <Link
                href="/signup"
                className="btn-secondary w-full text-center"
              >
                Sign Up Again
              </Link>
              <Link
                href="/"
                className="text-center text-body-sm text-text-secondary hover:text-sage-primary transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-body-sm text-text-light mt-6">
          Need help?{' '}
          <Link href="/contact" className="text-sage-primary hover:text-sage-deep transition-colors">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  )
}