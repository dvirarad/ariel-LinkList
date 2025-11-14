const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--disable-dev-shm-usage', '--no-sandbox'] });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleMessages = [];
  const pageErrors = [];

  page.on('console', msg => {
    const text = `[${msg.type()}] ${msg.text()}`;
    consoleMessages.push(text);
    console.log('CONSOLE:', text);
  });

  page.on('pageerror', err => {
    pageErrors.push(err.message);
    console.log('PAGE ERROR:', err.message);
    console.log('Stack:', err.stack);
  });

  page.on('crash', () => {
    console.log('PAGE CRASHED!');
    console.log('Console messages:', consoleMessages);
    console.log('Page errors:', pageErrors);
  });

  try {
    await page.goto('http://localhost:8080/', { waitUntil: 'domcontentloaded', timeout: 10000 });
    console.log('Page loaded successfully!');
    const title = await page.title();
    console.log('Page title:', title);

    // Wait a bit to see if there are any runtime errors
    await page.waitForTimeout(1000);

  } catch (e) {
    console.log('Error loading page:', e.message);
    console.log('All console messages:', consoleMessages);
    console.log('All page errors:', pageErrors);
  }

  await browser.close();
})();
