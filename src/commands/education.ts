import type { CommandHandler } from './index';

export const education: CommandHandler = ({ profile, t }) => {
  const expected = t('cmd.education.expected');

  const entries = profile.education
    .map(
      (e, idx) => `
    <div class="tl-item${idx === 0 ? ' tl-item-head' : ''}">
      <div class="tl-dot"></div>
      <div class="tl-date">${e.start} — ${e.end}${e.expected ? ` (${expected})` : ''}</div>
      <div class="tl-title">${e.degree}</div>
      <div class="tl-org">@ ${e.school}</div>
    </div>`
    )
    .join('');

  return `
<div class="cmd-block">
  <div class="cmd-title">🎓 ${t('cmd.education.title')}</div>
  <div class="tl">${entries}</div>
</div>`;
};
