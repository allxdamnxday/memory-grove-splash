'use client'

import Link from 'next/link'
import { ChevronLeft, Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BackNavigationProps {
  href: string
  label?: string
  className?: string
  variant?: 'default' | 'subtle'
}

export default function BackNavigation({ 
  href, 
  label = 'Return', 
  className,
  variant = 'default'
}: BackNavigationProps) {
  const variants = {
    default: 'text-sage-primary hover:text-sage-deep',
    subtle: 'text-text-secondary hover:text-sage-primary'
  }

  return (
    <Link 
      href={href}
      className={cn(
        'inline-flex items-center gap-2 text-body-sm font-medium transition-all duration-300 group',
        'hover:translate-x-[-4px] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2 rounded-lg px-2 py-1',
        variants[variant],
        className
      )}
    >
      <div className="relative">
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:scale-110" />
        <Leaf className="w-3 h-3 absolute -right-1 -top-1 text-sage-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
      </div>
      <span>{label}</span>
    </Link>
  )
}