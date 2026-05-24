import type { Profile } from '@ptypes/profile';

/**
 * Boot coordination — after the boot overlay is dismissed, types
 * "whoami" character-by-character into the terminal and submits it.
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

export function scheduleAutoWhoami(ctx: BootContext): void {
  const overlay = document.querySelector('[data-boot-overlay]');
  const fire = () => window.setTimeout(() => typeWhoami(ctx), 350);
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

function typeWhoami(ctx: BootContext): void {
  const cmd = 'whoami';
  const CHAR_MS = 40;
  let i = 0;

  const tick = () => {
    if (i < cmd.length) {
      ctx.input.value += cmd[i++];
      window.setTimeout(tick, CHAR_MS);
    } else {
      ctx.input.disabled = false;
      ctx.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      ctx.input.focus();
    }
  };
  tick();
}
