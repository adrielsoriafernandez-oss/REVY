import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { validateProductImages } from './lib/validate-product-images.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const products = JSON.parse(await readFile(path.join(root, 'src/data/products.json'), 'utf8'));
assert.equal(products.length, new Set(products.map((p) => p.id)).size, 'Duplicate product IDs');
assert.equal(products.length, new Set(products.map((p) => p.slug)).size, 'Duplicate product slugs');
const sources = [
  ...JSON.parse(await readFile(path.join(root, 'public/images/ASSETS-SOURCES.json'), 'utf8'))
    .assets,
  ...JSON.parse(
    await readFile(path.join(root, 'public/images/PEXELS-SOURCES.json'), 'utf8').catch(() => '[]'),
  ).map((source) => ({ ...source, path: source.file })),
  ...JSON.parse(
    await readFile(path.join(root, 'public/images/GENERATED-SOURCES.json'), 'utf8').catch(
      () => '[]',
    ),
  ),
];
const files = new Set([
  'brand/logo.png',
  'brand/logo-negative.png',
  'favicon.png',
  'favicon.ico',
  'apple-touch-icon.png',
  'images/editorial-hero.webp',
  'images/editorial-field.webp',
  'images/editorial-mujer.webp',
  'images/landscape-lake.webp',
]);
for (const p of products) {
  assert(['hombre', 'mujer'].includes(p.gender));
  assert(typeof p.name === 'string' && p.name.length);
  assert(p.price === null || (Number.isFinite(p.price) && p.price >= 0));
}
for (const image of await validateProductImages(products, {
  publicDir: path.join(root, 'public'),
  sources,
}))
  files.add(image);
for (const file of files) await access(path.join(root, 'public', file));
console.log(
  `Catálogo validado: ${products.length} productos; ${files.size} recursos referenciados disponibles; IDs y slugs únicos.`,
);
