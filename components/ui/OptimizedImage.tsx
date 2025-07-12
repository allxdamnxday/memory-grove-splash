'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  containerClassName?: string
  sizes?: string
  quality?: number
  blurDataURL?: string
  onLoad?: () => void
}

export function OptimizedImage({ 
  src, 
  alt, 
  width = 1920, 
  height = 1080, 
  priority = false,
  className = '',
  containerClassName = '',
  sizes = '100vw',
  quality = 85,
  blurDataURL,
  onLoad
}: OptimizedImageProps) {
  const [isLoading, setLoading] = useState(true)
  
  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        sizes={sizes}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        className={cn(
          'duration-700 ease-in-out',
          isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0',
          className
        )}
        onLoad={() => {
          setLoading(false)
          onLoad?.()
        }}
      />
    </div>
  )
}

// Responsive image component for art direction
interface ResponsiveImageProps extends Omit<OptimizedImageProps, 'src'> {
  sources: {
    media: string
    srcSet: string
    type?: string
  }[]
  fallbackSrc: string
}

export function ResponsiveImage({ 
  sources,
  fallbackSrc,
  alt,
  width = 1920,
  height = 1080,
  priority = false,
  className = '',
  containerClassName = '',
  sizes = '100vw',
  quality = 85,
  blurDataURL,
  onLoad
}: ResponsiveImageProps) {
  const [isLoading, setLoading] = useState(true)
  
  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      <picture>
        {sources.map((source, index) => (
          <source
            key={index}
            media={source.media}
            srcSet={source.srcSet}
            type={source.type}
          />
        ))}
        <Image
          src={fallbackSrc}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          quality={quality}
          sizes={sizes}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          className={cn(
            'duration-700 ease-in-out object-cover',
            isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0',
            className
          )}
          onLoad={() => {
            setLoading(false)
            onLoad?.()
          }}
        />
      </picture>
    </div>
  )
}