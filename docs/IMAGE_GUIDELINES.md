# Memory Grove Image Guidelines

This guide provides best practices for managing and optimizing images in the Memory Grove project.

## Image Optimization Workflow

### 1. Adding New Images

1. Place source images in `/public/images/raw/`
2. Name images descriptively (e.g., `hero_morning_grove.png`, `feature_voice_recording.jpg`)
3. Run the optimizer: `node scripts/image-optimizer.js`

### 2. Image Categories

Images are automatically organized based on filename patterns:
- **Hero images**: Include "hero" in filename → `/public/images/hero/`
- **Feature images**: Include "feature" in filename → `/public/images/features/`
- **Team photos**: Include "team" in filename → `/public/images/team/`
- **Blog images**: Include "blog" in filename → `/public/images/blog/`

### 3. Using Optimized Images

#### Static Images (Using OptimizedImage Component)

```tsx
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import imageMetadata from '@/public/images/hero/your-image.meta.json'

<OptimizedImage
  src="/images/hero/your-image-original.webp"
  alt="Descriptive alt text"
  width={imageMetadata.width}
  height={imageMetadata.height}
  priority // for above-fold images
  blurDataURL={imageMetadata.blurDataURL}
  sizes="(max-width: 640px) 100vw, (max-width: 1200px) 80vw, 1200px"
/>
```

#### Responsive Images (Art Direction)

```tsx
import { ResponsiveImage } from '@/components/ui/OptimizedImage'
import heroMetadata from '@/public/images/hero/hero.meta.json'

<ResponsiveImage
  sources={[
    {
      media: "(max-width: 640px)",
      srcSet: "/images/hero/hero-mobile-640.webp",
      type: "image/webp"
    },
    {
      media: "(max-width: 1200px)",
      srcSet: "/images/hero/hero-1200.webp",
      type: "image/webp"
    }
  ]}
  fallbackSrc="/images/hero/hero-1920.jpg"
  alt="Peaceful grove"
  width={1920}
  height={1080}
  priority
  blurDataURL={heroMetadata.blurDataURL}
/>
```

### 4. Dynamic/User-Uploaded Images (Supabase Storage)

For user-generated content, use Supabase Storage:

```tsx
// Upload image
const { data, error } = await supabase.storage
  .from('user-images')
  .upload(`memories/${userId}/${fileName}`, file, {
    cacheControl: '3600',
    upsert: false
  })

// Get optimized URL with transformations
const { data: { publicUrl } } = supabase.storage
  .from('user-images')
  .getPublicUrl(`memories/${userId}/${fileName}`)

// Use with OptimizedImage
<OptimizedImage
  src={publicUrl}
  alt="User memory"
  width={800}
  height={600}
  loader={({ src, width, quality }) => {
    return `${src}?width=${width}&quality=${quality || 75}`
  }}
/>
```

## Performance Best Practices

### Image Formats
- **WebP**: Primary format (85% quality for general, 90% for hero)
- **JPEG**: Fallback format with progressive encoding
- **AVIF**: Automatically handled by Next.js for supported browsers

### Image Sizes
- **Hero images**: 1920px, 1200px, 640px widths
- **Feature images**: 800px, 400px widths
- **Thumbnails**: 200px, 100px widths
- **Maximum file size**: 200KB for hero, 100KB for features, 50KB for thumbnails

### Loading Strategies
1. **Priority Loading**: Use `priority` prop for above-fold images
2. **Lazy Loading**: Default for below-fold images
3. **Blur Placeholders**: Automatically generated for smooth loading
4. **Sizes Attribute**: Always specify for responsive images

### Alt Text Guidelines
- Be descriptive and specific
- Include emotional context for Memory Grove
- Examples:
  - ✅ "Elderly hands holding a photo album, sunlight streaming through window"
  - ❌ "Image of hands"

## Image Checklist

Before deploying:
- [ ] Source images are in `/public/images/raw/`
- [ ] Ran `node scripts/image-optimizer.js`
- [ ] Using OptimizedImage component with blur placeholder
- [ ] Specified appropriate `sizes` attribute
- [ ] Added descriptive alt text
- [ ] Used `priority` for above-fold images
- [ ] Tested on slow 3G connection
- [ ] Verified CLS (Cumulative Layout Shift) is minimal

## Troubleshooting

### Common Issues

1. **Blur placeholder not showing**
   - Check that `.meta.json` file exists
   - Ensure `blurDataURL` is passed to component

2. **Images loading slowly**
   - Verify correct `sizes` attribute
   - Check if using WebP format
   - Consider reducing quality or dimensions

3. **Layout shift on load**
   - Always specify width and height
   - Use the blur placeholder
   - Ensure aspect ratio matches

## Memory Grove Brand Guidelines

### Image Style
- Soft, natural lighting
- Sage greens and warm earth tones
- Peaceful, contemplative mood
- Nature elements (trees, light, organic shapes)
- Human connection and warmth

### Avoid
- Harsh, clinical lighting
- Overly saturated colors
- Stock photo aesthetics
- Technology-focused imagery

## Updating the Image Optimizer

The optimizer script (`/scripts/image-optimizer.js`) can be customized:
- Adjust quality settings
- Add new size breakpoints
- Modify category detection logic
- Add new output formats

Remember to test changes thoroughly before processing all images.