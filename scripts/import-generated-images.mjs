// Copy approved ImageGen outputs into the project, optimize them and persist provenance.
// The input is a local authoring manifest; it is not needed when running the website.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import assert from 'node:assert/strict';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = process.argv[2];
if (!input)
  throw new Error('Usage: node scripts/import-generated-images.mjs <authoring-manifest.json>');
const records = JSON.parse(await readFile(path.resolve(input), 'utf8'));
const products = JSON.parse(await readFile(path.join(root, 'src/data/products.json'), 'utf8'));
const mapFile = path.join(root, 'src/data/image-overrides.json');
const overrides = JSON.parse(await readFile(mapFile, 'utf8'));
const sourceFile = path.join(root, 'public/images/GENERATED-SOURCES.json');
const sources = JSON.parse(await readFile(sourceFile, 'utf8').catch(() => '[]'));
await mkdir(path.join(root, 'public/images/generated'), { recursive: true });
for (const record of records) {
  const product = products.find((p) => p.id === record.id);
  assert(product && product.name === record.name, `Product mismatch: ${record.name}`);
  assert(/^[a-z0-9-]+$/.test(record.file), 'Invalid destination filename');
  const relative = `images/generated/${record.id}-${record.file}.webp`;
  await sharp(record.sourcePath)
    .rotate()
    .resize({ width: 1000, withoutEnlargement: true })
    .webp({ quality: 87, effort: 6 })
    .toFile(path.join(root, 'public', relative));
  const entry = {
    productId: product.id,
    productName: product.name,
    path: relative,
    generator: 'OpenAI ImageGen (built-in)',
    generatedAt: '2026-11-12',
    imageIsIllustrative: true,
    generated: true,
    prompt: record.prompt,
    description: `Ilustración de producto generada para ${product.name}. No documenta un artículo real.`,
    usage: 'REVY catalog product illustration',
  };
  const previousIndex = sources.findIndex((s) => s.productId === product.id);
  if (previousIndex < 0) sources.push(entry);
  else sources[previousIndex] = entry;
  const assignment = {
    images: [relative],
    source: 'Imagen ilustrativa generada con IA para REVY',
    generated: true,
  };
  overrides[product.id] = assignment;
  overrides[product.name] = assignment;
}
await writeFile(sourceFile, JSON.stringify(sources, null, 2) + '\n');
await writeFile(mapFile, JSON.stringify(overrides, null, 2) + '\n');
console.log(
  `${records.length} imágenes aprobadas incorporadas en WebP. Los originales de ImageGen se conservan. Ejecuta npm run sync:products.`,
);
