import { chromium, Browser, Page } from '@playwright/test';

interface TestStep {
  name: string;
  run: (page: Page) => Promise<void>;
}

async function runBrowserChallenge() {
  console.log('=====================================================');
  console.log('CHALLENGER: Playwright Headless Browser Test Suite');
  console.log('=====================================================\n');

  const chromePath = 'C:\\Users\\HP\\AppData\\Local\\ms-playwright\\chromium-1234\\chrome-win64\\chrome.exe';
  const browser: Browser = await chromium.launch({
    headless: true,
    executablePath: chromePath,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();

  let passedCount = 0;
  let failedCount = 0;

  async function step(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passedCount++;
    } catch (err: any) {
      console.error(`❌ FAIL: ${name}`);
      console.error(`   Reason: ${err.message}`);
      failedCount++;
    }
  }

  try {
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Step 1: Initial State Check
    await step('1. Initial State: 0%, shy cat, no Next button', async () => {
      const badgeText = await page.locator('[data-testid="percentage-badge"]').textContent();
      if (!badgeText?.includes('0%')) throw new Error(`Expected 0%, got: ${badgeText}`);

      const reactionText = await page.locator('[data-testid="threshold-copy"]').textContent();
      if (!reactionText?.includes('Only that much?')) throw new Error(`Expected 'Only that much?', got: ${reactionText}`);

      // Check cat-state-shy is visible (opacity 1)
      const shyOpacity = await page.locator('[data-testid="cat-state-shy"]').evaluate((el) => {
        return window.getComputedStyle(el).opacity;
      });
      if (shyOpacity !== '1') throw new Error(`Expected shy cat opacity 1, got: ${shyOpacity}`);

      // Check crying cat is hidden (opacity 0)
      const cryingOpacity = await page.locator('[data-testid="cat-state-crying"]').evaluate((el) => {
        return window.getComputedStyle(el).opacity;
      });
      if (cryingOpacity !== '0') throw new Error(`Expected crying cat opacity 0, got: ${cryingOpacity}`);

      // Next button should NOT exist
      const nextBtnCount = await page.locator('[data-testid="next-button"]').count();
      if (nextBtnCount !== 0) throw new Error(`Next button should not be present at 0%`);

      // Slider aria attributes
      const slider = page.locator('[role="slider"]');
      const valNow = await slider.getAttribute('aria-valuenow');
      if (valNow !== '0') throw new Error(`Expected aria-valuenow="0", got: ${valNow}`);
    });

    // Step 2: Mouse Drag to 14%
    await step('2. Mouse Drag to 14%: crying cat, "Half? Seriously?"', async () => {
      const track = page.locator('[data-testid="slider-track"]');
      const box = await track.boundingBox();
      if (!box) throw new Error('Could not find slider track bounding box');

      const startX = box.x;
      const target14X = box.x + box.width * 0.14;
      const centerY = box.y + box.height / 2;

      await page.mouse.move(startX, centerY);
      await page.mouse.down();
      await page.mouse.move(target14X, centerY, { steps: 5 });

      const badgeText = await page.locator('[data-testid="percentage-badge"]').textContent();
      if (!badgeText?.includes('14%')) throw new Error(`Expected 14%, got: ${badgeText}`);

      const reactionText = await page.locator('[data-testid="threshold-copy"]').textContent();
      if (!reactionText?.includes('Half? Seriously?')) throw new Error(`Expected 'Half? Seriously?', got: ${reactionText}`);

      const cryingOpacity = await page.locator('[data-testid="cat-state-crying"]').evaluate((el) => {
        return window.getComputedStyle(el).opacity;
      });
      if (cryingOpacity !== '1') throw new Error(`Expected crying cat opacity 1, got: ${cryingOpacity}`);
    });

    // Step 3: Mouse Drag to 55%
    await step('3. Mouse Drag to 55%: confused cat, "Aww, that\'s more like it!"', async () => {
      const track = page.locator('[data-testid="slider-track"]');
      const box = await track.boundingBox();
      if (!box) throw new Error('Missing box');

      const target55X = box.x + box.width * 0.55;
      const centerY = box.y + box.height / 2;

      await page.mouse.move(target55X, centerY, { steps: 5 });

      const badgeText = await page.locator('[data-testid="percentage-badge"]').textContent();
      if (!badgeText?.includes('55%')) throw new Error(`Expected 55%, got: ${badgeText}`);

      const reactionText = await page.locator('[data-testid="threshold-copy"]').textContent();
      if (!reactionText?.includes("Aww, that's more like it!")) throw new Error(`Expected "Aww, that's more like it!", got: ${reactionText}`);

      const confusedOpacity = await page.locator('[data-testid="cat-state-confused"]').evaluate((el) => {
        return window.getComputedStyle(el).opacity;
      });
      if (confusedOpacity !== '1') throw new Error(`Expected confused cat opacity 1, got: ${confusedOpacity}`);
    });

    // Step 4: Mouse Drag to 81%
    await step('4. Mouse Drag to 81%: happy cat, "love"', async () => {
      const track = page.locator('[data-testid="slider-track"]');
      const box = await track.boundingBox();
      if (!box) throw new Error('Missing box');

      const target81X = box.x + box.width * 0.81;
      const centerY = box.y + box.height / 2;

      await page.mouse.move(target81X, centerY, { steps: 5 });

      const badgeText = await page.locator('[data-testid="percentage-badge"]').textContent();
      if (!badgeText?.includes('81%')) throw new Error(`Expected 81%, got: ${badgeText}`);

      const reactionText = await page.locator('[data-testid="threshold-copy"]').textContent();
      if (!reactionText?.includes('love')) throw new Error(`Expected 'love', got: ${reactionText}`);

      const happyOpacity = await page.locator('[data-testid="cat-state-happy"]').evaluate((el) => {
        return window.getComputedStyle(el).opacity;
      });
      if (happyOpacity !== '1') throw new Error(`Expected happy cat opacity 1, got: ${happyOpacity}`);
    });

    // Step 5: Overdrive Drag to 500%
    await step('5. Overdrive Drag past track to 500%: ecstatic cat, "Correct answer!", Next button appears', async () => {
      const track = page.locator('[data-testid="slider-track"]');
      const box = await track.boundingBox();
      if (!box) throw new Error('Missing box');

      // 160px is W_OVERDRIVE past track right edge
      const target500X = box.x + box.width + 160;
      const centerY = box.y + box.height / 2;

      await page.mouse.move(target500X, centerY, { steps: 10 });

      const badgeText = await page.locator('[data-testid="percentage-badge"]').textContent();
      if (!badgeText?.includes('500%')) throw new Error(`Expected 500%, got: ${badgeText}`);

      const reactionText = await page.locator('[data-testid="threshold-copy"]').textContent();
      if (!reactionText?.includes('Correct answer!')) throw new Error(`Expected 'Correct answer!', got: ${reactionText}`);

      const ecstaticOpacity = await page.locator('[data-testid="cat-state-ecstatic"]').evaluate((el) => {
        return window.getComputedStyle(el).opacity;
      });
      if (ecstaticOpacity !== '1') throw new Error(`Expected ecstatic cat opacity 1, got: ${ecstaticOpacity}`);

      // Next button should now appear
      const nextBtn = page.locator('[data-testid="next-button"]');
      await nextBtn.waitFor({ state: 'visible', timeout: 2000 });
      const nextBtnText = await nextBtn.textContent();
      if (!nextBtnText?.includes('Next')) throw new Error(`Next button text mismatch: ${nextBtnText}`);
    });

    // Step 6: Overdrag to 550%+ (e.g. +100px past 500%)
    await step('6. Overdrag to 550%+: strictly clamped to 500%', async () => {
      const track = page.locator('[data-testid="slider-track"]');
      const box = await track.boundingBox();
      if (!box) throw new Error('Missing box');

      const targetOverdragX = box.x + box.width + 160 + 100;
      const centerY = box.y + box.height / 2;

      await page.mouse.move(targetOverdragX, centerY, { steps: 5 });

      const badgeText = await page.locator('[data-testid="percentage-badge"]').textContent();
      if (badgeText?.trim() !== '500% love' && !badgeText?.includes('500%')) {
        throw new Error(`Overdrag violated clamp! Badge text: ${badgeText}`);
      }

      // Check aria-valuenow is strictly 500
      const ariaNow = await page.locator('[role="slider"]').getAttribute('aria-valuenow');
      if (ariaNow !== '500') throw new Error(`Expected aria-valuenow="500", got: ${ariaNow}`);

      // Check hidden input value is 500
      const hiddenVal = await page.locator('[data-testid="love-slider-input"]').inputValue();
      if (hiddenVal !== '500') throw new Error(`Expected hidden input value="500", got: ${hiddenVal}`);

      // Release mouse
      await page.mouse.up();
    });

    // Step 7: Pointer Capture Verification (dragging far off-axis vertically)
    await step('7. Pointer Capture: dragging 300px vertically off-axis maintains control', async () => {
      const thumb = page.locator('[data-testid="slider-thumb"]');
      const thumbBox = await thumb.boundingBox();
      if (!thumbBox) throw new Error('Missing thumb box');

      // Click thumb and drag far above track (y - 300px)
      await page.mouse.move(thumbBox.x + thumbBox.width / 2, thumbBox.y + thumbBox.height / 2);
      await page.mouse.down();

      const track = page.locator('[data-testid="slider-track"]');
      const box = await track.boundingBox();
      if (!box) throw new Error('Missing box');

      // Drag to 55% horizontal position, but 200px ABOVE track
      const targetX = box.x + box.width * 0.55;
      const farAboveY = box.y - 200;

      await page.mouse.move(targetX, farAboveY, { steps: 5 });

      const badgeText = await page.locator('[data-testid="percentage-badge"]').textContent();
      if (!badgeText?.includes('55%')) {
        throw new Error(`Pointer capture failed when cursor was far above track! Badge text: ${badgeText}`);
      }

      await page.mouse.up();
    });

    // Step 8: Latching Behavior Verification
    await step('8. Latching Check: Next button remains visible when dragging down to 14%', async () => {
      const track = page.locator('[data-testid="slider-track"]');
      const box = await track.boundingBox();
      if (!box) throw new Error('Missing box');

      const target14X = box.x + box.width * 0.14;
      const centerY = box.y + box.height / 2;

      await page.mouse.move(target14X, centerY);
      await page.mouse.down();
      await page.mouse.up();

      const badgeText = await page.locator('[data-testid="percentage-badge"]').textContent();
      if (!badgeText?.includes('14%')) throw new Error(`Expected 14%, got: ${badgeText}`);

      // Next button MUST still be visible because unlock latches
      const nextBtn = page.locator('[data-testid="next-button"]');
      const isVisible = await nextBtn.isVisible();
      if (!isVisible) throw new Error('Unlock latching failed! Next button disappeared when value dropped below 500%');
    });

    // Step 9: Keyboard Navigation
    await step('9. Keyboard Navigation: Home, End, ArrowRight, PageUp clamping', async () => {
      const slider = page.locator('[role="slider"]');
      await slider.focus();

      // Press Home -> should jump to 0%
      await page.keyboard.press('Home');
      let val = await slider.getAttribute('aria-valuenow');
      if (val !== '0') throw new Error(`Home failed, aria-valuenow: ${val}`);

      // ArrowRight -> should add 5%
      await page.keyboard.press('ArrowRight');
      val = await slider.getAttribute('aria-valuenow');
      if (val !== '5') throw new Error(`ArrowRight failed, aria-valuenow: ${val}`);

      // Shift+ArrowRight -> should add 1%
      await page.keyboard.press('Shift+ArrowRight');
      val = await slider.getAttribute('aria-valuenow');
      if (val !== '6') throw new Error(`Shift+ArrowRight failed, aria-valuenow: ${val}`);

      // PageUp -> should add 50% (56%)
      await page.keyboard.press('PageUp');
      val = await slider.getAttribute('aria-valuenow');
      if (val !== '56') throw new Error(`PageUp failed, aria-valuenow: ${val}`);

      // End -> should jump to 500%
      await page.keyboard.press('End');
      val = await slider.getAttribute('aria-valuenow');
      if (val !== '500') throw new Error(`End failed, aria-valuenow: ${val}`);

      // ArrowRight 5 times from 500 -> should remain clamped at 500%
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('ArrowRight');
      }
      val = await slider.getAttribute('aria-valuenow');
      if (val !== '500') throw new Error(`ArrowRight past 500 overstepped clamp! aria-valuenow: ${val}`);
    });

    // Step 10: Synchronized Input Event
    await step('10. Synchronized Hidden Range Input: set to 350 and 500', async () => {
      const hiddenInput = page.locator('[data-testid="love-slider-input"]');

      // Dispatch change event to set 350
      await hiddenInput.evaluate((el: HTMLInputElement) => {
        el.value = '350';
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });

      let badgeText = await page.locator('[data-testid="percentage-badge"]').textContent();
      if (!badgeText?.includes('350%')) throw new Error(`Sync input 350 failed, badge: ${badgeText}`);

      // Set to 500
      await hiddenInput.evaluate((el: HTMLInputElement) => {
        el.value = '500';
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });

      badgeText = await page.locator('[data-testid="percentage-badge"]').textContent();
      if (!badgeText?.includes('500%')) throw new Error(`Sync input 500 failed, badge: ${badgeText}`);
    });

    // Step 11: Navigation Transition to Gift Hub
    await step('11. Navigation: Clicking Next button transitions to /hub', async () => {
      const nextBtn = page.locator('[data-testid="next-button"]');
      await nextBtn.click();
      await page.waitForURL('**/hub', { timeout: 4000 });

      const currentUrl = page.url();
      if (!currentUrl.endsWith('/hub')) throw new Error(`Expected URL to end with /hub, got: ${currentUrl}`);
      console.log(`   Successfully navigated to: ${currentUrl}`);
    });

  } finally {
    await browser.close();
  }

  console.log('\n=====================================================');
  console.log(`BROWSER CHALLENGE SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log('=====================================================');

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runBrowserChallenge().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
