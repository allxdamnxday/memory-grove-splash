'use client'

import { forwardRef, ReactNode } from 'react'
import Card, { CardProps, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card'
import { cn } from '@/lib/utils'

export interface OrganicCardProps extends Omit<CardProps, 'shape'> {
  colorScheme?: 'sage' | 'dawn' | 'earth' | 'default'
  withBlob?: boolean
  blobPosition?: 'top-right' | 'bottom-left' | 'center'
  safePadding?: boolean
  children: ReactNode
}

const OrganicCard = forwardRef<HTMLDivElement, OrganicCardProps>(
  ({ 
    className, 
    colorScheme = 'default',
    withBlob = false,
    blobPosition = 'top-right',
    safePadding = false,
    variant = 'nature',
    animate = false,
    children,
    ...props 
  }, ref) => {
    const colorSchemes = {
      sage: 'from-sage-mist/30 via-warm-white to-sage-light/10',
      dawn: 'from-accent-dawn/20 via-warm-white to-warm-sand/10',
      earth: 'from-accent-earth/10 via-warm-white to-warm-pebble/20',
      default: ''
    }

    const blobPositions = {
      'top-right': 'top-0 right-0',
      'bottom-left': 'bottom-0 left-0',
      'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
    }

    const blobColors = {
      sage: 'bg-sage-mist/40',
      dawn: 'bg-accent-dawn/30',
      earth: 'bg-accent-earth/20',
      default: 'bg-sage-light/30'
    }

    return (
      <Card
        ref={ref}
        shape="organic"
        variant={variant}
        animate={animate}
        className={cn(
          'relative',
          colorScheme !== 'default' && `bg-gradient-to-br ${colorSchemes[colorScheme]}`,
          className
        )}
        {...props}
      >
        {withBlob && (
          <div className="absolute inset-0 overflow-hidden rounded-organic pointer-events-none">
            <div 
              className={cn(
                'absolute w-64 h-64 rounded-organic blur-3xl animate-pulse',
                blobPositions[blobPosition],
                blobColors[colorScheme]
              )}
              style={{ animationDuration: '4s' }}
            />
          </div>
        )}
        <div className={cn(
          "relative z-10",
          safePadding && "p-4 sm:p-6 lg:p-8"
        )}>
          {children}
        </div>
      </Card>
    )
  }
)

OrganicCard.displayName = 'OrganicCard'

// Re-export Card components for convenience
export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter }

// Preset organic cards for common use cases
export const MemoryOrganicCard = forwardRef<HTMLDivElement, Omit<OrganicCardProps, 'colorScheme' | 'withBlob'>>(
  (props, ref) => (
    <OrganicCard
      ref={ref}
      colorScheme="sage"
      withBlob
      blobPosition="top-right"
      {...props}
    />
  )
)

MemoryOrganicCard.displayName = 'MemoryOrganicCard'

export const FeatureOrganicCard = forwardRef<HTMLDivElement, Omit<OrganicCardProps, 'colorScheme' | 'variant'>>(
  (props, ref) => (
    <OrganicCard
      ref={ref}
      colorScheme="dawn"
      variant="elevated"
      {...props}
    />
  )
)

FeatureOrganicCard.displayName = 'FeatureOrganicCard'

export default OrganicCard