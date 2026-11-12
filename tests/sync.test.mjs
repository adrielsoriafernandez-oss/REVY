import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { syncProducts } from '../scripts/sync-products.mjs';
test('synchronizes empty folders, direct galleries and metadata without changing originals; IDs stay stable', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'revy-sync-'));
  try {
    const root = path.join(temp, 'source'),
      publicDir = path.join(temp, 'public'),
      output = path.join(temp, 'data/products.json');
    const category = path.join(root, 'Hombre', 'Chaquetas');
    const product = path.join(category, 'Cuero vintage');
    await mkdir(product, { recursive: true });
    await writeFile(
      path.join(product, 'product.json'),
      JSON.stringify({ price: 42, sizes: ['M'], condition: 'Buen estado' }),
    );
    await writeFile(path.join(category, 'Denim-front.jpg'), 'front');
    await writeFile(path.join(category, 'Denim-back.jpg'), 'back');
    const first = await syncProducts({ root, output, publicDir, log: () => {} });
    assert.equal(first.length, 2);
    assert.equal(first.find((p) => p.name === 'Denim').images.length, 2);
    assert.equal(first.find((p) => p.name === 'Cuero vintage').price, 42);
    assert.deepEqual(first.find((p) => p.name === 'Cuero vintage').sizes, ['M']);
    assert.equal(first.find((p) => p.name === 'Cuero vintage').images.length, 0);
    assert.equal(first.find((p) => p.name === 'Denim').priceIsDemo, true);
    const second = await syncProducts({ root, output, publicDir, log: () => {} });
    assert.deepEqual(second, first);
    assert.equal(await readFile(path.join(category, 'Denim-front.jpg'), 'utf8'), 'front');
    assert.equal(
      await syncProducts({ root: path.join(temp, 'missing'), output, publicDir, log: () => {} }),
      null,
    );
    assert.deepEqual(JSON.parse(await readFile(output, 'utf8')), first);
  } finally {
    assert(path.resolve(temp).startsWith(path.resolve(os.tmpdir()) + path.sep));
    await rm(temp, { recursive: true, force: true });
  }
});

test('generated illustrations survive synchronization and real photographs take priority', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'revy-generated-sync-'));
  try {
    const root = path.join(temp, 'source'),
      publicDir = path.join(temp, 'public'),
      output = path.join(temp, 'data/products.json');
    const relative = 'Hombre/Chaquetas/Ilustración de prueba';
    const id = createHash('sha256').update(relative).digest('hex').slice(0, 12);
    await mkdir(path.join(root, relative), { recursive: true });
    await mkdir(publicDir, { recursive: true });
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(path.join(publicDir, 'illustration.webp'), 'illustrative fixture');
    await writeFile(
      output,
      JSON.stringify([
        {
          id,
          images: ['illustration.webp'],
          imageIsIllustrative: true,
          imageIsGenerated: true,
          imageSource: 'Generated test fixture',
        },
      ]),
    );
    const [illustrated] = await syncProducts({ root, output, publicDir, log: () => {} });
    assert.equal(illustrated.imageIsGenerated, true);
    assert.equal(illustrated.imageSource, 'Generated test fixture');
    await writeFile(path.join(root, relative, 'original.jpg'), 'original fixture');
    const [original] = await syncProducts({ root, output, publicDir, log: () => {} });
    assert.equal(original.id, id);
    assert.equal(original.imageIsGenerated, undefined);
    assert.equal(original.imageIsIllustrative, undefined);
    assert.equal(original.images[0], `products/${id}/1.jpg`);
    assert.equal(
      await readFile(path.join(root, relative, 'original.jpg'), 'utf8'),
      'original fixture',
    );
  } finally {
    assert(path.resolve(temp).startsWith(path.resolve(os.tmpdir()) + path.sep));
    await rm(temp, { recursive: true, force: true });
  }
});
