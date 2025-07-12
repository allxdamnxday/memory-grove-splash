'use client'

import { useEffect, useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  value: string
  label: string
  icon?: ReactNode
  delay?: number
  className?: string
}

export default function StatCard({ value, label, icon, delay = 0, className }: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])
  
  return (
    <div className={cn(
      "group relative transition-all duration-700 transform hover:scale-105",
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      className
    )}>
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-sage-mist/20 to-warm-sand/20 rounded-organic opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
      
      <div className="relative bg-warm-white/80 backdrop-blur-sm rounded-organic p-8 border border-warm-pebble/30 hover:border-sage-light/50 transition-colors">
        {icon && (
          <div className="flex justify-center mb-4 text-sage-primary">
            {icon}
          </div>
        )}
        
        <div className="text-center">
          <div className="text-display-sm font-serif text-sage-primary mb-3 leading-tight">
            {value}
          </div>
          <p className="text-body-sm text-text-secondary max-w-xs mx-auto leading-relaxed">
            {label}
          </p>
        </div>
      </div>
    </div>
  )
}