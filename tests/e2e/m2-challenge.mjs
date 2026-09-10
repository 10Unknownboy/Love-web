import { chromium } from '@playwright/test';

async function runM2Challenge() {
  console.log('--- Starting Empirical Challenge for Milestone 2 ---');

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();
  const baseUrl = 'http://localhost:3000';

  const results = {
    lockedBelow500: false,
    thresholdChecks: [],
    unlocksAt500: false,
    hasUnlockAnimation: false,
    navigatesToHub: false,
    decorativePointerEventsNone: false,
    dragNotObstructed: false,
    reverseScrubbingPreservesUnlock: false,
    keyboardAccessible: false,
  };

  try {
    // 1. Navigate to home
    console.log(`[Test 1] Loading ${baseUrl}...`);
    await page.goto(baseUrl, { waitUntil: 'networkidle' });

    // Verify initial state
    const initialHeading = await page.locator('[data-testid="main-heading"]').innerText();
    console.log(`Initial Heading: "${initialHeading}"`);

    // Verify decorative graphics have pointer-events-none
    console.log('[Test 2] Checking decorative graphics pointer-events...');
    const airplane = page.locator('img[alt*="Paper Airplane"]').locator('xpath=ancestor::div[contains(@class, "pointer-events-none")]');
    const birds = page.locator('img[alt*="Two sweet kissing lovebirds"]').locator('xpath=ancestor::div[contains(@class, "pointer-events-none")]');
    
    const airplaneCount = await airplane.count();
    const birdsCount = await birds.count();
    const airplanePE = await page.locator('img[alt*="Paper Airplane"]').evaluate(el => window.getComputedStyle(el).pointerEvents);
    const birdsPE = await page.locator('img[alt*="Two sweet kissing lovebirds"]').evaluate(el => window.getComputedStyle(el).pointerEvents);

    console.log(`Airplane ancestor pointer-events-none count: ${airplaneCount}, computed: ${airplanePE}`);
    console.log(`Birds ancestor pointer-events-none count: ${birdsCount}, computed: ${birdsPE}`);

    if (airplanePE === 'none' && birdsPE === 'none') {
      results.decorativePointerEventsNone = true;
      console.log('✓ Decorative graphics have pointer-events: none');
    } else {
      console.error(`✗ Decorative graphics pointer-events failed: airplane=${airplanePE}, birds=${birdsPE}`);
    }

    // 2. Check "Next ->" is locked below 500% across multiple thresholds
    console.log('[Test 3] Checking Next button is locked below 500%...');
    const testThresholds = [0, 14, 55, 81, 100, 250, 499];
    let allLockedBelow500 = true;

    for (const val of testThresholds) {
      await page.locator('[data-testid="love-slider-input"]').fill(String(val));
      // Dispatch change event to trigger state updates
      await page.locator('[data-testid="love-slider-input"]').dispatchEvent('change');
      await page.waitForTimeout(50);

      const nextBtnCount = await page.locator('[data-testid="next-button"]').count();
      const currentPct = await page.locator('[data-testid="percentage-badge"]').innerText();
      const copy = await page.locator('[data-testid="threshold-copy"]').innerText();

      console.log(`  Value: ${val}% -> Display: ${currentPct.trim()} | Copy: "${copy}" | Next button present: ${nextBtnCount > 0}`);

      if (nextBtnCount > 0) {
        allLockedBelow500 = false;
        console.error(`✗ Next button leaked at ${val}%!`);
      }
      results.thresholdChecks.push({ val, display: currentPct.trim(), copy, nextPresent: nextBtnCount > 0 });
    }

    results.lockedBelow500 = allLockedBelow500;
    if (allLockedBelow500) {
      console.log('✓ Next button remains strictly locked/hidden at all values < 500%');
    }

    // 3. Unlock at 500%
    console.log('[Test 4] Triggering 500% unlock...');
    await page.locator('[data-testid="love-slider-input"]').fill('500');
    await page.locator('[data-testid="love-slider-input"]').dispatchEvent('change');
    await page.waitForTimeout(100);

    const nextBtn = page.locator('[data-testid="next-button"]');
    const isNextVisible = await nextBtn.isVisible();
    console.log(`Next button visible at 500%: ${isNextVisible}`);

    if (isNextVisible) {
      results.unlocksAt500 = true;
      console.log('✓ Next button unlocked at 500%');

      // Check animation class
      const classList = await nextBtn.getAttribute('class');
      console.log(`Next button classes: "${classList}"`);
      if (classList && classList.includes('animate-unlock-reveal')) {
        results.hasUnlockAnimation = true;
        console.log('✓ Next button has animate-unlock-reveal class');
      } else {
        console.error('✗ Next button missing animate-unlock-reveal class');
      }
    } else {
      console.error('✗ Next button failed to become visible at 500%');
    }

    // 4. Reverse scrubbing: does unlock state persist when moving backwards?
    console.log('[Test 5] Reverse scrubbing check (does unlock stay latched?)...');
    await page.locator('[data-testid="love-slider-input"]').fill('55');
    await page.locator('[data-testid="love-slider-input"]').dispatchEvent('change');
    await page.waitForTimeout(50);
    const nextBtnAfterReverse = await page.locator('[data-testid="next-button"]').isVisible();
    console.log(`Next button visible after reverse drag to 55%: ${nextBtnAfterReverse}`);
    results.reverseScrubbingPreservesUnlock = nextBtnAfterReverse;

    // 5. Test physical pointer drag past track limit (Overdrive breakout)
    console.log('[Test 6] Testing actual physical mouse drag past physical bounds...');
    await page.goto(baseUrl, { waitUntil: 'networkidle' }); // fresh reload
    const sliderTrack = page.locator('[data-testid="slider-track"]');
    const trackBox = await sliderTrack.boundingBox();
    if (trackBox) {
      // Start drag at left edge of track
      await page.mouse.move(trackBox.x + 2, trackBox.y + trackBox.height / 2);
      await page.mouse.down();
      // Drag past the right end by 200px (into overdrive zone)
      await page.mouse.move(trackBox.x + trackBox.width + 200, trackBox.y + trackBox.height / 2, { steps: 20 });
      await page.mouse.up();
      await page.waitForTimeout(100);

      const valAfterDrag = await page.locator('[data-testid="percentage-badge"]').innerText();
      const nextVisibleAfterDrag = await page.locator('[data-testid="next-button"]').isVisible();
      console.log(`Physical drag past track boundary: Final Badge = ${valAfterDrag.trim()}, Next visible = ${nextVisibleAfterDrag}`);
      if (valAfterDrag.includes('500%') && nextVisibleAfterDrag) {
        results.dragNotObstructed = true;
        console.log('✓ Physical mouse drag past track boundary reaches 500% and unlocks Next button');
      } else {
        console.error(`✗ Physical drag failed to reach 500%: got ${valAfterDrag}`);
      }
    }

    // 6. Test Navigation to /hub
    console.log('[Test 7] Testing navigation to /hub via Next button click...');
    const nextButton = page.locator('[data-testid="next-button"]');
    await nextButton.click();
    await page.waitForURL('**/hub', { timeout: 5000 });

    const currentUrl = page.url();
    const hubHeading = await page.locator('h1').innerText();
    console.log(`Navigated URL: ${currentUrl}`);
    console.log(`Hub Heading: "${hubHeading}"`);

    if (currentUrl.includes('/hub') && hubHeading.includes('You passed the love test')) {
      results.navigatesToHub = true;
      console.log('✓ Next button navigates to /hub with expected content');
    } else {
      console.error(`✗ Navigation check failed: URL=${currentUrl}, heading=${hubHeading}`);
    }

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    await browser.close();
  }

  console.log('\n--- Empirical Challenge Summary ---');
  console.log(JSON.stringify(results, null, 2));

  const allPassed =
    results.lockedBelow500 &&
    results.unlocksAt500 &&
    results.hasUnlockAnimation &&
    results.navigatesToHub &&
    results.decorativePointerEventsNone &&
    results.dragNotObstructed;

  console.log(`\nOVERALL VERDICT: ${allPassed ? 'CONFIRMED' : 'REJECTED'}`);
  process.exit(allPassed ? 0 : 1);
}

runM2Challenge();
