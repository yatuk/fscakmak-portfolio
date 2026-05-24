import type { Locale, Profile } from '@ptypes/profile';
import { commandRegistry, type CommandContext, type CommandResult } from '@commands/index';
import { prefixHandlers, developerModeHtml } from '@commands/step10-eggs';
import { t as translate } from '@core/i18n';
import { escapeHtml } from '@lib/sanitize';
import { addScore, maxScoreHtml, maxScoreEffect, setupKonami, type ScoreState, type ScoreDisplay } from './scoring';
import { scheduleAutoWhoami, type BootContext } from './boot';

interface Elements {
  body: HTMLElement;
  output: HTMLElement;
  input: HTMLInputElement;
  scoreFill: HTMLElement;
  scoreValue: HTMLElement;
  suggestions: HTMLElement;
}

interface State {
  el: Elements;
  history: string[];
  hi: number;
  score: number;
  earned: Set<string>;
  ctx: CommandContext;
  suggestIdx: number;
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
  const sf = container.querySelector<HTMLElement>('[data-term-score-fill]');
  const sv = container.querySelector<HTMLElement>('[data-term-score-value]');
  const suggestions = container.querySelector<HTMLElement>('[data-term-suggestions]');

  if (!body || !output || !input || !sf || !sv || !suggestions) {
    console.warn('[terminal] required elements missing — skipping init');
    return;
  }

  const state: State = {
    el: { body, output, input, scoreFill: sf, scoreValue: sv, suggestions },
    history: [],
    hi: -1,
    score: 0,
    earned: new Set(),
    ctx: { profile, locale, t: (key) => translate(locale, key), getHistory: () => state.history },
    suggestIdx: -1,
  };

  input.addEventListener('keydown', (e) => onKey(state, e));
  input.addEventListener('input', () => updateSuggestions(state));
  body.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('a')) input.focus();
  });
  input.focus();
  wireQuickLaunch(container);

  setupKonami({
    get score() { return state.score; },
    set score(v: number) { state.score = v; },
    display: state.el,
    onPrompt: (cmd) => prompt(state, cmd),
    onBlock: (html) => block(state, html),
    devModeHtml: () => developerModeHtml(),
  });

  const st: ScoreState = state;
  const display: ScoreDisplay = state.el;
  const bootCtx: BootContext = {
    profile, history: state.history, hi: state.hi, input,
    onPrompt: (cmd) => prompt(state, cmd),
    onLine: (html) => line(state, html),
    onScore: (cmd) => addScore(st, display, cmd, () => {
      maxScoreEffect(display);
      block(state, maxScoreHtml());
    }),
  };
  scheduleAutoWhoami(bootCtx);
}

function wireQuickLaunch(root: ParentNode): void {
  root.querySelectorAll<HTMLButtonElement>('[data-term-quick]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const termRoot = btn.closest<HTMLElement>('[data-term-root]');
      const input = termRoot?.querySelector<HTMLInputElement>('[data-term-input]');
      const cmd = btn.dataset.termQuick ?? 'help';
      if (input) {
        input.value = cmd;
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        input.focus();
      }
    });
  });
}

/* ── Input handling ──────────────────────────────────── */

function onKey(s: State, e: KeyboardEvent): void {
  if (e.key === 'Enter') {
    hideSuggestions(s);
    s.suggestIdx = -1;
    run(s, s.el.input.value);
    s.el.input.value = '';
    return;
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (s.hi < s.history.length - 1) { s.hi++; s.el.input.value = s.history[s.hi] ?? ''; }
    return;
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (s.hi > 0) { s.hi--; s.el.input.value = s.history[s.hi] ?? ''; }
    else { s.hi = -1; s.el.input.value = ''; }
    return;
  }
  if (e.key === 'Tab') {
    e.preventDefault();
    const v = s.el.input.value.toLowerCase();
    if (!v) return;
    const matches = Object.keys(commandRegistry).filter((c) => c.startsWith(v));
    if (matches.length === 0) return;
    if (matches.length === 1) { s.el.input.value = matches[0]; hideSuggestions(s); }
    else { s.suggestIdx = (s.suggestIdx + 1) % matches.length; s.el.input.value = matches[s.suggestIdx]; renderSuggestions(s, matches, s.suggestIdx); }
    return;
  }
  if (e.key === 'Escape') { hideSuggestions(s); s.suggestIdx = -1; return; }
  if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); run(s, 'clear'); }
}

