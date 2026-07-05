/**
 * Generates og-image.png (1200×630) — terminal-themed social card.
 * Run: node scripts/generate-og.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderAsync } from '@resvg/resvg-js';

const OUT_PATH = resolve(import.meta.dirname ?? '.', '..', 'public', 'og-image.png');

const MONO = 'JetBrains Mono, Cascadia Mono, Consolas, monospace';

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" width="34" height="34" patternUnits="userSpaceOnUse">
      <path d="M 34 0 L 0 0 0 34" fill="none" stroke="rgba(255,255,255,0.035)" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="#0d0d0d"/>
  <rect width="1200" height="630" fill="url(#grid)"/>

  <!-- terminal window -->
  <rect x="70" y="52" width="1060" height="526" rx="12" fill="#111111" stroke="#27272a"/>
  <rect x="70" y="52" width="1060" height="46" rx="12" fill="#171717"/>
  <rect x="70" y="86" width="1060" height="12" fill="#171717"/>
  <line x1="70" y1="98" x2="1130" y2="98" stroke="#27272a"/>

  <circle cx="102" cy="75" r="7" fill="#f87171"/>
  <circle cx="126" cy="75" r="7" fill="#facc15"/>
  <circle cx="150" cy="75" r="7" fill="#4ade80"/>
  <text x="180" y="81" font-family="${MONO}" font-size="17" fill="#8a8a8a">fscakmak@kali ~ % zsh</text>

  <!-- prompt -->
  <text x="120" y="165" font-family="${MONO}" font-size="26" fill="#4ade80">$ <tspan fill="#facc15">whoami</tspan></text>

  <!-- name -->
  <text x="120" y="235" font-family="${MONO}" font-size="56" font-weight="700" fill="#e4e4e7">Fatih Serdar Cakmak</text>

  <!-- kv block -->
  <line x1="122" y1="270" x2="122" y2="420" stroke="#27272a" stroke-width="2"/>
  <text x="146" y="300" font-family="${MONO}" font-size="22" fill="#22d3ee">role:<tspan fill="#e4e4e7" x="290">SOC Analyst Intern · CE @ ITU</tspan></text>
  <text x="146" y="340" font-family="${MONO}" font-size="22" fill="#22d3ee">focus:<tspan fill="#e4e4e7" x="290">SIEM · SOAR · Detection · IR</tspan></text>
  <text x="146" y="380" font-family="${MONO}" font-size="22" fill="#22d3ee">building:<tspan fill="#e4e4e7" x="290">Tamga · MCPRadar</tspan></text>
  <text x="146" y="420" font-family="${MONO}" font-size="22" fill="#22d3ee">env:<tspan fill="#e4e4e7" x="290">Banking SOC / BDDK-regulated</tspan></text>

  <!-- tagline -->
  <text x="120" y="490" font-family="${MONO}" font-size="21" fill="#8a8a8a">"Most alerts are noise. The interesting part is the few</text>
  <text x="120" y="520" font-family="${MONO}" font-size="21" fill="#8a8a8a"> that aren't."</text>

  <!-- footer -->
  <text x="120" y="556" font-family="${MONO}" font-size="22" fill="#22d3ee">fscakmak.com<tspan fill="#4ade80"> _</tspan></text>
</svg>`;

const image = await renderAsync(svg, {
  font: { loadSystemFonts: true },
  background: '#0d0d0d',
});

writeFileSync(OUT_PATH, image.asPng());
console.log('Generated og-image.png (1200×630)');
