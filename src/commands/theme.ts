import type { CommandHandler } from './index';
import { THEME_STORAGE_KEY, THEME_VALID } from '@config/index';

export type ThemeName = (typeof THEME_VALID)[number];

export const THEMES: ReadonlyArray<{ name: ThemeName; emoji: string; tag: string }> = [
  { name: 'tokyonight', emoji: '🌃', tag: 'default · cyan + green' },
  { name: 'cyberpunk',  emoji: '🟣', tag: 'magenta + cyan' },
  { name: 'matrix',     emoji: '🟢', tag: 'green on black' },
  { name: 'catppuccin', emoji: '🐱', tag: 'mocha pastel' },
];

function currentTheme(): ThemeName {
  const set = document.documentElement.dataset.theme;
  return THEMES.some((t) => t.name === set) ? (set as ThemeName) : 'tokyonight';
}

function applyTheme(name: ThemeName): void {
  const html = document.documentElement;
  html.classList.add('theme-switching');
  html.dataset.theme = name;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, name);
  } catch {
    /* private mode — no-op */
  }
  window.setTimeout(() => html.classList.remove('theme-switching'), 300);
}

/**
 * `theme` (no args) lists themes + current.
 * `theme <name>` switches.
 * `theme reset` returns to tokyonight.
 *
 * Each variant is registered separately so the registry stays
 * exact-match. Tab autocomplete steps through them naturally.
 */
const list: CommandHandler = () => {
  const current = (typeof document !== 'undefined' && currentTheme()) || 'tokyonight';
  const rows = THEMES.map(
    (t) => `
    <div class="theme-row${t.name === current ? ' theme-row-active' : ''}">
      <span class="theme-emoji" aria-hidden="true">${t.emoji}</span>
      <span class="theme-name">${t.name}</span>
      <span class="theme-tag">${t.tag}</span>
      ${t.name === current ? '<span class="theme-current-pill">● active</span>' : ''}
    </div>`
  ).join('');
  return `
<div class="cmd-block">
  <div class="cmd-title">🎨 Themes</div>
  <div class="theme-list">${rows}</div>
  <div class="cmd-help-hint">Type <span class="t-link">theme &lt;name&gt;</span> to switch · <span class="t-link">theme reset</span> to revert.</div>
</div>`;
};

const set =
  (name: ThemeName): CommandHandler =>
  () => ({
    html: `<div class="cmd-block"><span class="t-grn">✓</span> theme switched to <span class="t-link">${name}</span>.</div>`,
    effect: () => applyTheme(name),
  });

export const themeCommands: Record<string, CommandHandler> = {
  theme: list,
  'theme tokyonight': set('tokyonight'),
  'theme cyberpunk': set('cyberpunk'),
  'theme matrix': set('matrix'),
  'theme catppuccin': set('catppuccin'),
  'theme reset': set('tokyonight'),
};
