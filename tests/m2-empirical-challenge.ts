import { getCatThresholdConfig, CAT_THRESHOLDS } from '../components/CatDisplay';
import * as fs from 'fs';
import * as path from 'path';

interface AssertionResult {
  name: string;
  passed: boolean;
  expected: any;
  actual: any;
  error?: string;
}

const results: AssertionResult[] = [];

function assertEqual(name: string, actual: any, expected: any) {
  const passed = actual === expected;
  results.push({ name, passed, expected, actual });
  if (!passed) {
    console.error(`❌ FAIL: ${name} | Expected: ${expected}, Actual: ${actual}`);
  } else {
    console.log(`✅ PASS: ${name} -> ${actual}`);
  }
}

function assertRange(name: string, actual: number, min: number, max: number) {
  const passed = actual >= min && actual <= max;
  results.push({ name, passed, expected: `[${min}, ${max}]`, actual });
  if (!passed) {
    console.error(`❌ FAIL: ${name} | Expected in [${min}, ${max}], Actual: ${actual}`);
  } else {
    console.log(`✅ PASS: ${name} -> ${actual} in [${min}, ${max}]`);
  }
}

console.log('=====================================================');
console.log('CHALLENGE SUITE: Milestone 2 Slider & Threshold Tests');
console.log('=====================================================\n');

// ----------------------------------------------------
// 1. THRESHOLD BOUNDARY EVALUATION
// ----------------------------------------------------
console.log('--- 1. Testing Threshold Boundaries ---');

// 0%
const cfg0 = getCatThresholdConfig(0);
assertEqual('0% State', cfg0.state, 'shy');
assertEqual('0% Text', cfg0.reactionText, 'Only that much?');

// 13.9% (Below 14%)
const cfg13_9 = getCatThresholdConfig(13.9);
assertEqual('13.9% State', cfg13_9.state, 'shy');
assertEqual('13.9% Text', cfg13_9.reactionText, 'Only that much?');

// 13.99% (Epsilon Below 14%)
const cfg13_99 = getCatThresholdConfig(13.99);
assertEqual('13.99% State', cfg13_99.state, 'shy');

// 14% (Boundary transition to crying)
const cfg14 = getCatThresholdConfig(14);
assertEqual('14% State', cfg14.state, 'crying');
assertEqual('14% Text', cfg14.reactionText, 'Half? Seriously?');

// 54.9% (Below 55%)
const cfg54_9 = getCatThresholdConfig(54.9);
assertEqual('54.9% State', cfg54_9.state, 'crying');
assertEqual('54.9% Text', cfg54_9.reactionText, 'Half? Seriously?');

// 54.99% (Epsilon Below 55%)
const cfg54_99 = getCatThresholdConfig(54.99);
assertEqual('54.99% State', cfg54_99.state, 'crying');

// 55% (Boundary transition to confused)
const cfg55 = getCatThresholdConfig(55);
assertEqual('55% State', cfg55.state, 'confused');
assertEqual('55% Text', cfg55.reactionText, "Aww, that's more like it!");

// 80.9% (Below 81%)
const cfg80_9 = getCatThresholdConfig(80.9);
assertEqual('80.9% State', cfg80_9.state, 'confused');
assertEqual('80.9% Text', cfg80_9.reactionText, "Aww, that's more like it!");

// 80.99% (Epsilon Below 81%)
const cfg80_99 = getCatThresholdConfig(80.99);
assertEqual('80.99% State', cfg80_99.state, 'confused');

// 81% (Boundary transition to happy)
const cfg81 = getCatThresholdConfig(81);
assertEqual('81% State', cfg81.state, 'happy');
assertEqual('81% Text', cfg81.reactionText, 'love');

// 499.9% (Below 500%)
const cfg499_9 = getCatThresholdConfig(499.9);
assertEqual('499.9% State', cfg499_9.state, 'happy');
assertEqual('499.9% Text', cfg499_9.reactionText, 'love');

// 499.99% (Epsilon Below 500%)
const cfg499_99 = getCatThresholdConfig(499.99);
assertEqual('499.99% State', cfg499_99.state, 'happy');

// 500% (Boundary transition to ecstatic)
const cfg500 = getCatThresholdConfig(500);
assertEqual('500% State', cfg500.state, 'ecstatic');
assertEqual('500% Text', cfg500.reactionText, 'Correct answer!');

// 550% (Overdrag)
const cfg550 = getCatThresholdConfig(550);
assertEqual('550% Overdrag State', cfg550.state, 'ecstatic');
assertEqual('550% Overdrag Text', cfg550.reactionText, 'Correct answer!');

