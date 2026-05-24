/* ── Scoring ───────────────────────────────────────────── */
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
  'nmap localhost': 5,
  'nmap fscakmak.com': 5,
  'scan fscakmak.com': 5,
  skillmatrix: 6,
};

export const MAX_SCORE = 100;

/* ── Terminal shell ────────────────────────────────────── */
export const HIST_KEY = 'terminal_history';
export const HIST_MAX = 50;
export const MAX_SUGGESTIONS = 6;

/* ── GitHub stats cache ────────────────────────────────── */
export const GH_CACHE_KEY = 'fsc.github.stats';
export const GH_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/* ── Theme ─────────────────────────────────────────────── */
export const THEME_STORAGE_KEY = 'fsc.theme';
export const THEME_VALID = ['tokyonight', 'cyberpunk', 'matrix', 'catppuccin'] as const;

/* ── Shared severity / confidence CSS class maps ───────── */
export const SEV_CLS = {
  CRITICAL: 'soc-crit',
  HIGH: 'soc-high',
  MEDIUM: 'soc-med',
  LOW: 'soc-low',
} as const;

export const CONF_CLS = {
  HIGH: 'soc-high',
  MED: 'soc-med',
  LOW: 'soc-low',
} as const;

export const STATUS_CLS = {
  OPEN: 'alert-open',
  'IN-REVIEW': 'alert-review',
  CLOSED: 'alert-closed',
} as const;

/* ── Konami code ───────────────────────────────────────── */
export const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];
