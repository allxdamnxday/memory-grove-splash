import { ButtonHTMLAttributes, forwardRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'white' | 'white-outline'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  external?: boolean
  className?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    href,
    external = false,
    children,
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-sans font-medium transition-all duration-300 ease-out transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-105 active:scale-95'
    
    const variants = {
      primary: 'bg-sage-primary text-warm-white hover:bg-sage-deep hover:shadow-lg',
      secondary: 'bg-transparent border-2 border-sage-primary text-sage-primary hover:bg-sage-mist hover:shadow-md',
      ghost: 'bg-transparent text-sage-primary hover:bg-sage-mist/50 hover:shadow-sm',
      white: 'bg-warm-white text-sage-deep hover:bg-warm-sand hover:shadow-lg',
      'white-outline': 'bg-transparent border-2 border-warm-white text-warm-white hover:bg-warm-white/10 hover:shadow-md'
    }
    
    const sizes = {
      sm: 'text-body-sm px-6 py-3 rounded-lg min-h-[44px]',
      md: 'text-body-sm px-8 py-4 rounded-xl min-h-[48px]',
      lg: 'text-body px-10 py-5 rounded-xl min-h-[56px]'
    }
    
    const classes = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    )
    
    if (href) {
      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={classes}
          >
            {children}
          </a>
        )
      }
      
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      )
    }
    
    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button