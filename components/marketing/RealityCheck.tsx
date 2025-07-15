'use client'

import StatCard from '@/components/ui/StatCard'
import Button from '@/components/ui/Button'
import WaveformBackground from '@/components/ui/WaveformBackground'
import { RegretIcon, TimeIcon, MessagesIcon } from './StatIcons'

export default function RealityCheck() {
  const stats = [
    {
      value: '73%',
      label: 'of people regret not recording their parents\' voices',
      icon: <RegretIcon />,
      delay: 200
    },
    {
      value: '2 minutes',
      label: 'is all it takes to preserve a memory forever',
      icon: <TimeIcon />,
      delay: 400
    },
    {
      value: '47 messages',
      label: 'average voice memories preserved per loved one',
      icon: <MessagesIcon />,
      delay: 600
    }
  ]

  return (
    <section className="section-spacing bg-gradient-to-b from-warm-white via-warm-sand/10 to-sage-mist/20 relative overflow-hidden">
      {/* Animated waveform background */}
      <WaveformBackground opacity={0.05} />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-sage-light/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-warm-primary/10 rounded-full blur-3xl animate-pulse animation-delay-600" />
      
      <div className="container-grove relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-serif text-h1 md:text-display-sm text-sage-deep mb-4 leading-tight">
            She&apos;s Telling That Story Again.
          </h2>
          <h3 className="font-serif text-h2 md:text-h1 text-sage-primary">
            One Day, You&apos;d Give Anything to Hear It.
          </h3>
        </div>
        
        <div className="max-w-3xl mx-auto mb-20 text-center animate-fade-in animation-delay-200">
          <p className="text-body-lg md:text-h3 text-text-secondary leading-relaxed">
            We keep 10,000 photos, but the one thing we can&apos;t photograph—
            <span className="block mt-2 text-sage-deep font-medium">
              the sound of their laughter, their &apos;I love you,&apos; their favorite story—
            </span>
            <span className="block mt-2">
              fades forever. Memory Grove captures what photos can&apos;t: 
              <span className="text-sage-primary font-medium"> the voice that means everything.</span>
            </span>
          </p>
        </div>
        
        {/* Statistics with enhanced visual design */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-20">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              value={stat.value}
              label={stat.label}
              icon={stat.icon}
              delay={stat.delay}
            />
          ))}
        </div>
        
        {/* Strong CTA section */}
        <div className="text-center max-w-2xl mx-auto animate-fade-in animation-delay-800">
          <div className="bg-warm-white/90 backdrop-blur-sm rounded-organic p-10 md:p-12 border border-sage-light/30 shadow-soft">
            <p className="text-h3 md:text-h2 font-serif text-sage-deep mb-6 leading-tight">
              Start with just 2 minutes today.
            </p>
            <p className="text-body-lg text-text-secondary mb-8">
              Because one day, those 2 minutes will mean <span className="italic">everything</span>.
            </p>
            <Button 
              href="/start" 
              size="lg"
              variant="primary"
              organic="seed"
              living
              className="animate-pulse-subtle"
            >
              Start Recording Now
            </Button>
            
            {/* Social proof */}
            <div className="mt-8 pt-8 border-t border-warm-pebble/20">
              <p className="text-body-sm text-text-tertiary">
                Join <span className="font-medium text-sage-primary">12,859 families</span> in 
                <span className="font-medium text-sage-primary"> 47 countries</span> preserving voices that matter
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}