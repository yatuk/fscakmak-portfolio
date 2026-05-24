import type { CommandHandler } from './index';
import { escapeHtml } from '@lib/sanitize';

const FSC_ASCII = `
  ███████╗███████╗ ██████╗
  ██╔════╝██╔════╝██╔════╝
  █████╗  ███████╗██║
  ██╔══╝  ╚════██║██║
  ██║     ███████║╚██████╗
  ╚═╝     ╚══════╝ ╚═════╝`;

const COLOR_BLOCKS = [
  '#ff5f57', '#febc2e', '#28c840', '#53b8ff',
  '#c778dd', '#e8804f', '#e55561', '#b3b9c5',
];

export const neofetch: CommandHandler = ({ profile, t }) => {
  const year = new Date().getFullYear();
  const techYears = year - 2019;
  const socYears = Math.max(0, year - 2025);

  const swatches = COLOR_BLOCKS.map(
    (c) => `<span class="nf-color" style="background:${c}"></span>`
  ).join('');

  const kv = (k: string, v: string) =>
    `<div class="nf-row"><span class="nf-k">${k}:</span><span class="nf-v">${v}</span></div>`;

  return `
<div class="cmd-block">
  <div class="nf">
    <div class="nf-art">
      <pre>${FSC_ASCII}</pre>
      <div class="nf-colors" aria-hidden="true">${swatches}</div>
    </div>
    <div class="nf-meta">
      ${kv(t('cmd.neofetch.user_host'), 'fscakmak@kali')}
      ${kv(t('cmd.neofetch.os'), 'Kali Linux / Windows 11')}
      ${kv(t('cmd.neofetch.shell'), 'zsh 5.9')}
      ${kv(t('cmd.neofetch.editor'), 'VS Code / Vim')}
      ${kv(t('cmd.neofetch.role'), escapeHtml(profile.identity.role))}
      ${kv(t('cmd.neofetch.threat_model'), 'Financial APTs')}
      ${kv(t('cmd.neofetch.uptime'), `${techYears}${t('cmd.neofetch.uptime_y')} in tech · ${socYears}${t('cmd.neofetch.uptime_y')}+ in SOC`)}
    </div>
  </div>
</div>`;
};
