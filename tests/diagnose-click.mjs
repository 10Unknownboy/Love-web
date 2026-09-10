import { chromium } from '@playwright/test';

async function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  const baseUrl = 'http://localhost:3000';
  console.log(`Connecting to ${baseUrl}...`);

  const browser = await chromium.launch({
    headless: true,
    channel: 'msedge',
    args: ['--autoplay-policy=no-user-gesture-required', '--no-sandbox'],
  });

  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });

  await page.goto(`${baseUrl}/surprise/2`, { waitUntil: 'networkidle' });
  await wait(1000);

  const analysis = await page.evaluate(() => {
    const playBtn = document.querySelector('[data-testid="audio-play-pause-btn"]');
    const polaroidImg = document.querySelector('[data-testid="polaroid-image"]');
    const polaroidFrame = document.querySelector('[data-testid="polaroid-frame"]');
    const widget = document.querySelector('[data-testid="audio-player-widget"]');

    const btnBox = playBtn ? playBtn.getBoundingClientRect() : null;
    const imgBox = polaroidImg ? polaroidImg.getBoundingClientRect() : null;
    const frameBox = polaroidFrame ? polaroidFrame.getBoundingClientRect() : null;
    const widgetBox = widget ? widget.getBoundingClientRect() : null;

    let elAtBtnCenter = null;
    let elementsAtBtnCenter = [];
    if (btnBox) {
      const cx = btnBox.left + btnBox.width / 2;
      const cy = btnBox.top + btnBox.height / 2;
      const el = document.elementFromPoint(cx, cy);
      elAtBtnCenter = el
        ? {
            tag: el.tagName,
            testId: el.getAttribute('data-testid'),
            class: el.className,
            outerHTML: el.outerHTML.slice(0, 150),
          }
        : null;

      if (document.elementsFromPoint) {
        elementsAtBtnCenter = document.elementsFromPoint(cx, cy).map((e) => ({
          tag: e.tagName,
          testId: e.getAttribute('data-testid'),
          class: (e.className || '').slice(0, 50),
        }));
      }
    }

    return {
      btnBox,
      imgBox,
      frameBox,
      widgetBox,
      elAtBtnCenter,
      elementsAtBtnCenter,
    };
  });

  console.log('--- DIAGNOSTIC RESULTS ---');
  console.log(JSON.stringify(analysis, null, 2));

  // Now try clicking playBtn
  console.log('\nAttempting to click audio-play-pause-btn...');
  try {
    await page.locator('[data-testid="audio-play-pause-btn"]').click({ timeout: 5000 });
    console.log('Successfully clicked audio-play-pause-btn!');
  } catch (err) {
    console.error('Click failed with error:\n', err.message);
  }

  await browser.close();
}

run().catch((e) => {
  console.error('Run failed:', e);
  process.exit(1);
});
