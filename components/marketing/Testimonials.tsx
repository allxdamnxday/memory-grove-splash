import Card, { CardContent } from '@/components/ui/Card'

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      relation: "Daughter",
      content: "Hearing my mother\'s voice tell her childhood stories brought tears to my eyes. Memory Groves gave us a gift we\'ll treasure forever.",
      image: "/images/testimonial-1.jpg"
    },
    {
      name: "Robert Chen",
      relation: "Grandfather",
      content: "I wanted my grandchildren to know where they came from. Now they can hear my stories in my own voice, even after I\'m gone.",
      image: "/images/testimonial-2.jpg"
    },
    {
      name: "Maria Santos",
      relation: "Memory Keeper",
      content: "Creating my grove felt like planting a garden of love. Each memory I add is a seed for future generations to discover.",
      image: "/images/testimonial-3.jpg"
    }
  ]

  return (
    <section className="section-spacing bg-warm-white">
      <div className="container-grove">
        <div className="text-center mb-16">
          <h2 className="font-serif text-h1 text-sage-deep mb-6">
            Voices From The Grove
          </h2>
          <p className="text-text-secondary text-body-lg max-w-3xl mx-auto">
            {`Real stories from those who've planted their memories and the loved ones 
            who've discovered them. Each grove is a testament to the power of preserved love.`}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} variant="default" className="relative">
              <CardContent className="pt-12">
                {/* Quote mark */}
                <div className="absolute top-6 left-8 text-sage-mist">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                
                <p className="text-text-secondary text-body-sm italic mb-6">
                  &quot;{testimonial.content}&quot;
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-sage-mist flex items-center justify-center">
                    <span className="text-sage-deep font-serif text-lg">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sage-deep font-medium">{testimonial.name}</p>
                    <p className="text-text-light text-caption">{testimonial.relation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}