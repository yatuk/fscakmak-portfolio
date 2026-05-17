import type { Locale, Profile } from '@ptypes/profile';
import { commandRegistry, type CommandContext } from '@commands/index';
import { t as translate } from '@core/i18n';

/**
 * Points per command (only awarded once per unique command).
 * v1 carried these; preserved verbatim so existing scoring intuition
 * remains identical for repeat visitors.
 */
const POINTS: Record<string, number> = {
  help: 3,
  'help -v': 5,
  whoami: 7,
  skills: 10,
  contact: 5,
  experience: 8,
  'git log': 15,
  projects: 15,
  neofetch: 5,
  socials: 3,
  'cat about.txt': 7,
  ls: 2,
  education: 5,
  certs: 8,
  certifications: 8,
  languages: 3,
  mitre: 10,
  'mitre attack': 10,
  tree: 4,
  theme: 3,
  'download resume': 5,
};
const MAX_SCORE = 100;

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

interface Elements {
  body: HTMLElement;
  output: HTMLElement;
  input: HTMLInputElement;
  scoreFill: HTMLElement;
  scoreValue: HTMLElement;
}

interface State {
  el: Elements;
  history: string[];
  hi: number;
  score: number;
  earned: Set<string>;
  ctx: CommandContext;
}

export interface InitOpts {
  container: HTMLElement;
  profile: Profile;
  locale: Locale;
}

export function initTerminal({ container, profile, locale }: InitOpts): void {
  const body = container.querySelector<HTMLElement>('[data-term-body]');
  const output = container.querySelector<HTMLElement>('[data-term-output]');
  const input = container.querySelector<HTMLInputElement>('[data-term-input]');
  const scoreFill = container.querySelector<HTMLElement>('[data-term-score-fill]');
  const scoreValue = container.querySelector<HTMLElement>('[data-term-score-value]');

  if (!body || !output || !input || !scoreFill || !scoreValue) {
    console.warn('[terminal] required elements missing — skipping init');
    return;
  }

  const state: State = {
    el: { body, output, input, scoreFill, scoreValue },
    history: [],
    hi: -1,
    score: 0,
    earned: new Set(),
    ctx: {
      profile,
      locale,
      t: (key) => translate(locale, key),
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      getHistory: () => state.history,
    },
  };

  input.addEventListener('keydown', (e) => onKey(state, e));
  body.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('a')) input.focus();
  });
  input.focus();
  setupKonami(state);
}

function onKey(s: State, e: KeyboardEvent): void {
  if (e.key === 'Enter') {
    run(s, s.el.input.value);
    s.el.input.value = '';
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (s.hi < s.history.length - 1) {
      s.hi++;
      s.el.input.value = s.history[s.hi] ?? '';
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (s.hi > 0) {
      s.hi--;
      s.el.input.value = s.history[s.hi] ?? '';
    } else {
      s.hi = -1;
      s.el.input.value = '';
    }
  } else if (e.key === 'Tab') {
    e.preventDefault();
    const v = s.el.input.value.toLowerCase();
    if (v) {
      const m = Object.keys(commandRegistry).find((c) => c.startsWith(v));
      if (m) s.el.input.value = m;
    }
  } else if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault();
    run(s, 'clear');
  }
}

function run(s: State, raw: string): void {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return;
  s.history.unshift(cmd);
  s.hi = -1;

  prompt(s, cmd);

  if (cmd === 'clear') {
    s.el.output.innerHTML = '';
    return;
  }

  const handler = commandRegistry[cmd];
  if (handler) {
    const result = handler(s.ctx);
    if (typeof result === 'string') {
      if (result) block(s, result);
    } else {
      if (result.html) block(s, result.html);
      if (result.effect) result.effect(s.ctx);
    }
    addScore(s, cmd);
    return;
  }

  if (cmd.startsWith('echo ')) {
    line(s, `<span class="t-tx">${escapeHtml(cmd.slice(5))}</span>`);
    return;
  }

  const notFound = s.ctx.t('errors.not_found');
  const dym = s.ctx.t('errors.did_you_mean');
  const typeHelpA = s.ctx.t('errors.type_help_prefix');
  const typeHelpB = s.ctx.t('errors.type_help_suffix');

  line(s, `<span class="t-err">${notFound}: ${escapeHtml(cmd)}</span>`);
  const suggestion = Object.keys(commandRegistry).find((c) =>
    c.startsWith(cmd.slice(0, 3))
  );
  if (suggestion) {
    line(s, `<span class="t-dim">${dym}: <span class="t-link">${suggestion}</span>?</span>`);
  }
  line(s, `<span class="t-dim">${typeHelpA} <span class="t-link">help</span> ${typeHelpB}</span>`);
}

function prompt(s: State, cmd: string): void {
  line(s, `<span class="t-prompt">$ </span><span class="t-cmd">${escapeHtml(cmd)}</span>`);
}

function line(s: State, html: string): void {
  const d = document.createElement('div');
  d.className = 't-line';
  d.innerHTML = html;
  s.el.output.appendChild(d);
  scrollEnd(s);
}

function block(s: State, html: string): void {
  const d = document.createElement('div');
  d.innerHTML = html;
  s.el.output.appendChild(d);
  scrollEnd(s);
}

function scrollEnd(s: State): void {
  requestAnimationFrame(() => {
    s.el.body.scrollTop = s.el.body.scrollHeight;
  });
}

function addScore(s: State, cmd: string): void {
  const pts = POINTS[cmd];
  if (!pts || s.earned.has(cmd)) return;
  s.earned.add(cmd);
  s.score = Math.min(s.score + pts, MAX_SCORE);
  s.el.scoreValue.textContent = `${s.score}/${MAX_SCORE}`;
  s.el.scoreFill.style.width = `${(s.score / MAX_SCORE) * 100}%`;
  flash(s.el.scoreValue);
}

function flash(el: HTMLElement): void {
  el.style.color = '#fff';
  window.setTimeout(() => {
    el.style.color = '';
  }, 300);
}

function setupKonami(s: State): void {
  let seq: string[] = [];
  document.addEventListener('keydown', (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    seq.push(k);
    if (seq.length > KONAMI.length) seq.shift();
    if (seq.join(',') === KONAMI.join(',')) {
      prompt(s, '↑↑↓↓←→←→BA');
      block(s, `<div class="cmd-block">
        <div class="t-ylw">🎮 KONAMI CODE ACTIVATED!</div>
        <div class="t-grn">Achievement Unlocked: Old School Gamer</div>
        <div class="t-dim">+30 bonus points.</div>
      </div>`);
      s.score = Math.min(s.score + 30, MAX_SCORE + 30);
      s.el.scoreValue.textContent = `${s.score}/${MAX_SCORE}`;
      s.el.scoreFill.style.width = '100%';
      seq = [];
    }
  });
}

/** Escape user-input strings before injecting them into innerHTML. */
function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return c;
    }
  });
}
