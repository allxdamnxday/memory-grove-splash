'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/blog', label: 'Stories' },
    { href: '/contact', label: 'Contact' }
  ]

  return (
    <header className="bg-warm-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-warm-pebble/20">
      <nav className="container-grove">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/images/Logo_no_text_No_BG.svg"
              alt="Memory Groves Logo"
              width={40}
              height={40}
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <span className="font-serif text-h3 text-sage-deep">
              Memory Groves
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-text-secondary hover:text-sage-primary transition-colors duration-300 text-body-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/join"
                className="btn-primary"
              >
                Begin Your Grove
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-sage-primary"
            aria-label="Toggle menu"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <>
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-warm-pebble/20 animate-fade-in">
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block text-text-secondary hover:text-sage-primary transition-colors duration-300 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-4">
                <Link
                  href="/join"
                  className="btn-primary block text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Begin Your Grove
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}