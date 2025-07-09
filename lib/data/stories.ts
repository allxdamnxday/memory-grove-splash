export interface Story {
  id: string
  slug: string
  title: string
  subtitle: string
  excerpt: string
  category: 'wedding' | 'birthday' | 'legacy' | 'comfort' | 'family'
  author: string
  authorAge?: number
  date: string
  readTime: string
  featured: boolean
  content?: string
  audioUrl?: string
  imageUrl?: string
}

export const stories: Story[] = [
  {
    id: '1',
    slug: 'emma',
    title: 'Emma\'s Wedding Day Message',
    subtitle: 'A father\'s love transcends time',
    excerpt: 'Three years before his diagnosis, Robert recorded a message for his daughter\'s future wedding day. When Emma walked down the aisle, his voice filled the space where he should have been.',
    category: 'wedding',
    author: 'Emma Richardson',
    authorAge: 28,
    date: '2024-01-15',
    readTime: '5 min read',
    featured: true,
    content: `
      The morning of my wedding, I was a mess. Dad had been gone for six months, and the thought of walking down the aisle without him felt impossible. That's when Mom handed me the tablet, tears in her eyes, and said, "Your father left something for you."

      I wasn't prepared for his voice. That warm, slightly raspy voice that used to sing me to sleep, tell terrible dad jokes, and call me "Em-bear" even when I begged him to stop in front of my friends.

      "My dearest Emma," he began, and I had to sit down. "If you're listening to this, it means you've found someone who makes you as happy as your mother makes me. And it means I'm not there to threaten them with my golf clubs."

      Even from beyond, he could make me laugh through tears.

      He talked about the day I was born, how tiny my fingers were wrapped around his. He remembered my first dance recital when I forgot the steps and just twirled in circles—he said it was still the best performance he'd ever seen. He spoke about teaching me to ride a bike, bandaging scraped knees, and how proud he was when I stood up to bullies in middle school.

      "I may not be there to walk you down the aisle," his voice continued, "but I'm there in every step you take. In your kindness, your strength, your terrible taste in music—okay, maybe not that last one."

      The ceremony was postponed fifteen minutes because I couldn't stop crying. But they were healing tears, grateful tears.

      During the father-daughter dance, we played his recording again. He'd thought of everything—even recorded himself humming our song, "The Way You Look Tonight." As I danced with my new husband, Dad's voice surrounded us: "Save me a dance, Em-bear. In whatever way the universe allows, I'll be there."

      There wasn't a dry eye in the room. My uncle later said it was like Dad was there, just in a different way. And he was right. Through Memory Grove, Dad didn't miss my wedding. He was present in the most profound way possible—through his words, his love, and his perfectly timed dad jokes.

      Now I'm expecting my first child, and I've already started my own Memory Grove. Because I learned that love doesn't end with goodbye. Sometimes it just finds new ways to say hello.
    `
  },
  {
    id: '2',
    slug: 'birthday-tradition',
    title: 'A Birthday Tradition That Lives On',
    subtitle: 'How one mother\'s foresight created 40 years of presence',
    excerpt: 'When Linda recorded birthday messages for her son\'s future birthdays, she couldn\'t have known she\'d only see him turn 12. Twenty-eight years later, David still receives her annual wishes.',
    category: 'birthday',
    author: 'David Chen',
    authorAge: 40,
    date: '2024-02-08',
    readTime: '4 min read',
    featured: true,
    content: `
      This morning, I turned 40. And just like every birthday for the past 28 years, I heard my mother's voice wishing me happy birthday.

      Mom died when I was 12. Cancer. But in her final months, she did something extraordinary—she recorded birthday messages for me until my 50th birthday. Ten years of messages I haven't even heard yet.

      This year's message was special. "My darling David," her voice began, as it always does. "Forty years old! I can hardly imagine it. You're probably married now—I hope they're good enough for you. Nobody ever will be, of course, but I suppose I'm biased."

      She was right. I'm married with two kids. She never met Sarah or our children, but somehow, she knows them.

      "By now you might have children of your own," her message continued. "Tell them about their Nai Nai. Tell them I loved them before they were even a possibility. Tell them about our Sunday dumpling tradition—and make sure you're keeping it alive!"

      We make dumplings every Sunday. My kids know it's Nai Nai's recipe.

      Each message is perfectly timed to my life stage. At 16, she talked about driving carefully. At 21, about drinking responsibly. At 30, about not working too hard. She even correctly predicted I'd need to hear "It's okay to be scared" when I became a father at 32.

      This year, she talked about middle age, about looking back and forward simultaneously. "You might feel old at 40," she laughed, "but you're still my baby boy. You'll always be my baby boy."

      Then came the part that broke me: "I need you to know that every candle you blow out, I'm there in the smoke that rises. Every wish you make, I'm listening. I may not be there to embarrass you by singing off-key, but I'm there in the silence after the song, in the moment before you cut the cake, in the love that surrounds you."

      My daughter asked me why I was crying. I told her they were happy tears because Nai Nai still sends me birthday cards. She asked how that's possible.

      "Love finds a way," I said. "Love always finds a way."

      I have ten more messages waiting. Ten more birthdays with Mom. And thanks to Memory Grove, when I'm 50 and listening to her final message, I won't really be saying goodbye. I'll just be grateful for a mother who made sure death was just a comma in our conversation, not a period.

      Mom was right about one more thing in today's message: "Forty looks good on you, my son. But then again, every age has looked good on you, because you're mine."

      Happy birthday to me. With love, from Mom.
    `
  },
  {
    id: '3',
    slug: 'grandpas-bedtime-stories',
    title: '365 Bedtime Stories from Grandpa',
    subtitle: 'One grandfather\'s gift that keeps on giving',
    excerpt: 'Before his passing, Frank recorded a bedtime story for each night of the year. Now his great-granddaughter falls asleep to his voice every night, knowing him through his tales of adventure and wonder.',
    category: 'family',
    author: 'Jennifer Martinez',
    authorAge: 34,
    date: '2024-02-20',
    readTime: '6 min read',
    featured: false,
    content: `
      Every night at 7:30 PM, my daughter Lily says the same thing: "Is it time for Grandpa Frank's story?"

      Lily never met her great-grandfather. He died two years before she was born. But she knows his voice better than she knows mine some days. Because Grandpa Frank, in his final year, recorded 365 bedtime stories—one for every night of the year.

      It started when he was diagnosed. Knowing he wouldn't see his future great-grandchildren, he asked me, "What's the one thing you remember most about being a kid?" I told him it was bedtime stories—how they made me feel safe and loved.

      "Then that's what I'll do," he said.

      He spent months in his study, sometimes recording three or four stories a day when he felt strong enough. He wrote some himself—tales of "Princess Pickle" and "The Giggling Dragon." Others were classics he'd memorized from reading to his own children. Each one begins the same way: "Hello, little sailor. It's Grandpa Frank here with tonight's adventure."

      Lily is convinced he's talking directly to her. Because somehow, he is.

      His stories aren't just tales. They're lessons wrapped in wonder. The story about the star who felt too small teaches about self-worth. The butterfly who was afraid to fly is about courage. The tree that gave shade to everyone is about generosity.

      On story #247, recorded when he was particularly weak, you can hear the oxygen machine in the background. But his voice never wavers as he tells the tale of "The Brave Little Boat." At the end, he says, "Remember, little sailor, even when the waves are big, you're braver than you believe."

      Last week, Lily had a nightmare. She woke up crying, asking for Mommy. But then she stopped and said, "Can we listen to Grandpa Frank? The one about being scared of the dark?"

      It's story #089. I know because I've heard them all, catalogued them, cherished them. In it, he talks about how stars are just night lights that God forgot to turn off, and how the dark is just the world's way of resting.

      "See, little sailor?" his voice soothes through the speaker. "The dark isn't scary. It's just sleepy. Just like you should be."

      She was asleep before the story ended.

      My husband jokes that Grandpa Frank is the world's most reliable babysitter. But it's more than that. Through these stories, Lily is developing a relationship with her great-grandfather. She knows his humor, his warmth, his way of seeing the world. She draws pictures for him, tells him about her day before pressing play, and insists on saying "Goodnight, Grandpa Frank" when each story ends.

      We're on our second full cycle through the stories now. Lily has favorites she requests on repeat. But I've started my own Memory Grove recordings for her future children. Because Grandpa Frank taught me something profound: love isn't limited by time.

      Every night, when his voice fills her room with "Sweet dreams, little sailor. Remember, you are loved bigger than the ocean, higher than the stars, and forever and always," I whisper thank you to a man who understood that the greatest gift you can give is your presence—even when you're no longer present.

      365 stories. 365 nights of love. 365 proofs that death cannot stop a grandfather from tucking in his great-granddaughter.

      That's the magic of a voice preserved. That's the power of Memory Grove.
    `
  },
  {
    id: '4',
    slug: 'wartime-love-letters',
    title: 'Love Letters Across Time',
    subtitle: 'A veteran\'s messages of hope for his family\'s dark days',
    excerpt: 'William, a WWII veteran, recorded messages for his family to open during their hardest moments. Decades later, his words still provide comfort when they need it most.',
    category: 'comfort',
    author: 'Margaret O\'Brien',
    authorAge: 67,
    date: '2024-03-01',
    readTime: '7 min read',
    featured: false
  },
  {
    id: '5',
    slug: 'recipes-and-memories',
    title: 'More Than Just Recipes',
    subtitle: 'How one grandmother preserved her heritage through cooking stories',
    excerpt: 'Maria recorded herself making every family recipe, sharing not just ingredients but the stories behind each dish. Now her grandchildren cook with her voice guiding them, keeping traditions alive.',
    category: 'family',
    author: 'Isabella Santos',
    authorAge: 29,
    date: '2024-03-10',
    readTime: '5 min read',
    featured: false
  },
  {
    id: '6',
    slug: 'graduation-surprise',
    title: 'The Graduation Gift That Came 15 Years Late',
    subtitle: 'A mother\'s faith in her son\'s future',
    excerpt: 'Despite her son\'s learning disabilities, Grace recorded a message for his college graduation. Fifteen years after her passing, her faith in him proved justified.',
    category: 'legacy',
    author: 'Marcus Thompson',
    authorAge: 33,
    date: '2024-03-15',
    readTime: '6 min read',
    featured: false
  }
]

export function getStoryBySlug(slug: string): Story | undefined {
  return stories.find(story => story.slug === slug)
}

export function getFeaturedStories(): Story[] {
  return stories.filter(story => story.featured)
}

export function getStoriesByCategory(category: Story['category']): Story[] {
  return stories.filter(story => story.category === category)
}