import type { CommandHandler } from './index';
import { escapeHtml } from '@lib/sanitize';

export const skills: CommandHandler = ({ profile, t }) => {
  const groups: Array<{ key: string; items: string[]; emphasize: boolean }> = [
    { key: 'cybersecurity', items: profile.skills.cybersecurity, emphasize: true },
    { key: 'infrastructure', items: profile.skills.infrastructure, emphasize: false },
    { key: 'compliance', items: profile.skills.compliance, emphasize: false },
    { key: 'tools', items: profile.skills.tools, emphasize: false },
  ];

  const renderGroup = (label: string, items: string[], emph: boolean) => `
    <div class="cmd-skill-group">
      <div class="cmd-skill-label">▸ ${escapeHtml(label)}:</div>
      <div class="cmd-skill-chips">
        ${items
          .map((s) => `<span class="cmd-chip${emph ? ' cmd-chip-emph' : ''}">${escapeHtml(s)}</span>`)
          .join('')}
      </div>
    </div>`;

  const groupsHtml = groups
    .map((g) => renderGroup(escapeHtml(t(`skill_groups.${g.key}`)), g.items, g.emphasize))
    .join('');

  return `
<div class="cmd-block">
  <div class="cmd-title">⚡ ${escapeHtml(t('cmd.skills.title'))}</div>
  ${groupsHtml}
</div>`;
};
