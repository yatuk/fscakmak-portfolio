import type { CommandHandler } from './index';

const KATAKANA =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01';
const FONT_PX = 13;
const COL_W = 14;
const DURATION_MS = 4000;
const FRAME_MS = 33;

/**
 * Drop-in command: shows boot text in the terminal, then triggers
 * the canvas rain overlay as a side-effect. The canvas creates
 * itself, runs for 4s, then removes itself.
 *
 * Respects prefers-reduced-motion: if reduced, we skip the canvas
 * entirely and just show the boot line.
 */
export const matrix: CommandHandler = () => ({
  html: `<div class="cmd-block"><span class="t-grn">Entering the Matrix... 🟢</span></div>`,
  effect: () => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    startCanvas();
  },
});

function startCanvas(): void {
  if (document.getElementById('term-matrix')) return; // already running

  const c = document.createElement('canvas');
  c.id = 'term-matrix';
  c.setAttribute('aria-hidden', 'true');
  c.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;z-index:200;pointer-events:none;';
  document.body.appendChild(c);

  c.width = window.innerWidth;
  c.height = window.innerHeight;
  const ctx = c.getContext('2d');
  if (!ctx) {
    c.remove();
    return;
  }

  const cols = Math.floor(c.width / COL_W);
  const drops = Array.from({ length: cols }, () => 1);
  const accent = readColor('--color-prompt') || '#41d98c';
  const bg = readColor('--color-bg') || '#0a0e14';

  const interval = window.setInterval(() => {
    ctx.fillStyle = hexToRgba(bg, 0.06);
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = accent;
    ctx.font = `${FONT_PX}px ${getComputedStyle(document.body).fontFamily}`;

    for (let i = 0; i < drops.length; i++) {
      const ch = KATAKANA[Math.floor(Math.random() * KATAKANA.length)] ?? '0';
      ctx.fillText(ch, i * COL_W, (drops[i] ?? 0) * COL_W);
      if ((drops[i] ?? 0) * COL_W > c.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] = (drops[i] ?? 0) + 1;
    }
  }, FRAME_MS);

  window.setTimeout(() => {
    window.clearInterval(interval);
    ctx.clearRect(0, 0, c.width, c.height);
    c.remove();
  }, DURATION_MS);
}

function readColor(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

/**
 * Convert a `#rrggbb` color into a faded `rgba(...)` string at the
 * given alpha. Used for the trailing-fade effect on the canvas.
 * Falls back transparent on bad input so we never throw mid-frame.
 */
function hexToRgba(hex: string, alpha: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m || !m[1]) return `rgba(0,0,0,${alpha})`;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 0xff},${(n >> 8) & 0xff},${n & 0xff},${alpha})`;
}
