'use client'

import { useEffect, useState } from 'react'

export default function FloatingElements() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [familyCount, setFamilyCount] = useState(12847)
  
  const ambientQuotes = [
    "Record them complaining about their day. Trust us.",
    "Your everyday hello is someone's future treasure",
    "The stories you're tired of telling are the ones they'll miss most"
  ]
  
  useEffect(() => {
    // Rotate quotes every 5 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % ambientQuotes.length)
    }, 5000)
    
    // Increment family count occasionally
    const countInterval = setInterval(() => {
      setFamilyCount((prev) => prev + Math.floor(Math.random() * 3))
    }, 10000)
    
    return () => {
      clearInterval(quoteInterval)
      clearInterval(countInterval)
    }
  }, [ambientQuotes.length])
  
  return (
    <>
      {/* Ambient Quote */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 -rotate-90 origin-left hidden xl:block">
        <p className="text-caption text-sage-light/60 font-handwritten whitespace-nowrap transition-opacity duration-1000">
          {ambientQuotes[currentQuoteIndex]}
        </p>
      </div>
      
      {/* Social Proof Bar */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-warm-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-soft">
          <p className="text-body-sm text-sage-primary font-sans">
            Join <span className="font-medium">{familyCount.toLocaleString()}</span> families preserving their voices for tomorrow
          </p>
        </div>
      </div>
      
      {/* Subtle Sound Waves Animation */}
      <div className="fixed top-20 right-10 pointer-events-none hidden lg:block">
        <svg className="w-24 h-24 text-sage-mist/20" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" className="animate-pulse" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" className="animate-pulse animation-delay-200" />
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.25" className="animate-pulse animation-delay-400" />
        </svg>
      </div>
      
      {/* Falling Leaves */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${20 + i * 20}%`,
              top: '-20px',
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + i * 5}s`
            }}
          >
            <svg className="w-8 h-8 text-sage-mist/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
            </svg>
          </div>
        ))}
      </div>
    </>
  )
}