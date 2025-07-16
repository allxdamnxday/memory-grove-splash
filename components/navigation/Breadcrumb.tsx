'use client'

import Link from 'next/link'
import { ChevronRight, Home, TreePine } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn('flex items-center gap-2 text-caption', className)}
    >
      <Link 
        href="/"
        className="text-text-secondary hover:text-sage-primary transition-colors"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-3 h-3 text-warm-400" />
          
          {item.href && index < items.length - 1 ? (
            <Link 
              href={item.href}
              className="text-text-secondary hover:text-sage-primary transition-colors flex items-center gap-1.5 group"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ) : (
            <div className="text-sage-deep font-medium flex items-center gap-1.5">
              {item.icon || <TreePine className="w-3.5 h-3.5 text-sage-primary" />}
              <span>{item.label}</span>
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}