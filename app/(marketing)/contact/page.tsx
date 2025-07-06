'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Metadata } from 'next'
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

const contactSchema = z.object({
  name: z.string().min(2, 'Please share your name'),
  email: z.string().email('Please provide a valid email address'),
  subject: z.string().min(5, 'Please provide a subject'),
  message: z.string().min(10, 'Please share a bit more detail'),
  type: z.enum(['general', 'press', 'partnership']).default('general'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitMessage({
          type: 'success',
          text: 'Your message has been planted in our grove. We\'ll tend to it with care and respond soon.',
        })
        reset()
      } else {
        setSubmitMessage({
          type: 'error',
          text: 'The message couldn\'t find its way. Please try again.',
        })
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'The grove is resting. Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      title: 'General Inquiries',
      description: 'Questions about The Memory Grove, how it works, or how to begin your journey.',
      icon: '💬',
    },
    {
      title: 'Press & Media',
      description: 'For media inquiries, interviews, or press resources about our mission.',
      icon: '📰',
    },
    {
      title: 'Partnership Opportunities',
      description: 'Explore ways to bring The Memory Grove to your community or organization.',
      icon: '🤝',
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-warm-sand to-sage-mist/20 py-20 md:py-32">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-dawn/20 rounded-organic blur-3xl" />
        <div className="container-grove relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-display-sm md:text-display text-sage-deep mb-6 animate-fade-in">
              {`Let's Connect`}
            </h1>
            <p className="text-text-secondary text-body-lg md:text-body-lg max-w-3xl mx-auto animate-fade-in animation-delay-200">
              {`Whether you have questions, stories to share, or want to explore partnerships, 
              we're here to listen. Every conversation helps our grove grow stronger.`}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="section-spacing">
        <div className="container-grove">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} variant="default" className="text-center">
                <CardHeader>
                  <div className="text-4xl mb-4">{info.icon}</div>
                  <CardTitle>{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{info.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <Card variant="elevated" padding="lg">
              <CardHeader>
                <CardTitle className="text-center">Send Us a Message</CardTitle>
                <CardDescription className="text-center">
                  Share your thoughts, questions, or ideas. We read every message with care.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <input type="hidden" {...register('type')} value="general" />
                  
                  <Input
                    label="Your Name"
                    {...register('name')}
                    error={errors.name?.message}
                    disabled={isSubmitting}
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                    disabled={isSubmitting}
                  />

                  <Input
                    label="Subject"
                    {...register('subject')}
                    error={errors.subject?.message}
                    disabled={isSubmitting}
                  />

                  <Textarea
                    label="Your Message"
                    rows={6}
                    {...register('message')}
                    error={errors.message?.message}
                    disabled={isSubmitting}
                    hint="Share what\'s on your heart. We\'re listening."
                  />

                  {submitMessage && (
                    <div
                      className={`p-4 rounded-lg animate-fade-in ${
                        submitMessage.type === 'success'
                          ? 'bg-sage-mist text-sage-deep'
                          : 'bg-accent-dawn/20 text-accent-earth'
                      }`}
                    >
                      {submitMessage.text}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Contact Info */}
      <section className="section-spacing bg-warm-sand">
        <div className="container-grove">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-h2 text-sage-deep mb-6">
              Other Ways to Reach Us
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <Card variant="default">
                <CardHeader>
                  <CardTitle>For Partners & Organizations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary text-body-sm mb-4">
                    Interested in bringing The Memory Grove to your community, 
                    healthcare facility, or organization?
                  </p>
                  <a
                    href="mailto:partnerships@memorygrove.com"
                    className="text-sage-primary hover:text-sage-deep transition-colors"
                  >
                    partnerships@memorygrove.com
                  </a>
                </CardContent>
              </Card>

              <Card variant="default">
                <CardHeader>
                  <CardTitle>For Media Inquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary text-body-sm mb-4">
                    Writing a story about digital legacy, memory preservation, 
                    or The Memory Grove?
                  </p>
                  <a
                    href="mailto:press@memorygrove.com"
                    className="text-sage-primary hover:text-sage-deep transition-colors"
                  >
                    press@memorygrove.com
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}