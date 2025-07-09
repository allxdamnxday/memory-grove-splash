const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

async function testBlogSystem() {
  console.log('Starting blog system test...');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  // Create screenshot directories
  await ensureDir('screenshots/blog/posts');
  
  const blogReport = {
    timestamp: new Date().toISOString(),
    blogListingPage: {
      url: 'http://localhost:3000/blog',
      posts: [],
      seo: {},
      performance: {}
    },
    individualPosts: [],
    mdxRendering: {
      codeBlocks: false,
      formatting: false,
      images: false
    },
    userExperience: {
      navigation: '',
      readability: '',
      interactivity: ''
    }
  };
  
  try {
    // Navigate to blog listing page
    console.log('Navigating to blog listing page...');
    const startTime = Date.now();
    await page.goto('http://localhost:3000/blog', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    const loadTime = Date.now() - startTime;
    blogReport.blogListingPage.performance.loadTime = `${loadTime}ms`;
    
    // Take screenshot of blog listing
    await page.screenshot({ 
      path: 'screenshots/blog/listing.png',
      fullPage: true 
    });
    console.log('Blog listing screenshot saved');
    
    // Extract SEO metadata
    const seoData = await page.evaluate(() => {
      const getMetaContent = (name) => {
        const tag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
        return tag ? tag.getAttribute('content') : null;
      };
      
      return {
        title: document.title,
        description: getMetaContent('description'),
        ogTitle: getMetaContent('og:title'),
        ogDescription: getMetaContent('og:description'),
        ogImage: getMetaContent('og:image'),
        twitterCard: getMetaContent('twitter:card'),
        canonical: document.querySelector('link[rel="canonical"]')?.href
      };
    });
    blogReport.blogListingPage.seo = seoData;
    
    // Find all blog post links
    const blogPosts = await page.evaluate(() => {
      const posts = [];
      const postElements = document.querySelectorAll('article, [class*="blog-card"], [class*="post-card"], a[href^="/blog/"]');
      
      postElements.forEach(element => {
        // Try to extract blog post info
        const link = element.tagName === 'A' ? element : element.querySelector('a');
        if (!link || !link.href.includes('/blog/') || link.href.endsWith('/blog/')) return;
        
        const title = element.querySelector('h2, h3, [class*="title"]')?.textContent?.trim() || 
                     link.textContent?.trim();
        const excerpt = element.querySelector('p, [class*="excerpt"], [class*="description"]')?.textContent?.trim();
        const date = element.querySelector('time, [class*="date"]')?.textContent?.trim();
        const author = element.querySelector('[class*="author"]')?.textContent?.trim();
        const readingTime = element.querySelector('[class*="reading-time"], [class*="read-time"]')?.textContent?.trim();
        
        if (title) {
          posts.push({
            title,
            url: link.href,
            slug: link.href.split('/blog/')[1]?.split('/')[0],
            excerpt,
            date,
            author,
            readingTime
          });
        }
      });
      
      // Remove duplicates
      const uniquePosts = posts.filter((post, index, self) => 
        index === self.findIndex(p => p.url === post.url)
      );
      
      return uniquePosts;
    });
    
    blogReport.blogListingPage.posts = blogPosts;
    console.log(`Found ${blogPosts.length} blog posts`);
    
    // Test each individual blog post
    for (const post of blogPosts) {
      console.log(`\nTesting blog post: ${post.title}`);
      const postReport = {
        ...post,
        seo: {},
        mdxFeatures: {
          codeBlocks: false,
          headings: false,
          lists: false,
          links: false,
          images: false,
          blockquotes: false
        },
        performance: {}
      };
      
      try {
        // Navigate to individual post
        const postStartTime = Date.now();
        await page.goto(post.url, { 
          waitUntil: 'networkidle',
          timeout: 30000 
        });
        postReport.performance.loadTime = `${Date.now() - postStartTime}ms`;
        
        // Take screenshot
        const screenshotPath = `screenshots/blog/posts/${post.slug}.png`;
        await page.screenshot({ 
          path: screenshotPath,
          fullPage: true 
        });
        console.log(`Screenshot saved: ${screenshotPath}`);
        
        // Extract post metadata and content
        const postData = await page.evaluate(() => {
          const getMetaContent = (name) => {
            const tag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
            return tag ? tag.getAttribute('content') : null;
          };
          
          // Check for MDX features
          const contentArea = document.querySelector('article, main, [class*="content"], [class*="prose"]');
          const mdxFeatures = {
            codeBlocks: !!contentArea?.querySelector('pre code, [class*="hljs"], [class*="prism"]'),
            headings: !!contentArea?.querySelector('h1, h2, h3, h4, h5, h6'),
            lists: !!contentArea?.querySelector('ul, ol'),
            links: !!contentArea?.querySelector('a'),
            images: !!contentArea?.querySelector('img'),
            blockquotes: !!contentArea?.querySelector('blockquote')
          };
          
          // Get actual rendered content info
          const title = document.querySelector('h1')?.textContent?.trim();
          const author = document.querySelector('[class*="author"], [itemprop="author"]')?.textContent?.trim();
          const date = document.querySelector('time, [class*="date"]')?.textContent?.trim();
          const readingTime = document.querySelector('[class*="reading-time"], [class*="read-time"]')?.textContent?.trim();
          
          // Count interactive elements
          const interactiveElements = {
            buttons: contentArea?.querySelectorAll('button').length || 0,
            forms: contentArea?.querySelectorAll('form').length || 0,
            inputs: contentArea?.querySelectorAll('input, textarea').length || 0
          };
          
          return {
            seo: {
              title: document.title,
              description: getMetaContent('description'),
              ogTitle: getMetaContent('og:title'),
              ogDescription: getMetaContent('og:description'),
              ogImage: getMetaContent('og:image'),
              articlePublishedTime: getMetaContent('article:published_time'),
              articleAuthor: getMetaContent('article:author')
            },
            metadata: {
              title,
              author,
              date,
              readingTime
            },
            mdxFeatures,
            interactiveElements,
            hasTableOfContents: !!document.querySelector('[class*="toc"], [class*="table-of-contents"]'),
            hasSocialShare: !!document.querySelector('[class*="share"], [class*="social"]')
          };
        });
        
        postReport.seo = postData.seo;
        postReport.metadata = postData.metadata;
        postReport.mdxFeatures = postData.mdxFeatures;
        postReport.interactiveElements = postData.interactiveElements;
        postReport.hasTableOfContents = postData.hasTableOfContents;
        postReport.hasSocialShare = postData.hasSocialShare;
        
        // Update overall MDX rendering status
        if (postData.mdxFeatures.codeBlocks) blogReport.mdxRendering.codeBlocks = true;
        if (postData.mdxFeatures.headings && postData.mdxFeatures.lists) blogReport.mdxRendering.formatting = true;
        if (postData.mdxFeatures.images) blogReport.mdxRendering.images = true;
        
      } catch (error) {
        console.error(`Error testing post ${post.title}:`, error);
        postReport.error = error.message;
      }
      
      blogReport.individualPosts.push(postReport);
    }
    
    // Test pagination/filtering if present
    await page.goto('http://localhost:3000/blog', { waitUntil: 'networkidle' });
    const paginationInfo = await page.evaluate(() => {
      const pagination = document.querySelector('[class*="pagination"], [aria-label*="pagination"]');
      const filters = document.querySelectorAll('[class*="filter"], [class*="category"], [class*="tag"]');
      const search = document.querySelector('input[type="search"], [class*="search"]');
      
      return {
        hasPagination: !!pagination,
        paginationButtons: pagination ? pagination.querySelectorAll('a, button').length : 0,
        hasFilters: filters.length > 0,
        filterCount: filters.length,
        hasSearch: !!search
      };
    });
    blogReport.blogListingPage.features = paginationInfo;
    
    // User experience assessment
    blogReport.userExperience = {
      navigation: paginationInfo.hasPagination || paginationInfo.hasFilters ? 
        'Good - includes pagination/filtering' : 'Basic - simple list view',
      readability: blogPosts.length > 0 && blogPosts[0].excerpt ? 
        'Excellent - clear titles and excerpts' : 'Good - titles visible',
      interactivity: blogReport.individualPosts.some(p => p.interactiveElements?.buttons > 0) ?
        'Interactive elements present' : 'Static content only'
    };
    
    // Save detailed report
    await fs.writeFile(
      'blog-test-report.json',
      JSON.stringify(blogReport, null, 2)
    );
    console.log('\nDetailed report saved to blog-test-report.json');
    
    // Generate summary report
    const summary = generateSummaryReport(blogReport);
    await fs.writeFile('blog-test-summary.md', summary);
    console.log('Summary report saved to blog-test-summary.md');
    
  } catch (error) {
    console.error('Error during blog testing:', error);
    blogReport.error = error.message;
  } finally {
    await browser.close();
  }
  
  return blogReport;
}

function generateSummaryReport(report) {
  const posts = report.individualPosts;
  const listing = report.blogListingPage;
  
  let summary = `# Blog System Test Report
Generated: ${new Date(report.timestamp).toLocaleString()}

## Blog Post Inventory

Found ${listing.posts.length} blog posts:

`;

  listing.posts.forEach((post, index) => {
    summary += `### ${index + 1}. ${post.title}
- URL: ${post.url}
- Slug: ${post.slug}
- Author: ${post.author || 'Not specified'}
- Date: ${post.date || 'Not specified'}
- Reading Time: ${post.readingTime || 'Not specified'}
- Excerpt: ${post.excerpt ? post.excerpt.substring(0, 100) + '...' : 'No excerpt'}

`;
  });

  summary += `## MDX Rendering Quality Assessment

`;

  const mdxFeaturesSummary = posts.reduce((acc, post) => {
    Object.keys(post.mdxFeatures || {}).forEach(feature => {
      if (post.mdxFeatures[feature]) {
        acc[feature] = (acc[feature] || 0) + 1;
      }
    });
    return acc;
  }, {});

  Object.entries(mdxFeaturesSummary).forEach(([feature, count]) => {
    summary += `- **${feature}**: Found in ${count}/${posts.length} posts\n`;
  });

  summary += `
## SEO Implementation Review

### Blog Listing Page
- Title: ${listing.seo.title || 'Not set'}
- Description: ${listing.seo.description || 'Not set'}
- OG Title: ${listing.seo.ogTitle || 'Not set'}
- OG Description: ${listing.seo.ogDescription || 'Not set'}
- OG Image: ${listing.seo.ogImage ? 'Present' : 'Missing'}
- Canonical URL: ${listing.seo.canonical || 'Not set'}

### Individual Posts SEO
`;

  posts.forEach(post => {
    if (post.seo) {
      summary += `
#### ${post.title}
- Title Tag: ${post.seo.title ? '✓' : '✗'}
- Meta Description: ${post.seo.description ? '✓' : '✗'}
- OG Tags: ${post.seo.ogTitle ? '✓' : '✗'}
- Article Metadata: ${post.seo.articlePublishedTime ? '✓' : '✗'}
`;
    }
  });

  summary += `
## User Experience Observations

- **Navigation**: ${report.userExperience.navigation}
- **Readability**: ${report.userExperience.readability}
- **Interactivity**: ${report.userExperience.interactivity}

### Blog Listing Features
- Pagination: ${listing.features?.hasPagination ? 'Yes' : 'No'}
- Filters: ${listing.features?.hasFilters ? `Yes (${listing.features.filterCount} filters)` : 'No'}
- Search: ${listing.features?.hasSearch ? 'Yes' : 'No'}

## Performance

### Blog Listing Page
- Load Time: ${listing.performance.loadTime}

### Individual Post Load Times
`;

  posts.forEach(post => {
    if (post.performance?.loadTime) {
      summary += `- ${post.title}: ${post.performance.loadTime}\n`;
    }
  });

  summary += `
## Screenshots Generated

- Blog listing: screenshots/blog/listing.png
`;

  posts.forEach(post => {
    summary += `- ${post.title}: screenshots/blog/posts/${post.slug}.png\n`;
  });

  return summary;
}

// Run the test
testBlogSystem()
  .then(() => console.log('\nBlog system test completed!'))
  .catch(console.error);