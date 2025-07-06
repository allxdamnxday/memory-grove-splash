import { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'
import Card, { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Memory Stories - The Memory Grove Blog',
  description: 'Explore stories, wisdom, and insights about preserving memories, digital legacy, and the sacred act of memory keeping.',
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sage-mist/20 to-warm-sand py-20 md:py-32">
        <div className="absolute top-0 left-0 w-96 h-96 bg-sage-light/20 rounded-organic blur-3xl" />
        <div className="container-grove relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-display-sm md:text-display text-sage-deep mb-6 animate-fade-in">
              Memory Stories
            </h1>
            <p className="text-text-secondary text-body-lg md:text-body-lg max-w-3xl mx-auto animate-fade-in animation-delay-200">
              Wisdom gathered from the grove. Stories about preserving memories, 
              honoring legacies, and the sacred act of remembering those we love.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section-spacing">
        <div className="container-grove">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-secondary text-body-lg mb-8">
                Our first stories are taking root and will bloom soon.
              </p>
              <Button href="/" variant="secondary">
                Return to the Grove
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.slug} className="h-full">
                  <Link href={`/blog/${post.slug}`} className="block h-full group">
                    <Card variant="default" className="h-full flex flex-col hover:scale-[1.02] transition-all duration-300">
                      <CardHeader>
                        <div className="text-sage-primary text-caption mb-2">
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <CardTitle className="group-hover:text-sage-primary transition-colors duration-300">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <CardDescription className="text-body-sm line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                      </CardContent>
                      <CardFooter>
                        <div className="flex items-center justify-between w-full">
                          <span className="text-text-light text-caption">
                            {post.readingTime}
                          </span>
                          <span className="text-sage-primary group-hover:translate-x-1 transition-transform duration-300">
                            →
                          </span>
                        </div>
                        {post.author && (
                          <div className="mt-4 pt-4 border-t border-warm-pebble/20 w-full">
                            <p className="text-text-light text-caption">
                              By {post.author}
                            </p>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-spacing bg-warm-sand">
        <div className="container-grove">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-h2 text-sage-deep mb-6">
              Nurture Your Understanding
            </h2>
            <p className="text-text-secondary text-body mb-8">
              Receive gentle wisdom about preserving memories and creating lasting legacies. 
              Join our community of memory keepers.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="input-field flex-1"
                required
              />
              <Button type="submit">
                Join Our Garden
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}