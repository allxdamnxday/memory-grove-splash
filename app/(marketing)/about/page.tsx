import { Metadata } from 'next'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { BackNavigation } from '@/components/navigation'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import heroMetadata from '@/public/images/hero/Tree Planters.meta.json'

export const metadata: Metadata = {
  title: 'About Us - Memory Groves',
  description: 'Learn about our mission to create a sacred digital sanctuary where memories bloom eternal through voice, story, and connection.',
}

export default function AboutPage() {
  const values = [
    {
      title: 'Reverence',
      description: 'We treat every memory, voice, and story with the sacred respect it deserves.',
      icon: '🌿'
    },
    {
      title: 'Authenticity', 
      description: 'We preserve your genuine voice essence, letting love speak in your authentic patterns.',
      icon: '💚'
    },
    {
      title: 'Connection',
      description: 'We bridge the temporal divide with love and intention.',
      icon: '🌉'
    },
    {
      title: 'Stewardship',
      description: 'We are caretakers of legacies, not owners of data.',
      icon: '🌱'
    },
    {
      title: 'Growth',
      description: 'Like nature, memories planted with us continue to bloom and nurture.',
      icon: '🌸'
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden py-20 md:py-24">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <OptimizedImage
            src="/images/hero/Tree Planters-original.webp"
            alt="Community coming together to plant trees, symbolizing growth and legacy"
            width={heroMetadata.width}
            height={heroMetadata.height}
            priority
            className="object-cover w-full h-full"
            containerClassName="w-full h-full"
            sizes="100vw"
            blurDataURL={heroMetadata.blurDataURL}
          />
          {/* Enhanced overlay system for optimal text readability */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          {/* Vignette effect */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40" />
        </div>
        
        {/* Subtle organic shape overlays */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sage-mist/5 rounded-organic blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-dawn/5 rounded-organic blur-3xl animate-pulse animation-delay-400" />
        
        <div className="container-grove relative z-10">
          <BackNavigation 
            href="/" 
            label="Return Home"
            variant="subtle"
            className="mb-8 animate-fade-in text-warm-white/90"
          />
          <div className="max-w-4xl mx-auto text-center px-6">
            <h1 className="font-serif text-display-sm md:text-display text-warm-white mb-6 animate-fade-in text-shadow-xl leading-tight">
              Our Sacred Mission
            </h1>
            <p className="text-warm-white/90 text-body-lg md:text-h3 max-w-3xl mx-auto animate-fade-in animation-delay-200 text-shadow-lg leading-relaxed">
              To create a sacred digital sanctuary where memories bloom eternal, 
              enabling people to preserve their essence, share their wisdom, 
              and ensure their love lives on through voice, story, and connection.
            </p>
            
            {/* CTA Button */}
            <div className="mt-12 animate-fade-in animation-delay-400">
              <Button 
                href="/start" 
                variant="white" 
                size="lg"
                organic="seed"
                living
                className="text-lg shadow-2xl"
              >
                Join Our Community
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section-spacing">
        <div className="container-grove">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-h1 text-sage-deep mb-8 text-center">
              Why We Built Memory Groves
            </h2>
            
            <div className="prose prose-sage max-w-none text-body">
              <p className="text-text-secondary mb-6">
                Memory Groves was born from a simple yet profound realization: 
                our voices carry the weight of our experiences, our stories hold 
                the wisdom of our journeys, and our love deserves to bloom beyond 
                the boundaries of time.
              </p>
              
              <p className="text-text-secondary mb-6">
                {`In an age where technology often feels cold and disconnected, we 
                envisioned something different—a digital space that feels as warm 
                as a grandmother's embrace, as sacred as a family heirloom, and as 
                natural as memories shared around a dinner table.`}
              </p>
              
              <p className="text-text-secondary mb-6">
                {`We believe that every life has stories worth preserving, wisdom worth 
                sharing, and love worth passing on. Memory Groves isn't just about 
                recording voices or storing photos—it's about creating living legacies 
                that grow richer with time, like a garden tended with love.`}
              </p>

              <p className="text-text-secondary">
                Our technology serves a deeply human purpose: to ensure that the essence 
                of who we are—our laughter, our lessons, our love—continues to nurture 
                and guide those who come after us. Because in the end, the greatest gift 
                we can leave behind is not what we owned, but who we were.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="section-spacing bg-warm-sand">
        <div className="container-grove">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-h1 text-sage-deep mb-6">
              Our Vision for Tomorrow
            </h2>
            <p className="text-text-secondary text-body-lg">
              A world where every life story is preserved with dignity, where technology 
              serves love rather than replacing it, and where future generations can 
              experience the authentic presence of those who came before.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="section-spacing">
        <div className="container-grove">
          <h2 className="font-serif text-h1 text-sage-deep mb-12 text-center">
            The Roots of Our Grove
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} variant="default">
                <CardHeader>
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <CardTitle className="text-h3">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary text-body-sm">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-spacing bg-sage-mist/20">
        <div className="container-grove">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-h1 text-sage-deep mb-6">
              Tending The Grove
            </h2>
            <p className="text-text-secondary text-body-lg mb-12">
              We are a small team of technologists, storytellers, and dreamers united 
              by a shared belief: that love transcends time, and memories deserve to 
              be preserved with reverence.
            </p>
            
            <div className="bg-warm-white rounded-xl p-8 md:p-12 shadow-gentle">
              <p className="text-text-secondary text-body italic">
                {`"We're not just building a platform; we're creating a sanctuary where 
                technology serves humanity's deepest need—to be remembered, to be heard, 
                and to continue loving even after we're gone."`}
              </p>
              <p className="text-sage-primary text-body-sm mt-4">
                — Memory Groves Team
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing">
        <div className="container-grove text-center">
          <h2 className="font-serif text-h2 text-sage-deep mb-6">
            Begin Your Own Journey
          </h2>
          <p className="text-text-secondary text-body-lg max-w-2xl mx-auto mb-8">
            Join us in creating a world where memories bloom eternal and love knows no bounds.
          </p>
          <Button href="/join" size="lg">
            Plant Your First Memory
          </Button>
        </div>
      </section>
    </>
  )
}