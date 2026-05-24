import type { CommandHandler } from './index';
import { escapeHtml } from '@lib/sanitize';

export const projects: CommandHandler = ({ profile, t }) => {
  const personalLabel = t('cmd.projects.personal');
  const teamLabel = t('cmd.projects.team');

  const cards = profile.projects
    .map((p) => {
      const ownerPill =
        p.owner_type === 'team'
          ? `<span class="proj-pill proj-pill-team" title="${escapeHtml(p.owner_note ?? '')}">${escapeHtml(teamLabel)}</span>`
          : `<span class="proj-pill proj-pill-personal">${escapeHtml(personalLabel)}</span>`;
      const statusBadge = p.status
        ? `<span class="proj-status proj-status-${p.status}">${p.status === 'active' ? '● ACTIVE' : 'COMPLETE'}</span>`
        : '';
      const privateBadge = p.is_private
        ? '<span class="proj-pill proj-pill-private">PRIVATE REPO</span>'
        : '';
      const nameEl = p.url
        ? `<a class="proj-name" href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer">🔗 ${escapeHtml(p.name)}</a>`
        : `<span class="proj-name proj-name-plain">${escapeHtml(p.name)}</span>`;
      const tags = p.tags
        .map((tg) => `<span class="proj-tag">${escapeHtml(tg)}</span>`)
        .join('');
      const demoLink = p.demo_url
        ? `<a class="proj-demo" href="${escapeHtml(p.demo_url)}" target="_blank" rel="noopener noreferrer">Live demo →</a>`
        : '';
      const note = p.owner_note
        ? `<div class="proj-note">${escapeHtml(p.owner_note)}</div>`
        : '';

      return `
      <article class="proj-card">
        <div class="proj-head">
          ${statusBadge}
          ${nameEl}
          ${privateBadge}
          ${ownerPill}
        </div>
        <div class="proj-tags">${tags}</div>
        <p class="proj-summary">${escapeHtml(p.summary)}</p>
        ${demoLink}
        ${note}
      </article>`;
    })
    .join('');

  return `
<div class="cmd-block">
  <div class="cmd-title">🔧 ${escapeHtml(t('cmd.projects.title'))}</div>
  <div class="proj-list">${cards}</div>
</div>`;
};
