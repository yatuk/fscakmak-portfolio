import type { CommandHandler } from './index';
import { escapeHtml } from '@lib/sanitize';

export const whoami: CommandHandler = ({ profile, t }) => {
  const { identity } = profile;
  return `
<div class="cmd-block">
  <div class="cmd-title">🛡️ ${escapeHtml(t('cmd.whoami.title'))}</div>
  <div class="kv">
    <div class="kv-row"><span class="kv-k">${escapeHtml(t('cmd.whoami.name'))}:</span><span class="kv-v">${escapeHtml(identity.name)}</span></div>
    <div class="kv-row"><span class="kv-k">${escapeHtml(t('cmd.whoami.role'))}:</span><span class="kv-v">${escapeHtml(identity.role)}</span></div>
    <div class="kv-row"><span class="kv-k">${escapeHtml(t('cmd.whoami.location'))}:</span><span class="kv-v">${escapeHtml(identity.location)} 🇹🇷</span></div>
    <div class="kv-row"><span class="kv-k">${escapeHtml(t('cmd.whoami.sector'))}:</span><span class="kv-v">${escapeHtml(identity.sector)}</span></div>
    <div class="kv-row"><span class="kv-k">${escapeHtml(t('cmd.whoami.currently'))}:</span><span class="kv-v kv-v-emph">${escapeHtml(identity.current)}</span></div>
  </div>
</div>`;
};
