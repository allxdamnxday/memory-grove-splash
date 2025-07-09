import { Metadata } from 'next'
import StoryCard from '@/components/marketing/StoryCard'
import Button from '@/components/ui/Button'
import { stories, getFeaturedStories } from '@/lib/data/stories'

export const metadata: Metadata = {
  title: 'Real Stories - Memory Grove',
  description: 'Read real stories from families who have preserved their voices and memories through Memory Grove. Discover how love transcends time through recorded messages.',
}

export default function StoriesPage() {
  const featuredStories = getFeaturedStories()
  const categories = [
    { id: 'all', label: 'All Stories' },
    { id: 'wedding', label: 'Weddings' },
    { id: 'birthday', label: 'Birthdays' },
    { id: 'family', label: 'Family' },
    { id: 'comfort', label: 'Comfort' },
    { id: 'legacy', label: 'Legacy' }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sage-mist/20 via-warm-white to-warm-sand py-20 md:py-32">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-dawn/20 rounded-organic blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sage-mist/30 rounded-organic blur-3xl animate-pulse animation-delay-400" />
        
        <div className="container-grove relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-display-sm md:text-display text-sage-deep mb-6 animate-fade-in">
              Voices That Transcend Time
            </h1>
            <p className="text-text-secondary text-body-lg md:text-body-lg max-w-3xl mx-auto animate-fade-in animation-delay-200">
              Real stories from real families who discovered that love doesn&apos;t end with goodbye. 
              These are their journeys of connection, comfort, and continuation.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Story */}
      <section className="section-spacing">
        <div className="container-grove">
          <div className="text-center mb-12">
            <h2 className="font-serif text-h2 text-sage-primary mb-2">Featured Story</h2>
            <p className="text-body-sm text-text-secondary">This month&apos;s most inspiring journey</p>
          </div>
          
          {featuredStories.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-warm-white rounded-organic p-8 md:p-12 shadow-soft">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-sage-mist rounded-full text-caption text-sage-deep">
                    {featuredStories[0].category}
                  </span>
                  <span className="text-caption text-text-light">
                    {featuredStories[0].readTime}
                  </span>
                </div>
                
                <h3 className="font-serif text-h1 text-sage-deep mb-2">
                  {featuredStories[0].title}
                </h3>
                <p className="text-body-lg text-sage-primary mb-4">
                  {featuredStories[0].subtitle}
                </p>
                <p className="text-body text-text-secondary mb-6">
                  {featuredStories[0].excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-body-sm text-text-light">
                    By {featuredStories[0].author}
                    {featuredStories[0].authorAge && `, ${featuredStories[0].authorAge}`}
                  </div>
                  <Button href={`/stories/${featuredStories[0].slug}`} variant="secondary">
                    Read Full Story
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Story Categories */}
      <section className="section-spacing bg-warm-sand">
        <div className="container-grove">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-6 py-2 rounded-full text-body-sm transition-all duration-300 ${
                  category.id === 'all' 
                    ? 'bg-sage-primary text-warm-white' 
                    : 'bg-warm-white text-sage-primary hover:bg-sage-mist'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Stories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <StoryCard
                key={story.id}
                story={story}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Share Your Story CTA */}
      <section className="section-spacing">
        <div className="container-grove">
          <div className="max-w-3xl mx-auto text-center bg-sage-mist/20 rounded-organic p-8 md:p-12">
            <h2 className="font-serif text-h1 text-sage-deep mb-4">
              Every Story Begins With a Single Recording
            </h2>
            <p className="text-body-lg text-text-secondary mb-8">
              These families took the first step to preserve their voices and stories. 
              Your journey can begin today with just one message.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/start" size="lg">
                Start Your Story
              </Button>
              <Button href="/how-it-works" variant="secondary" size="lg">
                Learn How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="section-spacing bg-warm-white">
        <div className="container-grove">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-serif text-h2 text-sage-deep mb-4">
              Receive Weekly Stories of Connection
            </h3>
            <p className="text-body text-text-secondary mb-8">
              Join our community and receive inspiring stories of how families are using 
              Memory Grove to stay connected across time.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-6 py-4 rounded-full border border-warm-pebble/30 focus:border-sage-primary focus:outline-none transition-colors"
                required
              />
              <Button type="submit">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}