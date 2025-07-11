import TestimonialCard from '@/components/ui/TestimonialCard'
import Button from '@/components/ui/Button'

export default function StoriesOfConnection() {
  const stories = [
    {
      title: 'The Wedding Dance',
      quote: "Dad recorded a message for my wedding day three years before his diagnosis. As I danced alone to our song, his voice filled the space where he should have been. 'I'm proud of you, sweetheart. Save me a dance.' There wasn't a dry eye in the room.",
      attribution: 'Maria',
      role: '28'
    },
    {
      title: 'The Birthday Tradition',
      quote: "Every year on my birthday, I get a new message from Mom. She recorded them all in one afternoon, imagining me at every age. This year I turned 40. She was right—I did need to hear her remind me to moisturize.",
      attribution: 'David',
      role: '40'
    },
    {
      title: 'The Bedtime Stories',
      quote: "Grandpa recorded 365 bedtime stories before he passed. Every night, my daughter hears his voice saying 'Sweet dreams, little sailor.' She's never met him, but she knows him.",
      attribution: 'Jennifer',
      role: '34'
    },
    {
      title: 'Questions Finally Answered',
      quote: "I uploaded Dad's old voicemails and work presentations. Now when I need guidance, I ask him questions we never got to discuss. Yesterday, his voice helped me through my first board meeting: 'Remember, confidence is quiet. Let your work speak.'",
      attribution: 'Michael',
      role: '32'
    },
    {
      title: 'Grandmother\'s Lullabies',
      quote: "Mom had videos of Grandma from the 90s. We uploaded them, and now my baby falls asleep to the same lullabies Grandma sang to me. Her voice bridges three generations—it's like she's still here, loving us.",
      attribution: 'Sarah',
      role: '29'
    },
    {
      title: 'The Recipe Continued',
      quote: "Found Mom's cooking show audition tape in the attic. Through Memory Grove, she now 'teaches' me new recipes every Sunday. 'Today we're making your favorite, honey'—words she never said, but exactly how she would have said them.",
      attribution: 'Elena',
      role: '45'
    }
  ]

  return (
    <section className="section-spacing bg-warm-white">
      <div className="container-grove">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-serif text-h1 md:text-display-sm text-sage-deep mb-6">
            Voices That Transcend Time
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <div key={index}>
              <h3 className="font-serif text-h3 text-sage-primary mb-4 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                {story.title}
              </h3>
              <TestimonialCard
                quote={story.quote}
                attribution={story.attribution}
                role={story.role}
                delay={index * 200 + 100}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-16 animate-fade-in animation-delay-800">
          <Button href="/start" size="lg">
            Start Your Voice Legacy
          </Button>
        </div>
      </div>
    </section>
  )
}