import type { CommandHandler } from './index';
import { escapeHtml } from '@lib/sanitize';

export const education: CommandHandler = ({ profile, t }) => {
  const expected = t('cmd.education.expected');

  const entries = profile.education
    .map(
      (e, idx) => `
    <div class="tl-item${idx === 0 ? ' tl-item-head' : ''}">
      <div class="tl-dot"></div>
      <div class="tl-date">${escapeHtml(e.start)} — ${escapeHtml(e.end)}${e.expected ? ` (${escapeHtml(expected)})` : ''}</div>
      <div class="tl-title">${escapeHtml(e.degree)}</div>
      <div class="tl-org">@ ${escapeHtml(e.school)}</div>
    </div>`
    )
    .join('');

  return `
<div class="cmd-block">
  <div class="cmd-title">🎓 ${escapeHtml(t('cmd.education.title'))}</div>
  <div class="tl">${entries}</div>
</div>`;
};
