import { chromium } from '@playwright/test';
import { spawn } from 'child_process';

const PORT = 3003;
const BASE_URL = `http://localhost:${PORT}`;

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runChallengerTests() {
  console.log('=====================================================');
  console.log('  MILESTONE 3 EMPIRICAL CHALLENGER VERIFICATION');
  console.log(`  Target: ${BASE_URL}`);
  console.log('=====================================================\n');

  console.log(`Starting Next.js dev server on port ${PORT}...`);
  const server = spawn('npx', ['next', 'dev', '-p', String(PORT)], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'pipe',
  });

  server.stdout.on('data', () => {});
  server.stderr.on('data', () => {});

  let serverReady = false;
  for (let i = 0; i < 60; i++) {
    await wait(1000);
    try {
      const res = await fetch(`${BASE_URL}/hub`);
      if (res.status === 200) {
        serverReady = true;
        break;
      }
    } catch {
      // still booting
    }
  }

  if (!serverReady) {
    try {
      if (server.pid) spawn('taskkill', ['/pid', String(server.pid), '/f', '/t']);
    } catch {}
    throw new Error(`Server failed to start and respond on port ${PORT} within 60s`);
  }
  console.log(`Server is ready and responding at ${BASE_URL}\n`);

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();

  const testResults = {
    hubRoute: { passed: false, details: [] },
    surprise1Route: { passed: false, details: [] },
    surprise2Route: { passed: false, details: [] },
    surprise3Route: { passed: false, details: [] },
    fullNavigationLoop: { passed: false, details: [] },
    mobileResponsiveness: { passed: false, details: [] },
  };

  try {
    // -----------------------------------------------------------------
    // TEST SUITE 1: /hub Route & Elements
    // -----------------------------------------------------------------
    console.log('--- [Suite 1] Verifying /hub Route & Content ---');
    await page.goto(`${BASE_URL}/hub`, { waitUntil: 'networkidle' });

    // Header check
    const hubHeading = await page.locator('[data-testid="hub-heading"]').innerText();
    const expectedHeading = 'You passed the love test';
    const headingMatches = hubHeading.trim() === expectedHeading;
    testResults.hubRoute.details.push({
      item: 'Header "You passed the love test"',
      actual: hubHeading.trim(),
      expected: expectedHeading,
      passed: headingMatches,
    });
    console.log(`  Header: "${hubHeading.trim()}" -> ${headingMatches ? 'PASS' : 'FAIL'}`);

    // Subtitle check
    const subtitleLocator = page.locator('text=Your surprises are waiting for you');
    const subtitleCount = await subtitleLocator.count();
    const hasSubtitle = subtitleCount > 0;
    testResults.hubRoute.details.push({
      item: 'Subtitle "Your surprises are waiting for you"',
      passed: hasSubtitle,
    });
    console.log(`  Subtitle: "Your surprises are waiting for you" -> ${hasSubtitle ? 'PASS' : 'FAIL'}`);

    // 3 Gift Boxes check
    const giftBoxes = page.locator('[data-testid^="gift-box-card-"]');
    const giftBoxCount = await giftBoxes.count();
    testResults.hubRoute.details.push({
      item: 'Exactly 3 Gift Boxes present',
      actualCount: giftBoxCount,
      passed: giftBoxCount === 3,
    });
    console.log(`  Gift Boxes Count: ${giftBoxCount} -> ${giftBoxCount === 3 ? 'PASS' : 'FAIL'}`);

    // Gift Box 1 attributes
    const gb1 = page.locator('[data-testid="gift-box-card-1"]');
    const gb1Href = await gb1.getAttribute('href');
    const gb1Text = await gb1.innerText();
    const gb1Pass = gb1Href === '/surprise/1' && gb1Text.includes('Your Bouquet');
    testResults.hubRoute.details.push({
      item: 'Gift Box 1 links to /surprise/1 with "Your Bouquet"',
      href: gb1Href,
      passed: gb1Pass,
    });
    console.log(`  Gift Box 1 -> /surprise/1 ("Your Bouquet"): ${gb1Pass ? 'PASS' : 'FAIL'}`);

    // Gift Box 2 attributes
    const gb2 = page.locator('[data-testid="gift-box-card-2"]');
    const gb2Href = await gb2.getAttribute('href');
    const gb2Text = await gb2.innerText();
    const gb2Pass = gb2Href === '/surprise/2' && gb2Text.includes('Scrapbook');
    testResults.hubRoute.details.push({
      item: 'Gift Box 2 links to /surprise/2 with "Scrapbook"',
      href: gb2Href,
      passed: gb2Pass,
    });
    console.log(`  Gift Box 2 -> /surprise/2 ("Scrapbook & Music Player"): ${gb2Pass ? 'PASS' : 'FAIL'}`);

    // Gift Box 3 attributes
    const gb3 = page.locator('[data-testid="gift-box-card-3"]');
    const gb3Href = await gb3.getAttribute('href');
    const gb3Text = await gb3.innerText();
    const gb3Pass = gb3Href === '/surprise/3' && gb3Text.includes('A Letter From My Heart');
    testResults.hubRoute.details.push({
      item: 'Gift Box 3 links to /surprise/3 with "A Letter From My Heart"',
      href: gb3Href,
      passed: gb3Pass,
    });
    console.log(`  Gift Box 3 -> /surprise/3 ("A Letter From My Heart"): ${gb3Pass ? 'PASS' : 'FAIL'}`);

    testResults.hubRoute.passed = testResults.hubRoute.details.every((d) => d.passed);

    // -----------------------------------------------------------------
    // TEST SUITE 2: Navigation to /surprise/1, Verification & Return
    // -----------------------------------------------------------------
    console.log('\n--- [Suite 2] Verifying Gift Box 1 -> /surprise/1 -> Return ---');
    await gb1.click();
    await page.waitForURL('**/surprise/1', { waitUntil: 'networkidle' });

    const currentUrl1 = page.url();
    const navigatedTo1 = currentUrl1.endsWith('/surprise/1');
    testResults.surprise1Route.details.push({
      item: 'Navigated to /surprise/1 upon clicking Gift Box 1',
      url: currentUrl1,
      passed: navigatedTo1,
    });
    console.log(`  Navigated to /surprise/1: ${navigatedTo1 ? 'PASS' : 'FAIL'}`);

    // Header "Your Bouquet"
    const bHeading = await page.locator('[data-testid="bouquet-heading"]').innerText();
    const bouquetHeadingPass = bHeading.trim() === 'Your Bouquet';
    testResults.surprise1Route.details.push({
      item: 'Header "Your Bouquet"',
      actual: bHeading.trim(),
      passed: bouquetHeadingPass,
    });
    console.log(`  Bouquet Header: "${bHeading.trim()}" -> ${bouquetHeadingPass ? 'PASS' : 'FAIL'}`);

    // Wavy/scalloped border container & image
    const frameCount = await page.locator('[data-testid="bouquet-frame"]').count();
    const imgLocator = page.locator('[data-testid="bouquet-image"]');
    const imgCount = await imgLocator.count();
    const imgLoaded = await imgLocator.evaluate((img) => img.complete && img.naturalWidth > 0);
    const frameAndImagePass = frameCount > 0 && imgCount > 0 && imgLoaded;
    testResults.surprise1Route.details.push({
      item: 'Scalloped frame and bouquet image loaded',
      frameCount,
      imgCount,
      imgLoaded,
      passed: frameAndImagePass,
    });
    console.log(`  Scalloped Frame & Image Loaded: ${frameAndImagePass ? 'PASS' : 'FAIL'}`);

    // 6 sweet text bubbles
    const expectedSweetQuotes = [
      'You make my heart bloom.',
      'I choose you every day',
      'Life feels sweeter with you',
      'My love for you keeps growing',
      'You make every moment sweeter.',
      'My heart will always choose you',
    ];

    let foundQuotes = 0;
    for (const q of expectedSweetQuotes) {
      const qCount = await page.locator(`text=${q}`).count();
      const qPass = qCount > 0;
      if (qPass) foundQuotes++;
      testResults.surprise1Route.details.push({
        item: `Sweet bubble quote: "${q}"`,
        count: qCount,
        passed: qPass,
      });
      console.log(`    Bubble: "${q}" -> ${qPass ? 'FOUND' : 'MISSING'}`);
    }

    const allQuotesPass = foundQuotes === 6;
    testResults.surprise1Route.details.push({
      item: 'All 6 sweet text bubbles present',
      found: foundQuotes,
      total: expectedSweetQuotes.length,
      passed: allQuotesPass,
    });

    // Next -> button click to return to /hub
    const nextBtn1 = page.locator('[data-testid="next-button"]');
    const nextBtn1Text = await nextBtn1.innerText();
    const nextBtn1Href = await nextBtn1.getAttribute('href');
    const nextBtn1Valid = nextBtn1Href === '/hub';
    testResults.surprise1Route.details.push({
      item: 'Next button points to /hub',
      text: nextBtn1Text,
      href: nextBtn1Href,
      passed: nextBtn1Valid,
    });

    await nextBtn1.click();
    await page.waitForURL('**/hub', { waitUntil: 'networkidle' });
    const returnFrom1Pass = page.url().endsWith('/hub');
    testResults.surprise1Route.details.push({
      item: 'Returned to /hub after clicking Next ->',
      url: page.url(),
      passed: returnFrom1Pass,
    });
    console.log(`  Next -> clicked: Returned to /hub: ${returnFrom1Pass ? 'PASS' : 'FAIL'}`);

    testResults.surprise1Route.passed = testResults.surprise1Route.details.every((d) => d.passed);

    // -----------------------------------------------------------------
    // TEST SUITE 3: Navigation to /surprise/2, Verification & Return
    // -----------------------------------------------------------------
    console.log('\n--- [Suite 3] Verifying Gift Box 2 -> /surprise/2 -> Return ---');
    const gb2Again = page.locator('[data-testid="gift-box-card-2"]');
    await gb2Again.click();
    await page.waitForURL('**/surprise/2', { waitUntil: 'networkidle' });

    const currentUrl2 = page.url();
    const navigatedTo2 = currentUrl2.endsWith('/surprise/2');
    testResults.surprise2Route.details.push({
      item: 'Navigated to /surprise/2 upon clicking Gift Box 2',
      url: currentUrl2,
      passed: navigatedTo2,
    });
    console.log(`  Navigated to /surprise/2: ${navigatedTo2 ? 'PASS' : 'FAIL'}`);

    // Polaroid frame and image
    const polaroidFrame = await page.locator('[data-testid="polaroid-frame"]').count();
    const polaroidImg = page.locator('[data-testid="polaroid-image"]');
    const polaroidImgCount = await polaroidImg.count();
    const polaroidLoaded = await polaroidImg.evaluate((img) => img.complete && img.naturalWidth > 0);
    const polaroidPass = polaroidFrame > 0 && polaroidImgCount > 0 && polaroidLoaded;
    testResults.surprise2Route.details.push({
      item: 'Polaroid frame and image loaded',
      frameCount: polaroidFrame,
      imgLoaded: polaroidLoaded,
      passed: polaroidPass,
    });
    console.log(`  Polaroid Frame & Image Loaded: ${polaroidPass ? 'PASS' : 'FAIL'}`);

    // 3 tickets
    const ticket1Matches = (await page.locator('text=LOVE PASS').count()) > 0 &&
                           (await page.locator('text=ADMIT ONE TO MY HEART').count()) > 0;
    const ticket2Matches = (await page.locator('text=ROMANCE TICKET').count()) > 0 &&
                           (await page.locator('text=SPECIAL DAY').count()) > 0;
    const ticket3Matches = (await page.locator('text=LOVE NOTE').count()) > 0 &&
                           (await page.locator('text=KEEP THIS TICKET').count()) > 0;

    testResults.surprise2Route.details.push({
      item: 'Ticket 1: LOVE PASS ADMIT ONE TO MY HEART',
      passed: ticket1Matches,
    });
    testResults.surprise2Route.details.push({
      item: 'Ticket 2: ROMANCE TICKET SPECIAL DAY',
      passed: ticket2Matches,
    });
    testResults.surprise2Route.details.push({
      item: 'Ticket 3: LOVE NOTE KEEP THIS TICKET',
      passed: ticket3Matches,
    });
    console.log(`  Tickets: T1=${ticket1Matches} T2=${ticket2Matches} T3=${ticket3Matches}`);

    // Audio Player Widget
    const audioWidgetCount = await page.locator('[data-testid="audio-player-widget"]').count();
    const trackTitle = (await page.locator('[data-testid="audio-track-title"]').innerText()).trim();
    const artistName = (await page.locator('[data-testid="audio-artist-name"]').innerText()).trim();
    const playPauseBtn = page.locator('[data-testid="audio-play-pause-btn"]');
    const hasPlayPauseBtn = (await playPauseBtn.count()) > 0;
    const hasSeekSlider = (await page.locator('[data-testid="audio-seek-slider"]').count()) > 0;

    const trackTitleMatches = trackTitle.includes('BIRDS OF A FEATHER');
    const artistMatches = artistName.includes('Billie Eilish');
    const audioPlayerPass = audioWidgetCount > 0 && trackTitleMatches && artistMatches && hasPlayPauseBtn && hasSeekSlider;

    testResults.surprise2Route.details.push({
      item: 'Audio Player Widget with BIRDS OF A FEATHER by Billie Eilish',
      audioWidgetCount,
      trackTitle,
      artistName,
      hasPlayPauseBtn,
      hasSeekSlider,
      passed: audioPlayerPass,
    });
    console.log(`  Audio Player: "${trackTitle}" by "${artistName}" -> ${audioPlayerPass ? 'PASS' : 'FAIL'}`);

    // Audio Play/Pause Interaction
    await playPauseBtn.click();
    await page.waitForTimeout(500);
    const pauseTitle = await playPauseBtn.getAttribute('title');
    const audioInteracted = pauseTitle === 'Pause music' || pauseTitle === 'Play music';
    testResults.surprise2Route.details.push({
      item: 'Audio Player play/pause toggle interaction',
      pauseTitle,
      passed: audioInteracted,
    });

    // Next -> return
    const nextBtn2 = page.locator('[data-testid="next-button"]');
    const nextBtn2Href = await nextBtn2.getAttribute('href');
    const nextBtn2Valid = nextBtn2Href === '/hub';
    testResults.surprise2Route.details.push({
      item: 'Next button points to /hub',
      href: nextBtn2Href,
      passed: nextBtn2Valid,
    });

    await nextBtn2.click();
    await page.waitForURL('**/hub', { waitUntil: 'networkidle' });
    const returnFrom2Pass = page.url().endsWith('/hub');
    testResults.surprise2Route.details.push({
      item: 'Returned to /hub after clicking Next ->',
      url: page.url(),
      passed: returnFrom2Pass,
    });
    console.log(`  Next -> clicked: Returned to /hub: ${returnFrom2Pass ? 'PASS' : 'FAIL'}`);

    testResults.surprise2Route.passed = testResults.surprise2Route.details.every((d) => d.passed);

    // -----------------------------------------------------------------
    // TEST SUITE 4: Navigation to /surprise/3, Verification & Return
    // -----------------------------------------------------------------
    console.log('\n--- [Suite 4] Verifying Gift Box 3 -> /surprise/3 -> Return ---');
    const gb3Again = page.locator('[data-testid="gift-box-card-3"]');
    await gb3Again.click();
    await page.waitForURL('**/surprise/3', { waitUntil: 'networkidle' });

    const currentUrl3 = page.url();
    const navigatedTo3 = currentUrl3.endsWith('/surprise/3');
    testResults.surprise3Route.details.push({
      item: 'Navigated to /surprise/3 upon clicking Gift Box 3',
      url: currentUrl3,
      passed: navigatedTo3,
    });
    console.log(`  Navigated to /surprise/3: ${navigatedTo3 ? 'PASS' : 'FAIL'}`);

    // Header "A Letter From My Heart"
    const lHeading = await page.locator('[data-testid="letter-heading"]').innerText();
    const letterHeadingPass = lHeading.trim() === 'A Letter From My Heart';
    testResults.surprise3Route.details.push({
      item: 'Header "A Letter From My Heart"',
      actual: lHeading.trim(),
      passed: letterHeadingPass,
    });
    console.log(`  Letter Header: "${lHeading.trim()}" -> ${letterHeadingPass ? 'PASS' : 'FAIL'}`);

    // Letter Card & 3 Paragraphs Verbatim
    const hasLetterCard = (await page.locator('[data-testid="letter-card"]').count()) > 0;
    const p0 = (await page.locator('[data-testid="letter-paragraph-0"]').innerText()).trim();
    const p1 = (await page.locator('[data-testid="letter-paragraph-1"]').innerText()).trim();
    const p2 = (await page.locator('[data-testid="letter-paragraph-2"]').innerText()).trim();

    const expectedP0 =
      "You make my life feel more beautiful and meaningful, and I feel so lucky to have you. I love you wholeheartedly, and I can't wait to continue loving you for the rest of my life.";
    const expectedP1 =
      "You make me smile, you make me feel safe, and you bring so much happiness into my world. I know I tell you this every day, but you truly are the most beautiful person in my eyes.";
    const expectedP2 =
      "Thank you for being you and for filling my heart with so much love. No matter what happens, I will always choose you.";

    const p0Pass = p0 === expectedP0;
    const p1Pass = p1 === expectedP1;
    const p2Pass = p2 === expectedP2;

    testResults.surprise3Route.details.push({
      item: 'Paragraph 1 verbatim check',
      actual: p0,
      expected: expectedP0,
      passed: p0Pass,
    });
    testResults.surprise3Route.details.push({
      item: 'Paragraph 2 verbatim check',
      actual: p1,
      expected: expectedP1,
      passed: p1Pass,
    });
    testResults.surprise3Route.details.push({
      item: 'Paragraph 3 verbatim check',
      actual: p2,
      expected: expectedP2,
      passed: p2Pass,
    });
    console.log(`  Paragraph 1 Match: ${p0Pass ? 'PASS' : 'FAIL'}`);
    console.log(`  Paragraph 2 Match: ${p1Pass ? 'PASS' : 'FAIL'}`);
    console.log(`  Paragraph 3 Match: ${p2Pass ? 'PASS' : 'FAIL'}`);

    // Closing "Always, forever."
    const closing = (await page.locator('[data-testid="letter-closing"]').innerText()).trim();
    const closingPass = closing === 'Always, forever.';
    testResults.surprise3Route.details.push({
      item: 'Closing "Always, forever."',
      actual: closing,
      passed: closingPass,
    });
    console.log(`  Closing "Always, forever.": ${closingPass ? 'PASS' : 'FAIL'}`);

    // Cat holding heart
    const catSection = page.locator('[data-testid="letter-cat"]');
    const hasCatSection = (await catSection.count()) > 0;
    const catImg = page.locator('[data-testid="letter-cat"] img');
    const catImgCount = await catImg.count();
    const catLoaded = await catImg.evaluate((img) => img.complete && img.naturalWidth > 0);
    const catAlt = await catImg.getAttribute('alt');
    const catAltValid = (catAlt || '').toLowerCase().includes('heart');
    const catPass = hasCatSection && catImgCount > 0 && catLoaded && catAltValid;

    testResults.surprise3Route.details.push({
      item: 'Cat holding heart image loaded with heart alt description',
      hasCatSection,
      catLoaded,
      catAlt,
      passed: catPass,
    });
    console.log(`  Cat Holding Heart: ${catPass ? 'PASS' : 'FAIL'}`);

    // Next -> return
    const nextBtn3 = page.locator('[data-testid="next-button"]');
    const nextBtn3Href = await nextBtn3.getAttribute('href');
    const nextBtn3Valid = nextBtn3Href === '/hub';
    testResults.surprise3Route.details.push({
      item: 'Next button points to /hub',
      href: nextBtn3Href,
      passed: nextBtn3Valid,
    });

    await nextBtn3.click();
    await page.waitForURL('**/hub', { waitUntil: 'networkidle' });
    const returnFrom3Pass = page.url().endsWith('/hub');
    testResults.surprise3Route.details.push({
      item: 'Returned to /hub after clicking Next ->',
      url: page.url(),
      passed: returnFrom3Pass,
    });
    console.log(`  Next -> clicked: Returned to /hub: ${returnFrom3Pass ? 'PASS' : 'FAIL'}`);

    testResults.surprise3Route.passed = testResults.surprise3Route.details.every((d) => d.passed);

    // -----------------------------------------------------------------
    // TEST SUITE 5: Full Hub-and-Spoke Navigation Loop (Consecutive)
    // -----------------------------------------------------------------
    console.log('\n--- [Suite 5] Verifying Consecutive Hub-and-Spoke Cycle ---');
    let loopSuccess = true;
    for (let spoke = 1; spoke <= 3; spoke++) {
      await page.click(`[data-testid="gift-box-card-${spoke}"]`);
      await page.waitForURL(`**/surprise/${spoke}`);
      console.log(`  Visited /surprise/${spoke}`);
      await page.click('[data-testid="next-button"]');
      await page.waitForURL('**/hub');
      console.log(`  Returned from /surprise/${spoke} to /hub`);
    }
    testResults.fullNavigationLoop.details.push({
      item: 'Completed 1 -> hub -> 2 -> hub -> 3 -> hub consecutive loop',
      passed: loopSuccess,
    });
    testResults.fullNavigationLoop.passed = loopSuccess;
    console.log(`  Navigation Loop Result: ${loopSuccess ? 'PASS' : 'FAIL'}`);

    // -----------------------------------------------------------------
    // TEST SUITE 6: Mobile Responsiveness Stress Test (375x667)
    // -----------------------------------------------------------------
    console.log('\n--- [Suite 6] Mobile Responsiveness (375x667 Viewport) ---');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/hub`, { waitUntil: 'networkidle' });

    // Ensure gift boxes are visible and vertically stacked
    const box1Bounding = await page.locator('[data-testid="gift-box-card-1"]').boundingBox();
    const box2Bounding = await page.locator('[data-testid="gift-box-card-2"]').boundingBox();
    const isStacked = box2Bounding && box1Bounding && box2Bounding.y > box1Bounding.y;
    testResults.mobileResponsiveness.details.push({
      item: 'Gift boxes stack vertically on mobile viewport',
      isStacked,
      passed: !!isStacked,
    });
    console.log(`  Gift Boxes Stack Vertically: ${!!isStacked ? 'PASS' : 'FAIL'}`);

    // Test Surprise 1 mobile
    await page.goto(`${BASE_URL}/surprise/1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="next-button"]', { timeout: 10000 });
    const count1 = await page.locator('[data-testid="next-button"]').count();
    const title1 = await page.title();
    const mobileNext1 = await page.locator('[data-testid="next-button"]').isVisible();
    console.log(`  Surprise 1 Mobile: title="${title1}", count=${count1}, isVisible=${mobileNext1}`);
    testResults.mobileResponsiveness.details.push({
      item: 'Surprise 1 Next button visible on mobile',
      title: title1,
      count: count1,
      passed: mobileNext1,
    });

    // Test Surprise 2 mobile
    await page.goto(`${BASE_URL}/surprise/2`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="next-button"]', { timeout: 10000 });
    const count2 = await page.locator('[data-testid="next-button"]').count();
    const title2 = await page.title();
    const mobileNext2 = await page.locator('[data-testid="next-button"]').isVisible();
    console.log(`  Surprise 2 Mobile: title="${title2}", count=${count2}, isVisible=${mobileNext2}`);
    testResults.mobileResponsiveness.details.push({
      item: 'Surprise 2 Next button visible on mobile',
      title: title2,
      count: count2,
      passed: mobileNext2,
    });

    // Test Surprise 3 mobile
    await page.goto(`${BASE_URL}/surprise/3`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="next-button"]', { timeout: 10000 });
    const count3 = await page.locator('[data-testid="next-button"]').count();
    const title3 = await page.title();
    const mobileNext3 = await page.locator('[data-testid="next-button"]').isVisible();
    console.log(`  Surprise 3 Mobile: title="${title3}", count=${count3}, isVisible=${mobileNext3}`);
    testResults.mobileResponsiveness.details.push({
      item: 'Surprise 3 Next button visible on mobile',
      title: title3,
      count: count3,
      passed: mobileNext3,
    });

    testResults.mobileResponsiveness.passed = testResults.mobileResponsiveness.details.every((d) => d.passed);
    console.log(`  Mobile Responsiveness Result: ${testResults.mobileResponsiveness.passed ? 'PASS' : 'FAIL'}`);

    // -----------------------------------------------------------------
    // SUMMARY REPORT
    // -----------------------------------------------------------------
    console.log('\n=====================================================');
    console.log('                 TEST SUMMARY REPORT');
    console.log('=====================================================');
    console.log(JSON.stringify(testResults, null, 2));

    const overallPassed =
      testResults.hubRoute.passed &&
      testResults.surprise1Route.passed &&
      testResults.surprise2Route.passed &&
      testResults.surprise3Route.passed &&
      testResults.fullNavigationLoop.passed &&
      testResults.mobileResponsiveness.passed;

    console.log('\n=====================================================');
    if (overallPassed) {
      console.log('  FINAL VERDICT: CONFIRMED (ALL CHECKS PASSED)');
    } else {
      console.log('  FINAL VERDICT: FAILED (FAILURES ENCOUNTERED)');
      process.exitCode = 1;
    }
    console.log('=====================================================');
  } catch (err) {
    console.error('Fatal execution error:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    try {
      if (server.pid) {
        spawn('taskkill', ['/pid', String(server.pid), '/f', '/t']);
      }
    } catch {
      server.kill();
    }
  }
}

runChallengerTests();
