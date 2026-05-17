import type { CommandHandler } from './index';

export const ls: CommandHandler = ({ t }) => {
  const entries = [
    { key: 'about',          cls: 'ls-file' },
    { key: 'languages',      cls: 'ls-file' },
    { key: 'skills',         cls: 'ls-dir' },
    { key: 'experience',     cls: 'ls-dir' },
    { key: 'projects',       cls: 'ls-dir' },
    { key: 'certifications', cls: 'ls-dir' },
    { key: 'education',      cls: 'ls-dir' },
    { key: 'secret',         cls: 'ls-dir-hidden' },
    { key: 'readme',         cls: 'ls-readme' },
    { key: 'resume',         cls: 'ls-asset' },
  ];

  const items = entries
    .map((e) => `<span class="${e.cls}">${t(`cmd.ls.${e.key}`)}</span>`)
    .join('  ');

  return `<div class="cmd-block cmd-ls">${items}</div>`;
};
