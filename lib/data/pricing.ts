export const pricingTiers = [
  {
    id: 'memory-seed',
    name: 'Memory Seed',
    price: 'Free',
    description: 'Start your legacy journey',
    features: [
      '5 voice recordings (up to 5 minutes each)',
      'Basic scheduling',
      '1 recipient',
      'Text transcriptions'
    ],
    cta: 'Plant Your Seed',
    variant: 'secondary' as const
  },
  {
    id: 'memory-garden',
    name: 'Memory Garden',
    price: '$9',
    period: '/month',
    description: 'Grow your digital legacy',
    features: [
      'Unlimited recordings',
      'Advanced scheduling',
      'Unlimited recipients',
      'Voice cloning (beta)',
      'Priority support'
    ],
    cta: 'Grow Your Garden',
    variant: 'primary' as const,
    popular: true
  },
  {
    id: 'memory-grove',
    name: 'Memory Grove',
    price: '$99',
    period: '/year',
    description: 'Complete legacy protection',
    features: [
      'Everything in Garden',
      'Legacy transfer tools',
      'Physical voice archive USB',
      'White glove setup service',
      'Eternal storage guarantee'
    ],
    cta: 'Build Your Grove',
    variant: 'primary' as const
  }
]