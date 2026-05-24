import type { CommandHandler } from './index';
import { escapeHtml } from '@lib/sanitize';

export const certs: CommandHandler = ({ profile, t }) => {
  const cards = profile.certifications
    .map((c) => {
      const fullName = c.full_name ? ` <span class="cert-full">— ${escapeHtml(c.full_name)}</span>` : '';
      const date = c.date ? `<span class="cert-date">${escapeHtml(c.date)}</span>` : '';
      const credentialLink =
        c.credential_url
          ? `<a class="cert-link" href="${escapeHtml(c.credential_url)}" target="_blank" rel="noopener noreferrer">🔗</a>`
          : '';

      return `
      <article class="cert-card">
        <div class="cert-head">
          <span class="cert-name">${escapeHtml(c.name)}${fullName}</span>
          ${credentialLink}
        </div>
        <div class="cert-meta">
          <span class="cert-issuer">${escapeHtml(c.issuer)}</span>
          ${date}
        </div>
      </article>`;
    })
    .join('');

  return `
<div class="cmd-block">
  <div class="cmd-title">🎖️ ${escapeHtml(t('cmd.certs.title'))}</div>
  <div class="cert-list">${cards}</div>
</div>`;
};
