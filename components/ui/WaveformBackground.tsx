'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface WaveformBackgroundProps {
  className?: string
  opacity?: number
  color?: string
}

export default function WaveformBackground({ 
  className,
  opacity = 0.03,
  color = '#3A3F36'
}: WaveformBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    // Animation variables
    let animationId: number
    const waves: number[] = []
    const waveCount = 50
    const waveSpacing = canvas.width / waveCount
    
    // Initialize waves
    for (let i = 0; i < waveCount; i++) {
      waves.push(Math.random() * 0.5 + 0.5)
    }
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update wave heights
      for (let i = 0; i < waveCount; i++) {
        const targetHeight = Math.random() * 0.5 + 0.5
        waves[i] += (targetHeight - waves[i]) * 0.1
      }
      
      // Draw waves
      ctx.fillStyle = color
      ctx.globalAlpha = opacity
      
      for (let i = 0; i < waveCount; i++) {
        const x = i * waveSpacing + waveSpacing / 2
        const height = waves[i] * canvas.height * 0.3
        const y = (canvas.height - height) / 2
        
        ctx.fillRect(x - 1, y, 2, height)
      }
      
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [color, opacity])
  
  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{ width: '100%', height: '100%' }}
    />
  )
}