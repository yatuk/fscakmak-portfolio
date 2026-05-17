import type { CommandHandler } from './index';

export const languages: CommandHandler = ({ profile, t }) => {
  const spokenItems = profile.skills.spoken_languages
    .map(
      (l) => `
      <div class="lang-row">
        <span class="lang-name">${l.name}</span>
        <span class="lang-level">${l.level}</span>
      </div>`
    )
    .join('');

  const progLangs = profile.skills.tools.filter((tool) =>
    ['Python', 'Go', 'C/C++', 'SQL', 'Bash'].some((p) =>
      tool.toLowerCase().includes(p.toLowerCase())
    )
  );
  const progChips = progLangs
    .map((p) => `<span class="cmd-chip">${p}</span>`)
    .join('');

  return `
<div class="cmd-block">
  <div class="cmd-title">🗣️ ${t('cmd.languages.title')}</div>
  <div class="cmd-skill-group">
    <div class="cmd-skill-label">▸ ${t('cmd.languages.spoken')}:</div>
    <div class="lang-list">${spokenItems}</div>
  </div>
  <div class="cmd-skill-group">
    <div class="cmd-skill-label">▸ ${t('cmd.languages.programming')}:</div>
    <div class="cmd-skill-chips">${progChips}</div>
  </div>
</div>`;
};
