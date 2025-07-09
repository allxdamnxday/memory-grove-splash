import { Metadata } from 'next'
import CreateMemory from '@/components/audio/CreateMemory'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Create New Memory | Memory Grove',
  description: 'Record or upload a new voice memory to preserve in your digital grove',
}

export default function NewMemoryPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link
          href="/account/memories"
          className="inline-flex items-center text-body-sm text-sage-primary hover:text-sage-deep transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to memories
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-heading-xl font-serif text-center mb-2">Create a Memory</h1>
        <p className="text-body-lg text-text-secondary text-center mb-8">
          Preserve your voice and stories in your digital sanctuary
        </p>

        <CreateMemory />
      </div>
    </div>
  )
}