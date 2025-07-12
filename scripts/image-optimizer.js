// scripts/optimize-images.js
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function optimizeImages() {
  const inputDir = 'public/images/raw';
  const outputDir = 'public/images/optimized';
  
  // Create output directory
  await fs.mkdir(outputDir, { recursive: true });
  
  const files = await fs.readdir(inputDir);
  
  for (const file of files) {
    if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
      const input = path.join(inputDir, file);
      const output = path.join(outputDir, file);
      
      // Generate multiple sizes
      await sharp(input)
        .resize(1920, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({ quality: 85, progressive: true })
        .toFile(output.replace(/\.\w+$/, '-1920.jpg'));
        
      await sharp(input)
        .resize(1200, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({ quality: 85, progressive: true })
        .toFile(output.replace(/\.\w+$/, '-1200.jpg'));
        
      await sharp(input)
        .resize(640, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({ quality: 85, progressive: true })
        .toFile(output.replace(/\.\w+$/, '-640.jpg'));
        
      // Generate blur placeholder
      const { data, info } = await sharp(input)
        .resize(10, 10, { fit: 'inside' })
        .blur()
        .toBuffer({ resolveWithObject: true });
        
      console.log(`Optimized ${file}`);
    }
  }
}

optimizeImages();