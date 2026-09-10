import { chromium } from '@playwright/test';
import { spawn } from 'child_process';

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runM3Verification() {
  console.log('--- Starting Milestone 3 End-to-End Verification ---');

  // Start Next.js server on port 3001
  const port = 3001;
  const server = spawn('npx', ['next', 'start', '-p', String(port)], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'pipe',
  });

  let serverReady = false;
  server.stdout.on('data', (data) => {
    const text = data.toString();
    if (text.includes('Ready in') || text.includes('started server on') || text.includes('http://localhost:' + port)) {
      serverReady = true;
    }
  });

  // Wait for server to become ready
  console.log('Waiting for Next.js server to start on port', port, '...');
  for (let i = 0; i < 30; i++) {
    await wait(1000);
    try {
      const res = await fetch(`http://localhost:${port}/hub`);
      if (res.ok) {
        serverReady = true;
        break;
      }
    } catch {
      // waiting
    }
  }

  if (!serverReady) {
    server.kill();
    throw new Error('Next.js server failed to start within timeout');
  }
  console.log('Server is ready on port', port);

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();
  const baseUrl = `http://localhost:${port}`;

  const results = {};

  try {
    // 1. Test /hub
    console.log('\n[1] Testing /hub...');
    await page.goto(`${baseUrl}/hub`, { waitUntil: 'networkidle' });
    const hubHeading = await page.locator('[data-testid="hub-heading"]').innerText();
    const hasSubtitle = (await page.locator('text=Your surprises are waiting for you').count()) > 0;
    const giftBoxes = page.locator('[data-testid^="gift-box-card-"]');
    const giftCount = await giftBoxes.count();
    const backBtn = page.locator('[data-testid="back-to-slider"]');
    const hasBackBtn = (await backBtn.count()) > 0;

    console.log('  Hub heading:', hubHeading);
    console.log('  Has subtitle:', hasSubtitle);
    console.log('  Gift boxes count:', giftCount);
    console.log('  Has back button:', hasBackBtn);

    results.hub = {
      headingCorrect: hubHeading.includes('You passed the love test'),
      subtitleCorrect: hasSubtitle,
      threeGiftBoxes: giftCount === 3,
      hasBackButton: hasBackBtn,
    };

    // 2. Test /surprise/1
    console.log('\n[2] Testing /surprise/1 (Your Bouquet)...');
    await page.goto(`${baseUrl}/surprise/1`, { waitUntil: 'networkidle' });
    const bouquetHeading = await page.locator('[data-testid="bouquet-heading"]').innerText();
    const hasBouquetFrame = (await page.locator('[data-testid="bouquet-frame"]').count()) > 0;
    const hasBouquetImage = (await page.locator('[data-testid="bouquet-image"]').count()) > 0;

    const expectedQuotes = [
      'You make my heart bloom.',
      'I choose you every day',
      'Life feels sweeter with you',
      'My love for you keeps growing',
      'You make every moment sweeter.',
      'My heart will always choose you',
    ];

    let foundQuotesCount = 0;
    for (const q of expectedQuotes) {
      const count = await page.locator(`text=${q}`).count();
      if (count > 0) {
        foundQuotesCount++;
      } else {
        console.warn(`  Missing quote: "${q}"`);
      }
    }

    const nextBtn1 = page.locator('[data-testid="next-button"]');
    const nextBtn1Href = await nextBtn1.getAttribute('href');

    console.log('  Bouquet heading:', bouquetHeading);
    console.log('  Has frame:', hasBouquetFrame);
    console.log('  Has image:', hasBouquetImage);
    console.log(`  Found quotes: ${foundQuotesCount}/${expectedQuotes.length}`);
    console.log('  Next button href:', nextBtn1Href);

    results.surprise1 = {
      headingCorrect: bouquetHeading === 'Your Bouquet',
      hasBouquetFrame,
      hasBouquetImage,
      allQuotesPresent: foundQuotesCount === 6,
      nextLinksToHub: nextBtn1Href === '/hub',
    };

    // 3. Test /surprise/2
    console.log('\n[3] Testing /surprise/2 (Scrapbook & Melodies)...');
    await page.goto(`${baseUrl}/surprise/2`, { waitUntil: 'networkidle' });
    const scrapbookHeading = await page.locator('[data-testid="scrapbook-heading"]').innerText();
    const hasPolaroidFrame = (await page.locator('[data-testid="polaroid-frame"]').count()) > 0;
    const hasPolaroidImage = (await page.locator('[data-testid="polaroid-image"]').count()) > 0;

    // Tickets
    const t1 = await page.locator('text=LOVE PASS ADMIT ONE TO MY HEART').count();
    const t2 = await page.locator('text=ROMANCE TICKET SPECIAL DAY').count();
    const t3 = await page.locator('text=LOVE NOTE KEEP THIS TICKET').count();

    // Audio Player
    const hasAudioPlayer = (await page.locator('[data-testid="audio-player-widget"]').count()) > 0;
    const trackTitle = await page.locator('[data-testid="audio-track-title"]').innerText();
    const artistName = await page.locator('[data-testid="audio-artist-name"]').innerText();
    const playBtn = page.locator('[data-testid="audio-play-pause-btn"]');
    const seekSlider = page.locator('[data-testid="audio-seek-slider"]');

    const nextBtn2 = page.locator('[data-testid="next-button"]');
    const nextBtn2Href = await nextBtn2.getAttribute('href');

    console.log('  Scrapbook heading:', scrapbookHeading);
    console.log('  Has polaroid:', hasPolaroidFrame && hasPolaroidImage);
    console.log('  Tickets found: T1=', t1, 'T2=', t2, 'T3=', t3);
    console.log('  Has audio player:', hasAudioPlayer);
    console.log('  Track title:', trackTitle);
    console.log('  Artist name:', artistName);
    console.log('  Next button href:', nextBtn2Href);

    results.surprise2 = {
      headingCorrect: scrapbookHeading.includes('Scrapbook'),
      hasPolaroid: hasPolaroidFrame && hasPolaroidImage,
      ticket1: t1 > 0,
      ticket2: t2 > 0,
      ticket3: t3 > 0,
      hasAudioPlayer,
      trackTitleCorrect: trackTitle.includes('BIRDS OF A FEATHER'),
      artistCorrect: artistName.includes('Billie Eilish'),
      hasPlayBtn: (await playBtn.count()) > 0,
      hasSeekSlider: (await seekSlider.count()) > 0,
      nextLinksToHub: nextBtn2Href === '/hub',
    };

    // 4. Test /surprise/3
    console.log('\n[4] Testing /surprise/3 (A Letter From My Heart)...');
    await page.goto(`${baseUrl}/surprise/3`, { waitUntil: 'networkidle' });
    const letterHeading = await page.locator('[data-testid="letter-heading"]').innerText();
    const hasLetterCard = (await page.locator('[data-testid="letter-card"]').count()) > 0;
    const p0 = await page.locator('[data-testid="letter-paragraph-0"]').innerText();
    const p1 = await page.locator('[data-testid="letter-paragraph-1"]').innerText();
    const p2 = await page.locator('[data-testid="letter-paragraph-2"]').innerText();
    const closing = await page.locator('[data-testid="letter-closing"]').innerText();
    const hasCatImage = (await page.locator('[data-testid="letter-cat"] img').count()) > 0;

    const nextBtn3 = page.locator('[data-testid="next-button"]');
    const nextBtn3Href = await nextBtn3.getAttribute('href');

    console.log('  Letter heading:', letterHeading);
    console.log('  Has letter card:', hasLetterCard);
    console.log('  Paragraph 0 length:', p0.length);
    console.log('  Paragraph 1 length:', p1.length);
    console.log('  Paragraph 2 length:', p2.length);
    console.log('  Closing text:', closing);
    console.log('  Has cat sticker:', hasCatImage);
    console.log('  Next button href:', nextBtn3Href);

    results.surprise3 = {
      headingCorrect: letterHeading === 'A Letter From My Heart',
      hasLetterCard,
      p0Matches: p0.includes('You make my life feel more beautiful'),
      p1Matches: p1.includes('You make me smile, you make me feel safe'),
      p2Matches: p2.includes('Thank you for being you and for filling my heart with so much love'),
      closingMatches: closing === 'Always, forever.',
      hasCatImage,
      nextLinksToHub: nextBtn3Href === '/hub',
    };

    // 5. Test Navigation Flow: /hub -> /surprise/1 -> /hub -> /surprise/2 -> /hub -> /surprise/3 -> /hub
    console.log('\n[5] Testing Hub-and-Spoke Navigation Flow...');
    await page.goto(`${baseUrl}/hub`, { waitUntil: 'networkidle' });
    await page.click('[data-testid="gift-box-card-1"]');
    await page.waitForURL('**/surprise/1');
    console.log('  Navigated to /surprise/1');
    await page.click('[data-testid="next-button"]');
    await page.waitForURL('**/hub');
    console.log('  Returned to /hub');

    await page.click('[data-testid="gift-box-card-2"]');
    await page.waitForURL('**/surprise/2');
    console.log('  Navigated to /surprise/2');
    await page.click('[data-testid="next-button"]');
    await page.waitForURL('**/hub');
    console.log('  Returned to /hub');

    await page.click('[data-testid="gift-box-card-3"]');
    await page.waitForURL('**/surprise/3');
    console.log('  Navigated to /surprise/3');
    await page.click('[data-testid="next-button"]');
    await page.waitForURL('**/hub');
    console.log('  Returned to /hub');

    results.navigationFlow = true;

    console.log('\n--- ALL VERIFICATION RESULTS ---');
    console.log(JSON.stringify(results, null, 2));

    const allPassed =
      Object.values(results.hub).every(Boolean) &&
      Object.values(results.surprise1).every(Boolean) &&
      Object.values(results.surprise2).every(Boolean) &&
      Object.values(results.surprise3).every(Boolean) &&
      results.navigationFlow;

    if (allPassed) {
      console.log('\n✅ ALL MILESTONE 3 VERIFICATION CHECKS PASSED!');
    } else {
      console.error('\n❌ SOME CHECKS FAILED!');
      process.exitCode = 1;
    }
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

runM3Verification().catch((err) => {
  console.error('Fatal verification error:', err);
  process.exit(1);
});
