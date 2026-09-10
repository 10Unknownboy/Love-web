import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Users\\HP\\AppData\\Local\\ms-playwright\\chromium-1234\\chrome-win64\\chrome.exe',
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  const hiddenInput = page.locator('[data-testid="love-slider-input"]');

  await hiddenInput.evaluate((el: HTMLInputElement) => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    )?.set;
    nativeInputValueSetter?.call(el, '350');
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const badge = await page.locator('[data-testid="percentage-badge"]').textContent();
  console.log('After setting input to 350, badge is:', badge);

  await browser.close();
}

main().catch(console.error);
