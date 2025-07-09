import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { getStoryBySlug, stories, getStoriesByCategory } from '@/lib/data/stories'

export async function generateStaticParams() {
  return stories.map((story) => ({
    slug: story.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const story = getStoryBySlug(params.slug)
  
  if (!story) {
    return {
      title: 'Story Not Found - Memory Grove',
    }
  }

  return {
    title: `${story.title} - Memory Grove Stories`,
    description: story.excerpt,
    openGraph: {
      title: story.title,
      description: story.excerpt,
      type: 'article',
      authors: [story.author],
    },
  }
}

export default function StoryPage({ params }: { params: { slug: string } }) {
  const story = getStoryBySlug(params.slug)
  
  if (!story) {
    notFound()
  }

  // Get related stories from the same category
  const relatedStories = getStoriesByCategory(story.category)
    .filter(s => s.id !== story.id)
    .slice(0, 3)

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-warm-sand via-warm-white to-sage-mist/20 py-16 md:py-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sage-mist/30 rounded-organic blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-dawn/20 rounded-organic blur-3xl animate-pulse animation-delay-400" />
        
        <div className="container-grove relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link 
              href="/stories" 
              className="inline-flex items-center text-sage-primary hover:text-sage-deep transition-colors mb-8"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Stories
            </Link>

            {/* Category & Read Time */}
            <div className="flex items-center gap-4 mb-6 animate-fade-in">
              <span className="px-4 py-2 bg-sage-mist rounded-full text-body-sm text-sage-deep">
                {story.category}
              </span>
              <span className="text-body-sm text-text-light">
                {story.readTime}
              </span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="font-serif text-display-sm md:text-display text-sage-deep mb-4 animate-fade-in animation-delay-200">
              {story.title}
            </h1>
            <p className="text-body-lg md:text-h3 text-sage-primary mb-8 animate-fade-in animation-delay-400">
              {story.subtitle}
            </p>

            {/* Author Info */}
            <div className="flex items-center justify-between animate-fade-in animation-delay-600">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-sage-mist rounded-full flex items-center justify-center">
                  <span className="font-serif text-h3 text-sage-deep">
                    {story.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-body text-sage-deep">
                    {story.author}
                    {story.authorAge && <span className="text-text-secondary">, {story.authorAge}</span>}
                  </p>
                  <p className="text-body-sm text-text-light">{story.date}</p>
                </div>
              </div>
              
              {/* Share Button */}
              <button className="p-3 rounded-full bg-warm-white hover:bg-sage-mist transition-colors">
                <svg className="w-5 h-5 text-sage-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Story Content */}
      <section className="section-spacing">
        <div className="container-grove">
          <div className="max-w-3xl mx-auto">
            {story.content ? (
              <div className="prose prose-lg prose-sage max-w-none">
                {story.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-body text-text-secondary mb-6">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            ) : (
              <div className="bg-sage-mist/20 rounded-organic p-12 text-center">
                <p className="text-body-lg text-sage-primary mb-6">
                  This is a preview of {story.author}&apos;s story.
                </p>
                <p className="text-body text-text-secondary mb-8">
                  {story.excerpt}
                </p>
                <Button href="/start">
                  Start Your Own Story
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-spacing bg-warm-sand">
        <div className="container-grove">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-h1 text-sage-deep mb-4">
              Every Voice Has a Story Worth Preserving
            </h2>
            <p className="text-body-lg text-text-secondary mb-8">
              {story.author}&apos;s journey began with a single recording. 
              Your story is waiting to be told.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/start" size="lg">
                Begin Your Recording
              </Button>
              <Button href="/how-it-works" variant="secondary" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Stories */}
      {relatedStories.length > 0 && (
        <section className="section-spacing">
          <div className="container-grove">
            <h3 className="font-serif text-h2 text-sage-deep mb-8 text-center">
              More Stories of {story.category === 'wedding' ? 'Love' : 
                           story.category === 'birthday' ? 'Celebration' :
                           story.category === 'family' ? 'Connection' :
                           story.category === 'comfort' ? 'Comfort' : 'Legacy'}
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {relatedStories.map((relatedStory) => (
                <Link
                  key={relatedStory.id}
                  href={`/stories/${relatedStory.slug}`}
                  className="group"
                >
                  <article className="bg-warm-white rounded-organic p-6 shadow-gentle hover:shadow-soft transition-all duration-300">
                    <h4 className="font-serif text-h3 text-sage-deep mb-2 group-hover:text-sage-primary transition-colors">
                      {relatedStory.title}
                    </h4>
                    <p className="text-body-sm text-text-secondary mb-4">
                      {relatedStory.excerpt.substring(0, 100)}...
                    </p>
                    <span className="text-sage-primary text-body-sm">
                      Read story →
                    </span>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}