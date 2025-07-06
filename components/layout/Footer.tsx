import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  const footerLinks = {
    explore: [
      { href: '/how-it-works', label: 'How It Works' },
      { href: '/about', label: 'Our Story' },
      { href: '/blog', label: 'Memory Stories' },
    ],
    support: [
      { href: '/contact', label: 'Contact Us' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
    ],
    connect: [
      { href: 'https://twitter.com/memorygrove', label: 'Twitter', external: true },
      { href: 'https://instagram.com/memorygrove', label: 'Instagram', external: true },
      { href: 'https://linkedin.com/company/memorygrove', label: 'LinkedIn', external: true },
    ],
  }

  return (
    <footer className="bg-warm-sand border-t border-warm-pebble/20">
      <div className="container-grove py-16 md:py-20">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-sage-mist flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="w-6 h-6 text-sage-deep"
                >
                  <path d="M12 2C7 2 4 5 4 9c0 4 4 12 8 12s8-8 8-12c0-4-3-7-8-7z" />
                  <path d="M12 2v19M8 7c0 3 1.5 5 4 5s4-2 4-5" />
                </svg>
              </div>
              <span className="font-serif text-h3 text-sage-deep">
                The Memory Grove
              </span>
            </Link>
            <p className="text-text-secondary text-body-sm max-w-md mb-6">
              A sacred digital sanctuary where memories bloom eternal. 
              Preserve your essence, share your wisdom, and ensure your love 
              lives on through voice, story, and connection.
            </p>
            <div className="flex space-x-4">
              {footerLinks.connect.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-sage-mist/50 flex items-center justify-center hover:bg-sage-mist transition-colors duration-300"
                  aria-label={link.label}
                >
                  <span className="sr-only">{link.label}</span>
                  {/* Simple social icons - in production, use proper icon library */}
                  <div className="w-4 h-4 bg-sage-primary rounded-sm"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-serif text-body-lg text-sage-deep mb-4">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-sage-primary transition-colors duration-300 text-body-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-body-lg text-sage-deep mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-sage-primary transition-colors duration-300 text-body-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-warm-pebble/20 pt-12 mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-serif text-h3 text-sage-deep mb-4">
              Join Our Growing Garden
            </h3>
            <p className="text-text-secondary mb-6">
              Receive gentle wisdom about preserving memories and creating lasting legacies.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="input-field flex-1"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Plant Your Seed
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-warm-pebble/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-light text-caption">
              © {currentYear} The Memory Grove. Nurturing memories with reverence and care.
            </p>
            <p className="text-text-light text-caption">
              Made with 🌱 for those we love
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}