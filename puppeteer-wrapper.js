#!/usr/bin/env node
const chromium = require("@sparticuz/chromium");
const { spawn } = require('child_process');

(async () => {
    try {
        // Check what methods are available
        console.error("Available chromium methods:", Object.keys(chromium));
        
        // Try different ways to get the executable path
        let execPath;
        
        // Method 1: Direct property
        if (chromium.executablePath && typeof chromium.executablePath === 'string') {
            execPath = chromium.executablePath;
            console.error("Using direct property:", execPath);
        }
        // Method 2: Function call (older versions)
        else if (typeof chromium.executablePath === 'function') {
            execPath = await chromium.executablePath();
            console.error("Using function call:", execPath);
        }
        // Method 3: Default property
        else if (chromium.path) {
            execPath = chromium.path;
            console.error("Using path property:", execPath);
        }
        // Method 4: Puppeteer's bundled chromium
        else {
            console.error("Falling back to puppeteer's chromium");
            execPath = undefined; // Let puppeteer use its default
        }
        
        // Set environment variables
        if (execPath) {
            process.env.PUPPETEER_EXECUTABLE_PATH = execPath;
        }
        
        // Use chromium args if available
        const args = chromium.args || [];
        process.env.PUPPETEER_ARGS = JSON.stringify([
            ...args,
            "--hide-scrollbars",
            "--disable-web-security",
            "--no-sandbox",
            "--disable-setuid-sandbox"
        ]);
        
        console.error("Launching MCP server...");
        
        // Launch the actual MCP server
        const child = spawn('npx', ['-y', '@modelcontextprotocol/server-puppeteer'], {
            stdio: 'inherit',
            env: process.env
        });
        
        child.on('error', (error) => {
            console.error("Failed to start MCP server:", error);
            process.exit(1);
        });
        
        child.on('exit', (code) => {
            process.exit(code || 0);
        });
        
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
})();