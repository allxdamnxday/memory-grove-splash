# Memory Groves - Splash Page & Marketing Site Outline

## Phase 1: MVP Splash Page (Week 1-2)

### Core Pages
1. **Landing Page (Homepage)**
   - Hero section with nature imagery (grove/garden)
   - Tagline: "Where Memories Bloom Eternal"
   - Brief value proposition
   - Email capture form ("Join our grove")
   - Social media links

2. **About Page**
   - Our story (why we're building this)
   - Mission & vision
   - Team introduction (if comfortable sharing)
   - Brand values in accessible language

3. **Blog**
   - Simple blog structure for SEO
   - Initial posts:
     - "The Sacred Act of Memory Keeping"
     - "Why Your Voice Matters"
     - "Digital Legacy in the Modern Age"
   - Categories: Memory Keeping, Technology & Heart, Family Stories

4. **Contact**
   - Simple contact form
   - Press inquiries section
   - Partnership opportunities

### Technical Stack
- **Next.js 14** with App Router
- **Tailwind CSS** for styling
- **Supabase** for email collection & storage
- **Vercel** for hosting
- **MDX** for blog posts
- **React Hook Form** for forms
- **Resend** or **SendGrid** for email automation

### Key Features
- Mobile-responsive design
- SEO optimization (meta tags, sitemap, robots.txt)
- Analytics (Google Analytics / Plausible)
- Cookie consent banner
- Accessibility (WCAG AA compliant)

### Email Collection Strategy
- Welcome email series (3-5 emails)
- Weekly "Memory Moments" newsletter
- Early access list for beta testers
- Segmentation: General interest vs. Professional (funeral directors, counselors)

## Phase 2: Enhanced Marketing Site (Week 3-4)

### Additional Pages
1. **How It Works**
   - Three-step visual journey
   - "Plant" → "Nurture" → "Bloom"
   - Interactive elements (subtle animations)
   - Video explainer (optional)

2. **Use Cases**
   - Personal memory keeping
   - Family historians
   - End-of-life planning
   - Professional services

3. **Resources**
   - Memory prompts guide (downloadable PDF)
   - "Starting Conversations About Legacy" toolkit
   - Recommended readings
   - Partner resources

4. **Privacy & Security**
   - Clear, human-readable privacy policy
   - Security measures explained simply
   - Data ownership promises
   - Trust indicators

### Enhanced Features
- **Waitlist with Referral System**
  - "Grow your grove" - invite friends
  - Early access tiers based on referrals
  - Social sharing incentives

- **Interactive Elements**
  - "Plant a memory" demo (text only for now)
  - Memory prompt generator
  - Testimonial carousel
  - Seasonal themes (subtle background changes)

- **Content Marketing**
  - Guest blog opportunities
  - Podcast appearance tracker
  - Press kit download
  - Brand assets for partners

## Phase 3: Community Building (Month 2)

### Community Features
1. **Memory Stories Section**
   - User-submitted stories (with permission)
   - Monthly featured memory keeper
   - Community guidelines

2. **Events & Workshops**
   - Virtual memory-keeping workshops
   - Grief support partner events
   - Webinar registration

3. **Grove Keeper Program**
   - Early adopter community
   - Beta testing opportunities
   - Feedback forums
   - Exclusive content

### SEO & Content Strategy
- **Keyword Targets**
  - "digital legacy planning"
  - "preserve family memories"
  - "voice recording for memories"
  - "ethical AI memorial"
  - Long-tail keywords around grief, memory, legacy

- **Content Calendar**
  - 2 blog posts/week
  - 1 memory prompt/week
  - Monthly newsletter
  - Seasonal campaigns (Mother's Day, Memorial Day, etc.)

- **Link Building**
  - Guest posts on grief support sites
  - Partnerships with genealogy blogs
  - Funeral industry publications
  - Senior living communities

## Phase 4: Pre-Launch Features (Month 3)

### Advanced Features
1. **Beta Access Portal**
   - Application process
   - NDA agreements
   - Feedback collection system
   - Feature voting

2. **Pricing Preview**
   - Transparent pricing philosophy
   - "Growing Together" founding member rates
   - Gift memberships concept

3. **API Documentation** (if applicable)
   - For funeral homes
   - Healthcare providers
   - Developer community

### Social Proof
- Advisor profiles
- Partnership announcements
- Media mentions tracker
- User testimonial videos

## Technical Implementation Details

### Next.js Structure
```
/app
  /(marketing)
    /page.tsx (landing)
    /about/page.tsx
    /how-it-works/page.tsx
    /blog/[slug]/page.tsx
    /resources/page.tsx
  /(auth)
    /waitlist/page.tsx
  /api
    /subscribe/route.ts
    /contact/route.ts
/components
  /ui (following brand guidelines)
  /marketing
  /blog
/lib
  /mdx
  /email
  /analytics
/content
  /blog
  /resources
/public
  /images
  /downloads
```

### Performance Targets
- Lighthouse score: 95+
- Core Web Vitals: All green
- Load time: <2s on 3G
- Image optimization with next/image
- Font optimization (Cormorant Garamond, Source Sans Pro)

### Analytics & Tracking
- Conversion events:
  - Email signups
  - Resource downloads
  - Blog engagement time
  - Social shares
- A/B testing framework ready
- Heatmap integration (Hotjar/Clarity)
- UTM parameter tracking

## Content Guidelines

### Voice & Tone (from Brand Guidelines)
- Warm and gentle, like a friend
- Nature metaphors throughout
- No corporate jargon
- Focus on growth and continuity
- Inclusive language always

### Visual Design
- Sage green color palette
- Organic shapes and flowing lines
- Natural photography (golden hour)
- Generous white space
- Subtle paper textures

### Call-to-Actions
- "Begin Your Grove"
- "Plant Your First Memory"
- "Join Our Growing Garden"
- "Nurture Your Legacy"

## Launch Checklist

### Pre-Launch
- [ ] Domain setup with SSL
- [ ] Email automation sequences
- [ ] Social media profiles
- [ ] Analytics implementation
- [ ] Legal pages (Privacy, Terms)
- [ ] Accessibility audit
- [ ] Cross-browser testing
- [ ] Load testing

### Launch Day
- [ ] Press release
- [ ] Social media announcements
- [ ] Email to early subscribers
- [ ] Team celebration 🌱

### Post-Launch
- [ ] Daily analytics review
- [ ] Respond to inquiries
- [ ] Content calendar execution
- [ ] Feature roadmap updates
- [ ] Community engagement

## Success Metrics

### Month 1
- 1,000 email subscribers
- 50+ beta applications
- 5 partnership inquiries
- 10,000 unique visitors

### Month 3
- 5,000 email subscribers
- 200+ beta testers
- 3 strategic partnerships
- 25% email open rate
- 5% conversion to waitlist

### Month 6
- 10,000+ email list
- 500+ active beta users
- Press coverage in 5+ publications
- Community of 1,000+ Grove Keepers

## Budget Considerations

### Essential (Month 1)
- Domain & hosting: $50/month
- Email service: $50/month
- Stock photography: $200
- Total: ~$300/month

### Growth (Month 3+)
- Premium email features: $200/month
- Analytics tools: $100/month
- Design assets: $500
- Content writing: $1,000/month
- Total: ~$2,000/month

## Risk Mitigation

- **Technical**: Start simple, progressively enhance
- **Legal**: Clear disclaimers about beta status
- **Emotional**: Sensitivity readers for all content
- **Competitive**: Focus on unique value prop (nature, ethics)
- **Financial**: Bootstrap-friendly approach

## Next Steps

1. Set up Next.js project with brand colors/fonts
2. Create email capture component
3. Write first 3 blog posts
4. Design hero section with nature imagery
5. Set up analytics and email automation
6. Launch MVP in 2 weeks

Remember: We're not building a tech platform, we're creating a sacred digital sanctuary. Every decision should reflect warmth, reverence, and the natural cycles of memory and growth.