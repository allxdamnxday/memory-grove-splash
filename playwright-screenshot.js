const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

async function takeScreenshots() {
  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'screenshots');
  try {
    await fs.mkdir(screenshotsDir, { recursive: true });
  } catch (error) {
    console.error('Error creating screenshots directory:', error);
  }

  // Launch browser
  const browser = await chromium.launch({
    headless: false, // Set to false to see the browser
    args: ['--disable-blink-features=AutomationControlled']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  // Collect console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });

  // Collect page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.toString());
  });

  try {
    console.log('Navigating to http://localhost:3000...');
    
    // Navigate to the homepage with performance tracking
    const startTime = Date.now();
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    const loadTime = Date.now() - startTime;
    console.log(`Page loaded in ${loadTime}ms`);

    // Wait for animations to complete
    await page.waitForTimeout(2000);

    // Take full page screenshot
    console.log('Taking full page screenshot...');
    await page.screenshot({
      path: path.join(screenshotsDir, 'homepage-full.png'),
      fullPage: true
    });

    // Take hero section screenshot
    console.log('Taking hero section screenshot...');
    const heroSection = await page.$('section:first-of-type, .hero, [class*="hero"]');
    if (heroSection) {
      await heroSection.screenshot({
        path: path.join(screenshotsDir, 'hero-section.png')
      });
    }

    // Scroll and take features section screenshot
    console.log('Taking features section screenshot...');
    const featuresSection = await page.$('[class*="features"], section:has(h2:text("Features")), section:nth-of-type(2)');
    if (featuresSection) {
      await featuresSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await featuresSection.screenshot({
        path: path.join(screenshotsDir, 'features-section.png')
      });
    }

    // Look for CTA sections
    console.log('Looking for CTA sections...');
    const ctaSections = await page.$$('[class*="cta"], section:has(a[href*="contact"]), section:has(button)');
    for (let i = 0; i < ctaSections.length; i++) {
      await ctaSections[i].scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await ctaSections[i].screenshot({
        path: path.join(screenshotsDir, `cta-section-${i + 1}.png`)
      });
    }

    // Document visual elements
    console.log('\nDocumenting visual elements...');
    
    // Get computed styles of key elements
    const visualElements = await page.evaluate(() => {
      const results = {
        colors: {},
        typography: {},
        animations: [],
        images: []
      };

      // Get root styles for CSS variables
      const root = document.documentElement;
      const rootStyles = getComputedStyle(root);
      
      // Extract color variables
      const colorVars = ['--color-sage', '--color-warm', '--primary', '--background'];
      colorVars.forEach(varName => {
        const value = rootStyles.getPropertyValue(varName);
        if (value) results.colors[varName] = value.trim();
      });

      // Get body styles
      const body = document.body;
      const bodyStyles = getComputedStyle(body);
      results.colors.background = bodyStyles.backgroundColor;
      results.colors.text = bodyStyles.color;
      
      // Typography
      results.typography.bodyFont = bodyStyles.fontFamily;
      results.typography.bodySize = bodyStyles.fontSize;
      results.typography.bodyLineHeight = bodyStyles.lineHeight;

      // Check headings
      const h1 = document.querySelector('h1');
      if (h1) {
        const h1Styles = getComputedStyle(h1);
        results.typography.h1Font = h1Styles.fontFamily;
        results.typography.h1Size = h1Styles.fontSize;
        results.typography.h1Weight = h1Styles.fontWeight;
      }

      // Check for animations
      document.querySelectorAll('*').forEach(el => {
        const styles = getComputedStyle(el);
        if (styles.animation !== 'none' || styles.transition !== 'none') {
          const className = typeof el.className === 'string' ? el.className : '';
          results.animations.push({
            element: el.tagName + (className ? '.' + className.split(' ')[0] : ''),
            animation: styles.animation,
            transition: styles.transition
          });
        }
      });

      // Get images
      document.querySelectorAll('img').forEach(img => {
        results.images.push({
          src: img.src,
          alt: img.alt,
          width: img.width,
          height: img.height
        });
      });

      return results;
    });

    console.log('Visual Elements:', JSON.stringify(visualElements, null, 2));

    // Take mobile screenshot
    console.log('\nTaking mobile screenshot...');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(1000); // Wait for responsive adjustments
    
    await page.screenshot({
      path: path.join(screenshotsDir, 'homepage-mobile-full.png'),
      fullPage: true
    });

    // Take mobile hero screenshot
    if (heroSection) {
      await heroSection.screenshot({
        path: path.join(screenshotsDir, 'hero-section-mobile.png')
      });
    }

    // Check accessibility
    console.log('\nChecking accessibility...');
    const accessibilityIssues = await page.evaluate(() => {
      const issues = [];
      
      // Check for alt text on images
      document.querySelectorAll('img').forEach(img => {
        if (!img.alt) {
          issues.push(`Missing alt text on image: ${img.src}`);
        }
      });

      // Check for proper heading hierarchy
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      let lastLevel = 0;
      headings.forEach(h => {
        const level = parseInt(h.tagName[1]);
        if (level > lastLevel + 1) {
          issues.push(`Heading hierarchy issue: ${h.tagName} follows h${lastLevel}`);
        }
        lastLevel = level;
      });

      // Check for form labels
      document.querySelectorAll('input, textarea, select').forEach(input => {
        if (!input.labels?.length && !input.getAttribute('aria-label')) {
          issues.push(`Form input without label: ${input.type || 'unknown'}`);
        }
      });

      // Check color contrast (basic check)
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        const styles = getComputedStyle(link);
        const color = styles.color;
        const bgColor = styles.backgroundColor;
        // Note: This is a simplified check
        if (color && bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
          issues.push(`Check color contrast for link: ${link.textContent}`);
        }
      });

      return issues;
    });

    // Generate report
    const report = {
      loadTime: `${loadTime}ms`,
      screenshots: [
        'homepage-full.png',
        'hero-section.png',
        'features-section.png',
        'homepage-mobile-full.png',
        'hero-section-mobile.png'
      ],
      visualElements,
      accessibilityIssues,
      consoleMessages,
      pageErrors,
      timestamp: new Date().toISOString()
    };

    // Add CTA screenshots to report
    for (let i = 0; i < ctaSections.length; i++) {
      report.screenshots.push(`cta-section-${i + 1}.png`);
    }

    // Save report
    await fs.writeFile(
      path.join(screenshotsDir, 'screenshot-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('\nScreenshot Report:', JSON.stringify(report, null, 2));

    return report;

  } catch (error) {
    console.error('Error during screenshot process:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the screenshot function
takeScreenshots()
  .then(() => {
    console.log('\nScreenshots completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\nFailed to complete screenshots:', error);
    process.exit(1);
  });