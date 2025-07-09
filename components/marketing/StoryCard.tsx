import Link from 'next/link'
import { Story } from '@/lib/data/stories'

interface StoryCardProps {
  story: Story
  delay?: number
}

export default function StoryCard({ story, delay = 0 }: StoryCardProps) {
  const getCategoryColor = (category: Story['category']) => {
    switch (category) {
      case 'wedding':
        return 'bg-accent-dawn/20 text-accent-moss'
      case 'birthday':
        return 'bg-sage-mist text-sage-deep'
      case 'family':
        return 'bg-warm-sand text-sage-primary'
      case 'comfort':
        return 'bg-sage-light/20 text-sage-deep'
      case 'legacy':
        return 'bg-accent-earth/20 text-text-primary'
      default:
        return 'bg-sage-mist text-sage-deep'
    }
  }

  return (
    <Link 
      href={`/stories/${story.slug}`}
      className="block group animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <article className="bg-warm-white rounded-organic p-6 shadow-gentle hover:shadow-soft transition-all duration-300 h-full flex flex-col">
        {/* Category & Read Time */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-caption ${getCategoryColor(story.category)}`}>
            {story.category}
          </span>
          <span className="text-caption text-text-light">
            {story.readTime}
          </span>
        </div>

        {/* Title & Subtitle */}
        <h3 className="font-serif text-h3 text-sage-deep mb-2 group-hover:text-sage-primary transition-colors">
          {story.title}
        </h3>
        <p className="text-body-sm text-sage-primary mb-3">
          {story.subtitle}
        </p>

        {/* Excerpt */}
        <p className="text-body-sm text-text-secondary mb-4 flex-1">
          {story.excerpt}
        </p>

        {/* Author & Action */}
        <div className="flex items-center justify-between pt-4 border-t border-warm-pebble/20">
          <span className="text-caption text-text-light">
            By {story.author}
            {story.authorAge && `, ${story.authorAge}`}
          </span>
          <span className="text-sage-primary text-body-sm group-hover:translate-x-1 transition-transform duration-300">
            Read story →
          </span>
        </div>
      </article>
    </Link>
  )
}