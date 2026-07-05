import type { CommandHandler } from './index';
import { escapeHtml } from '@lib/sanitize';

export const socials: CommandHandler = ({ profile, t }) => {
  const { social } = profile.identity;
  const rows = [
    {
      label: t('cmd.socials.github'),
      value: `<a href="https://github.com/${escapeHtml(social.github)}" target="_blank" rel="noopener noreferrer">github.com/${escapeHtml(social.github)}</a>`,
    },
    {
      label: t('cmd.socials.linkedin'),
      value: `<a href="https://linkedin.com/in/${escapeHtml(social.linkedin)}" target="_blank" rel="noopener noreferrer">linkedin.com/in/${escapeHtml(social.linkedin)}</a>`,
    },
  ];

  const rowsHtml = rows
    .map(
      (r) => `
    <div class="contact-row">
      <span class="contact-label">${escapeHtml(r.label)}:</span>
      <span class="contact-value">${r.value}</span>
    </div>`
    )
    .join('');

  return `
<div class="cmd-block">
  <div class="cmd-title">${escapeHtml(t('cmd.socials.title'))}</div>
  <div class="contact-list">${rowsHtml}</div>
</div>`;
};
