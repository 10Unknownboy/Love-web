import { chromium } from '@playwright/test';

async function inspect() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  page.on('console', msg => console.log('Console:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PageError:', err.message));
  page.on('response', resp => {
    if (!resp.ok()) {
      console.log('Failed response:', resp.status(), resp.url());
    }
  });

  const resp = await page.goto('http://localhost:3000/surprise/2', { waitUntil: 'domcontentloaded' });
  console.log('Status:', resp ? resp.status() : 'no resp');
  console.log('Current URL:', page.url());
  console.log('Title:', await page.title());

  await page.waitForTimeout(1000);

  const html = await page.content();
  console.log('HTML Length:', html.length);
  console.log('Contains audio-play-pause-btn:', html.includes('audio-play-pause-btn'));
  console.log('Contains polaroid-image:', html.includes('polaroid-image'));

  const info = await page.evaluate(() => {
    const btn = document.querySelector('[data-testid="audio-play-pause-btn"]');
    const img = document.querySelector('[data-testid="polaroid-image"]');
    const frame = document.querySelector('[data-testid="polaroid-frame"]');
    const widget = document.querySelector('[data-testid="audio-player-widget"]');

    const btnRect = btn ? btn.getBoundingClientRect() : null;
    const imgRect = img ? img.getBoundingClientRect() : null;
    const frameRect = frame ? frame.getBoundingClientRect() : null;
    const widgetRect = widget ? widget.getBoundingClientRect() : null;

    let elAtPoint = null;
    if (btnRect) {
      const x = btnRect.left + btnRect.width / 2;
      const y = btnRect.top + btnRect.height / 2;
      const el = document.elementFromPoint(x, y);
      elAtPoint = el
        ? {
            tag: el.tagName,
            testId: el.getAttribute('data-testid'),
            class: el.className,
          }
        : null;
    }

    return {
      btnRect,
      imgRect,
      frameRect,
      widgetRect,
      elAtPoint,
    };
  });

  console.log('Info:', JSON.stringify(info, null, 2));
  await browser.close();
}

inspect();
