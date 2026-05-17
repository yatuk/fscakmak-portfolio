import type { CommandHandler } from './index';

interface Row {
  cmd: string;
  desc: string;
  pts?: number;
}

export const help: CommandHandler = ({ t }) => {
  const rows: Row[] = [
    { cmd: 'whoami',         desc: t('cmd.whoami.title'),     pts: 7 },
    { cmd: 'cat about.txt',  desc: t('cmd.about.filename'),   pts: 7 },
    { cmd: 'skills',         desc: t('cmd.skills.title'),     pts: 10 },
    { cmd: 'experience',     desc: t('cmd.experience.title'), pts: 8 },
    { cmd: 'git log',        desc: t('cmd.git_log.title'),    pts: 15 },
    { cmd: 'projects',       desc: t('cmd.projects.title'),   pts: 15 },
    { cmd: 'education',      desc: t('cmd.education.title'),  pts: 5 },
    { cmd: 'certs',          desc: t('cmd.certs.title'),      pts: 8 },
    { cmd: 'languages',      desc: t('cmd.languages.title'),  pts: 3 },
    { cmd: 'contact',        desc: t('cmd.contact.title'),    pts: 5 },
    { cmd: 'socials',        desc: t('cmd.socials.title'),    pts: 3 },
    { cmd: 'neofetch',       desc: t('cmd.neofetch.user_host'), pts: 5 },
    { cmd: 'ls',             desc: 'list directory',          pts: 2 },
    { cmd: 'clear',          desc: 'clear screen' },
  ];

  const rowsHtml = rows
    .map(
      (r) => `
    <div class="cmd-help-row">
      <span class="cmd-help-cmd">${r.cmd}</span>
      <span class="cmd-help-desc">${r.desc}${r.pts ? ` <span class="cmd-help-pts">(+${r.pts})</span>` : ''}</span>
    </div>`
    )
    .join('');

  return `
<div class="cmd-block">
  <div class="cmd-title">📋 ${t('cmd.help.title')}:</div>
  <div class="cmd-help-rows">${rowsHtml}</div>
  <div class="cmd-help-hint">💡 ${t('cmd.help.footer_hint')}</div>
</div>`;
};
