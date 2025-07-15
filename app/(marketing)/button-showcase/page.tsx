import ButtonShowcase from '@/components/examples/ButtonShowcase'

export default function ButtonShowcasePage() {
  return (
    <div className="min-h-screen bg-background-primary py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-h1 font-serif text-sage-deep mb-4 text-center">Button Component Showcase</h1>
        <p className="text-body text-text-secondary text-center mb-12 max-w-2xl mx-auto">
          This page demonstrates all the variants, sizes, and states of the improved Button component.
          The Button component now supports icon variants, loading states, and better accessibility.
        </p>
        <ButtonShowcase />
      </div>
    </div>
  )
}