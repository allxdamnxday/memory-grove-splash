import { Metadata } from 'next'
import Link from 'next/link'
import { BackNavigation } from '@/components/navigation'

export const metadata: Metadata = {
  title: 'Privacy Policy - Memory Grove',
  description: 'Learn how Memory Grove protects your personal information and recordings with the reverence and care they deserve.',
}

export default function PrivacyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-warm-sand to-sage-mist/20 py-16 md:py-24">
        <div className="container-grove">
          <BackNavigation 
            href="/" 
            label="Return Home"
            variant="subtle"
            className="mb-8 animate-fade-in"
          />
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-display-sm md:text-display text-sage-deep mb-6">
              Privacy Policy
            </h1>
            <p className="text-text-secondary text-body-lg">
              Your trust is sacred to us. This policy explains how we protect and honor 
              your personal information and memories.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-spacing">
        <div className="container-grove">
          <div className="max-w-3xl mx-auto prose prose-sage">
            <p className="text-body-lg text-sage-primary mb-8">
              Last updated: January 1, 2024
            </p>

            <h2 className="font-serif text-h2 text-sage-deep mt-12 mb-4">
              Our Sacred Promise
            </h2>
            <p className="text-body text-text-secondary mb-6">
              At Memory Grove, we understand that you&apos;re entrusting us with more than data—you&apos;re 
              sharing your voice, your stories, and your love. We treat this responsibility with the 
              reverence it deserves.
            </p>

            <h2 className="font-serif text-h2 text-sage-deep mt-12 mb-4">
              Information We Gather
            </h2>
            <h3 className="font-serif text-h3 text-sage-primary mt-8 mb-3">
              Seeds You Plant (Information You Provide)
            </h3>
            <ul className="space-y-2 mb-6">
              <li className="text-body text-text-secondary">
                • Account information (name, email, password)
              </li>
              <li className="text-body text-text-secondary">
                • Voice recordings and messages you create
              </li>
              <li className="text-body text-text-secondary">
                • Photos and text you choose to include
              </li>
              <li className="text-body text-text-secondary">
                • Recipient information for message delivery
              </li>
            </ul>

            <h3 className="font-serif text-h3 text-sage-primary mt-8 mb-3">
              Natural Growth (Automatic Information)
            </h3>
            <ul className="space-y-2 mb-6">
              <li className="text-body text-text-secondary">
                • Device and browser information for security
              </li>
              <li className="text-body text-text-secondary">
                • Usage patterns to improve your experience
              </li>
              <li className="text-body text-text-secondary">
                • Technical logs for troubleshooting
              </li>
            </ul>

            <h2 className="font-serif text-h2 text-sage-deep mt-12 mb-4">
              How We Nurture Your Information
            </h2>
            <p className="text-body text-text-secondary mb-6">
              We use your information solely to:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-body text-text-secondary">
                • Create and maintain your Memory Grove
              </li>
              <li className="text-body text-text-secondary">
                • Deliver messages according to your wishes
              </li>
              <li className="text-body text-text-secondary">
                • Provide support when you need it
              </li>
              <li className="text-body text-text-secondary">
                • Protect your grove from unauthorized access
              </li>
              <li className="text-body text-text-secondary">
                • Improve our service with your permission
              </li>
            </ul>

            <h2 className="font-serif text-h2 text-sage-deep mt-12 mb-4">
              Protecting Your Grove
            </h2>
            <p className="text-body text-text-secondary mb-6">
              Your memories are protected by:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-body text-text-secondary">
                • Bank-level encryption for all recordings
              </li>
              <li className="text-body text-text-secondary">
                • Secure servers with 24/7 monitoring
              </li>
              <li className="text-body text-text-secondary">
                • Regular security audits and updates
              </li>
              <li className="text-body text-text-secondary">
                • Strict access controls and authentication
              </li>
            </ul>

            <h2 className="font-serif text-h2 text-sage-deep mt-12 mb-4">
              Sharing Your Seeds (When We Share Information)
            </h2>
            <p className="text-body text-text-secondary mb-6">
              We will never sell your information. We share your data only:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-body text-text-secondary">
                • With recipients you explicitly designate
              </li>
              <li className="text-body text-text-secondary">
                • With service providers who help us operate (under strict confidentiality)
              </li>
              <li className="text-body text-text-secondary">
                • When required by law (we&apos;ll notify you when possible)
              </li>
              <li className="text-body text-text-secondary">
                • To protect rights, safety, or property
              </li>
            </ul>

            <h2 className="font-serif text-h2 text-sage-deep mt-12 mb-4">
              Your Rights in the Grove
            </h2>
            <p className="text-body text-text-secondary mb-6">
              You always maintain control over your information:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-body text-text-secondary">
                • Access all your recordings and data
              </li>
              <li className="text-body text-text-secondary">
                • Update or correct any information
              </li>
              <li className="text-body text-text-secondary">
                • Delete recordings or your entire account
              </li>
              <li className="text-body text-text-secondary">
                • Export your memories in standard formats
              </li>
              <li className="text-body text-text-secondary">
                • Opt out of non-essential communications
              </li>
            </ul>

            <h2 className="font-serif text-h2 text-sage-deep mt-12 mb-4">
              Children&apos;s Privacy
            </h2>
            <p className="text-body text-text-secondary mb-6">
              Memory Grove is designed for adults creating legacies for all ages. We do not 
              knowingly collect information from children under 13. If you believe a child 
              has provided us information, please contact us immediately.
            </p>

            <h2 className="font-serif text-h2 text-sage-deep mt-12 mb-4">
              Changes to This Policy
            </h2>
            <p className="text-body text-text-secondary mb-6">
              As our grove grows, this policy may evolve. We&apos;ll notify you of any significant 
              changes and always give you the choice to accept them before they apply to your information.
            </p>

            <h2 className="font-serif text-h2 text-sage-deep mt-12 mb-4">
              Contact Our Caretakers
            </h2>
            <p className="text-body text-text-secondary mb-6">
              Questions, concerns, or requests about your privacy? We&apos;re here to help:
            </p>
            <div className="bg-sage-mist/20 rounded-organic p-6 mb-8">
              <p className="text-body text-sage-deep mb-2">
                Email: privacy@memorygrove.com
              </p>
              <p className="text-body text-sage-deep mb-2">
                Phone: 1-800-MEMORIES
              </p>
              <p className="text-body text-sage-deep">
                Mail: Memory Grove Privacy Team<br />
                123 Sanctuary Lane<br />
                San Francisco, CA 94105
              </p>
            </div>

            <div className="border-t border-warm-pebble/30 pt-8 mt-12">
              <p className="text-body-sm text-text-light text-center">
                Your privacy is the foundation of trust in our grove. Thank you for allowing us 
                to be the guardians of your memories.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}