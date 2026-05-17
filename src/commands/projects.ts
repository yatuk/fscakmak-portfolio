import type { CommandHandler } from './index';

export const projects: CommandHandler = ({ profile, t }) => {
  const personalLabel = t('cmd.projects.personal');
  const teamLabel = t('cmd.projects.team');

  const cards = profile.projects
    .map((p) => {
      const ownerPill =
        p.owner_type === 'team'
          ? `<span class="proj-pill proj-pill-team" title="${p.owner_note ?? ''}">${teamLabel}</span>`
          : `<span class="proj-pill proj-pill-personal">${personalLabel}</span>`;
      const tags = p.tags
        .map((tg) => `<span class="proj-tag">${tg}</span>`)
        .join('');
      const note = p.owner_note
        ? `<div class="proj-note">${p.owner_note}</div>`
        : '';

      return `
      <article class="proj-card">
        <div class="proj-head">
          <a class="proj-name" href="${p.url}" target="_blank" rel="noopener noreferrer">🔗 ${p.name}</a>
          ${ownerPill}
        </div>
        <div class="proj-tags">${tags}</div>
        <p class="proj-summary">${p.summary}</p>
        ${note}
      </article>`;
    })
    .join('');

  return `
<div class="cmd-block">
  <div class="cmd-title">🔧 ${t('cmd.projects.title')}</div>
  <div class="proj-list">${cards}</div>
</div>`;
};
