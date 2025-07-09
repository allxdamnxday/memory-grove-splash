import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Start Your Memory Grove - Begin Your Digital Legacy',
  description: 'Begin preserving your voice, stories, and wisdom for future generations. Start your Memory Grove journey with a simple recording.',
}

export default function StartPage() {
  // Redirect to signup page for now
  redirect('/signup')
}