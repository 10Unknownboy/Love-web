import { chromium } from '@playwright/test';

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runEmpiricalChallenge() {
  console.log('===============================================================');
  console.log('  MILESTONE 3 EMPIRICAL CHALLENGER: AUDIO & RESPONSIVE VIEWPORTS');
  console.log('===============================================================\n');

  const baseUrl = 'http://localhost:3000';

  // Verify server responds
  try {
    const res = await fetch(`${baseUrl}/surprise/2`);
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
  } catch (err) {
    throw new Error(`Failed to connect to ${baseUrl}: ${err.message}`);
  }
  console.log(`Connected to test server at ${baseUrl}\n`);

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
    args: ['--autoplay-policy=no-user-gesture-required', '--no-sandbox'],
  });

  const summary = {
    audioControls: {
      initialStatePaused: false,
      playTogglesPlaying: false,
      pauseTogglesPaused: false,
      timeAdvancesWhenPlaying: false,
      seekSliderUpdatesTime: false,
      skipForwardAdvances10s: false,
      skipBackRewinds10s: false,
      skipBackClampsAtZero: false,
      skipForwardClampsAtDuration: false,
    },
    audioContinuity: {
      playingBeforeNav: false,
      persistsOnHubNavigation: false,
      persistsAcrossMultiRouteHop: false,
      timeDidNotResetToZero: false,
      controlsSyncOnReturnToSurprise2: false,
    },
    responsiveViewports: {
      desktop_1280: {
        hub: { passed: false, scrollWidth: 0, winWidth: 0, overflowingElements: [] },
        surprise1: { passed: false, scrollWidth: 0, winWidth: 0, overflowingElements: [] },
        surprise2: { passed: false, scrollWidth: 0, winWidth: 0, overflowingElements: [] },
        surprise3: { passed: false, scrollWidth: 0, winWidth: 0, overflowingElements: [] },
      },
      mobile_375: {
        hub: { passed: false, scrollWidth: 0, winWidth: 0, overflowingElements: [] },
        surprise1: { passed: false, scrollWidth: 0, winWidth: 0, overflowingElements: [] },
        surprise2: { passed: false, scrollWidth: 0, winWidth: 0, overflowingElements: [] },
        surprise3: { passed: false, scrollWidth: 0, winWidth: 0, overflowingElements: [] },
      },
    },
  };

  try {
    // -------------------------------------------------------------
    // PART 1: AUDIO CONTROLS TESTING ON /surprise/2
    // -------------------------------------------------------------
    console.log('-------------------------------------------------------------');
    console.log('>>> [1] TESTING AUDIO PLAYER WIDGET CONTROLS ON /surprise/2');
    console.log('-------------------------------------------------------------');

    const contextDesktop = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const page = await contextDesktop.newPage();

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`[Browser Console Error] ${msg.text()}`);
      }
    });

    console.log(`Navigating to ${baseUrl}/surprise/2...`);
    await page.goto(`${baseUrl}/surprise/2`, { waitUntil: 'networkidle' });

    // 1. Initial State Check
    const playBtn = page.locator('[data-testid="audio-play-pause-btn"]');
    const playBtnTitle = await playBtn.getAttribute('title');
    const globalPill = page.locator('aside[aria-label="Global music player"]');
    const globalPillText = (await globalPill.innerText()).toUpperCase();

    console.log(`Initial Play Button Title: "${playBtnTitle}"`);
    console.log(`Initial Global Pill Text: "${globalPillText.trim()}"`);

    if (playBtnTitle === 'Play music' && globalPillText.includes('PAUSED')) {
      summary.audioControls.initialStatePaused = true;
      console.log('  ✓ Initial state confirmed: Paused');
    } else {
      console.log('  ✗ Unexpected initial state');
    }

    // 2. Play Click
    console.log('\nTesting Play action...');
    await playBtn.scrollIntoViewIfNeeded();
    await playBtn.click();
    await wait(500);

    const playBtnTitleAfterPlay = await playBtn.getAttribute('title');
    const globalPillAfterPlay = (await globalPill.innerText()).toUpperCase();
    const hasSpinClass = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="audio-player-widget"] [aria-hidden="true"]');
      return el ? el.classList.contains('animate-spin') : false;
    });

    console.log(`Play Button Title after click: "${playBtnTitleAfterPlay}"`);
    console.log(`Global Pill Text after play: "${globalPillAfterPlay.trim()}"`);
    console.log(`Vinyl spinning: ${hasSpinClass}`);

    if (
      playBtnTitleAfterPlay === 'Pause music' &&
      globalPillAfterPlay.includes('PLAYING') &&
      hasSpinClass
    ) {
      summary.audioControls.playTogglesPlaying = true;
      console.log('  ✓ Play toggle confirmed: Active playback, vinyl spinning, global pill updated to PLAYING');
    } else {
      console.log('  ✗ Play toggle failed to activate expected UI states');
    }

    // 3. Time Advancement
    console.log('\nTesting real-time advancement while playing...');
    const time1Str = await page.locator('[data-testid="audio-current-time"]').innerText();
    const audioTime1 = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      return audio ? audio.currentTime : 0;
    });
    console.log(`Initial time mark: UI="${time1Str}", audio.currentTime=${audioTime1.toFixed(2)}s`);

    await wait(2500); // wait 2.5 seconds

    const time2Str = await page.locator('[data-testid="audio-current-time"]').innerText();
    const audioTime2 = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      return audio ? audio.currentTime : 0;
    });
    console.log(`After 2.5s playback: UI="${time2Str}", audio.currentTime=${audioTime2.toFixed(2)}s`);

    if (audioTime2 > audioTime1) {
      summary.audioControls.timeAdvancesWhenPlaying = true;
      console.log(`  ✓ Time elapsed confirmed: audio progressed by ${(audioTime2 - audioTime1).toFixed(2)}s`);
    } else {
      console.log('  ✗ Audio did not advance during playback');
    }

    // 4. Pause Click
    console.log('\nTesting Pause action...');
    await playBtn.click();
    await wait(300);

    const playBtnTitleAfterPause = await playBtn.getAttribute('title');
    const globalPillAfterPause = (await globalPill.innerText()).toUpperCase();
    const hasSpinAfterPause = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="audio-player-widget"] [aria-hidden="true"]');
      return el ? el.classList.contains('animate-spin') : false;
    });

    console.log(`Play Button Title after pause: "${playBtnTitleAfterPause}"`);
    console.log(`Global Pill Text after pause: "${globalPillAfterPause.trim()}"`);
    console.log(`Vinyl spinning after pause: ${hasSpinAfterPause}`);

    if (
      playBtnTitleAfterPause === 'Play music' &&
      globalPillAfterPause.includes('PAUSED') &&
      !hasSpinAfterPause
    ) {
      summary.audioControls.pauseTogglesPaused = true;
      console.log('  ✓ Pause toggle confirmed: Playback paused, vinyl stopped, UI reset to PAUSED');
    } else {
      console.log('  ✗ Pause toggle failed');
    }

    // 5. Seek Slider Functionality
    console.log('\nTesting Seek Slider scrubbing with React native setter...');
    await page.evaluate((val) => {
      const slider = document.querySelector('[data-testid="audio-seek-slider"]');
      if (slider) {
        const nativeSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set;
        nativeSetter?.call(slider, String(val));
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, 45);
    await wait(300);

    const timeAfterSeek = await page.locator('[data-testid="audio-current-time"]').innerText();
    const audioTimeAfterSeek = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      return audio ? audio.currentTime : 0;
    });
    console.log(`Seek slider set to 45: UI="${timeAfterSeek}", audio.currentTime=${audioTimeAfterSeek.toFixed(2)}s`);

    if (timeAfterSeek === '0:45' && Math.abs(audioTimeAfterSeek - 45) < 1.5) {
      summary.audioControls.seekSliderUpdatesTime = true;
      console.log('  ✓ Seek slider scrub confirmed: Current time updated to 0:45');
    } else {
      console.log(`  ✗ Seek slider scrub failed: UI=${timeAfterSeek}, audio=${audioTimeAfterSeek}`);
    }

    // 6. Skip Forward (+10s)
    console.log('\nTesting Skip Forward (+10s)...');
    const skipForwardBtn = page.locator('[data-testid="audio-skip-forward-btn"]');
    await skipForwardBtn.click();
    await wait(300);

    const timeAfterSkipFwd = await page.locator('[data-testid="audio-current-time"]').innerText();
    const audioTimeAfterSkipFwd = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      return audio ? audio.currentTime : 0;
    });
    console.log(`After Skip Forward (+10s): UI="${timeAfterSkipFwd}", audio.currentTime=${audioTimeAfterSkipFwd.toFixed(2)}s`);

    if (timeAfterSkipFwd === '0:55' && Math.abs(audioTimeAfterSkipFwd - 55) < 1.5) {
      summary.audioControls.skipForwardAdvances10s = true;
      console.log('  ✓ Skip Forward (+10s) confirmed: 45s -> 55s');
    } else {
      console.log(`  ✗ Skip Forward failed: UI=${timeAfterSkipFwd}, audio=${audioTimeAfterSkipFwd}`);
    }

    // 7. Skip Back (-10s)
    console.log('\nTesting Skip Back (-10s)...');
    const skipBackBtn = page.locator('[data-testid="audio-skip-back-btn"]');
    await skipBackBtn.click();
    await wait(300);

    const timeAfterSkipBack = await page.locator('[data-testid="audio-current-time"]').innerText();
    const audioTimeAfterSkipBack = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      return audio ? audio.currentTime : 0;
    });
    console.log(`After Skip Back (-10s): UI="${timeAfterSkipBack}", audio.currentTime=${audioTimeAfterSkipBack.toFixed(2)}s`);

    if (timeAfterSkipBack === '0:45' && Math.abs(audioTimeAfterSkipBack - 45) < 1.5) {
      summary.audioControls.skipBackRewinds10s = true;
      console.log('  ✓ Skip Back (-10s) confirmed: 55s -> 45s');
    } else {
      console.log(`  ✗ Skip Back failed: UI=${timeAfterSkipBack}, audio=${audioTimeAfterSkipBack}`);
    }

    // 8. Boundary: Skip Back near 0s (clamps at 0:00)
    console.log('\nTesting Skip Back boundary clamping at 0:00...');
    await page.evaluate((val) => {
      const slider = document.querySelector('[data-testid="audio-seek-slider"]');
      if (slider) {
        const nativeSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set;
        nativeSetter?.call(slider, String(val));
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, 4);
    await wait(200);
    await skipBackBtn.click(); // 4s - 10s should clamp to 0s
    await wait(300);

    const timeAfterClampZero = await page.locator('[data-testid="audio-current-time"]').innerText();
    const audioTimeClampZero = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      return audio ? audio.currentTime : 0;
    });
    console.log(`Skip back from 4s: UI="${timeAfterClampZero}", audio.currentTime=${audioTimeClampZero.toFixed(2)}s`);

    if (timeAfterClampZero === '0:00' && audioTimeClampZero === 0) {
      summary.audioControls.skipBackClampsAtZero = true;
      console.log('  ✓ Skip Back lower boundary clamping confirmed: Clamped safely to 0:00 without negative values');
    } else {
      console.log(`  ✗ Lower boundary clamping failed: UI=${timeAfterClampZero}, audio=${audioTimeClampZero}`);
    }

    // 9. Boundary: Skip Forward near end (clamps at duration)
    console.log('\nTesting Skip Forward boundary clamping at duration...');
    const duration = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      return audio && audio.duration ? audio.duration : 177;
    });
    const nearEnd = Math.floor(duration - 3);
    await page.evaluate((val) => {
      const slider = document.querySelector('[data-testid="audio-seek-slider"]');
      if (slider) {
        const nativeSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set;
        nativeSetter?.call(slider, String(val));
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, nearEnd);
    await wait(200);
    await skipForwardBtn.click(); // (duration - 3s) + 10s should clamp to duration
    await wait(300);

    const audioTimeClampEnd = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      return audio ? audio.currentTime : 0;
    });
    console.log(`Skip forward from ${nearEnd}s with duration ${duration}s: audio.currentTime=${audioTimeClampEnd.toFixed(2)}s`);

    if (Math.abs(audioTimeClampEnd - duration) < 1.0 || Math.abs(audioTimeClampEnd - 177) < 0.5) {
      summary.audioControls.skipForwardClampsAtDuration = true;
      console.log('  ✓ Skip Forward upper boundary clamping confirmed: Clamped safely at track duration');
    } else {
      console.log(`  ✗ Upper boundary clamping failed: duration=${duration}, audioTime=${audioTimeClampEnd}`);
    }

    // -------------------------------------------------------------
    // PART 2: AUDIO CONTINUITY ACROSS ROUTE TRANSITIONS
    // -------------------------------------------------------------
    console.log('\n-------------------------------------------------------------');
    console.log('>>> [2] TESTING AUDIO CONTINUITY ACROSS ROUTE NAVIGATION');
    console.log('-------------------------------------------------------------');

    // Seek back to 30s and start playing
    await page.evaluate((val) => {
      const slider = document.querySelector('[data-testid="audio-seek-slider"]');
      if (slider) {
        const nativeSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set;
        nativeSetter?.call(slider, String(val));
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, 30);
    await wait(200);
    await playBtn.click();
    await wait(400);

    const isPlayingBeforeNav = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      return audio ? !audio.paused : false;
    });
    const timeBeforeNav = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      return audio ? audio.currentTime : 0;
    });

    console.log(`Before Navigation: isPlaying=${isPlayingBeforeNav}, currentTime=${timeBeforeNav.toFixed(2)}s`);
    summary.audioContinuity.playingBeforeNav = isPlayingBeforeNav;

    // Step A: Navigate to /hub via Next button
    console.log('Navigating from /surprise/2 to /hub via Next button...');
    const nextBtn = page.locator('[data-testid="next-button"]');
    await nextBtn.click();
    await page.waitForURL('**/hub', { timeout: 5000 });
    console.log(`Current URL: ${page.url()}`);

    // Wait 1.5 seconds on /hub to verify continuous playback
    await wait(1500);

    const isPlayingOnHub = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      return audio ? !audio.paused : false;
    });
    const timeOnHub = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      return audio ? audio.currentTime : 0;
    });
    const hubPillText = (await page.locator('aside[aria-label="Global music player"]').innerText()).toUpperCase();

    console.log(`On /hub: isPlaying=${isPlayingOnHub}, currentTime=${timeOnHub.toFixed(2)}s, Global Pill="${hubPillText.trim()}"`);

    if (isPlayingOnHub && hubPillText.includes('PLAYING') && timeOnHub > timeBeforeNav) {
      summary.audioContinuity.persistsOnHubNavigation = true;
      summary.audioContinuity.timeDidNotResetToZero = true;
      console.log(`  ✓ Playback maintained seamlessly across route change! Elapsed on hub: ${(timeOnHub - timeBeforeNav).toFixed(2)}s`);
    } else {
      console.log(`  ✗ Audio continuity failed on /hub! isPlaying=${isPlayingOnHub}, time=${timeOnHub}`);
    }

    // Step B: Navigate to /surprise/1 (Your Bouquet)
    console.log('\nNavigating from /hub to /surprise/1...');
    await page.click('[data-testid="gift-box-card-1"]');
    await page.waitForURL('**/surprise/1');
    await wait(1000);

    const isPlayingOnS1 = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      return audio ? !audio.paused : false;
    });
    const timeOnS1 = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      return audio ? audio.currentTime : 0;
    });
    console.log(`On /surprise/1: isPlaying=${isPlayingOnS1}, currentTime=${timeOnS1.toFixed(2)}s`);

    // Step C: Return to /hub from /surprise/1
    console.log('Returning to /hub from /surprise/1...');
    await page.click('[data-testid="next-button"]');
    await page.waitForURL('**/hub');
    await wait(500);

    // Step D: Re-enter /surprise/2 (Scrapbook & Music Player)
    console.log('Re-entering /surprise/2 from /hub...');
    await page.click('[data-testid="gift-box-card-2"]');
    await page.waitForURL('**/surprise/2');
    await wait(1000);

    const isPlayingReturnS2 = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      return audio ? !audio.paused : false;
    });
    const timeReturnS2 = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      return audio ? audio.currentTime : 0;
    });
    const s2PlayBtnTitle = await page.locator('[data-testid="audio-play-pause-btn"]').getAttribute('title');
    const s2HasSpin = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="audio-player-widget"] [aria-hidden="true"]');
      return el ? el.classList.contains('animate-spin') : false;
    });

    console.log(`Back on /surprise/2: isPlaying=${isPlayingReturnS2}, currentTime=${timeReturnS2.toFixed(2)}s, PlayBtnTitle="${s2PlayBtnTitle}", Spinning=${s2HasSpin}`);

    if (isPlayingOnS1 && isPlayingReturnS2 && timeReturnS2 > timeOnS1) {
      summary.audioContinuity.persistsAcrossMultiRouteHop = true;
      console.log('  ✓ Audio persisted uninterrupted across multi-route hop (/surprise/2 -> /hub -> /surprise/1 -> /hub -> /surprise/2)');
    }

    if (s2PlayBtnTitle === 'Pause music' && s2HasSpin) {
      summary.audioContinuity.controlsSyncOnReturnToSurprise2 = true;
      console.log('  ✓ Local AudioPlayerWidget controls re-synced correctly to active playback state upon returning!');
    }

    // Pause audio
    await page.locator('[data-testid="audio-play-pause-btn"]').click();
    await contextDesktop.close();

    // -------------------------------------------------------------
    // PART 3: RESPONSIVE VIEWPORT TESTING (375x667 & 1280x800)
    // -------------------------------------------------------------
    console.log('\n-------------------------------------------------------------');
    console.log('>>> [3] TESTING RESPONSIVE VIEWPORT OVERFLOW & LAYOUT');
    console.log('-------------------------------------------------------------');

    const routes = [
      { name: 'hub', path: '/hub' },
      { name: 'surprise1', path: '/surprise/1' },
      { name: 'surprise2', path: '/surprise/2' },
      { name: 'surprise3', path: '/surprise/3' },
    ];

    const viewports = [
      { key: 'desktop_1280', label: 'Desktop (1280x800)', width: 1280, height: 800 },
      { key: 'mobile_375', label: 'Mobile (375x667)', width: 375, height: 667 },
    ];

    for (const vp of viewports) {
      console.log(`\n=== Testing Viewport: ${vp.label} ===`);
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const vpPage = await ctx.newPage();

      for (const route of routes) {
        console.log(`Checking route ${route.path} on ${vp.label}...`);
        await vpPage.goto(`${baseUrl}${route.path}`, { waitUntil: 'networkidle' });
        await wait(300);

        const metrics = await vpPage.evaluate((targetWidth) => {
          const docEl = document.documentElement;
          const body = document.body;
          const winWidth = window.innerWidth;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const clientWidth = docEl.clientWidth;

          // Check for any DOM element exceeding the viewport boundary
          const overflowing = [];
          const all = document.querySelectorAll('*');
          for (const el of all) {
            if (['SCRIPT', 'STYLE', 'HEAD', 'META', 'TITLE'].includes(el.tagName)) continue;
            const rect = el.getBoundingClientRect();
            // Allow 1.5px tolerance for subpixel anti-aliasing
            if (rect.right > winWidth + 1.5 || rect.left < -1.5) {
              overflowing.push({
                tag: el.tagName.toLowerCase(),
                id: el.id || '',
                class: (el.className && typeof el.className === 'string' ? el.className.slice(0, 80) : ''),
                left: Math.round(rect.left),
                right: Math.round(rect.right),
                width: Math.round(rect.width),
              });
            }
          }

          return {
            winWidth,
            clientWidth,
            scrollWidth,
            hasHorizontalScrollbar: scrollWidth > winWidth,
            overflowingElements: overflowing.slice(0, 6),
          };
        }, vp.width);

        const passed = !metrics.hasHorizontalScrollbar && metrics.overflowingElements.length === 0;

        summary.responsiveViewports[vp.key][route.name] = {
          passed,
          scrollWidth: metrics.scrollWidth,
          winWidth: metrics.winWidth,
          overflowingElements: metrics.overflowingElements,
        };

        if (passed) {
          console.log(`  ✓ ${route.path} OK: scrollWidth=${metrics.scrollWidth}px <= winWidth=${metrics.winWidth}px, 0 overflow elements`);
        } else {
          console.error(`  ✗ ${route.path} OVERFLOW DETECTED: scrollWidth=${metrics.scrollWidth}px > winWidth=${metrics.winWidth}px or ${metrics.overflowingElements.length} elements overflowing`);
          console.error('    Overflowing elements sample:', JSON.stringify(metrics.overflowingElements, null, 2));
        }
      }

      await ctx.close();
    }

  } catch (error) {
    console.error('Fatal challenge error during execution:', error);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }

  console.log('\n===============================================================');
  console.log('  MILESTONE 3 EMPIRICAL CHALLENGE RESULTS SUMMARY');
  console.log('===============================================================');
  console.log(JSON.stringify(summary, null, 2));

  // Determine overall verdict
  const audioControlsAllPassed = Object.values(summary.audioControls).every(Boolean);
  const continuityAllPassed = Object.values(summary.audioContinuity).every(Boolean);
  const desktopAllPassed = Object.values(summary.responsiveViewports.desktop_1280).every((r) => r.passed);
  const mobileAllPassed = Object.values(summary.responsiveViewports.mobile_375).every((r) => r.passed);

  console.log('\nSummary Verdict Checks:');
  console.log(`- Audio Controls (Play/Pause/Seek/Skip/Clamping/TimeUpdates): ${audioControlsAllPassed ? 'PASS' : 'FAIL'}`);
  console.log(`- Audio Continuity Across Route Transitions (/2 -> /hub -> /1 -> /hub -> /2): ${continuityAllPassed ? 'PASS' : 'FAIL'}`);
  console.log(`- Responsive Viewports Desktop (1280x800): ${desktopAllPassed ? 'PASS' : 'FAIL'}`);
  console.log(`- Responsive Viewports Mobile (375x667): ${mobileAllPassed ? 'PASS' : 'FAIL'}`);

  const overallPassed = audioControlsAllPassed && continuityAllPassed && desktopAllPassed && mobileAllPassed;
  console.log(`\nFINAL EMPIRICAL VERDICT: ${overallPassed ? 'CONFIRMED' : 'FAILED'}\n`);

  if (!overallPassed) {
    process.exitCode = 1;
  }
}

runEmpiricalChallenge();
