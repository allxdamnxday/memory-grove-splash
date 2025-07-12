const chromium = require("@sparticuz/chromium");
const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log("Getting Chromium executable path...");
        const executablePath = await chromium.executablePath();
        console.log("Executable path:", executablePath);
        
        console.log("Launching browser...");
        const browser = await puppeteer.launch({
            executablePath: executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
            defaultViewport: chromium.defaultViewport,
            args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        });
        
        console.log("Browser launched successfully!");
        
        // Test navigation
        const page = await browser.newPage();
        await page.goto('http://localhost:3000');
        console.log("Page loaded successfully!");
        
        // Take a screenshot as proof it works
        await page.screenshot({ path: 'test-screenshot.png' });
        console.log("Screenshot saved as test-screenshot.png");
        
        await browser.close();
        console.log("Browser closed successfully!");
    } catch (err) {
        console.error("Error occurred:", err);
        process.exit(1);
    }
})();