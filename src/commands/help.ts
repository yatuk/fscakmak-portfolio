import type { CommandHandler } from './index';

interface Row {
  cmd: string;
  desc: string;
  pts?: number;
}

const QUICK_ROWS = (t: (k: string) => string): Row[] => [
  { cmd: 'whoami',         desc: t('cmd.whoami.title'),       pts: 7 },
  { cmd: 'cat about.txt',  desc: t('cmd.about.filename'),     pts: 7 },
  { cmd: 'skills',         desc: t('cmd.skills.title'),       pts: 10 },
  { cmd: 'experience',     desc: t('cmd.experience.title'),   pts: 8 },
  { cmd: 'git log',        desc: t('cmd.git_log.title'),      pts: 15 },
  { cmd: 'projects',       desc: t('cmd.projects.title'),     pts: 15 },
  { cmd: 'education',      desc: t('cmd.education.title'),    pts: 5 },
  { cmd: 'certs',          desc: t('cmd.certs.title'),        pts: 8 },
  { cmd: 'mitre',          desc: 'defended ATT&CK techniques' },
  { cmd: 'languages',      desc: t('cmd.languages.title'),    pts: 3 },
  { cmd: 'contact',        desc: t('cmd.contact.title'),      pts: 5 },
  { cmd: 'socials',        desc: t('cmd.socials.title'),      pts: 3 },
  { cmd: 'neofetch',       desc: t('cmd.neofetch.user_host'), pts: 5 },
  { cmd: 'ls',             desc: 'list directory',            pts: 2 },
  { cmd: 'theme',          desc: 'switch palette' },
  { cmd: 'tree',           desc: 'site map' },
  { cmd: 'download resume',desc: 'download CV PDF' },
  { cmd: 'clear',          desc: 'clear screen' },
];

const renderRow = (r: Row): string => `
    <div class="cmd-help-row">
      <span class="cmd-help-cmd">${r.cmd}</span>
      <span class="cmd-help-desc">${r.desc}${r.pts ? ` <span class="cmd-help-pts">(+${r.pts})</span>` : ''}</span>
    </div>`;

export const help: CommandHandler = ({ t }) => {
  const rowsHtml = QUICK_ROWS(t).map(renderRow).join('');
  return `
<div class="cmd-block">
  <div class="cmd-title">📋 ${t('cmd.help.title')}:</div>
  <div class="cmd-help-rows">${rowsHtml}</div>
  <div class="cmd-help-hint">💡 ${t('cmd.help.footer_hint')}</div>
</div>`;
};

interface Category {
  title: string;
  rows: Row[];
}

const verboseCategories = (t: (k: string) => string): Category[] => [
  {
    title: '▸ About me',
    rows: [
      { cmd: 'whoami',        desc: t('cmd.whoami.title') },
      { cmd: 'cat about.txt', desc: t('cmd.about.filename') },
      { cmd: 'neofetch',      desc: 'system info' },
      { cmd: 'languages',     desc: t('cmd.languages.title') },
    ],
  },
  {
    title: '▸ Work & background',
    rows: [
      { cmd: 'experience', desc: t('cmd.experience.title') },
      { cmd: 'git log',    desc: 'unified timeline' },
      { cmd: 'projects',   desc: t('cmd.projects.title') },
      { cmd: 'education',  desc: t('cmd.education.title') },
      { cmd: 'certs',      desc: t('cmd.certs.title') },
      { cmd: 'skills',     desc: t('cmd.skills.title') },
      { cmd: 'mitre',      desc: 'defended ATT&CK techniques' },
    ],
  },
  {
    title: '▸ Reach out',
    rows: [
      { cmd: 'contact', desc: t('cmd.contact.title') },
      { cmd: 'socials', desc: t('cmd.socials.title') },
      { cmd: 'download resume', desc: 'CV PDF' },
    ],
  },
  {
    title: '▸ System',
    rows: [
      { cmd: 'ls',     desc: 'list directory' },
      { cmd: 'tree',   desc: 'site map' },
      { cmd: 'theme',  desc: 'switch palette (tokyonight · cyberpunk · matrix · catppuccin)' },
      { cmd: 'clear',  desc: 'clear screen (or Ctrl+L)' },
      { cmd: 'help',   desc: 'compact command list' },
    ],
  },
  {
    title: '▸ Hidden',
    rows: [
      { cmd: '???', desc: 'There are easter eggs. Tab autocomplete is your friend.' },
    ],
  },
];

export const helpVerbose: CommandHandler = ({ t }) => {
  const blocks = verboseCategories(t)
    .map(
      (c) => `
    <div class="cmd-help-cat">
      <div class="cmd-help-cat-title">${c.title}</div>
      <div class="cmd-help-rows">${c.rows.map(renderRow).join('')}</div>
    </div>`
    )
    .join('');

  return `
<div class="cmd-block">
  <div class="cmd-title">📋 ${t('cmd.help.title')} (verbose):</div>
  ${blocks}
  <div class="cmd-help-hint">💡 ${t('cmd.help.footer_hint')}</div>
</div>`;
};
