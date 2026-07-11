import type { CommandHandler } from './index';
import { escapeHtml } from '@lib/sanitize';
import writeupsData from '@data/writeups.json';

interface Writeup {
  title: string;
  url?: string;
  path?: string;
  date: string;
  lang: string;
  tags: string[];
}

export const writeups: CommandHandler = ({ t }) => {
  const rows = (writeupsData as Writeup[])
    .map((w) => {
      const tags = w.tags
        .map((tg) => `<span class="proj-tag">${escapeHtml(tg)}</span>`)
        .join('');
      const link = w.path
        ? `<a class="writeup-title" href="${escapeHtml(w.path)}">${escapeHtml(w.title)} →</a>`
        : `<a class="writeup-title" href="${escapeHtml(w.url ?? '#')}" target="_blank" rel="noopener noreferrer">${escapeHtml(w.title)} ↗</a>`;
      return `
    <div class="writeup-row">
      <span class="writeup-date">${escapeHtml(w.date)}</span>
      ${link}
      <span class="writeup-tags">${tags}</span>
    </div>`;
    })
    .join('');

  return `
<div class="cmd-block">
  <div class="cmd-title">${escapeHtml(t('sections.writeups'))}</div>
  <div class="writeup-list">${rows}</div>
  <div class="cmd-help-hint" style="margin-top:10px">
    <a href="https://medium.com/@fscakmak" target="_blank" rel="noopener noreferrer">medium.com/@fscakmak →</a>
  </div>
</div>`;
};
