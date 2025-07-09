import { AnimationObserver } from '@/components/layout/AnimationObserver'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AnimationObserver />
      <main className="pt-20">
        {children}
      </main>
    </>
  )
}