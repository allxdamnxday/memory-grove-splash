'use client'

import { useState } from 'react'

interface FAQItemProps {
  question: string
  answer: string
  delay?: number
}

export default function FAQItem({ question, answer, delay = 0 }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div 
      className="border-b border-sage-mist/30 py-6 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <button
        className="w-full text-left flex items-center justify-between group"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3 className="font-serif text-h3 text-sage-deep pr-4 group-hover:text-sage-primary transition-colors">
          {question}
        </h3>
        <div className="flex-shrink-0 w-6 h-6 text-sage-primary transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ${
        isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
      }`}>
        <p className="text-body text-text-secondary pr-12">
          {answer}
        </p>
      </div>
    </div>
  )
}