import Hero from '@/components/marketing/Hero'
import EmailCapture from '@/components/marketing/EmailCapture'
import RealityCheck from '@/components/marketing/RealityCheck'
import HowItWorks from '@/components/marketing/HowItWorks'
import StoriesOfConnection from '@/components/marketing/StoriesOfConnection'
import UseCases from '@/components/marketing/UseCases'
import UrgencySection from '@/components/marketing/UrgencySection'
import Pricing from '@/components/marketing/Pricing'
import FAQ from '@/components/marketing/FAQ'
import FooterCTA from '@/components/marketing/FooterCTA'
import FloatingElements from '@/components/marketing/FloatingElements'

export default function Home() {
  return (
    <div className="space-y-2">
      <Hero />
      <EmailCapture />
      <RealityCheck />
      <HowItWorks />
      <StoriesOfConnection />
      <UseCases />
      <UrgencySection />
      <Pricing />
      <FAQ />
      <FooterCTA />
      <FloatingElements />
    </div>
  )
}