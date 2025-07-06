import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { AnimationObserver } from '@/components/layout/AnimationObserver'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AnimationObserver />
      <Header />
      <main className="min-h-screen pt-20">
        {children}
      </main>
      <Footer />
    </>
  )
}