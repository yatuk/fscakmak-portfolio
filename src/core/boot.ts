import type { Profile } from '@ptypes/profile';
import { escapeHtml } from '@lib/sanitize';

/**
 * Boot coordination — schedules and runs the auto-whoami
 * command after the boot overlay is dismissed.
 */

export interface BootContext {
  profile: Profile;
  history: string[];
  hi: number;
  input: HTMLInputElement;
  onPrompt: (cmd: string) => void;
  onLine: (html: string) => void;
  onScore: (cmd: string) => void;
}

/** Auto-run whoami once after the boot overlay is removed. */
export function scheduleAutoWhoami(ctx: BootContext): void {
  const overlay = document.querySelector('[data-boot-overlay]');
  const fire = () => window.setTimeout(() => autoRun(ctx), 400);
  if (!overlay) {
    fire();
    return;
  }
  new MutationObserver((_, obs) => {
    if (!document.contains(overlay)) {
      obs.disconnect();
      fire();
    }
  }).observe(document.body, { childList: true, subtree: true });
}

function autoRun(ctx: BootContext): void {
  const { identity } = ctx.profile;
  ctx.history.unshift('whoami');
  ctx.hi = -1;
  ctx.onPrompt('whoami');
  ctx.onLine(
    `<span class="t-tx">${escapeHtml(identity.name)}</span>` +
    `<span class="t-dim"> — </span>` +
    `<span class="t-grn">${escapeHtml(identity.role)}</span>`,
  );
  ctx.onScore('whoami');
  ctx.input.focus();
}
