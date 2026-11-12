// Curated, illustrative matches only. Originals found by sync-products always take priority.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sources = JSON.parse(
  await readFile(path.join(root, 'public/images/ASSETS-SOURCES.json'), 'utf8'),
).assets;
const assignments = {
  'Camisa de franela a cuadros': 'flannel-red.webp',
  'Vaqueros rectos azul oscuro': 'jeans-blue-studio.webp',
  'Bolso de cuero marrón vintage': 'bag-brown.webp',
  'Cárdigan de punto color crema': 'cardigan-cream.webp',
  'Vaqueros flare azul claro': 'jeans-flare-blue.webp',
  'Vaqueros rectos vintage': 'jeans-blue-studio.webp',
};
const mapFile = path.join(root, 'src/data/image-overrides.json');
const overrides = JSON.parse(await readFile(mapFile, 'utf8'));
for (const [name, file] of Object.entries(assignments)) {
  const source = sources.find((s) => s.file === file);
  if (!source) throw new Error(`Missing source: ${file}`);
  overrides[name] = { images: [source.path], source: source.sourcePage };
}
const generated = JSON.parse(
  await readFile(path.join(root, 'public/images/GENERATED-SOURCES.json'), 'utf8').catch(() => '[]'),
);
for (const entry of generated) {
  const assignment = {
    images: [entry.path],
    source: 'Imagen ilustrativa generada con IA para REVY',
    generated: true,
  };
  overrides[entry.productId] = assignment;
  overrides[entry.productName] = assignment;
}
await writeFile(mapFile, JSON.stringify(overrides, null, 2) + '\n');
console.log(
  `${Object.keys(assignments).length} fotografías de stock y ${generated.length} imágenes generadas registradas. Ejecuta npm run sync:products.`,
);
