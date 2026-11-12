// Technical variants only: remove the white matte, crop unused margins and resize.
// No tracing, redrawing or changes to the supplied mark's geometry.
import sharp from 'sharp';
import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [logoPath, iconPath] = process.argv.slice(2);
if (!logoPath || !iconPath)
  throw new Error(
    'Usage: node scripts/prepare-brand.mjs <original-logo.png> <original-favicon.png>',
  );
const brand = path.join(project, 'public/brand');
await mkdir(brand, { recursive: true });
await copyFile(logoPath, path.join(brand, 'logo-original.png'));
await copyFile(iconPath, path.join(brand, 'favicon-original.png'));
async function unmatte(source) {
  const { data, info } = await sharp(source)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let left = info.width,
    top = info.height,
    right = 0,
    bottom = 0;
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * 4;
      const alpha = 1 - Math.min(data[i + 1], data[i + 2]) / 255;
      if (alpha > 0.08 && data[i] > data[i + 1] * 1.5) {
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
      }
      if (alpha < 0.015) {
        data[i + 3] = 0;
        continue;
      }
      for (let c = 0; c < 3; c++)
        data[i + c] = Math.round(
          Math.max(0, Math.min(255, (data[i + c] - (1 - alpha) * 255) / alpha)),
        );
      data[i + 3] = Math.round(data[i + 3] * alpha);
    }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extract({
      left: Math.max(0, left - 6),
      top: Math.max(0, top - 6),
      width: Math.min(info.width - left, right - left + 13),
      height: Math.min(info.height - top, bottom - top + 13),
    })
    .png()
    .toBuffer();
}
const logo = await unmatte(logoPath);
await writeFile(path.join(brand, 'logo.png'), logo);
const { data, info } = await sharp(logo).raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 4) {
  data[i] = 248;
  data[i + 1] = 247;
  data[i + 2] = 244;
}
await sharp(data, { raw: info }).png().toFile(path.join(brand, 'logo-negative.png'));
const icon = await unmatte(iconPath);
const square = (size) =>
  sharp(icon)
    .resize(size - 8, size - 8, { fit: 'inside' })
    .extend({
      top: 4,
      bottom: 4,
      left: 4,
      right: 4,
      background: { r: 248, g: 247, b: 244, alpha: 1 },
    })
    .resize(size, size, { fit: 'contain', background: '#F8F7F4' })
    .png()
    .toBuffer();
await writeFile(path.join(project, 'public/favicon.png'), await square(48));
await writeFile(path.join(project, 'public/apple-touch-icon.png'), await square(180));
const png = await square(32);
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header[6] = 32;
header[7] = 32;
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
await writeFile(path.join(project, 'public/favicon.ico'), Buffer.concat([header, png]));
console.log(
  'Logotipos originales conservados; variantes transparentes, negativa, favicon PNG/ICO y apple-touch-icon creadas.',
);
