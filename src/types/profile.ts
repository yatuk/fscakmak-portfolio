/**
 * Profile data shape — single source of truth for what
 * `src/data/profile.{tr,en}.json` files must conform to.
 *
 * Aligned with the user's actual CV. The "GERÇEK KİŞİSEL VERİLER"
 * block in the v2 prompt is the spec; this file enforces it.
 */

export type Locale = 'en' | 'tr';

export interface SocialHandles {
  github: string;
  linkedin: string;
}

export interface Identity {
  name: string;
  role: string;
  location: string;
  sector: string;
  current: string;
  tagline?: string;
  email: string;
  domain: string;
  social: SocialHandles;
}

export interface SpokenLanguage {
  name: string;
  level: string;
}

export interface SkillGroups {
  cybersecurity: string[];
  ai_security: string[];
  infrastructure: string[];
  compliance: string[];
  tools: string[];
  spoken_languages: SpokenLanguage[];
}

export interface ExperienceEntry {
  active: boolean;
  part_time?: boolean;
  start: string; // ISO yyyy-mm
  end: string | null; // null = present
  title: string;
  company: string;
  location: string;
  highlights: string[];
}

export interface EducationEntry {
  school: string;
  degree: string;
  start: string;
  end: string;
  expected?: boolean;
}

export type ProjectOwnerType = 'personal' | 'team';

export interface ProjectEntry {
  slug: string;
  name: string;
  url?: string;
  owner_type: ProjectOwnerType;
  owner_note?: string;
  tags: string[];
  summary: string;
  featured: boolean;
  status?: 'active' | 'complete';
  demo_url?: string;
  is_private?: boolean;
}

export interface CertEntry {
  name: string;
  full_name?: string;
  issuer: string;
  date?: string;
  credential_id?: string;
  credential_url?: string;
}

export interface Profile {
  identity: Identity;
  about: string;
  skills: SkillGroups;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certifications: CertEntry[];
  projects: ProjectEntry[];
}
