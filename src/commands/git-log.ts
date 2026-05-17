import type { CommandHandler } from './index';

/**
 * `git log` — combined timeline of experience + education,
 * oldest at bottom (newest commit first, like a real git log).
 */
export const gitLog: CommandHandler = ({ profile, t }) => {
  const present = t('cmd.experience.present');
  const expected = t('cmd.education.expected');

  type Item = {
    sortKey: string;
    range: string;
    title: string;
    org: string;
    detail: string;
  };

  const items: Item[] = [
    ...profile.experience.map((e) => ({
      sortKey: e.end ?? '9999-12',
      range: `${e.start} — ${e.end ?? present}`,
      title: e.title,
      org: `@ ${e.company} — ${e.location}`,
      detail: e.highlights[0] ?? '',
    })),
    ...profile.education.map((edu) => ({
      sortKey: edu.end,
      range: `${edu.start} — ${edu.end}${edu.expected ? ` (${expected})` : ''}`,
      title: edu.degree,
      org: `@ ${edu.school}`,
      detail: '',
    })),
  ];

  items.sort((a, b) => (a.sortKey < b.sortKey ? 1 : -1));

  const html = items
    .map(
      (i, idx) => `
    <div class="tl-item${idx === 0 ? ' tl-item-head' : ''}">
      <div class="tl-dot"></div>
      <div class="tl-date">${i.range}</div>
      <div class="tl-title">${i.title}</div>
      <div class="tl-org">${i.org}</div>
      ${i.detail ? `<div class="tl-detail">${i.detail}</div>` : ''}
    </div>`
    )
    .join('');

  return `
<div class="cmd-block">
  <div class="cmd-title">📦 ${t('cmd.git_log.title')}</div>
  <div class="tl">${html}</div>
</div>`;
};
