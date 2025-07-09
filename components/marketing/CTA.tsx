import Button from '@/components/ui/Button'

export default function CTA() {
  return (
    <section className="section-spacing bg-gradient-to-br from-sage-mist via-sage-light/20 to-warm-sand relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sage-primary/10 rounded-organic blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-dawn/20 rounded-organic blur-3xl" />
      
      <div className="container-grove relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-display-sm md:text-display text-sage-deep mb-6">
            Your Story Deserves to Live On
          </h2>
          
          <p className="text-text-secondary text-body-lg md:text-body-lg max-w-2xl mx-auto mb-10">
            Every voice carries wisdom. Every story holds love. Every memory planted 
            today blooms for generations tomorrow. Begin your grove and let your 
            essence nurture those who come after.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button href="/signup" size="lg">
              Start Your Grove Today
            </Button>
            <Button href="/how-it-works" variant="secondary" size="lg">
              Learn More
            </Button>
          </div>
          
          <p className="mt-8 text-text-light text-body-sm">
            Join thousands who are preserving their legacy with love
          </p>
        </div>
      </div>
    </section>
  )
}