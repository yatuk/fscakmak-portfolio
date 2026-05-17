import type { CommandHandler } from './index';

export const contact: CommandHandler = ({ profile, t }) => {
  const { email, social } = profile.identity;
  const rows = [
    {
      icon: '📧',
      label: t('cmd.contact.email'),
      value: `<a href="mailto:${email}">${email}</a>`,
    },
    {
      icon: '💼',
      label: t('cmd.contact.linkedin'),
      value: `<a href="https://linkedin.com/in/${social.linkedin}" target="_blank" rel="noopener noreferrer">linkedin.com/in/${social.linkedin}</a>`,
    },
    {
      icon: '🐙',
      label: t('cmd.contact.github'),
      value: `<a href="https://github.com/${social.github}" target="_blank" rel="noopener noreferrer">github.com/${social.github}</a>`,
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
