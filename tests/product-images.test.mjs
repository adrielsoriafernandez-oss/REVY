import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';
import { validateProductImages } from '../scripts/lib/validate-product-images.mjs';

test('delivery rejects missing or corrupt pictures and requires provenance for generated illustrations', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'revy-images-'));
  try {
    const options = { publicDir: directory, sources: [] };
    await assert.rejects(
      validateProductImages([{ name: 'Sin imagen', images: [] }], options),
      /Producto sin imagen: Sin imagen/,
    );
    await writeFile(path.join(directory, 'corrupt.webp'), 'not an image');
    await assert.rejects(
      validateProductImages([{ name: 'Corrupta', images: ['corrupt.webp'] }], options),
    );
    await sharp({ create: { width: 30, height: 40, channels: 3, background: '#D9D6CE' } })
      .webp()
      .toFile(path.join(directory, 'valid.webp'));
    const product = {
      name: 'Ilustración',
      images: ['valid.webp'],
      imageIsIllustrative: true,
      imageIsGenerated: true,
    };
    await assert.rejects(validateProductImages([product], options), /sin registro de procedencia/);
    const files = await validateProductImages([product], {
      ...options,
      sources: [{ path: 'valid.webp', generated: true, generator: 'ImageGen test fixture' }],
    });
    assert.deepEqual([...files], ['valid.webp']);
    await assert.rejects(
      validateProductImages([{ ...product, imageIsIllustrative: false }], options),
      /debe indicarse como ilustrativa/,
    );
  } finally {
    assert(path.resolve(directory).startsWith(path.resolve(os.tmpdir()) + path.sep));
    await rm(directory, { recursive: true, force: true });
  }
});
