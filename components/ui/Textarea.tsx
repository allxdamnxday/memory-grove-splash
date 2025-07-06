import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={textareaId}
            className="block text-body-sm font-normal text-text-primary mb-2"
          >
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'input-field min-h-[120px] resize-y',
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

Textarea.displayName = 'Textarea'

export default Textarea