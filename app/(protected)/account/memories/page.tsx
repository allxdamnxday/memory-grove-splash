import { Metadata } from 'next'
import MemoriesList from '@/components/audio/MemoriesList'

export const metadata: Metadata = {
  title: 'Your Memories | Memory Grove',
  description: 'View and manage your preserved voice memories',
}

export default function MemoriesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <MemoriesList />
    </div>
  )
}