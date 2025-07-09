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
    pageContent: {},
    forms: [],
    errors: [],
    designConsistency: {
      colors: new Set(),
      fonts: new Set(),
      natureMessaging: []
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
    
    // Extract navigation links and page content
    const homepageData = await page.evaluate(() => {
      const data = {
        title: document.title,
        navigation: [],
        content: {
          headings: [],
          ctaButtons: [],
          natureMessaging: []
        }
      };
      
      // Get navigation links
      const navElements = document.querySelectorAll('nav a, header a');
      navElements.forEach(link => {
        const href = link.getAttribute('href');
        const text = link.textContent.trim();
        if (href && !href.startsWith('#') && !href.startsWith('http')) {
          data.navigation.push({ href, text });
        }
      });
      
      // Get headings
      document.querySelectorAll('h1, h2, h3').forEach(h => {
        data.content.headings.push({
          level: h.tagName,
          text: h.textContent.trim()
        });
      });
      
      // Get CTA buttons
      document.querySelectorAll('button, a[href="/join"], a[href="/contact"]').forEach(btn => {
        data.content.ctaButtons.push({
          text: btn.textContent.trim(),
          href: btn.getAttribute('href') || 'button'
        });
      });
      
      // Extract nature-inspired messaging
      const natureKeywords = ['grove', 'tree', 'root', 'leaf', 'sanctuary', 'sacred', 'memories', 'voice', 'story', 'connection', 'preserve', 'bloom'];
      const allText = document.body.innerText;
      natureKeywords.forEach(keyword => {
        const regex = new RegExp(`[^.]*\\b${keyword}\\b[^.]*\\.`, 'gi');
        const matches = allText.match(regex);
        if (matches) {
          data.content.natureMessaging.push(...matches.slice(0, 2).map(m => m.trim()));
        }
      });
      
      return data;
    });
    
    report.siteStructure.navigation = [...new Map(homepageData.navigation.map(item => [item.href, item])).values()];
    report.pageContent['/'] = homepageData.content;
    report.designConsistency.natureMessaging.push(...homepageData.content.natureMessaging);
    
    console.log(`Found ${report.siteStructure.navigation.length} navigation links`);
    
    // Add homepage to visited pages
    report.pagesVisited.push({
      url: '/',
      title: homepageData.title,
      screenshot: 'homepage/full-page.png',
      timestamp: new Date().toISOString()
    });
    
    // Test each marketing page
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
            content: {
              headings: [],
              forms: [],
              interactiveElements: [],
              natureMessaging: [],
              textContent: []
            },
            design: {
              primaryColors: [],
              fonts: []
            }
          };
          
          // Get all headings
          document.querySelectorAll('h1, h2, h3').forEach(h => {
            data.content.headings.push({
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
                label: input.labels?.[0]?.textContent || input.placeholder
              });
            });
            data.content.forms.push({
              id: form.id || 'unnamed-form',
              fields: inputs,
              submitButton: form.querySelector('button[type="submit"]')?.textContent.trim()
            });
          });
          
          // Get key text content
          document.querySelectorAll('p, blockquote').forEach(p => {
            const text = p.textContent.trim();
            if (text.length > 50 && text.length < 300) {
              data.content.textContent.push(text);
            }
          });
          
          // Look for nature-inspired messaging
          const natureKeywords = ['grove', 'tree', 'root', 'leaf', 'sanctuary', 'sacred', 'nature', 'growth', 'bloom', 'forest', 'memories', 'voice', 'story'];
          const bodyText = document.body.innerText;
          natureKeywords.forEach(keyword => {
            const regex = new RegExp(`[^.]*\\b${keyword}\\b[^.]*\\.`, 'gi');
            const matches = bodyText.match(regex);
            if (matches) {
              data.content.natureMessaging.push(...matches.slice(0, 2).map(m => m.trim()));
            }
          });
          
          // Get design elements
          const mainElements = document.querySelectorAll('h1, h2, button, .btn, nav');
          mainElements.forEach(el => {
            const computed = window.getComputedStyle(el);
            data.design.primaryColors.push(computed.color);
            data.design.fonts.push(computed.fontFamily);
          });
          
          return data;
        });
        
        // Add to report
        report.pagesVisited.push({
          url: pageInfo.path,
          name: pageInfo.name,
          title: pageData.title,
          screenshot: `${pageInfo.name}/full-page.png`,
          timestamp: new Date().toISOString()
        });
        
        report.pageContent[pageInfo.path] = pageData.content;
        
        // Add design elements
        pageData.design.primaryColors.forEach(c => report.designConsistency.colors.add(c));
        pageData.design.fonts.forEach(f => report.designConsistency.fonts.add(f));
        report.designConsistency.natureMessaging.push(...pageData.content.natureMessaging);
        
        // Document forms found
        if (pageData.content.forms.length > 0) {
          report.forms.push({
            page: pageInfo.path,
            forms: pageData.content.forms
          });
        }
        
        // Special handling for contact page form validation display
        if (pageInfo.path === '/contact') {
          console.log('📧 Checking contact form structure...');
          
          // Click submit to see validation
          const submitButton = await page.$('form button[type="submit"]');
          if (submitButton) {
            await submitButton.click();
            await page.waitForTimeout(1000);
            
            // Take screenshot of validation state
            await page.screenshot({ 
              path: path.join(pageDir, 'form-validation.png'), 
              fullPage: true 
            });
            
            // Check for validation messages
            const validationState = await page.evaluate(() => {
              const messages = [];
              document.querySelectorAll('[aria-invalid="true"], .text-red-600, [role="alert"]').forEach(el => {
                const text = el.textContent.trim();
                if (text) messages.push(text);
              });
              return messages;
            });
            
            if (validationState.length > 0) {
              report.forms.find(f => f.page === '/contact').validationMessages = validationState;
            }
          }
        }
        
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
    report.designConsistency.colors = [...new Set(report.designConsistency.colors)];
    report.designConsistency.fonts = [...new Set(report.designConsistency.fonts)];
    report.designConsistency.natureMessaging = [...new Set(report.designConsistency.natureMessaging)];
    
    // Save report
    await fs.writeFile(
      path.join(__dirname, 'memory-grove-test-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n✅ Testing complete! Report saved to memory-grove-test-report.json');
    
    // Print summary
    console.log('\n📊 Test Summary:');
    console.log(`- Pages tested: ${report.pagesVisited.length}`);
    console.log(`- Forms found: ${report.forms.length}`);
    console.log(`- Nature messaging examples: ${report.designConsistency.natureMessaging.length}`);
    console.log(`- Errors encountered: ${report.errors.length}`);
    
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
testMemoryGrove()
  .then(() => console.log('\n🌲 Memory Grove site testing completed!'))
  .catch(console.error);