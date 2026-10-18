import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgPath = path.resolve('public/icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  // 1. apple-touch-icon.png (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.resolve('public/apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // 2. pwa-192x192.png
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.resolve('public/pwa-192x192.png'));
  console.log('Generated pwa-192x192.png');

  // 3. pwa-512x512.png
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public/pwa-512x512.png'));
  console.log('Generated pwa-512x512.png');

  // 4. pwa-maskable-512x512.png (with 12% safe zone padding)
  const innerSize = Math.round(512 * 0.8);
  const innerResized = await sharp(svgBuffer)
    .resize(innerSize, innerSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 16, g: 185, b: 129, alpha: 1 }, // matching green #10b981
    },
  })
    .composite([
      {
        input: innerResized,
        top: Math.round((512 - innerSize) / 2),
        left: Math.round((512 - innerSize) / 2),
      },
    ])
    .png()
    .toFile(path.resolve('public/pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');
}

generate().catch(console.error);
