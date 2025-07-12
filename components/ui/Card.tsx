import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'nature' | 'glass'
  padding?: 'sm' | 'md' | 'lg'
  shape?: 'default' | 'organic'
  animate?: 'fade-in' | 'scale-in' | 'slide-up' | false
  animationDelay?: number
  interactive?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default', 
    padding = 'md', 
    shape = 'default',
    animate = false,
    animationDelay = 0,
    interactive = true,
    children, 
    ...props 
  }, ref) => {
    const baseStyles = cn(
      'transition-all duration-300 ease-out',
      shape === 'organic' ? 'rounded-organic' : 'rounded-xl',
      interactive && 'transform hover:scale-[1.02]'
    )
    
    const variants = {
      default: 'bg-warm-white border border-warm-pebble shadow-gentle hover:shadow-soft',
      elevated: 'bg-warm-white shadow-soft hover:shadow-xl',
      bordered: 'bg-transparent border-2 border-warm-pebble hover:border-sage-light',
      nature: 'bg-gradient-to-br from-sage-mist/20 via-warm-white to-warm-sand/10 shadow-gentle hover:shadow-soft border border-sage-light/20',
      glass: 'bg-warm-white/80 backdrop-blur-sm border border-warm-pebble/40 shadow-gentle hover:shadow-soft'
    }
    
    const paddings = {
      sm: 'p-6',
      md: 'p-8',
      lg: 'p-10'
    }
    
    const animationClasses = {
      'fade-in': 'animate-fade-in',
      'scale-in': 'animate-scale-in',
      'slide-up': 'animate-slide-up'
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          paddings[padding],
          animate && animationClasses[animate],
          className
        )}
        style={{
          ...(animationDelay > 0 && { animationDelay: `${animationDelay}ms` }),
          ...props.style
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mb-6', className)}
      {...props}
    />
  )
)

CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-serif text-h3 text-sage-deep', className)}
      {...props}
    />
  )
)

CardTitle.displayName = 'CardTitle'

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-text-secondary text-body-sm mt-2', className)}
      {...props}
    />
  )
)

CardDescription.displayName = 'CardDescription'

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-text-primary', className)}
      {...props}
    />
  )
)

CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-6 pt-6 border-t border-warm-pebble/20', className)}
      {...props}
    />
  )
)

CardFooter.displayName = 'CardFooter'

export default Card