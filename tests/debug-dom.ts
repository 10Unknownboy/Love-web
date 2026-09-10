import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Users\\HP\\AppData\\Local\\ms-playwright\\chromium-1234\\chrome-win64\\chrome.exe',
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  console.log('--- Initial State ---');
  const shyClass = await page.locator('[data-testid="cat-state-shy"]').getAttribute('class');
  const cryingClass = await page.locator('[data-testid="cat-state-crying"]').getAttribute('class');
  const shyOpacity = await page.locator('[data-testid="cat-state-shy"]').evaluate(el => window.getComputedStyle(el).opacity);
  const cryingOpacity = await page.locator('[data-testid="cat-state-crying"]').evaluate(el => window.getComputedStyle(el).opacity);
  console.log('Shy class:', shyClass);
  console.log('Shy computed opacity:', shyOpacity);
  console.log('Crying class:', cryingClass);
  console.log('Crying computed opacity:', cryingOpacity);

  // Press ArrowRight 3 times (value becomes 15%)
  const slider = page.locator('[role="slider"]');
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');

  console.log('\n--- After 3 ArrowRight (15%) ---');
  const badge = await page.locator('[data-testid="percentage-badge"]').textContent();
  const cryingClassAfter = await page.locator('[data-testid="cat-state-crying"]').getAttribute('class');
  const cryingOpacityImmediate = await page.locator('[data-testid="cat-state-crying"]').evaluate(el => window.getComputedStyle(el).opacity);
  console.log('Badge text:', badge);
  console.log('Crying class after:', cryingClassAfter);
  console.log('Crying computed opacity immediate:', cryingOpacityImmediate);

  await page.waitForTimeout(150); // wait for duration-75 transition
  const cryingOpacityAfterDelay = await page.locator('[data-testid="cat-state-crying"]').evaluate(el => window.getComputedStyle(el).opacity);
  console.log('Crying computed opacity after 150ms delay:', cryingOpacityAfterDelay);

  await browser.close();
}

main().catch(console.error);
