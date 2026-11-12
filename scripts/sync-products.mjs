import { readdir, readFile, writeFile, mkdir, copyFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const slugify = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const imagePattern = /\.(jpe?g|png|webp|avif|gif)$/i;
const exists = async (p) =>
  access(p).then(
    () => true,
    () => false,
  );
async function metadata(dir, stem) {
  for (const name of [stem && `${stem}.json`, 'product.json', 'metadata.json'].filter(Boolean)) {
    try {
      return JSON.parse(await readFile(path.join(dir, name), 'utf8'));
    } catch (error) {
      if (error.code !== 'ENOENT')
        throw new Error(`Metadatos inválidos: ${path.join(dir, name)}: ${error.message}`);
    }
  }
  return {};
}
export async function syncProducts({
  root = process.env.REVY_PRODUCTS_ROOT || path.resolve(project, '..'),
  output = path.join(project, 'src/data/products.json'),
  publicDir = path.join(project, 'public'),
  log = console.log,
} = {}) {
  const folders = await readdir(root, { withFileTypes: true }).catch(() => []);
  const genders = folders.filter(
    (d) => d.isDirectory() && ['hombre', 'mujer'].includes(slugify(d.name)),
  );
  if (!genders.length) {
    log(
      'No se encuentran Hombre/Mujer. Se conserva el catálogo incluido. Usa REVY_PRODUCTS_ROOT para otra ubicación.',
    );
    return null;
  }
  const previous = JSON.parse(await readFile(output, 'utf8').catch(() => '[]'));
  const imageMap = JSON.parse(
    await readFile(path.join(project, 'src/data/image-overrides.json'), 'utf8').catch(() => '{}'),
  );
  const result = [];
  let originalImages = 0;
  const featuredNames = [
    'Chaqueta de cuero bomber marrón vintage',
    'Vaqueros bootcut azul lavado',
    'Camisa de franela roja vintage',
    'Chaqueta de ante marrón claro',
  ];
  for (const genderDir of genders.sort((a, b) => a.name.localeCompare(b.name))) {
    const gender = slugify(genderDir.name);
    const genderPath = path.join(root, genderDir.name);
    for (const categoryDir of (await readdir(genderPath, { withFileTypes: true }))
      .filter((d) => d.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name))) {
      const categoryPath = path.join(genderPath, categoryDir.name);
      const entries = await readdir(categoryPath, { withFileTypes: true });
      const candidates = [];
      const walk = async (dir) => {
        const items = await readdir(dir, { withFileTypes: true });
        const images = items
          .filter((d) => d.isFile() && imagePattern.test(d.name))
          .map((d) => path.join(dir, d.name))
          .sort();
        const dirs = items.filter((d) => d.isDirectory());
        if (images.length || !dirs.length)
          candidates.push({ name: path.basename(dir), dir, images, stem: undefined });
        else for (const sub of dirs) await walk(path.join(dir, sub.name));
      };
      for (const entry of entries.filter((d) => d.isDirectory()))
        await walk(path.join(categoryPath, entry.name));
      const directGroups = new Map();
      for (const entry of entries.filter((d) => d.isFile() && imagePattern.test(d.name))) {
        const stem = path
          .parse(entry.name)
          .name.replace(/(?:[-_ ](?:front|back|side|detail|frente|espalda|detalle|\d+))+$/i, '');
        const group = directGroups.get(stem) || [];
        group.push(path.join(categoryPath, entry.name));
        directGroups.set(stem, group);
      }
      for (const [stem, images] of directGroups)
        candidates.push({ name: stem, dir: categoryPath, images: images.sort(), stem });
      for (const candidate of candidates) {
        const relative = path
          .relative(root, candidate.stem ? path.join(candidate.dir, candidate.stem) : candidate.dir)
          .split(path.sep)
          .join('/');
        const id = createHash('sha256').update(relative).digest('hex').slice(0, 12);
        const meta = await metadata(candidate.dir, candidate.stem);
        const old = previous.find((p) => p.id === id);
        const name = typeof meta.name === 'string' ? meta.name : candidate.name;
        const slug = `${gender}-${slugify(candidate.name)}-${id.slice(0, 4)}`;
        const images = [];
        for (let i = 0; i < candidate.images.length; i++) {
          const source = candidate.images[i];
          const destination = `products/${id}/${i + 1}${path.extname(source).toLowerCase()}`;
          await mkdir(path.dirname(path.join(publicDir, destination)), { recursive: true });
          await copyFile(source, path.join(publicDir, destination));
          images.push(destination);
          originalImages++;
        }
        const override = imageMap[id] || imageMap[candidate.name];
        const illustrative =
          !images.length &&
          (override ||
            (old?.imageIsIllustrative && old.images.length
              ? { images: old.images, source: old.imageSource, generated: old.imageIsGenerated }
              : null));
        if (illustrative)
          for (const image of illustrative.images)
            if (await exists(path.join(publicDir, image))) images.push(image);
        const basePrice =
          {
            'Chaquetas y abrigos': 65,
            'Pantalones y denim': 38,
            'Camisas y camisetas': 26,
            'Jerséis y punto': 35,
            Accesorios: 24,
          }[categoryDir.name] || 30;
        const hasPrice =
          typeof meta.price === 'number' && Number.isFinite(meta.price) && meta.price >= 0;
        const product = {
          id,
          slug,
          name,
          gender,
          category: categoryDir.name,
          price: hasPrice ? meta.price : basePrice + (parseInt(id.slice(0, 2), 16) % 4) * 3,
          priceIsDemo: !hasPrice,
          images,
          sourcePath: relative,
        };
        if (images.length && !candidate.images.length) {
          product.imageIsIllustrative = true;
          if (illustrative.generated) product.imageIsGenerated = true;
          product.imageSource = illustrative.source || 'Consulta public/images/ASSETS-SOURCES.json';
        }
        for (const key of ['description', 'color', 'condition', 'addedAt'])
          if (typeof meta[key] === 'string') product[key] = meta[key];
        if (Array.isArray(meta.sizes) && meta.sizes.every((x) => typeof x === 'string'))
          product.sizes = meta.sizes;
        product.featured =
          typeof meta.featured === 'boolean'
            ? meta.featured
            : featuredNames.includes(candidate.name);
        result.push(product);
      }
    }
  }
  const unique = [...new Map(result.map((p) => [p.id, p])).values()];
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify(unique, null, 2) + '\n');
  log(
    `${unique.length} productos sincronizados. ${originalImages} fotografías originales. ${unique.filter((p) => p.imageIsIllustrative).length} productos con imágenes ilustrativas.`,
  );
  return unique;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await syncProducts();
