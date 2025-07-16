'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { Dropdown, DropdownItem, DropdownDivider, DropdownHeader } from '@/components/ui'

export default function HeaderClient({ user }: { user: User | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/blog', label: 'Stories' },
    { href: '/contact', label: 'Contact' }
  ]

  // Get user initials from email or metadata
  const getUserInitials = (user: User | null) => {
    if (!user) return ''
    if (user.user_metadata?.name) {
      const names = user.user_metadata.name.split(' ')
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return user.email?.slice(0, 2).toUpperCase() || 'U'
  }

  const userInitials = getUserInitials(user)

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
                <Dropdown
                  trigger={
                    <div className="flex items-center gap-3 text-text-secondary hover:text-sage-primary transition-colors group">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-mist to-sage-soft flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                          {userInitials ? (
                            <span className="text-sm font-medium text-sage-deep">{userInitials}</span>
                          ) : (
                            <svg className="w-5 h-5 text-sage-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-sage-primary rounded-full border-2 border-white"></div>
                      </div>
                      <div className="hidden lg:block text-left">
                        <p className="text-xs text-warm-500">Welcome back</p>
                        <p className="text-sm font-medium text-warm-700 truncate max-w-[150px]">
                          {user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                        </p>
                      </div>
                      <svg className="w-4 h-4 text-warm-500 group-hover:text-sage-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  }
                  align="right"
                  contentClassName="min-w-[240px]"
                >
                  <DropdownHeader>
                    <div className="flex items-center gap-3 pb-2">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage-mist to-sage-soft flex items-center justify-center">
                        {userInitials ? (
                          <span className="text-base font-medium text-sage-deep">{userInitials}</span>
                        ) : (
                          <svg className="w-6 h-6 text-sage-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-warm-700 truncate">
                          {user.user_metadata?.name || 'Memory Grove User'}
                        </p>
                        <p className="text-xs text-warm-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </DropdownHeader>
                  
                  <DropdownDivider />
                  
                  <DropdownItem
                    href="/account"
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    }
                  >
                    My Grove
                  </DropdownItem>
                  
                  <DropdownItem
                    href="/account/profile"
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    }
                  >
                    Profile Settings
                  </DropdownItem>
                  
                  <DropdownItem
                    href="/account/preferences"
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    }
                  >
                    Preferences
                  </DropdownItem>
                  
                  <DropdownDivider />
                  
                  <DropdownItem
                    href="/help"
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  >
                    Help & Support
                  </DropdownItem>
                  
                  <DropdownDivider />
                  
                  <form action="/api/auth/signout" method="POST">
                    <DropdownItem
                      onClick={() => {}}
                      variant="danger"
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      }
                    >
                      <button type="submit" className="w-full text-left">
                        Sign out
                      </button>
                    </DropdownItem>
                  </form>
                </Dropdown>
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
                    <div className="flex items-center gap-3 px-2 py-3 mb-2 bg-sage-soft/20 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage-mist to-sage-soft flex items-center justify-center">
                        {userInitials ? (
                          <span className="text-base font-medium text-sage-deep">{userInitials}</span>
                        ) : (
                          <svg className="w-6 h-6 text-sage-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-warm-700 truncate">
                          {user.user_metadata?.name || 'Memory Grove User'}
                        </p>
                        <p className="text-xs text-warm-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <Link
                      href="/account"
                      className="flex items-center gap-3 text-text-secondary hover:text-sage-primary transition-colors duration-300 py-2 px-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      My Grove
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account/profile"
                      className="flex items-center gap-3 text-text-secondary hover:text-sage-primary transition-colors duration-300 py-2 px-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account/preferences"
                      className="flex items-center gap-3 text-text-secondary hover:text-sage-primary transition-colors duration-300 py-2 px-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Preferences
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/help"
                      className="flex items-center gap-3 text-text-secondary hover:text-sage-primary transition-colors duration-300 py-2 px-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Help & Support
                    </Link>
                  </li>
                  <li className="pt-2 mt-2 border-t border-warm-pebble/20">
                    <form action="/api/auth/signout" method="POST">
                      <button
                        type="submit"
                        className="w-full flex items-center gap-3 text-left text-red-600 hover:text-red-700 transition-colors duration-300 py-2 px-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
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