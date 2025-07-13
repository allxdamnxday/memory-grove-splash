import Button from '@/components/ui/Button'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import heroMetadata from '@/public/images/hero/Hero_Image_Raw.meta.json'

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden py-20 md:py-24">
      {/* Hero Background Image */}
      <div className="absolute inset-0">
        <OptimizedImage
          src="/images/hero/Hero_Image_Raw-original.webp"
          alt="Peaceful grove with morning light filtering through trees"
          width={heroMetadata.width}
          height={heroMetadata.height}
          priority
          className="object-cover w-full h-full"
          containerClassName="w-full h-full"
          sizes="100vw"
          blurDataURL={heroMetadata.blurDataURL}
        />
        {/* Enhanced overlay system for optimal text readability */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40" />
      </div>
      
      {/* Subtle organic shape overlays */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sage-mist/5 rounded-organic blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-dawn/5 rounded-organic blur-3xl animate-pulse animation-delay-400" />
      
      <div className="container-grove relative z-10">
        <div className="max-w-4xl mx-auto text-center px-6">
          {/* Main heading with enhanced readability */}
          <h1 className="font-serif text-display-lg md:text-display text-warm-white mb-8 animate-fade-in text-shadow-xl leading-tight">
            Your Voice. Their Comfort. Forever.
          </h1>
          
          {/* Subheading with better contrast */}
          <p className="text-warm-white/90 text-body-lg md:text-h3 max-w-3xl mx-auto mb-16 animate-fade-in animation-delay-200 text-shadow-lg leading-relaxed">
            Every day, someone desperately searches for just one more voicemail from someone they&apos;ve lost. 
            Today, while voices are strong and stories are fresh, you can ensure your love speaks across time.
          </p>
          
          {/* Reorganized CTA Buttons with clear hierarchy */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in animation-delay-400">
            <Button 
              href="/start" 
              variant="white" 
              size="lg"
              className="text-lg shadow-2xl"
            >
              Start Your Legacy
            </Button>
            <Button 
              href="/stories/emma" 
              variant="white-outline" 
              size="lg"
              className="text-lg"
            >
              Listen to Emma&apos;s Story
            </Button>
          </div>
          
          {/* Micro-copy */}
          <p className="text-warm-white/80 text-body-md mt-8 animate-fade-in animation-delay-600 text-shadow">
            No credit card required. Begin with a single recording.
          </p>
        </div>
      </div>
    </section>
  )
}