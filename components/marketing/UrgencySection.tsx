import Button from '@/components/ui/Button'

export default function UrgencySection() {
  return (
    <section className="section-spacing bg-warm-white">
      <div className="container-grove">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-serif text-h1 md:text-display-sm text-sage-deep mb-4">
            Every Voice is Temporary.
          </h2>
          <h3 className="font-serif text-h2 text-sage-primary">
            Your Love Doesn&apos;t Have to Be.
          </h3>
        </div>

        <div className="max-w-4xl mx-auto">
          <p className="text-body-lg text-text-secondary text-center mb-12 animate-fade-in animation-delay-200">
            We tell ourselves there&apos;s always tomorrow to record their stories, capture their laugh, 
            save their advice. But voices change. Memories fade. And sometimes, tomorrow doesn&apos;t come. 
            Memory Groves exists because love deserves better than voicemail graveyards and forgotten stories.
          </p>

          {/* Visual representation */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-sage-mist/20 rounded-organic p-8 text-center animate-fade-in animation-delay-400">
              <div className="text-sage-primary mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h4 className="font-serif text-h3 text-sage-deep mb-2">Today</h4>
              <p className="text-body-sm text-text-secondary">Woman recording her voice, sharing stories</p>
            </div>

            <div className="bg-accent-dawn/20 rounded-organic p-8 text-center animate-fade-in animation-delay-600">
              <div className="text-accent-moss mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="font-serif text-h3 text-sage-deep mb-2">Years Later</h4>
              <p className="text-body-sm text-text-secondary">Family listening, finding comfort in her voice</p>
            </div>
          </div>

          <div className="text-center animate-fade-in animation-delay-800">
            <Button href="/start" size="lg">
              Preserve Your Voice Today
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}