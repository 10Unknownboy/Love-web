import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Users\\HP\\AppData\\Local\\ms-playwright\\chromium-1234\\chrome-win64\\chrome.exe',
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  const sliderBox = await page.locator('[role="slider"]').boundingBox();
  const trackBox = await page.locator('[data-testid="slider-track"]').boundingBox();
  console.log('role="slider" box:', sliderBox);
  console.log('slider-track box:', trackBox);

  await browser.close();
}

main().catch(console.error);
