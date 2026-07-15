import * as esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../../artifacts/api-server/dist');

mkdirSync(outDir, { recursive: true });

await esbuild.build({
  entryPoints: [path.join(__dirname, '../dist/index.js')],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: path.join(outDir, 'index.mjs'),
  external: ['pg', '@napi-rs/canvas', 'discord.js', 'drizzle-orm'],
  sourcemap: true,
  minify: false,
});

console.log('✅ Bundle complete!');
