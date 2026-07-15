import * as esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

await esbuild.build({
  entryPoints: [path.join(__dirname, '../dist/index.js')],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: path.join(__dirname, '../../artifacts/api-server/dist/index.mjs'),
  external: ['pg', '@napi-rs/canvas'],
  sourcemap: true,
});

console.log('Bundle complete!');
