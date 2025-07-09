'use client'

import { useEffect, useState } from 'react'

interface StatCardProps {
  value: string
  label: string
  delay?: number
}

export default function StatCard({ value, label, delay = 0 }: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])
  
  return (
    <div className={`text-center transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="text-display-sm font-serif text-sage-primary mb-2">
        {value}
      </div>
      <p className="text-body-sm text-text-secondary max-w-xs mx-auto">
        {label}
      </p>
    </div>
  )
}