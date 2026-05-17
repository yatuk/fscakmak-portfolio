import type { CommandHandler } from './index';

export const experience: CommandHandler = ({ profile, t }) => {
  const present = t('cmd.experience.present');
  const activeLabel = t('cmd.experience.active');
  const partTime = t('cmd.experience.part_time');

  const entries = profile.experience
    .map((e) => {
      const dateRange = `${e.start} – ${e.end ?? present}`;
      const activePill = e.active
        ? `<span class="exp-pill exp-pill-active">● ${activeLabel}</span>`
        : '';
      const partTimePill = e.part_time
        ? `<span class="exp-pill exp-pill-pt">${partTime}</span>`
        : '';
      const bullets = e.highlights.map((h) => `<li>${h}</li>`).join('');

      return `
      <div class="exp-entry">
        <div class="exp-header">
          ${activePill}
          ${partTimePill}
          <span class="exp-date">${dateRange}</span>
        </div>
        <div class="exp-title">
          ${e.title} — <span class="exp-company">${e.company}</span>
        </div>
        <div class="exp-location">${e.location}</div>
        <ul class="exp-highlights">${bullets}</ul>
      </div>`;
    })
    .join('');

  return `
<div class="cmd-block">
  <div class="cmd-title">💼 ${t('cmd.experience.title')}</div>
  <div class="exp-list">${entries}</div>
</div>`;
};
