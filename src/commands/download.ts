import type { CommandHandler } from './index';

/**
 * Triggers a direct download of /resume.pdf. The file must exist
 * under public/resume.pdf at deploy time; if missing, the browser
 * will surface its standard 404 — no client-side check is needed.
 *
 * Uses a hidden <a> with `download` attribute so the browser
 * downloads rather than navigates. Falls back to opening in a new
 * tab if the attribute is unsupported.
 */
const renderer: CommandHandler = ({ locale }) => {
  const file = 'resume.pdf';
  const note =
    locale === 'tr'
      ? "İndirme başlatıldı. Tarayıcı engellerse aşağıdaki linke tıklayın."
      : 'Download started. If your browser blocks it, click the link below.';

  return {
    html: `
<div class="cmd-block">
  <div class="cmd-title">download ${file}</div>
  <div class="cmd-help-hint">${note}</div>
  <div style="margin-top:6px"><a href="/${file}" download class="t-link">/${file}</a></div>
</div>`,
    effect: () => {
      const a = document.createElement('a');
      a.href = `/${file}`;
      a.download = file;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
    },
  };
};

export const downloadCommands: Record<string, CommandHandler> = {
  'download resume': renderer,
  'wget resume.pdf': renderer,
};
