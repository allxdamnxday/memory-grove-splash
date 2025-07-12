import { Metadata } from 'next'
import MemoriesList from '@/components/audio/MemoriesList'

export const metadata: Metadata = {
  title: 'Your Memories | Memory Grove',
  description: 'View and manage your preserved voice memories',
}

export default function MemoriesPage() {
  return (
    <div className="w-full max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <MemoriesList />
    </div>
  )
}