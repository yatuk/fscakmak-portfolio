/**
 * Generates apple-touch-icon.png (180×180) from favicon.svg.
 * Run: node scripts/generate-icons.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderAsync } from '@resvg/resvg-js';

const SVG_PATH = resolve(import.meta.dirname ?? '.', '..', 'public', 'favicon.svg');
const OUT_PATH = resolve(import.meta.dirname ?? '.', '..', 'public', 'apple-touch-icon.png');

const svgSource = readFileSync(SVG_PATH, 'utf-8');

// Insert a 180x180 viewBox and size for retina apple-touch-icon
const sized = svgSource.replace(
  'viewBox="0 0 32 32"',
  'viewBox="0 0 32 32" width="180" height="180"',
);

const image = await renderAsync(sized, {
  font: {
    loadSystemFonts: false,
  },
  background: '#0D0D0D',
});

writeFileSync(OUT_PATH, image.asPng());

// eslint-disable-next-line no-console
console.log('Generated apple-touch-icon.png (180×180)');
