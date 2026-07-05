import type { CommandHandler } from './index';
import { escapeHtml } from '@lib/sanitize';

export const experience: CommandHandler = ({ profile, t }) => {
  const present = t('cmd.experience.present');
  const activeLabel = t('cmd.experience.active');
  const partTime = t('cmd.experience.part_time');

  const entries = profile.experience
    .map((e) => {
      const dateRange = `${escapeHtml(e.start)} – ${escapeHtml(e.end ?? present)}`;
      const activePill = e.active
        ? `<span class="exp-pill exp-pill-active">● ${escapeHtml(activeLabel)}</span>`
        : '';
      const partTimePill = e.part_time
        ? `<span class="exp-pill exp-pill-pt">${escapeHtml(partTime)}</span>`
        : '';
      const bullets = e.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join('');

      return `
      <div class="exp-entry">
        <div class="exp-header">
          ${activePill}
          ${partTimePill}
          <span class="exp-date">${dateRange}</span>
        </div>
        <div class="exp-title">
          ${escapeHtml(e.title)} — <span class="exp-company">${escapeHtml(e.company)}</span>
        </div>
        <div class="exp-location">${escapeHtml(e.location)}</div>
        <ul class="exp-highlights">${bullets}</ul>
      </div>`;
    })
    .join('');

  return `
<div class="cmd-block">
  <div class="cmd-title">${escapeHtml(t('cmd.experience.title'))}</div>
  <div class="exp-list">${entries}</div>
</div>`;
};
