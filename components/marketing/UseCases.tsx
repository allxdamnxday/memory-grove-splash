'use client'

import { useState } from 'react'
import { useCases } from '@/lib/data/useCases'
import { 
  BirthdayIcon, 
  WeddingIcon, 
  ComfortIcon, 
  RecipesIcon, 
  WisdomIcon, 
  EmergencyIcon 
} from './EmotionalIcons'
import Waveform from '@/components/ui/Waveform'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import featureDaughterMetadata from '@/public/images/features/feature_daughter_showing_grandma.meta.json'
import featureGrandmaMetadata from '@/public/images/features/feature_grandma_recording.meta.json'
import featureAudioWaveMetadata from '@/public/images/features/feature_audio_wave_forest.meta.json'

export default function UseCases() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  // Map feature images to specific use cases
  const getFeatureImage = (useCaseId: string) => {
    switch (useCaseId) {
      case 'birthday':
        return {
          src: '/images/features/feature_daughter_showing_grandma-original.webp',
          metadata: featureDaughterMetadata,
          alt: 'Daughter sharing precious memories with grandmother on her birthday'
        }
      case 'comfort':
        return {
          src: '/images/features/feature_grandma_recording-original.webp',
          metadata: featureGrandmaMetadata,
          alt: 'Grandmother recording comforting messages for her family'
        }
      case 'wedding':
        return {
          src: '/images/features/feature_audio_wave_forest-original.webp',
          metadata: featureAudioWaveMetadata,
          alt: 'Voice waves creating a forest of memories for special occasions'
        }
      default:
        return null
    }
  }

  const getIcon = (iconName: string) => {
    const iconProps = { className: "w-10 h-10 md:w-12 md:h-12" }
    
    switch (iconName) {
      case 'birthday':
        return <BirthdayIcon {...iconProps} />
      case 'wedding':
        return <WeddingIcon {...iconProps} />
      case 'comfort':
        return <ComfortIcon {...iconProps} />
      case 'recipes':
        return <RecipesIcon {...iconProps} />
      case 'wisdom':
        return <WisdomIcon {...iconProps} />
      case 'emergency':
        return <EmergencyIcon {...iconProps} />
      default:
        return null
    }
  }

  return (
    <section className="section-spacing bg-gradient-to-b from-warm-white to-sage-mist/10">
      <div className="container-grove">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-serif text-h1 md:text-display-sm text-sage-deep mb-6">
            Your Voice, When They Need You Most
          </h2>
          <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
            Not just recordings - your actual voice speaking new words of love, forever. 
            Because love doesn&apos;t end when life does.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {useCases.map((useCase, index) => {
            const featureImage = getFeatureImage(useCase.id)
            
            return (
              <div
                key={useCase.id}
                className={cn(
                  "group relative rounded-organic overflow-hidden transition-all duration-500 transform hover:-translate-y-1 animate-fade-in cursor-pointer",
                  index % 2 === 0 ? "bg-warm-white" : "bg-sage-mist/10",
                  "hover:shadow-elevated"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredCard(useCase.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Feature Image for first three cards */}
                {featureImage && index < 3 && (
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <OptimizedImage
                      src={featureImage.src}
                      alt={featureImage.alt}
                      width={featureImage.metadata.width}
                      height={featureImage.metadata.height}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                      containerClassName="w-full h-full"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      blurDataURL={featureImage.metadata.blurDataURL}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}

                {/* Heartbeat effect on hover */}
                <div className={cn(
                  "absolute inset-0 rounded-organic bg-gradient-to-br from-sage-primary/5 to-warm-primary/5 opacity-0 transition-opacity duration-500",
                  hoveredCard === useCase.id && "opacity-100 animate-pulse"
                )} />

                <div className="relative z-10 p-6 md:p-8">
                  <div className="text-sage-primary mb-4 transition-transform duration-300 group-hover:scale-110">
                    {getIcon(useCase.icon)}
                  </div>
                
                <h3 className="font-serif text-h3 md:text-h2 text-sage-deep mb-3 leading-tight">
                  {useCase.title}
                </h3>
                
                <p className="text-body-sm md:text-body-md text-text-secondary mb-4 leading-relaxed">
                  {useCase.description}
                </p>

                {/* Audio waveform visualization */}
                <div className="mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Waveform 
                    animate={hoveredCard === useCase.id} 
                    color={index % 2 === 0 ? "sage" : "warm"}
                  />
                </div>

                {/* Testimonial */}
                {useCase.testimonial && (
                  <div className="border-t border-warm-pebble/20 pt-4 mt-4">
                    <p className="text-body-xs italic text-text-tertiary">
                      &ldquo;{useCase.testimonial.quote}&rdquo;
                    </p>
                    <p className="text-body-xs text-sage-primary mt-1">
                      — {useCase.testimonial.author}
                    </p>
                  </div>
                )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16 animate-fade-in animation-delay-600">
          <p className="text-body-lg text-text-secondary mb-6">
            Which moments matter most to you?
          </p>
          <Button 
            href="/start" 
            size="lg"
            variant="primary"
            organic="seed"
            living
          >
            Preserve Your Voice Forever
          </Button>
        </div>
      </div>
    </section>
  )
}