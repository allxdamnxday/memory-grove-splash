'use client'

import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { useEffect, useState } from 'react'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import Image from 'next/image'

const components = {
  h1: (props: any) => <h1 className="font-serif text-h1 text-sage-deep mt-8 mb-4" {...props} />,
  h2: (props: any) => <h2 className="font-serif text-h2 text-sage-deep mt-8 mb-4" {...props} />,
  h3: (props: any) => <h3 className="font-serif text-h3 text-sage-deep mt-6 mb-3" {...props} />,
  p: (props: any) => <p className="text-text-secondary text-body mb-6" {...props} />,
  ul: (props: any) => <ul className="text-text-secondary text-body mb-6 ml-6 list-disc" {...props} />,
  ol: (props: any) => <ol className="text-text-secondary text-body mb-6 ml-6 list-decimal" {...props} />,
  li: (props: any) => <li className="mb-2" {...props} />,
  a: (props: any) => (
    <a 
      className="text-sage-primary hover:text-sage-deep underline transition-colors duration-300" 
      {...props} 
    />
  ),
  blockquote: (props: any) => (
    <blockquote 
      className="border-l-4 border-sage-light pl-6 my-6 text-text-secondary italic" 
      {...props} 
    />
  ),
  code: (props: any) => {
    const isInline = !props.className
    return isInline ? (
      <code className="bg-sage-mist px-2 py-1 rounded text-body-sm" {...props} />
    ) : (
      <code {...props} />
    )
  },
  pre: (props: any) => (
    <pre className="bg-text-primary text-warm-white p-4 rounded-lg overflow-x-auto mb-6" {...props} />
  ),
  hr: () => <hr className="border-warm-pebble my-8" />,
  img: (props: any) => {
    // For MDX content, we need to handle both relative and absolute URLs
    const src = props.src || ''
    const alt = props.alt || ''
    
    // Always use Next.js Image component for better optimization
    // For external images, we've configured remotePatterns in next.config.mjs
    return (
      <div className="relative w-full my-8">
        <Image
          src={src}
          alt={alt}
          width={800}
          height={600}
          className="rounded-lg shadow-gentle w-full h-auto"
          style={{ objectFit: 'contain' }}
          unoptimized={src.startsWith('data:')} // For data URLs
        />
      </div>
    )
  },
}

export function MDXContent({ content }: { content: string }) {
  const [mdxSource, setMdxSource] = useState<any>(null)

  useEffect(() => {
    const processMDX = async () => {
      const serialized = await serialize(content, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            [
              rehypePrettyCode,
              {
                theme: 'one-dark-pro',
                keepBackground: false,
              },
            ],
          ],
        },
      })
      setMdxSource(serialized)
    }
    
    processMDX()
  }, [content])

  if (!mdxSource) {
    return <div className="animate-pulse">Loading story...</div>
  }

  return <MDXRemote {...mdxSource} components={components} />
}