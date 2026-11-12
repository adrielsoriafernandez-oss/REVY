import archiver from 'archiver';
import { createWriteStream } from 'node:fs';
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.resolve(process.argv[2] || path.join(root, 'artifacts/revy-github.zip'));
await mkdir(path.dirname(destination), { recursive: true });
const output = createWriteStream(destination);
const archive = archiver('zip', { zlib: { level: 9 } });
const completion = new Promise((resolve, reject) => {
  output.on('close', resolve);
  output.on('error', reject);
  archive.on('error', reject);
});
archive.pipe(output);
// Include only project sources. Never sweep unknown dotfiles, credentials, build output or caches.
for (const directory of ['.github', 'public', 'src', 'scripts', 'tests', 'docs'])
  archive.directory(path.join(root, directory), `revy/${directory}`);
for (const file of [
  'package.json',
  'package-lock.json',
  'index.html',
  'tsconfig.json',
  'vite.config.ts',
  'README.md',
  'THIRD-PARTY-NOTICES.md',
  '.gitignore',
  '.env.example',
  '.prettierrc.json',
  '.prettierignore',
])
  archive.file(path.join(root, file), { name: `revy/${file}` });
await archive.finalize();
await completion;
console.log(`ZIP creado: ${destination} (${(await stat(destination)).size} bytes)`);
