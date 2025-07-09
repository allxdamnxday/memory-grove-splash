import StatCard from '@/components/ui/StatCard'

export default function RealityCheck() {
  const stats = [
    {
      value: '73%',
      label: 'of people regret not recording their parents\' voices',
      delay: 200
    },
    {
      value: '2 minutes',
      label: 'is all it takes to preserve a memory forever',
      delay: 400
    },
    {
      value: '∞',
      label: 'moments when your voice will bring comfort',
      delay: 600
    }
  ]

  return (
    <section className="section-padding bg-warm-white">
      <div className="container-grove">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-serif text-h1 md:text-display-sm text-sage-deep mb-4">
            She&apos;s Telling That Story Again.
          </h2>
          <h3 className="font-serif text-h2 text-sage-primary">
            One Day, You&apos;d Give Anything to Hear It.
          </h3>
        </div>
        
        <div className="max-w-3xl mx-auto mb-16 text-center animate-fade-in animation-delay-200">
          <p className="text-body-lg text-text-secondary">
            We save 10,000 photos but lose the sound of laughter. We preserve signatures 
            but not the voice saying &ldquo;I love you.&rdquo; Memory Groves ensures that when your 
            presence is needed most—at graduations, weddings, hard days, and quiet 
            anniversaries—your voice remains.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              value={stat.value}
              label={stat.label}
              delay={stat.delay}
            />
          ))}
        </div>
      </div>
    </section>
  )
}