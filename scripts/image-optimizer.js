// scripts/optimize-images.js
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { getPlaiceholder } = require('plaiceholder');

const IMAGE_SIZES = [640, 1200, 1920];
const IMAGE_CATEGORIES = {
  hero: 'public/images/hero',
  features: 'public/images/features',
  team: 'public/images/team',
  blog: 'public/images/blog'
};

async function generateBlurDataURL(imagePath) {
  try {
    const buffer = await fs.readFile(imagePath);
    const { base64 } = await getPlaiceholder(buffer);
    return base64;
  } catch (error) {
    console.error(`Error generating blur placeholder for ${imagePath}:`, error);
    return null;
  }
}

async function optimizeImage(inputPath, outputDir, fileName) {
  const basename = path.basename(fileName, path.extname(fileName));
  const metadata = await sharp(inputPath).metadata();
  
  console.log(`Processing ${fileName} - ${metadata.width}x${metadata.height}`);
  
  // Generate optimized versions for each size
  for (const size of IMAGE_SIZES) {
    // Skip if image is smaller than target size
    if (metadata.width < size) continue;
    
    // Generate JPEG version
    await sharp(inputPath)
      .resize(size, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: 85, progressive: true })
      .toFile(path.join(outputDir, `${basename}-${size}.jpg`));
    
    // Generate WebP version
    await sharp(inputPath)
      .resize(size, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: 85 })
      .toFile(path.join(outputDir, `${basename}-${size}.webp`));
  }
  
  // Generate original size in optimized formats
  await sharp(inputPath)
    .jpeg({ quality: 90, progressive: true })
    .toFile(path.join(outputDir, `${basename}-original.jpg`));
    
  await sharp(inputPath)
    .webp({ quality: 90 })
    .toFile(path.join(outputDir, `${basename}-original.webp`));
  
  // Generate blur placeholder
  const blurDataURL = await generateBlurDataURL(inputPath);
  
  // Save metadata including blur placeholder
  const metadataJson = {
    originalName: fileName,
    width: metadata.width,
    height: metadata.height,
    sizes: IMAGE_SIZES.filter(size => metadata.width >= size),
    blurDataURL,
    generatedAt: new Date().toISOString()
  };
  
  await fs.writeFile(
    path.join(outputDir, `${basename}.meta.json`),
    JSON.stringify(metadataJson, null, 2)
  );
  
  console.log(`✓ Optimized ${fileName} - Generated ${metadataJson.sizes.length} sizes`);
}

async function optimizeImages() {
  const inputDir = 'public/images/raw';
  
  // Create output directories
  for (const [category, dir] of Object.entries(IMAGE_CATEGORIES)) {
    await fs.mkdir(dir, { recursive: true });
  }
  
  try {
    const files = await fs.readdir(inputDir);
    
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
        const inputPath = path.join(inputDir, file);
        
        // Determine category based on filename or prompt user
        let category = 'hero'; // Default category
        
        // You can add logic here to determine category from filename
        // For example: if (file.includes('team')) category = 'team';
        
        if (file.toLowerCase().includes('hero')) {
          category = 'hero';
        } else if (file.toLowerCase().includes('feature')) {
          category = 'features';
        } else if (file.toLowerCase().includes('team')) {
          category = 'team';
        } else if (file.toLowerCase().includes('blog')) {
          category = 'blog';
        }
        
        const outputDir = IMAGE_CATEGORIES[category];
        await optimizeImage(inputPath, outputDir, file);
      }
    }
    
    console.log('\n✅ All images optimized successfully!');
  } catch (error) {
    console.error('Error optimizing images:', error);
    process.exit(1);
  }
}

// Run the optimizer
optimizeImages();