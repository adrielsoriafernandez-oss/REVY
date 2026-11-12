import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const key = process.env.PEXELS_API_KEY;
if (!key) {
  console.log(
    'PEXELS_API_KEY no está configurada. Se conservan las imágenes locales y los placeholders. Añade una clave en .env para buscar nuevas fotos.',
  );
  process.exit(0);
}
const products = JSON.parse(await readFile(path.join(project, 'src/data/products.json'), 'utf8'));
const mapPath = path.join(project, 'src/data/image-overrides.json');
const overrides = JSON.parse(await readFile(mapPath, 'utf8').catch(() => '{}'));
const sourcePath = path.join(project, 'public/images/PEXELS-SOURCES.json');
const sources = JSON.parse(await readFile(sourcePath, 'utf8').catch(() => '[]'));
const terms = [
  [/ante/i, 'suede jacket'],
  [/cuero.*chaqueta|chaqueta.*cuero/i, 'brown leather jacket'],
  [/denim.*borreguito/i, 'sherpa denim jacket'],
  [/chaqueta|barn|workwear/i, 'olive workwear jacket'],
  [/vaqueros.*negro/i, 'black bootcut jeans'],
  [/vaqueros|denim/i, 'vintage bootcut denim jeans'],
  [/pana/i, 'brown corduroy trousers'],
  [/carpenter/i, 'beige carpenter pants'],
  [/franela/i, 'plaid flannel shirt'],
  [/camisa.*western/i, 'white western shirt'],
  [/henley/i, 'henley shirt'],
  [/cardigan|cárdigan/i, 'vintage knit cardigan'],
  [/jersey/i, 'wool knit sweater'],
  [/bolso/i, 'brown leather handbag'],
  [/cinturon|cinturón/i, 'brown leather belt'],
];
for (const p of products) {
  if (p.images.length || overrides[p.id]) continue;
  const query = `${p.gender === 'hombre' ? 'men' : 'women'} ${terms.find(([pattern]) => pattern.test(p.name))?.[1] || p.name} neutral background`;
  const response = await fetch(
    `https://api.pexels.com/v1/search?${new URLSearchParams({ query, per_page: '5', orientation: 'portrait' })}`,
    { headers: { Authorization: key } },
  );
  if (!response.ok) {
    console.log(`Búsqueda detenida: Pexels HTTP ${response.status}. No se evaden restricciones.`);
    break;
  }
  const { photos = [] } = await response.json();
  // A specific visible garment must match the requested type; ambiguous results are kept for review.
  const garment = terms
    .find(([pattern]) => pattern.test(p.name))?.[1]
    .split(' ')
    .find((s) =>
      [
        'jacket',
        'jeans',
        'trousers',
        'pants',
        'shirt',
        'cardigan',
        'sweater',
        'handbag',
        'belt',
      ].includes(s),
    );
  const candidate = photos.find((photo) => garment && photo.alt?.toLowerCase().includes(garment));
  if (!candidate) {
    console.log(`Sin coincidencia suficientemente específica: ${p.name}`);
    await new Promise((r) => setTimeout(r, 1100));
    continue;
  }
  const relative = `images/pexels/${candidate.id}.jpg`;
  const destination = path.join(project, 'public', relative);
  if (
    !(await access(destination).then(
      () => true,
      () => false,
    ))
  ) {
    const image = await fetch(candidate.src.large2x);
    if (!image.ok) {
      console.log(`Descarga no disponible: HTTP ${image.status}`);
      continue;
    }
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, Buffer.from(await image.arrayBuffer()));
  }
  overrides[p.id] = { images: [relative], source: candidate.url };
  if (!sources.some((s) => s.id === candidate.id))
    sources.push({
      id: candidate.id,
      file: relative,
      url: candidate.url,
      author: candidate.photographer,
      authorUrl: candidate.photographer_url,
      license: 'Pexels License',
      licenseUrl: 'https://www.pexels.com/license/',
      query,
      alt: candidate.alt,
    });
  await writeFile(mapPath, JSON.stringify(overrides, null, 2) + '\n');
  await writeFile(sourcePath, JSON.stringify(sources, null, 2) + '\n');
  console.log(`Imagen ilustrativa descargada: ${p.name}`);
  await new Promise((r) => setTimeout(r, 1100));
}
console.log(
  'Ejecuta npm run sync:products para incorporar las imágenes. Revisa siempre su correspondencia visual.',
);
