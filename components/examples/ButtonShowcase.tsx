'use client'

import Button from '@/components/ui/Button'
import { Heart, Share2, Download, Play, Settings, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export default function ButtonShowcase() {
  const [loading, setLoading] = useState(false)

  const handleLoadingClick = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 3000)
  }

  return (
    <div className="space-y-12 p-8">
      {/* Regular Button Variants */}
      <section>
        <h2 className="text-h3 font-serif text-text-primary mb-6">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="white">White Button</Button>
          <Button variant="white-outline">White Outline</Button>
        </div>
      </section>

      {/* Button Sizes */}
      <section>
        <h2 className="text-h3 font-serif text-text-primary mb-6">Button Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small Button</Button>
          <Button size="md">Medium Button</Button>
          <Button size="lg">Large Button</Button>
        </div>
      </section>

      {/* Icon Buttons */}
      <section>
        <h2 className="text-h3 font-serif text-text-primary mb-6">Icon Buttons</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="icon" size="icon-sm" icon={<Heart className="w-4 h-4" />} />
          <Button variant="icon" size="icon-md" icon={<Share2 className="w-5 h-5" />} />
          <Button variant="icon" size="icon-lg" icon={<Download className="w-6 h-6" />} />
          <Button variant="primary" size="icon-md" icon={<Play className="w-5 h-5" />} className="!rounded-full" />
          <Button variant="secondary" size="icon-md" icon={<Settings className="w-5 h-5" />} />
        </div>
      </section>

      {/* Buttons with Icons and Text */}
      <section>
        <h2 className="text-h3 font-serif text-text-primary mb-6">Buttons with Icons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">
            <Play className="w-4 h-4 mr-2" />
            Play Recording
          </Button>
          <Button variant="secondary">
            Download Memory
            <Download className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="ghost">
            Continue
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </section>

      {/* Loading States */}
      <section>
        <h2 className="text-h3 font-serif text-text-primary mb-6">Loading States</h2>
        <div className="flex flex-wrap gap-4">
          <Button loading>Saving...</Button>
          <Button variant="secondary" loading>Processing</Button>
          <Button onClick={handleLoadingClick} loading={loading}>
            {loading ? 'Uploading...' : 'Click to Load'}
          </Button>
        </div>
      </section>

      {/* Button Links */}
      <section>
        <h2 className="text-h3 font-serif text-text-primary mb-6">Button Links</h2>
        <div className="flex flex-wrap gap-4">
          <Button href="/about">Internal Link</Button>
          <Button href="https://example.com" external variant="secondary">
            External Link
          </Button>
          <Button href="/stories" variant="ghost">
            Browse Stories
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </section>

      {/* Disabled States */}
      <section>
        <h2 className="text-h3 font-serif text-text-primary mb-6">Disabled States</h2>
        <div className="flex flex-wrap gap-4">
          <Button disabled>Disabled Primary</Button>
          <Button variant="secondary" disabled>Disabled Secondary</Button>
          <Button variant="icon" size="icon-md" icon={<Heart className="w-5 h-5" />} disabled />
        </div>
      </section>
    </div>
  )
}