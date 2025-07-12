import { cn } from '@/lib/utils'

interface WaveformProps {
  className?: string
  animate?: boolean
  color?: 'sage' | 'warm' | 'muted'
}

export default function Waveform({ 
  className, 
  animate = false,
  color = 'sage' 
}: WaveformProps) {
  const colorClasses = {
    sage: 'fill-sage-primary/30',
    warm: 'fill-warm-primary/30',
    muted: 'fill-text-tertiary/20'
  }

  return (
    <div className={cn("flex items-center justify-center gap-0.5 h-8", className)}>
      {[...Array(20)].map((_, i) => {
        const height = Math.random() * 20 + 10
        const delay = i * 50
        
        return (
          <div
            key={i}
            className={cn(
              "w-0.5 rounded-full transition-all duration-300",
              colorClasses[color],
              animate && "animate-pulse"
            )}
            style={{
              height: `${height}px`,
              animationDelay: animate ? `${delay}ms` : undefined
            }}
          />
        )
      })}
    </div>
  )
}