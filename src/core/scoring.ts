/**
 * Scoring module — tracks earned points across commands.
 * Extracted from terminal.ts to keep the shell under 250 lines.
 */

export const POINTS: Record<string, number> = {
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
  stats: 5,
  'github stats': 5,
  tcpdump: 3,
  siem: 3,
  'siem alerts': 3,
  logs: 8,
  'logs --severity critical': 3,
  'logs --severity high': 3,
  'logs --severity medium': 3,
  'logs --severity low': 3,
  alerts: 10,
  ioc: 8,
  threat: 8,
  scan: 5,
  nmap: 5,
  skillmatrix: 6,
};

export const MAX_SCORE = 100;

export interface ScoreState {
  score: number;
  earned: Set<string>;
}

export interface ScoreDisplay {
  scoreFill: HTMLElement;
  scoreValue: HTMLElement;
}

export function addScore(
  st: ScoreState,
  display: ScoreDisplay,
  cmd: string,
  onMax: () => void,
): void {
  const pts = POINTS[cmd];
  if (!pts || st.earned.has(cmd)) return;
  st.earned.add(cmd);
  const prev = st.score;
  st.score = Math.min(st.score + pts, MAX_SCORE);
  display.scoreValue.textContent = `${st.score}/${MAX_SCORE}`;
  display.scoreFill.style.width = `${(st.score / MAX_SCORE) * 100}%`;
  flash(display.scoreValue);
  if (prev < MAX_SCORE && st.score >= MAX_SCORE) onMax();
}

export function maxScoreHtml(): string {
  return `<div class="cmd-block">
    <div class="t-grn">██████████████████████ 100/100</div>
    <div class="t-ylw">achievement unlocked: thorough investigator</div>
    <div class="t-dim">You read everything. Most people don't get this far.</div>
    <div class="t-dim">There's one more thing — try: <span class="t-link">sudo</span></div>
  </div>`;
}

export function maxScoreEffect(display: ScoreDisplay): void {
  display.scoreFill.style.background = 'var(--color-prompt)';
}

function flash(el: HTMLElement): void {
  el.style.color = '#fff';
  window.setTimeout(() => {
    el.style.color = '';
  }, 300);
}

export const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

export interface KonamiContext {
  score: number;
  display: ScoreDisplay;
  onPrompt: (cmd: string) => void;
  onBlock: (html: string) => void;
  devModeHtml: () => string;
}

export function setupKonami(ctx: KonamiContext): void {
  let seq: string[] = [];
  let unlocked = false;
  document.addEventListener('keydown', (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    seq.push(k);
    if (seq.length > KONAMI.length) seq.shift();
    if (seq.join(',') !== KONAMI.join(',')) return;

    if (unlocked) {
      seq = [];
      return;
    }
    unlocked = true;

    ctx.onPrompt('↑↑↓↓←→←→BA');
    ctx.onBlock(`<div class="cmd-block">
        <div class="t-ylw">\u{1F3AE} KONAMI CODE ACTIVATED!</div>
        <div class="t-grn">Achievement Unlocked: Old School Gamer</div>
        <div class="t-dim">Developer mode unlocked — hidden command list below. +30 bonus points.</div>
      </div>`);
    ctx.onBlock(ctx.devModeHtml());

    try {
      sessionStorage.setItem('fsc.developer', '1');
    } catch {
      /* no-op */
    }

    ctx.score = Math.min(ctx.score + 30, MAX_SCORE + 30);
    ctx.display.scoreValue.textContent = `${ctx.score}/${MAX_SCORE}`;
    ctx.display.scoreFill.style.width = '100%';
    seq = [];
  });
}
