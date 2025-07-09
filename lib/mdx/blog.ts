import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const blogsDirectory = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
  category: string
  readingTime: string
  content: string
}

export function getBlogSlugs() {
  if (!fs.existsSync(blogsDirectory)) {
    return []
  }
  return fs.readdirSync(blogsDirectory).filter((file) => file.endsWith('.mdx'))
}

export function getBlogBySlug(slug: string): BlogPost | null {
  const realSlug = slug.replace(/\.mdx$/, '')
  const fullPath = path.join(blogsDirectory, `${realSlug}.mdx`)
  
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const stats = readingTime(content)

  return {
    slug: realSlug,
    title: data.title,
    excerpt: data.excerpt,
    date: data.date,
    author: data.author || 'Memory Groves Team',
    category: data.category || 'Memory Keeping',
    readingTime: stats.text,
    content,
  }
}

export function getAllBlogs(): BlogPost[] {
  const slugs = getBlogSlugs()
  const posts = slugs
    .map((slug) => getBlogBySlug(slug.replace(/\.mdx$/, '')))
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1))
  
  return posts
}