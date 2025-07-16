import { Metadata } from 'next'
import { BackNavigation } from '@/components/navigation'

export const metadata: Metadata = {
  title: 'Terms of Service - Memory Grove',
  description: 'The agreement that guides our relationship as you create your digital legacy with Memory Grove.',
}

export default function TermsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sage-mist/20 to-warm-sand py-16 md:py-24">
        <div className="container-grove">
          <BackNavigation 
            href="/" 
            label="Return Home"
            variant="subtle"
            className="mb-8 animate-fade-in"
          />
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-display-sm md:text-display text-sage-deep mb-6">
              Terms of Service
            </h1>
            <p className="text-text-secondary text-body-lg">
              Our agreement is built on mutual respect, trust, and the shared goal of preserving 
              what matters most.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-spacing">
        <div className="container-grove">
          <div className="max-w-3xl mx-auto prose prose-sage">
            <p className="text-body-lg text-sage-primary mb-8">
              Effective Date: January 1, 2024
            </p>

            <div className="bg-sage-mist/20 rounded-organic p-6 mb-8">
              <p className="text-body text-sage-deep">
                Welcome to Memory Grove. These terms create a framework of trust and understanding 
                between us. We&apos;ve written them in plain language because transparency nurtures trust.
              </p>
            </div>

            <h2 className="font-serif text-h2 text-sage-deep mt-12 mb-4">
              1. Our Relationship
            </h2>
            <p className="text-body text-text-secondary mb-6">
              When you join Memory Grove, you&apos;re not just a user—you&apos;re entrusting us with your 
              legacy. We take this responsibility seriously and commit to:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-body text-text-secondary">
                • Treating your memories with reverence and care
              </li>
              <li className="text-body text-text-secondary">
                • Providing reliable service for generations
              </li>
              <li className="text-body text-text-secondary">
                • Being transparent in our practices
              </li>
              <li className="text-body text-text-secondary">
                • Supporting you with compassion
              </li>
            </ul>

            <h2 className="font-serif text-h2 text-sage-deep mt-12 mb-4">
              2. Your Grove, Your Rules
            </h2>
            <h3 className="font-serif text-h3 text-sage-primary mt-8 mb-3">
              What You Can Do
            </h3>
            <ul className="space-y-2 mb-6">
              <li className="text-body text-text-secondary">
                • Create and store unlimited memories (based on your plan)
              </li>
              <li className="text-body text-text-secondary">
                • Share recordings with chosen recipients
              </li>
              <li className="text-body text-text-secondary">
                • Schedule deliveries for future dates
              </li>
              <li className="text-body text-text-secondary">
                • Maintain complete control over your content
              </li>
              <li className="text-body text-text-secondary">
                • Export or delete your data anytime
              </li>
            </ul>

            <h3 className="font-serif text-h3 text-sage-primary mt-8 mb-3">
              What We Ask of You
            </h3>
            <ul className="space-y-2 mb-6">
              <li className="text-body text-text-secondary">
                • Use Memory Grove with good intentions
              </li>
              <li className="text-body text-text-secondary">
                • Respect others&apos; privacy and rights
              </li>
              <li className="text-body text-text-secondary">
                • Keep your account information secure
              </li>
              <li className="text-body text-text-secondary">
                • Ensure you have rights to content you upload
              </li>
              <li className="text-body text-text-secondary">
                • Be truthful in your interactions with us
              </li>
            </ul>

            <h2 className="font-serif text-h2 text-sage-deep mt-12 mb-4">
              3. Content Ownership
            </h2>
            <p className="text-body text-text-secondary mb-6">
              <strong>Your content remains yours.</strong> You retain all rights to your recordings, 
              photos, and messages. By using Memory Grove, you grant us permission only to:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-body text-text-secondary">
                • Store and protect your content
              </li>
              <li className="text-body text-text-secondary">
                • Deliver it according to your instructions
              </li>
              <li className="text-body text-text-secondary">
                • Create backups for preservation
              </li>
              <li className="text-body text-text-secondary">
                • Provide technical support when needed
              </li>
            </ul>

            <h2 className="font-serif text-h2 text-sage-deep mt-12 mb-4">
              4. Our Service Commitment
            </h2>
            <p className="text-body text-text-secondary mb-6">
              We promise to:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-body text-text-secondary">
                • Maintain 99.9% uptime for accessing your grove
              </li>
              <li className="text-body text-text-secondary">
                • Preserve your content with multiple backups
              </li>
              <li className="text-body text-text-secondary">
                • Deliver messages exactly as scheduled
              </li>
              <li className="text-body text-text-secondary">
                • Notify you of any service changes
              </li>
              <li className="text-body text-text-secondary">
                • Provide human support when you need it
              </li>
            </ul>

            <h2 className="font-serif text-h2 text-sage-deep mt-12 mb-4">
              5. Privacy & Security
            </h2>
            <p className="text-body text-text-secondary mb-6">
              Your privacy is sacred. We protect it through:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-body text-text-secondary">
                • End-to-end encryption for all recordings
              </li>
              <li className="text-body text-text-secondary">
                • Strict access controls
              </li>
              <li className="text-body text-text-secondary">
                • Regular security audits
              </li>
              <li className="text-body text-text-secondary">
                • Transparent data practices
              </li>
            </ul>
            <p className="text-body text-text-secondary mb-6">
              See our <a href="/privacy" className="text-sage-primary hover:text-sage-deep">Privacy Policy</a> for 
              detailed information.
            </p>

            <h2 className="font-serif text-h2 text-sage-deep mt-12 mb-4">
              6. Payment & Plans
            </h2>
            <p className="text-body text-text-secondary mb-6">
              We offer transparent pricing with no hidden fees:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-body text-text-secondary">
                • Free tier always available
              </li>
              <li className="text-body text-text-secondary">
                • Cancel paid plans anytime
              </li>
              <li className="text-body text-text-secondary">
                • No deletion of content if you downgrade
              </li>
              <li className="text-body text-text-secondary">
                • Refunds available within 30 days
              </li>
            </ul>

            <h2 className="font-serif text-h2 text-sage-deep mt-12 mb-4">
              7. Eternal Storage Promise
            </h2>
            <p className="text-body text-text-secondary mb-6">
              For Memory Grove (annual) members, we guarantee:
            </p>
            <div className="bg-sage-mist/20 rounded-organic p-6 mb-6">
              <p className="text-body text-sage-deep">
                Your recordings will be preserved and accessible for a minimum of 100 years, 
                even if Memory Grove ceases operations. This is secured through our partnership 
                with digital preservation institutions.
              </p>
            </div>

            <h2 className="font-serif text-h2 text-sage-deep mt-12 mb-4">
              8. Prohibited Uses
            </h2>
            <p className="text-body text-text-secondary mb-6">
              Memory Grove is a space for love and legacy. Please don&apos;t use it for:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-body text-text-secondary">
                • Harmful, hateful, or illegal content
              </li>
              <li className="text-body text-text-secondary">
                • Impersonating others
              </li>
              <li className="text-body text-text-secondary">
                • Commercial spam or advertising
              </li>
              <li className="text-body text-text-secondary">
                • Violating others&apos; privacy or rights
              </li>
              <li className="text-body text-text-secondary">
                • Attempting to breach security
              </li>
            </ul>

            <h2 className="font-serif text-h2 text-sage-deep mt-12 mb-4">
              9. Account Succession
            </h2>
            <p className="text-body text-text-secondary mb-6">
              You may designate a Grove Keeper who can:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-body text-text-secondary">
                • Manage your account if you&apos;re unable
              </li>
              <li className="text-body text-text-secondary">
                • Ensure messages are delivered as planned
              </li>
              <li className="text-body text-text-secondary">
                • Add memorial content with family permission
              </li>
            </ul>

            <h2 className="font-serif text-h2 text-sage-deep mt-12 mb-4">
              10. Limitation of Liability
            </h2>
            <p className="text-body text-text-secondary mb-6">
              While we strive for perfection, we&apos;re human. We&apos;re not liable for:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-body text-text-secondary">
                • Indirect or consequential damages
              </li>
              <li className="text-body text-text-secondary">
                • Loss beyond our reasonable control
              </li>
              <li className="text-body text-text-secondary">
                • Third-party actions or content
              </li>
            </ul>
            <p className="text-body text-text-secondary mb-6">
              Our total liability is limited to the amount you&apos;ve paid us in the past 12 months.
            </p>

            <h2 className="font-serif text-h2 text-sage-deep mt-12 mb-4">
              11. Dispute Resolution
            </h2>
            <p className="text-body text-text-secondary mb-6">
              If we have a disagreement, let&apos;s talk first. We believe most issues can be 
              resolved with honest conversation. If needed, we agree to binding arbitration 
              in San Francisco, California.
            </p>

            <h2 className="font-serif text-h2 text-sage-deep mt-12 mb-4">
              12. Changes to Terms
            </h2>
            <p className="text-body text-text-secondary mb-6">
              As Memory Grove grows, these terms may evolve. We&apos;ll notify you of significant 
              changes 30 days in advance. Continued use means you accept the new terms.
            </p>

            <h2 className="font-serif text-h2 text-sage-deep mt-12 mb-4">
              13. Contact Us
            </h2>
            <p className="text-body text-text-secondary mb-6">
              Questions about these terms? We&apos;re here to help:
            </p>
            <div className="bg-sage-mist/20 rounded-organic p-6 mb-8">
              <p className="text-body text-sage-deep mb-2">
                Email: legal@memorygrove.com
              </p>
              <p className="text-body text-sage-deep mb-2">
                Phone: 1-800-MEMORIES
              </p>
              <p className="text-body text-sage-deep">
                Mail: Memory Grove Legal<br />
                123 Sanctuary Lane<br />
                San Francisco, CA 94105
              </p>
            </div>

            <div className="border-t border-warm-pebble/30 pt-8 mt-12">
              <p className="text-body text-sage-primary text-center font-serif">
                &ldquo;In the grove of memory, every voice matters, every story has value, 
                and every connection is sacred.&rdquo;
              </p>
              <p className="text-body-sm text-text-light text-center mt-4">
                Thank you for trusting us with your legacy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}