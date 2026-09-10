import { test, expect } from '@playwright/test';

test.describe('Love Test User Journey', () => {
  test('should complete the love test and navigate to surprises', async ({ page }) => {
    // 1. Navigate to the app
    await page.goto('http://localhost:3000/');

    // 2. Verify initial state
    await expect(page.locator('text=How much do you love me?')).toBeVisible();
    
    // 3. Find the slider and drag it to 200%
    const slider = page.locator('input[type="range"]');
    await slider.evaluate((node) => {
      const input = node as HTMLInputElement;
      input.value = "200";
      node.dispatchEvent(new Event('input', { bubbles: true }));
      node.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // 4. Verify 200% state
    await expect(page.locator('text=200%')).toBeVisible();
    await expect(page.locator('text=Correct answer!')).toBeVisible();

    // 5. Click the Next button
    const nextButton = page.locator('text=Next ->');
    await expect(nextButton).toBeVisible();
    await nextButton.click();

    // 6. Verify we arrived at the Gift Hub
    await expect(page).toHaveURL(/.*\/hub/);
    await expect(page.locator('text=You passed the love test')).toBeVisible();
  });
});
