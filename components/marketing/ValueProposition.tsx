import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export default function ValueProposition() {
  const values = [
    {
      icon: (
        <svg className="w-12 h-12 text-sage-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      title: 'Preserve Your Essence',
      description: 'Your voice carries the weight of your experiences. Capture stories, wisdom, and messages in your authentic voice for those you love.'
    },
    {
      icon: (
        <svg className="w-12 h-12 text-sage-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Living Legacy',
      description: 'Unlike static memorials, your grove grows with time. Add new memories, update your thoughts, and let your legacy bloom naturally.'
    },
    {
      icon: (
        <svg className="w-12 h-12 text-sage-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Connection Across Time',
      description: 'Bridge generations with your voice and stories. Let great-grandchildren hear your laughter and know your heart.'
    }
  ]

  return (
    <section className="section-spacing bg-warm-white">
      <div className="container-grove">
        <div className="text-center mb-16">
          <h2 className="font-serif text-h1 text-sage-deep mb-6">
            Plant Seeds That Bloom Forever
          </h2>
          <p className="text-text-secondary text-body-lg max-w-3xl mx-auto">
            {`The Memory Grove isn't just another digital platform. It's a sacred space 
            where technology serves love, where your essence is preserved with reverence, 
            and where memories grow stronger with time.`}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card key={index} variant="default" className="text-center hover:scale-[1.02] transition-transform duration-300">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <CardTitle>{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-body-sm">
                  {value.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}