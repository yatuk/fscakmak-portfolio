import type { CommandHandler } from './index';
import { escapeHtml } from '@lib/sanitize';

export const aboutTxt: CommandHandler = ({ profile, t }) => {
  return `
<div class="cmd-block">
  <div class="cmd-quote">
    <div class="cmd-quote-filename">${escapeHtml(t('cmd.about.filename'))}</div>
    <p>${escapeHtml(profile.about)}</p>
  </div>
</div>`;
};
