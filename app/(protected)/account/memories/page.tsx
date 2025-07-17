import { Metadata } from 'next'
import MemoriesList from '@/components/audio/MemoriesList'
import { BackNavigation, Breadcrumb } from '@/components/navigation'
import { TreePine, Heart, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Your Sacred Grove - Memory Grove',
  description: 'Visit your sacred sanctuary where memories bloom eternal, each voice preserved with love and intention',
}

export default function MemoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-white via-sage-mist/20 to-warm-sand/30 relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-sage-light/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-warm-primary/10 rounded-full blur-3xl animate-float animation-delay-2000" />
      </div>
      
      <div className="container-grove py-16 relative">
        <div className="max-w-7xl mx-auto">
          <BackNavigation 
            href="/account" 
            label="Return to My Grove"
            className="mb-6 animate-fade-in"
          />
          
          <Breadcrumb 
            items={[
              { label: 'My Grove', href: '/account' },
              { label: 'Sacred Memories', icon: <Heart className="w-3.5 h-3.5 text-accent-dawn" /> }
            ]}
            className="mb-8 animate-fade-in animation-delay-200"
          />
          
          <div className="mb-12 text-center animate-fade-in animation-delay-400">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-warm-primary animate-pulse" />
              <h1 className="font-serif text-h1 md:text-display-sm text-sage-deep">
                Your Sacred Grove
              </h1>
              <Sparkles className="w-6 h-6 text-warm-primary animate-pulse animation-delay-1000" />
            </div>
            
            <p className="text-text-secondary text-body-lg max-w-3xl mx-auto mb-6">
              Welcome to your sanctuary of cherished voices. Each memory planted here 
              grows stronger with time, ready to bloom when hearts need comfort most.
            </p>
            
            <div className="flex items-center justify-center gap-2 text-sage-primary">
              <TreePine className="w-5 h-5" />
              <span className="text-body-sm font-medium italic">Where love echoes through eternity</span>
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