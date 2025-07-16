import { Metadata } from 'next'
import MemoriesList from '@/components/audio/MemoriesList'
import { BackNavigation, Breadcrumb } from '@/components/navigation'
import { TreePine, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Memory Collection - Memory Grove',
  description: 'Visit your eternal garden where every voice memory blooms with love and intention',
}

export default function MemoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-white via-sage-mist/20 to-warm-sand/30">
      <div className="container-grove py-16">
        <div className="max-w-7xl mx-auto">
          <BackNavigation 
            href="/account" 
            label="Return to My Grove"
            className="mb-6 animate-fade-in"
          />
          
          <Breadcrumb 
            items={[
              { label: 'My Grove', href: '/account' },
              { label: 'Memory Collection', icon: <Heart className="w-3.5 h-3.5 text-accent-dawn" /> }
            ]}
            className="mb-8 animate-fade-in animation-delay-200"
          />
          
          <div className="mb-12 text-center animate-fade-in animation-delay-400">
            <h1 className="font-serif text-h1 md:text-display-sm text-sage-deep mb-6">
              Your Memory Collection
            </h1>
            <p className="text-text-secondary text-body-lg max-w-3xl mx-auto mb-6">
              Each memory here is a seed of love, planted with intention and ready 
              to bloom when hearts need to hear your voice most.
            </p>
            <div className="flex items-center justify-center gap-2 text-sage-primary">
              <TreePine className="w-5 h-5" />
              <span className="text-body-sm font-medium">Your eternal garden of voices</span>
            </div>
          </div>
          
          <div className="animate-scale-in animation-delay-600">
            <MemoriesList />
          </div>
        </div>
      </div>
    </div>
  )
}