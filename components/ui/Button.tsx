'use client'

import { ButtonHTMLAttributes, forwardRef, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant of the button */
  variant?: 'primary' | 'secondary' | 'ghost' | 'white' | 'white-outline' | 'icon'
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg' | 'icon-sm' | 'icon-md' | 'icon-lg'
  /** Organic shape style */
  organic?: 'pebble' | 'leaf' | 'seed' | 'none'
  /** If provided, renders as a link instead of button */
  href?: string
  /** Opens link in new tab/window */
  external?: boolean
  /** Additional CSS classes */
  className?: string
  /** Shows loading spinner and disables button */
  loading?: boolean
  /** Icon element to display (for icon variant) */
  icon?: React.ReactNode
  /** Enable living animation (gentle morphing) */
  living?: boolean
}

/**
 * Button component that supports multiple variants, sizes, and can render as a button or link.
 * 
 * @example
 * // Primary button
 * <Button variant="primary" size="md">Click me</Button>
 * 
 * @example
 * // Icon button
 * <Button variant="icon" size="icon-md" icon={<Play />} />
 * 
 * @example
 * // Loading state
 * <Button loading>Saving...</Button>
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    organic = 'pebble',
    href,
    external = false,
    children,
    loading = false,
    icon,
    disabled,
    living = false,
    ...props 
  }, ref) => {
    const [isHovered, setIsHovered] = useState(false)
    const [morphSeed, setMorphSeed] = useState(0)
    const buttonRef = useRef<HTMLElement>(null)
    
    // Generate unique organic shape on mount and hover
    useEffect(() => {
      if (living && isHovered) {
        const interval = setInterval(() => {
          setMorphSeed(Math.random())
        }, 2000)
        return () => clearInterval(interval)
      }
    }, [living, isHovered])
    
    // Organic shape configurations
    const getOrganicShape = () => {
      if (organic === 'none') return 'rounded-xl'
      
      const shapes = {
        pebble: [
          'rounded-[30%_70%_70%_30%/30%_30%_70%_70%]',
          'rounded-[40%_60%_60%_40%/50%_50%_50%_50%]',
          'rounded-[35%_65%_65%_35%/40%_40%_60%_60%]'
        ],
        leaf: [
          'rounded-[0%_100%_100%_0%/50%_50%_50%_50%]',
          'rounded-[80%_20%_80%_20%/20%_80%_20%_80%]',
          'rounded-[70%_30%_70%_30%/30%_70%_30%_70%]'
        ],
        seed: [
          'rounded-[50%_50%_50%_50%/60%_60%_40%_40%]',
          'rounded-[45%_55%_55%_45%/65%_65%_35%_35%]',
          'rounded-[55%_45%_45%_55%/55%_55%_45%_45%]'
        ]
      }
      
      const shapeSet = shapes[organic]
      if (!shapeSet) return 'rounded-xl'
      
      // Return different shape based on hover state and morph seed
      if (isHovered && living) {
        const index = Math.floor(morphSeed * shapeSet.length)
        return shapeSet[index]
      }
      
      return shapeSet[0]
    }
    const baseStyles = cn(
      'relative inline-flex items-center justify-center font-sans font-medium',
      'transition-all duration-500 ease-out transform',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-primary focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'hover:scale-[1.02] active:scale-[0.98]',
      'overflow-hidden',
      getOrganicShape()
    )
    
    const variants = {
      primary: cn(
        'bg-gradient-to-br from-sage-primary to-sage-deep text-warm-white',
        'hover:from-sage-deep hover:to-sage-primary',
        'shadow-[0_4px_20px_rgba(124,132,113,0.3)]',
        'hover:shadow-[0_8px_30px_rgba(124,132,113,0.4)]',
        'before:absolute before:inset-0 before:opacity-0',
        'before:bg-gradient-to-tr before:from-warm-white/20 before:to-transparent',
        'hover:before:opacity-100 before:transition-opacity before:duration-500'
      ),
      secondary: cn(
        'bg-transparent border-2 border-sage-primary text-sage-primary',
        'hover:bg-gradient-to-br hover:from-sage-mist/30 hover:to-sage-light/20',
        'hover:border-sage-deep hover:text-sage-deep',
        'shadow-[0_2px_10px_rgba(124,132,113,0.1)]',
        'hover:shadow-[0_4px_20px_rgba(124,132,113,0.2)]'
      ),
      ghost: cn(
        'bg-transparent text-sage-primary',
        'hover:bg-gradient-to-br hover:from-sage-mist/20 hover:to-transparent',
        'hover:text-sage-deep'
      ),
      white: cn(
        'bg-gradient-to-br from-warm-white to-warm-sand text-sage-deep',
        'hover:from-warm-sand hover:to-warm-white',
        'shadow-[0_4px_20px_rgba(0,0,0,0.1)]',
        'hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]'
      ),
      'white-outline': cn(
        'bg-transparent border-2 border-warm-white text-warm-white',
        'hover:bg-warm-white/10 hover:border-warm-sand',
        'shadow-[0_4px_20px_rgba(255,255,255,0.1)]',
        'hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)]'
      ),
      icon: cn(
        'bg-transparent text-sage-primary',
        'hover:bg-gradient-to-br hover:from-sage-mist/30 hover:to-sage-light/20',
        'hover:text-sage-deep'
      )
    }
    
    const sizes = {
      sm: 'text-body-sm px-6 py-3 min-h-[44px]',
      md: 'text-body-sm px-8 py-4 min-h-[48px]',
      lg: 'text-body px-10 py-5 min-h-[56px]',
      'icon-sm': 'p-2 w-10 h-10',
      'icon-md': 'p-2.5 w-12 h-12',
      'icon-lg': 'p-3 w-14 h-14'
    }
    
    const classes = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      living && 'animate-pulse',
      className
    )
    
    // Mouse event handlers for living animation
    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => setIsHovered(false)
    
    // Button content with loading state
    const buttonContent = (
      <>
        {/* Organic texture overlay */}
        <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700">
          <span className="absolute inset-0 bg-gradient-to-tr from-warm-white/10 via-transparent to-warm-white/5" />
          <span className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-warm-white/10 to-transparent rounded-full blur-2xl" />
        </span>
        
        {/* Content */}
        <span className="relative z-10 flex items-center justify-center">
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              {children}
            </>
          ) : (
            variant === 'icon' ? icon : children
          )}
        </span>
      </>
    )
    
    if (href) {
      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={classes}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={buttonRef as any}
          >
            {buttonContent}
          </a>
        )
      }
      
      return (
        <Link 
          href={href} 
          className={classes}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={buttonRef as any}
        >
          {buttonContent}
        </Link>
      )
    }
    
    return (
      <button
        className={classes}
        ref={ref}
        disabled={disabled || loading}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {buttonContent}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button