/* ── Autocomplete ────────────────────────────────────── */

const MAX_SUGGESTIONS = 6;

function updateSuggestions(s: State): void {
  const v = s.el.input.value.toLowerCase();
  s.suggestIdx = -1;
  if (!v) { hideSuggestions(s); return; }
  const matches = Object.keys(commandRegistry).filter((c) => c.startsWith(v));
  if (matches.length === 0 || matches.length === 1 && matches[0] === v) { hideSuggestions(s); return; }
  renderSuggestions(s, matches, -1);
}

function renderSuggestions(s: State, matches: string[], activeIdx: number): void {
  const visible = matches.slice(0, MAX_SUGGESTIONS);
  s.el.suggestions.innerHTML = visible
    .map((cmd, i) => {
      const cls = i === activeIdx ? 'term-sug term-sug-active' : 'term-sug';
      return `<span class="${cls}" data-cmd="${cmd}">${cmd}</span>`;
    })
    .join('');
  s.el.suggestions.classList.add('term-suggestions-open');
  s.el.suggestions.querySelectorAll<HTMLElement>('[data-cmd]').forEach((el) => {
    el.addEventListener('click', () => {
      s.el.input.value = el.dataset.cmd ?? '';
      hideSuggestions(s);
      s.el.input.focus();
    });
  });
}

function hideSuggestions(s: State): void {
  s.el.suggestions.innerHTML = '';
  s.el.suggestions.classList.remove('term-suggestions-open');
}

/* ── Command dispatch ────────────────────────────────── */

function run(s: State, raw: string): void {
  const trimmed = raw.trim();
  const cmd = trimmed.toLowerCase();
  if (!cmd) return;
  s.history.unshift(cmd);
  s.hi = -1;
  prompt(s, cmd);

  if (cmd === 'clear') { s.el.output.innerHTML = ''; return; }

  const lower = trimmed.toLowerCase();
  for (const ph of prefixHandlers) {
    if (lower.startsWith(ph.prefix)) {
      void dispatch(s, ph.run(trimmed.slice(ph.prefix.length)), cmd);
      return;
    }
  }

  const handler = commandRegistry[cmd];
  if (handler) { void dispatch(s, handler(s.ctx), cmd); return; }

  if (cmd.startsWith('echo ')) { line(s, `<span class="t-tx">${escapeHtml(cmd.slice(5))}</span>`); return; }

  const t = s.ctx.t;
  line(s, `<span class="t-err">${t('errors.not_found')}: ${escapeHtml(cmd)}</span>`);
  const dym = Object.keys(commandRegistry).find((c) => c.startsWith(cmd.slice(0, 3)));
  if (dym) line(s, `<span class="t-dim">${t('errors.did_you_mean')}: <span class="t-link">${dym}</span>?</span>`);
  line(s, `<span class="t-dim">${t('errors.type_help_prefix')} <span class="t-link">help</span> ${t('errors.type_help_suffix')}</span>`);
}

async function dispatch(s: State, result: CommandResult | Promise<CommandResult>, scoreKey: string): Promise<void> {
  const resolved = await Promise.resolve(result);
  if (typeof resolved === 'string') { if (resolved) block(s, resolved); }
  else { if (resolved.html) block(s, resolved.html); if (resolved.effect) resolved.effect(s.ctx); }

  const st: ScoreState = s;
  const display: ScoreDisplay = s.el;
  addScore(st, display, scoreKey, () => { maxScoreEffect(display); block(s, maxScoreHtml()); });
}

/* ── Rendering ───────────────────────────────────────── */

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
  requestAnimationFrame(() => { s.el.body.scrollTop = s.el.body.scrollHeight; });
}
