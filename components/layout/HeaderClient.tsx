'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { User } from '@supabase/supabase-js'

export default function HeaderClient({ user }: { user: User | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

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
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-text-secondary hover:text-sage-primary transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-sage-mist flex items-center justify-center">
                      <svg className="w-5 h-5 text-sage-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-soft py-2 z-50">
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-body-sm text-text-secondary hover:bg-warm-sand/20 hover:text-sage-primary transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Grove
                      </Link>
                      <form action="/api/auth/signout" method="POST">
                        <button
                          type="submit"
                          className="w-full text-left px-4 py-2 text-body-sm text-text-secondary hover:bg-warm-sand/20 hover:text-sage-primary transition-colors"
                        >
                          Sign out
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-sage-primary hover:text-sage-deep transition-colors text-body-sm"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-primary"
                  >
                    Begin Your Grove
                  </Link>
                </div>
              )}
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
              {user ? (
                <>
                  <li className="pt-4 border-t border-warm-pebble/20">
                    <Link
                      href="/account"
                      className="block text-text-secondary hover:text-sage-primary transition-colors duration-300 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Grove
                    </Link>
                  </li>
                  <li>
                    <form action="/api/auth/signout" method="POST">
                      <button
                        type="submit"
                        className="w-full text-left text-text-secondary hover:text-sage-primary transition-colors duration-300 py-2"
                      >
                        Sign out
                      </button>
                    </form>
                  </li>
                </>
              ) : (
                <>
                  <li className="pt-4 border-t border-warm-pebble/20">
                    <Link
                      href="/login"
                      className="block text-sage-primary hover:text-sage-deep transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className="btn-primary block text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Begin Your Grove
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}