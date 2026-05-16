/**
 * Profile data shape — single source of truth for what
 * `src/data/profile.{tr,en}.json` files must conform to.
 *
 * Keep in sync with both locale files. Future Step 1 will
 * populate the JSON files from the v1 HTML content.
 */

export type Locale = 'en' | 'tr';

export interface SocialHandles {
  github: string;
  linkedin: string;
  twitter: string;
  reddit: string;
  discord?: string;
}

export interface Identity {
  name: string;
  role: string;
  location: string;
  sector: string;
  current: string;
  motto: string;
  email: string;
  phone: string;
  social: SocialHandles;
}

export interface SkillGroups {
  blue_team: string[];
  infrastructure: string[];
  compliance: string[];
  tools: string[];
}

export interface ExperienceEntry {
  active: boolean;
  start: string; // ISO yyyy-mm
  end: string | null; // null = present
  title: string;
  company: string;
  location: string;
  highlights: string[];
  stack: string[];
}

export interface EducationEntry {
  start: string;
  end: string;
  degree: string;
  institution: string;
  notes?: string;
}

export interface ProjectEntry {
  slug: string;
  name: string;
  url: string;
  tags: string[];
  summary: string;
  outcomes?: string[];
  featured: boolean;
}

export interface CertEntry {
  name: string;
  issuer: string;
  date?: string; // null/undefined when in progress
  in_progress?: boolean;
  credential_id?: string;
  credential_url?: string;
  badge?: string;
}

export interface WriteupEntry {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  url: string;
  summary?: string;
}

export interface Profile {
  identity: Identity;
  about: string;
  skills: SkillGroups;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  certs: CertEntry[];
  writeups: WriteupEntry[];
}
