'use client'

import { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface FloatingBlobProps {
  color?: 'sage' | 'dawn' | 'earth' | 'mist'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  animate?: boolean
  blur?: 'sm' | 'md' | 'lg' | 'xl'
  opacity?: number
  className?: string
  style?: CSSProperties
}

export default function FloatingBlob({
  color = 'sage',
  size = 'md',
  position = 'top-right',
  animate = true,
  blur = 'lg',
  opacity = 0.3,
  className,
  style
}: FloatingBlobProps) {
  const colors = {
    sage: 'from-sage-mist to-sage-light',
    dawn: 'from-accent-dawn to-warm-sand',
    earth: 'from-accent-earth to-warm-pebble',
    mist: 'from-warm-white to-sage-mist'
  }

  const sizes = {
    sm: 'w-32 h-32',
    md: 'w-64 h-64',
    lg: 'w-96 h-96',
    xl: 'w-[32rem] h-[32rem]'
  }

  const positions = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  }

  const blurs = {
    sm: 'blur-xl',
    md: 'blur-2xl',
    lg: 'blur-3xl',
    xl: 'blur-[100px]'
  }

  return (
    <div
      className={cn(
        'absolute pointer-events-none rounded-organic bg-gradient-to-br',
        colors[color],
        sizes[size],
        positions[position],
        blurs[blur],
        animate && 'animate-float',
        className
      )}
      style={{
        opacity,
        ...style
      }}
    />
  )
}

// Floating blob group for complex backgrounds
interface FloatingBlobGroupProps {
  preset?: 'minimal' | 'balanced' | 'rich'
  children?: React.ReactNode
}

export function FloatingBlobGroup({ preset = 'balanced', children }: FloatingBlobGroupProps) {
  const presets = {
    minimal: [
      { color: 'sage' as const, position: 'top-right' as const, size: 'md' as const }
    ],
    balanced: [
      { color: 'sage' as const, position: 'top-right' as const, size: 'lg' as const },
      { color: 'dawn' as const, position: 'bottom-left' as const, size: 'md' as const }
    ],
    rich: [
      { color: 'sage' as const, position: 'top-right' as const, size: 'xl' as const },
      { color: 'dawn' as const, position: 'bottom-left' as const, size: 'lg' as const },
      { color: 'earth' as const, position: 'center' as const, size: 'md' as const, opacity: 0.2 }
    ]
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {presets[preset].map((blob, index) => (
        <FloatingBlob
          key={index}
          {...blob}
          style={{ animationDelay: `${index * 2}s` }}
        />
      ))}
      {children}
    </div>
  )
}