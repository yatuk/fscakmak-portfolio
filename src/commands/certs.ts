import type { CommandHandler } from './index';

export const certs: CommandHandler = ({ profile, t }) => {
  const cards = profile.certifications
    .map((c) => {
      const fullName = c.full_name ? ` <span class="cert-full">— ${c.full_name}</span>` : '';
      const date = c.date ? `<span class="cert-date">${c.date}</span>` : '';
      const credentialLink =
        c.credential_url
          ? `<a class="cert-link" href="${c.credential_url}" target="_blank" rel="noopener noreferrer">🔗</a>`
          : '';

      return `
      <article class="cert-card">
        <div class="cert-head">
          <span class="cert-name">${c.name}${fullName}</span>
          ${credentialLink}
        </div>
        <div class="cert-meta">
          <span class="cert-issuer">${c.issuer}</span>
          ${date}
        </div>
      </article>`;
    })
    .join('');

  return `
<div class="cmd-block">
  <div class="cmd-title">🎖️ ${t('cmd.certs.title')}</div>
  <div class="cert-list">${cards}</div>
</div>`;
};
