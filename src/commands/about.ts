import type { CommandHandler } from './index';

export const aboutTxt: CommandHandler = ({ profile, t }) => {
  return `
<div class="cmd-block">
  <div class="cmd-quote">
    <div class="cmd-quote-filename">${t('cmd.about.filename')}</div>
    <p>${profile.about}</p>
  </div>
</div>`;
};
