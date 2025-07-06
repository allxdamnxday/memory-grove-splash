import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-body-sm font-normal text-text-primary mb-2"
          >
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'input-field',
            error && 'border-accent-earth focus:ring-accent-earth',
            className
          )}
          {...props}
        />
        
        {hint && !error && (
          <p className="mt-2 text-caption text-text-light">
            {hint}
          </p>
        )}
        
        {error && (
          <p className="mt-2 text-caption text-accent-earth animate-fade-in">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input