// Negative & Extreme Boundary Robustness
const cfgNeg = getCatThresholdConfig(-20);
assertEqual('Negative Value (-20) State', cfgNeg.state, 'shy');

const cfg1000 = getCatThresholdConfig(1000);
assertEqual('Overdrag (1000%) State', cfg1000.state, 'ecstatic');

// ----------------------------------------------------
// 2. ASSET FILE INTEGRITY FOR ALL 5 STATES
// ----------------------------------------------------
console.log('\n--- 2. Testing Asset File Integrity on Disk ---');
const publicDir = path.resolve(__dirname, '..', 'public');

for (const [state, config] of Object.entries(CAT_THRESHOLDS)) {
  const filePath = path.join(publicDir, config.imageSrc.replace(/^\//, ''));
  const exists = fs.existsSync(filePath);
  const stats = exists ? fs.statSync(filePath) : null;
  const isNonEmpty = stats ? stats.size > 10000 : false;
  assertEqual(`Asset exists for [${state}]: ${config.imageSrc}`, exists, true);
  assertEqual(`Asset non-empty (>10KB) for [${state}]`, isNonEmpty, true);
}

// ----------------------------------------------------
// 3. SLIDER DRAG PHYSICS MATHEMATICAL ORACLE
// ----------------------------------------------------
console.log('\n--- 3. Testing Slider Drag Physics Oracle ---');

// Model of calculateValueFromPointer from LoveSlider.tsx
function simulateCalculateValue(
  clientX: number,
  trackLeft: number,
  trackWidth: number,
  wOverdrive = 160
): number {
  if (trackWidth <= 0) return 0;
  const x = clientX - trackLeft;

  if (x <= 0) return 0;
  if (x <= trackWidth) {
    const ratio = x / trackWidth;
    return Math.round(ratio * 100);
  }

  const overdriveX = x - trackWidth;
  const overdriveRatio = Math.min(1, overdriveX / wOverdrive);
  const computedValue = Math.round(100 + overdriveRatio * 400);
  return Math.min(500, computedValue);
}

const trackLeft = 100;
const trackWidth = 400; // e.g., 400px wide track
const wOverdrive = 160;

// Test negative coordinate drag (pointer dragged left of track)
assertEqual(
  'Pointer at x=50 (left of trackLeft 100)',
  simulateCalculateValue(50, trackLeft, trackWidth, wOverdrive),
  0
);
assertEqual(
  'Pointer exactly at trackLeft 100',
  simulateCalculateValue(100, trackLeft, trackWidth, wOverdrive),
  0
);

// Test 14% position: 100 + 400 * 0.14 = 156
assertEqual(
  'Pointer at 14% mark (x=156)',
  simulateCalculateValue(156, trackLeft, trackWidth, wOverdrive),
  14
);

// Test 55% position: 100 + 400 * 0.55 = 320
assertEqual(
  'Pointer at 55% mark (x=320)',
  simulateCalculateValue(320, trackLeft, trackWidth, wOverdrive),
  55
);

// Test 81% position: 100 + 400 * 0.81 = 424
assertEqual(
  'Pointer at 81% mark (x=424)',
  simulateCalculateValue(424, trackLeft, trackWidth, wOverdrive),
  81
);

// Test 100% position: 100 + 400 = 500
assertEqual(
  'Pointer at 100% physical track end (x=500)',
  simulateCalculateValue(500, trackLeft, trackWidth, wOverdrive),
  100
);

// Test Overdrive Midpoint (300%): 500 + 160 * (200/400) = 500 + 80 = 580
assertEqual(
  'Pointer at 300% overdrive midpoint (x=580)',
  simulateCalculateValue(580, trackLeft, trackWidth, wOverdrive),
  300
);

// Test 500% reached at overdrive end: 500 + 160 = 660
assertEqual(
  'Pointer at 500% overdrive limit (x=660)',
  simulateCalculateValue(660, trackLeft, trackWidth, wOverdrive),
  500
);

// Test Overdrag at 550% equivalent: 500 + 160 + 50 = 710
assertEqual(
  'Pointer at overdrag x=710 (550% equivalent)',
  simulateCalculateValue(710, trackLeft, trackWidth, wOverdrive),
  500 // Must be strictly clamped to 500
);

// Test extreme overdrag: x = 2000
assertEqual(
  'Pointer at extreme overdrag x=2000',
  simulateCalculateValue(2000, trackLeft, trackWidth, wOverdrive),
  500
);

// ----------------------------------------------------
// 4. VISUAL OVERHANG & STYLING CLAMPING ORACLE
// ----------------------------------------------------
console.log('\n--- 4. Testing Thumb Overhang and Styling Clamping ---');

const MAX_THUMB_OVERHANG = 64;

function computeThumbOverhang(value: number): number {
  const isOverdrive = value > 100;
  const overdriveRatio = isOverdrive ? Math.min(1, (value - 100) / 400) : 0;
  return overdriveRatio * MAX_THUMB_OVERHANG;
}

assertEqual('Overhang at value=0', computeThumbOverhang(0), 0);
assertEqual('Overhang at value=50', computeThumbOverhang(50), 0);
assertEqual('Overhang at value=100', computeThumbOverhang(100), 0);
assertEqual('Overhang at value=300 (50% overdrive)', computeThumbOverhang(300), 32);
assertEqual('Overhang at value=500 (100% overdrive)', computeThumbOverhang(500), 64);
assertEqual('Overhang at value=550 (overdrag clamped)', computeThumbOverhang(550), 64);

// ----------------------------------------------------
// 5. KEYBOARD STATE MACHINE SIMULATION
// ----------------------------------------------------
console.log('\n--- 5. Testing Keyboard State Machine ---');

function simulateKeyboardNavigation(
  initialValue: number,
  keys: string[]
): { finalValue: number; unlocked: boolean; unlockCount: number } {
  let val = initialValue;
  let unlocked = initialValue >= 500;
  let unlockCount = 0;

  const triggerUnlock = () => {
    unlocked = true;
    unlockCount++;
  };

  for (const key of keys) {
    let delta = 0;
    let targetValue: number | null = null;

    switch (key) {
      case 'ArrowRight':
      case 'ArrowUp':
        delta = 5;
        break;
      case 'Shift+ArrowRight':
        delta = 1;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        delta = -5;
        break;
      case 'Shift+ArrowLeft':
        delta = -1;
        break;
      case 'PageUp':
        delta = 50;
        break;
      case 'PageDown':
        delta = -50;
        break;
      case 'Home':
        targetValue = 0;
        break;
      case 'End':
        targetValue = 500;
        break;
    }

    const nextValue =
      targetValue !== null ? targetValue : Math.max(0, Math.min(500, val + delta));

    val = nextValue;
    if (nextValue >= 500 && !unlocked) {
      triggerUnlock();
    }
  }

  return { finalValue: val, unlocked, unlockCount };
}

// Key tests:
const kb1 = simulateKeyboardNavigation(0, ['ArrowRight', 'ArrowRight']);
assertEqual('ArrowRight twice from 0', kb1.finalValue, 10);
assertEqual('ArrowRight twice unlocked?', kb1.unlocked, false);

const kb2 = simulateKeyboardNavigation(0, ['ArrowLeft', 'ArrowLeft']);
assertEqual('ArrowLeft below zero clamped to 0', kb2.finalValue, 0);

const kb3 = simulateKeyboardNavigation(0, ['PageUp', 'PageUp', 'PageUp']);
assertEqual('PageUp 3 times from 0', kb3.finalValue, 150);

const kb4 = simulateKeyboardNavigation(150, ['Home']);
assertEqual('Home jumps to 0', kb4.finalValue, 0);

const kb5 = simulateKeyboardNavigation(0, ['End']);
assertEqual('End jumps to 500', kb5.finalValue, 500);
assertEqual('End unlocks', kb5.unlocked, true);
assertEqual('End unlockCount', kb5.unlockCount, 1);

const kb6 = simulateKeyboardNavigation(495, ['ArrowRight', 'ArrowRight', 'ArrowRight']);
assertEqual('ArrowRight past 500 clamps strictly at 500', kb6.finalValue, 500);
assertEqual('Past 500 unlocks once', kb6.unlockCount, 1);

// Latching verification: move to 500 then back down to 14
const kb7 = simulateKeyboardNavigation(0, ['End', 'PageDown', 'PageDown']);
assertEqual('Latching test: End then PageDown x 2 value is 400', kb7.finalValue, 400);
assertEqual('Latching test: Still unlocked after value drops to 400', kb7.unlocked, true);

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
const totalTests = results.length;
const passedTests = results.filter((r) => r.passed).length;
const failedTests = totalTests - passedTests;

console.log('\n=====================================================');
console.log(`SUMMARY: ${passedTests}/${totalTests} PASSED, ${failedTests} FAILED`);
console.log('=====================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
