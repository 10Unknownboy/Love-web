import fs from 'fs';
import path from 'path';

const projectRoot = 'C:\\Users\\HP\\.gemini\\antigravity\\scratch\\Love-web';
const brainDir = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\892cf02e-1aef-4078-9be9-533def2189df';
const imagesDir = path.join(projectRoot, 'public', 'images');
const audioDir = path.join(projectRoot, 'public', 'audio');

const imageMap = {
  'cat_shy_1789035906717.jpg': 'cat_shy.jpg',
  'cat_crying_skeptical_1789036122521.jpg': 'cat_crying.jpg',
  'cat_confused_1789036152362.jpg': 'cat_confused.jpg',
  'cat_happy_1789036176958.jpg': 'cat_happy.jpg',
  'cat_ecstatic_heart_1789036477910.jpg': 'cat_ecstatic.jpg',
  'roses_bouquet_1789035858530.jpg': 'bouquet.jpg',
  'blue_gift_box_1789035884698.jpg': 'gift_box.jpg',
  'polaroid_clouds_hills_1789035835480.jpg': 'polaroid.jpg',
  'kissing_birds_1789036516049.jpg': 'kissing_birds.jpg',
  'paper_airplane_1789036535504.jpg': 'paper_airplane.jpg',
};

async function main() {
  console.log('--- Setting up Love-web Static Assets ---');

  fs.mkdirSync(imagesDir, { recursive: true });
  fs.mkdirSync(audioDir, { recursive: true });

  console.log('\n[1/2] Copying 10 kawaii image assets...');
  let copiedCount = 0;
  for (const [srcName, destName] of Object.entries(imageMap)) {
    const srcPath = path.join(brainDir, srcName);
    const destPath = path.join(imagesDir, destName);

    if (!fs.existsSync(srcPath)) {
      throw new Error(`Source image not found: ${srcPath}`);
    }

    fs.copyFileSync(srcPath, destPath);
    const stat = fs.statSync(destPath);
    console.log(`  ✓ ${destName} (${(stat.size / 1024).toFixed(1)} KB)`);
    copiedCount++;
  }
  console.log(`Completed copying ${copiedCount}/10 images.`);

  console.log('\n[2/2] Sourcing romantic audio track ("Birds of a Feather" by Purrple Cat)...');
  const targetAudioPath = path.join(audioDir, 'romantic_melody.mp3');
  const audioUrl = 'https://www.free-stock-music.com/music/purrple-cat/mp3/purrple-cat-birds-of-a-feather.mp3';

  if (fs.existsSync(targetAudioPath) && fs.statSync(targetAudioPath).size > 1000000) {
    console.log('  ✓ romantic_melody.mp3 already exists. Skipping download.');
  } else {
    try {
      const res = await fetch(audioUrl, {
        headers: {
          'Referer': 'https://www.free-stock-music.com/purrple-cat-birds-of-a-feather.html',
          'User-Agent': 'Mozilla/5.0',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(targetAudioPath, buf);
      console.log(`  ✓ romantic_melody.mp3 downloaded successfully (${(buf.byteLength / (1024 * 1024)).toFixed(2)} MB)`);
    } catch (err) {
      console.warn(`  ⚠️ Audio download failed (${err.message}). Procedural synth fallback will be used.`);
    }
  }

  console.log('\n=== Static assets setup complete! ===');
}

main().catch((err) => {
  console.error('Asset setup failed:', err);
  process.exit(1);
});
