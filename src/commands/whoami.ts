import type { CommandHandler } from './index';

export const whoami: CommandHandler = ({ profile, t }) => {
  const { identity } = profile;
  return `
<div class="cmd-block">
  <div class="cmd-title">🛡️ ${t('cmd.whoami.title')}</div>
  <div class="kv">
    <div class="kv-row"><span class="kv-k">${t('cmd.whoami.name')}:</span><span class="kv-v">${identity.name}</span></div>
    <div class="kv-row"><span class="kv-k">${t('cmd.whoami.role')}:</span><span class="kv-v">${identity.role}</span></div>
    <div class="kv-row"><span class="kv-k">${t('cmd.whoami.location')}:</span><span class="kv-v">${identity.location} 🇹🇷</span></div>
    <div class="kv-row"><span class="kv-k">${t('cmd.whoami.sector')}:</span><span class="kv-v">${identity.sector}</span></div>
    <div class="kv-row"><span class="kv-k">${t('cmd.whoami.currently')}:</span><span class="kv-v kv-v-emph">${identity.current}</span></div>
  </div>
</div>`;
};
