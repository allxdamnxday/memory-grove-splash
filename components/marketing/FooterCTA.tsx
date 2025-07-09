import Button from '@/components/ui/Button'

export default function FooterCTA() {
  return (
    <section className="section-spacing bg-sage-primary text-warm-white">
      <div className="container-grove">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-h1 md:text-display-sm mb-6 animate-fade-in">
            Your Voice is More Powerful Than You Know
          </h2>
          
          <p className="text-body-lg mb-12 opacity-90 animate-fade-in animation-delay-200">
            Somewhere in the future, someone you love will need to hear exactly what only you can say. 
            The question isn&apos;t whether your voice matters—it&apos;s whether it will be there when it&apos;s needed most.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in animation-delay-400">
            <Button href="/start" size="lg" variant="secondary">
              Start Recording - It&apos;s Free
            </Button>
            <a 
              href="/stories" 
              className="inline-flex items-center justify-center text-warm-white hover:text-sage-mist transition-colors font-sans text-body"
            >
              Listen to Real Memory Grove Stories
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
          
          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in animation-delay-600">
            <div className="flex items-center justify-center gap-3 opacity-90">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-body-sm">Bank-Level Encryption</span>
            </div>
            <div className="flex items-center justify-center gap-3 opacity-90">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span className="text-body-sm">Family-Owned Company</span>
            </div>
            <div className="flex items-center justify-center gap-3 opacity-90">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 19h10V4.828l-5-4.999-5 4.999V19zm0 2H5c-1.103 0-2-.897-2-2V5c0-.265.105-.52.293-.707l7-7c.391-.391 1.023-.391 1.414 0l7 7c.188.187.293.442.293.707v14c0 1.103-.897 2-2 2h-2v-7h-6v7z"/>
              </svg>
              <span className="text-body-sm">1 Tree Planted Per Grove</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}