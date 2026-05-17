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

export interface CommandContext {
  profile: Profile;
  locale: Locale;
  t: (key: string) => string;
}

export type CommandHandler = (ctx: CommandContext) => string;

/**
 * Command name → handler. Names are intentionally English
 * (whoami, ls, etc.) — universal terminal vocabulary. Per the
 * v2 spec: command names stay English; outputs render per locale.
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
};
