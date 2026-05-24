import type { CommandHandler } from './index';
import { escapeHtml } from '@lib/sanitize';

export const contact: CommandHandler = ({ profile, t }) => {
  const { email, social } = profile.identity;
  const rows = [
    {
      icon: '📧',
      label: t('cmd.contact.email'),
      value: `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`,
    },
    {
      icon: '💼',
      label: t('cmd.contact.linkedin'),
      value: `<a href="https://linkedin.com/in/${escapeHtml(social.linkedin)}" target="_blank" rel="noopener noreferrer">linkedin.com/in/${escapeHtml(social.linkedin)}</a>`,
    },
    {
      icon: '🐙',
      label: t('cmd.contact.github'),
      value: `<a href="https://github.com/${escapeHtml(social.github)}" target="_blank" rel="noopener noreferrer">github.com/${escapeHtml(social.github)}</a>`,
    },
  ];

  const rowsHtml = rows
    .map(
      (r) => `
    <div class="contact-row">
      <span class="contact-icon" aria-hidden="true">${r.icon}</span>
      <span class="contact-label">${r.label}:</span>
      <span class="contact-value">${r.value}</span>
    </div>`
    )
    .join('');

  return `
<div class="cmd-block">
  <div class="cmd-title">📬 ${t('cmd.contact.title')}</div>
  <div class="contact-list">${rowsHtml}</div>
</div>`;
};
