import type { CommandHandler } from './index';
import { escapeHtml } from '@lib/sanitize';

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
      range: `${escapeHtml(e.start)} — ${escapeHtml(e.end ?? present)}`,
      title: escapeHtml(e.title),
      org: `@ ${escapeHtml(e.company)} — ${escapeHtml(e.location)}`,
      detail: escapeHtml(e.highlights[0] ?? ''),
    })),
    ...profile.education.map((edu) => ({
      sortKey: edu.end,
      range: `${escapeHtml(edu.start)} — ${escapeHtml(edu.end)}${edu.expected ? ` (${escapeHtml(expected)})` : ''}`,
      title: escapeHtml(edu.degree),
      org: `@ ${escapeHtml(edu.school)}`,
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
  <div class="cmd-title">📦 ${escapeHtml(t('cmd.git_log.title'))}</div>
  <div class="tl">${html}</div>
</div>`;
};
