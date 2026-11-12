import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

export async function validateProductImages(products, { publicDir, sources }) {
  const files = new Set();
  const publicRoot = path.resolve(publicDir);
  for (const product of products) {
    assert(
      Array.isArray(product.images) && product.images.length > 0,
      `Producto sin imagen: ${product.name}`,
    );
    if (product.imageIsGenerated)
      assert(
        product.imageIsIllustrative,
        `Una imagen generada debe indicarse como ilustrativa: ${product.name}`,
      );
    for (const image of product.images) {
      assert(
        typeof image === 'string' && !image.startsWith('http'),
        'La imagen debe ser un archivo local del proyecto',
      );
      const absolute = path.resolve(publicRoot, image);
      assert(
        absolute.startsWith(publicRoot + path.sep),
        `La imagen sale de public: ${product.name}`,
      );
      const metadata = await sharp(await readFile(absolute)).metadata();
      assert(metadata.width > 0 && metadata.height > 0, `Imagen no válida: ${product.name}`);
      const source = sources.find((entry) => entry.path === image);
      if (product.imageIsIllustrative)
        assert(source, `Imagen ilustrativa sin registro de procedencia: ${product.name}`);
      if (product.imageIsGenerated)
        assert(
          source?.generated && source.generator,
          `Imagen generada sin procedencia registrada: ${product.name}`,
        );
      files.add(image);
    }
  }
  return files;
}
