const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

async function ensureDirectory(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    console.error(`Error creating directory ${dir}:`, error.message);
  }
}

async function testMemoryGrove() {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  const report = {
    timestamp: new Date().toISOString(),
    siteStructure: {},
    pagesVisited: [],
    forms: [],
    errors: [],
    brokenLinks: [],
    designConsistency: {
      colors: new Set(),
      fonts: new Set(),
      messaging: []
    }
  };

  try {
    // Start at homepage
    console.log('🌲 Visiting homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Create screenshot directories
    const screenshotBase = path.join(__dirname, 'screenshots', 'marketing');
    await ensureDirectory(screenshotBase);
    
    // Take homepage screenshot
    const homepageDir = path.join(screenshotBase, 'homepage');
    await ensureDirectory(homepageDir);
    await page.screenshot({ 
      path: path.join(homepageDir, 'full-page.png'), 
      fullPage: true 
    });
    
    // Extract navigation links
    const navLinks = await page.evaluate(() => {
      const links = [];
      const navElements = document.querySelectorAll('nav a, header a');
      navElements.forEach(link => {
        const href = link.getAttribute('href');
        const text = link.textContent.trim();
        if (href && !href.startsWith('#') && !href.startsWith('http')) {
          links.push({ href, text });
        }
      });
      return [...new Set(links.map(l => JSON.stringify(l)))].map(l => JSON.parse(l));
    });
    
    report.siteStructure.navigation = navLinks;
    console.log(`Found ${navLinks.length} navigation links:`, navLinks);
    
    // Add homepage to visited pages
    report.pagesVisited.push({
      url: '/',
      title: await page.title(),
      screenshot: 'homepage/full-page.png',
      timestamp: new Date().toISOString()
    });
    
    // Test each navigation link
    const pagesToTest = [
      { path: '/about', name: 'about' },
      { path: '/contact', name: 'contact' },
      { path: '/blog', name: 'blog' }
    ];
    
    for (const pageInfo of pagesToTest) {
      console.log(`\n🌿 Testing ${pageInfo.name} page...`);
      
      try {
        await page.goto(`http://localhost:3000${pageInfo.path}`, { 
          waitUntil: 'networkidle',
          timeout: 30000 
        });
        
        // Create page directory and take screenshot
        const pageDir = path.join(screenshotBase, pageInfo.name);
        await ensureDirectory(pageDir);
        
        const screenshotPath = path.join(pageDir, 'full-page.png');
        await page.screenshot({ 
          path: screenshotPath, 
          fullPage: true 
        });
        
        // Extract page information
        const pageData = await page.evaluate(() => {
          const data = {
            title: document.title,
            headings: [],
            forms: [],
            interactiveElements: [],
            natureMessaging: []
          };
          
          // Get all headings
          document.querySelectorAll('h1, h2, h3').forEach(h => {
            data.headings.push({
              level: h.tagName,
              text: h.textContent.trim()
            });
          });
          
          // Find forms
          document.querySelectorAll('form').forEach(form => {
            const inputs = [];
            form.querySelectorAll('input, textarea, select').forEach(input => {
              inputs.push({
                type: input.type || input.tagName.toLowerCase(),
                name: input.name,
                placeholder: input.placeholder,
                required: input.required,
                validation: input.pattern || input.type
              });
            });
            data.forms.push({
              id: form.id,
              action: form.action,
              method: form.method,
              inputs
            });
          });
          
          // Find interactive elements
          document.querySelectorAll('button, [role="button"], a[href^="#"]').forEach(el => {
            data.interactiveElements.push({
              type: el.tagName.toLowerCase(),
              text: el.textContent.trim(),
              href: el.getAttribute('href')
            });
          });
          
          // Look for nature-inspired messaging
          const natureKeywords = ['grove', 'tree', 'root', 'leaf', 'sanctuary', 'sacred', 'nature', 'growth', 'bloom', 'forest'];
          const textContent = document.body.textContent.toLowerCase();
          natureKeywords.forEach(keyword => {
            if (textContent.includes(keyword)) {
              const regex = new RegExp(`[^.]*${keyword}[^.]*\\.`, 'gi');
              const matches = textContent.match(regex);
              if (matches) {
                data.natureMessaging.push(...matches.slice(0, 3));
              }
            }
          });
          
          return data;
        });
        
        // Add to report
        report.pagesVisited.push({
          url: pageInfo.path,
          name: pageInfo.name,
          title: pageData.title,
          screenshot: `${pageInfo.name}/full-page.png`,
          structure: pageData,
          timestamp: new Date().toISOString()
        });
        
        // Test contact form if on contact page
        if (pageInfo.path === '/contact') {
          console.log('📧 Testing contact form...');
          
          // Test form validation with empty submission
          const submitButton = await page.$('form button[type="submit"]');
          if (submitButton) {
            await submitButton.click();
            await page.waitForTimeout(1000);
            
            // Check for validation messages
            const validationErrors = await page.evaluate(() => {
              const errors = [];
              document.querySelectorAll('[aria-invalid="true"], .error, .text-red-600').forEach(el => {
                errors.push(el.textContent.trim());
              });
              return errors;
            });
            
            report.forms.push({
              page: '/contact',
              test: 'empty_submission',
              validationErrors,
              screenshot: `${pageInfo.name}/form-validation.png`
            });
            
            await page.screenshot({ 
              path: path.join(pageDir, 'form-validation.png'), 
              fullPage: true 
            });
          }
          
          // Test with valid data
          await page.reload();
          await page.waitForTimeout(1000);
          
          // Fill form with test data
          await page.fill('input[name="name"]', 'Test User');
          await page.fill('input[name="email"]', 'test@example.com');
          await page.fill('textarea[name="message"]', 'This is a test message to check the contact form functionality.');
          
          // Take screenshot of filled form
          await page.screenshot({ 
            path: path.join(pageDir, 'form-filled.png'), 
            fullPage: true 
          });
          
          // Submit form
          await page.click('form button[type="submit"]');
          await page.waitForTimeout(3000);
          
          // Check for success message
          const successMessage = await page.evaluate(() => {
            const success = document.querySelector('.text-green-700, [role="alert"], .success');
            return success ? success.textContent.trim() : null;
          });
          
          report.forms.push({
            page: '/contact',
            test: 'valid_submission',
            success: !!successMessage,
            message: successMessage,
            screenshot: `${pageInfo.name}/form-success.png`
          });
          
          await page.screenshot({ 
            path: path.join(pageDir, 'form-success.png'), 
            fullPage: true 
          });
        }
        
        // Check for broken links on the page
        const links = await page.evaluate(() => {
          const allLinks = [];
          document.querySelectorAll('a[href]').forEach(link => {
            allLinks.push({
              href: link.href,
              text: link.textContent.trim()
            });
          });
          return allLinks;
        });
        
        for (const link of links) {
          if (link.href.startsWith('http://localhost:3000')) {
            try {
              const response = await page.goto(link.href, { 
                waitUntil: 'domcontentloaded',
                timeout: 10000 
              });
              if (!response.ok()) {
                report.brokenLinks.push({
                  page: pageInfo.path,
                  link: link.href,
                  text: link.text,
                  status: response.status()
                });
              }
              // Go back to the page we were testing
              await page.goto(`http://localhost:3000${pageInfo.path}`, { 
                waitUntil: 'networkidle' 
              });
            } catch (error) {
              report.brokenLinks.push({
                page: pageInfo.path,
                link: link.href,
                text: link.text,
                error: error.message
              });
            }
          }
        }
        
        // Extract design elements
        const designElements = await page.evaluate(() => {
          const styles = {
            colors: new Set(),
            fonts: new Set()
          };
          
          // Get computed styles from various elements
          const elements = document.querySelectorAll('h1, h2, h3, p, button, a');
          elements.forEach(el => {
            const computed = window.getComputedStyle(el);
            styles.colors.add(computed.color);
            styles.colors.add(computed.backgroundColor);
            styles.fonts.add(computed.fontFamily);
          });
          
          return {
            colors: Array.from(styles.colors).filter(c => c !== 'rgba(0, 0, 0, 0)'),
            fonts: Array.from(styles.fonts)
          };
        });
        
        designElements.colors.forEach(c => report.designConsistency.colors.add(c));
        designElements.fonts.forEach(f => report.designConsistency.fonts.add(f));
        
      } catch (error) {
        console.error(`Error testing ${pageInfo.name}:`, error.message);
        report.errors.push({
          page: pageInfo.path,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Convert Sets to Arrays for JSON serialization
    report.designConsistency.colors = Array.from(report.designConsistency.colors);
    report.designConsistency.fonts = Array.from(report.designConsistency.fonts);
    
    // Save report
    await fs.writeFile(
      path.join(__dirname, 'memory-grove-test-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n✅ Testing complete! Report saved to memory-grove-test-report.json');
    
    // Print summary
    console.log('\n📊 Test Summary:');
    console.log(`- Pages tested: ${report.pagesVisited.length}`);
    console.log(`- Forms tested: ${report.forms.length}`);
    console.log(`- Broken links found: ${report.brokenLinks.length}`);
    console.log(`- Errors encountered: ${report.errors.length}`);
    console.log(`- Design colors found: ${report.designConsistency.colors.length}`);
    console.log(`- Font families used: ${report.designConsistency.fonts.length}`);
    
  } catch (error) {
    console.error('Fatal error during testing:', error);
    report.errors.push({
      page: 'general',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  } finally {
    await browser.close();
  }
  
  return report;
}

// Run the test
testMemoryGrove().catch(console.error);