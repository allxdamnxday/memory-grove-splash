// windows-chrome-mcp.js
#!/usr/bin/env node
const { spawn } = require('child_process');

// Set environment to use Windows Chrome
process.env.PUPPETEER_CONNECT_URL = 'ws://127.0.0.1:9222';
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';

console.error('Connecting to Windows Chrome on port 9222...');

const child = spawn('npx', ['-y', '@modelcontextprotocol/server-puppeteer'], {
  stdio: 'inherit',
  env: process.env
});

child.on('exit', (code) => {
  process.exit(code || 0);
});