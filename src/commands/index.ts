import type { Locale, Profile } from '@ptypes/profile';

import { help } from './help';
import { whoami } from './whoami';
import { aboutTxt } from './about';
import { skills } from './skills';
import { experience } from './experience';
import { gitLog } from './git-log';
import { projects } from './projects';
import { education } from './education';
import { certs } from './certs';
import { contact } from './contact';
import { socials } from './socials';
import { neofetch } from './neofetch';
import { languages } from './languages';
import { ls } from './ls';
import { eggs } from './easter-eggs';

export interface CommandContext {
  profile: Profile;
  locale: Locale;
  t: (key: string) => string;
  getHistory: () => readonly string[];
}

/**
 * Commands return either:
 *   - a string of HTML (the common case), OR
 *   - a `{ html?, effect? }` record when a side-effect is needed
 *     (matrix canvas, theme switching, downloads, etc.).
 *
 * `html` is appended to the output log; `effect` runs after, with
 * access to the command context. Returning neither is a no-op.
 */
export type CommandResult =
  | string
  | {
      html?: string;
      effect?: (ctx: CommandContext) => void;
    };

export type CommandHandler = (ctx: CommandContext) => CommandResult;

/**
 * Command name → handler. Names are intentionally English
 * (whoami, ls, etc.) — universal terminal vocabulary. Per the
 * v2 spec: command names stay English; outputs render per locale.
 *
 * Easter eggs are merged in from `easter-eggs.ts` so tab-autocomplete
 * discovers them, but they're intentionally absent from `help`.
 */
export const commandRegistry: Record<string, CommandHandler> = {
  help,
  whoami,
  'cat about.txt': aboutTxt,
  skills,
  experience,
  'git log': gitLog,
  projects,
  education,
  certs,
  certifications: certs,
  contact,
  socials,
  neofetch,
  languages,
  ls,
  ...eggs,
};
