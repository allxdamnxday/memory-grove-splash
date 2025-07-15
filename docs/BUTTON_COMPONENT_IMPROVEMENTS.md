# Button Component Improvements

## Overview

The Button component has been enhanced with new features while maintaining the existing design system and brand guidelines.

## New Features

### 1. Icon Button Support
- Added `icon` variant for icon-only buttons
- New icon sizes: `icon-sm`, `icon-md`, `icon-lg`
- Pass icon through the `icon` prop when using `variant="icon"`

```tsx
<Button variant="icon" size="icon-md" icon={<Play />} />
```

### 2. Loading State
- Added `loading` prop that shows a spinner and disables the button
- Works with all variants and sizes
- Maintains button text while showing loading indicator

```tsx
<Button loading>Saving...</Button>
```

### 3. Enhanced Documentation
- Added JSDoc comments to the component
- Comprehensive prop descriptions with TypeScript
- Usage examples in component documentation

### 4. Improved Accessibility
- Loading state properly disables the button
- Icon buttons should include `aria-label` for screen readers
- Maintained all existing focus states

## Usage Examples

### Basic Buttons
```tsx
import Button from '@/components/ui/Button'

// Primary button
<Button variant="primary">Click me</Button>

// Secondary button
<Button variant="secondary">Learn more</Button>

// Ghost button
<Button variant="ghost">Cancel</Button>
```

### Icon Buttons
```tsx
// Icon-only button
<Button 
  variant="icon" 
  size="icon-md" 
  icon={<Heart />} 
  aria-label="Like"
/>

// Primary variant with icon
<Button 
  variant="primary" 
  size="icon-md" 
  icon={<Play />} 
  className="!rounded-full"
/>
```

### Loading States
```tsx
// Basic loading
<Button loading>Processing...</Button>

// Loading with click handler
const [loading, setLoading] = useState(false)

<Button 
  loading={loading}
  onClick={async () => {
    setLoading(true)
    await doSomething()
    setLoading(false)
  }}
>
  Submit
</Button>
```

### Button Links
```tsx
// Internal link
<Button href="/about">About Us</Button>

// External link
<Button href="https://example.com" external>
  Visit Site
</Button>
```

## Migration Guide

### Replacing Native Buttons

The AudioPlayer component has been updated as an example:

**Before:**
```tsx
<button
  onClick={togglePlayPause}
  disabled={isLoading}
  className="w-12 h-12 bg-sage-primary..."
>
  {isLoading ? <Spinner /> : <Play />}
</button>
```

**After:**
```tsx
<Button
  onClick={togglePlayPause}
  variant="primary"
  size="icon-md"
  loading={isLoading}
  icon={<Play />}
  className="!rounded-full"
  aria-label="Play"
/>
```

## Removed Code

- Deleted unused `.btn-primary` and `.btn-secondary` CSS classes from `globals.css`
- These were legacy styles not being used by any components

## Testing

View all button variants and states at: `/button-showcase`

This showcase page demonstrates:
- All variants (primary, secondary, ghost, white, white-outline, icon)
- All sizes (sm, md, lg, icon-sm, icon-md, icon-lg)
- Loading states
- Disabled states
- Button links (internal and external)
- Buttons with icons and text