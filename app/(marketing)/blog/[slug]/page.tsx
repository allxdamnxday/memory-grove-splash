import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getPostSlugs } from '@/lib/mdx'
import Button from '@/components/ui/Button'
import { MDXContent } from '@/components/blog/MDXContent'

export async function generateStaticParams() {
  const slugs = await getPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found - Memory Groves',
    }
  }

  return {
    title: `${post.title} - Memory Groves`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-warm-sand to-sage-mist/10 py-20 md:py-32">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-dawn/10 rounded-organic blur-3xl" />
        <div className="container-grove relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center space-x-2 text-body-sm">
                <li>
                  <Link href="/" className="text-sage-primary hover:text-sage-deep transition-colors">
                    Home
                  </Link>
                </li>
                <li className="text-text-light">/</li>
                <li>
                  <Link href="/blog" className="text-sage-primary hover:text-sage-deep transition-colors">
                    Stories
                  </Link>
                </li>
                <li className="text-text-light">/</li>
                <li className="text-text-secondary">Current</li>
              </ol>
            </nav>

            {/* Post Header */}
            <h1 className="font-serif text-display-sm md:text-display text-sage-deep mb-6 animate-fade-in">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-text-light text-body-sm animate-fade-in animation-delay-200">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span>·</span>
              <span>{post.readingTime}</span>
              {post.author && (
                <>
                  <span>·</span>
                  <span>By {post.author}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-spacing">
        <div className="container-grove">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg prose-sage max-w-none">
              <MDXContent content={post.content} />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-warm-pebble/20">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-sage-mist text-sage-deep text-body-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="section-spacing bg-warm-sand">
        <div className="container-grove">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-h2 text-sage-deep mb-6">
              Continue Your Journey
            </h2>
            <p className="text-text-secondary text-body mb-8">
              Explore more stories from the grove or return to plant your own memories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/blog" variant="secondary">
                More Stories
              </Button>
              <Button href="/join">
                Begin Your Grove
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}