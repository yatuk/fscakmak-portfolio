import enJson from '@data/profile.en.json';
import trJson from '@data/profile.tr.json';
import type { Locale, Profile } from '@ptypes/profile';

/**
 * All profile content lives in src/data/profile.{en,tr}.json.
 * This loader is the only module that imports those JSON files —
 * everything else asks via `getProfile(locale)`.
 *
 * Static imports keep the SSG build tree-shakable: each locale's
 * page bundle only carries the JSON it actually renders, after
 * Rollup eliminates the unused side.
 */
const profiles: Record<Locale, Profile> = {
  en: enJson as unknown as Profile,
  tr: trJson as unknown as Profile,
};

export function getProfile(locale: Locale): Profile {
  return profiles[locale];
}

/** Narrow Astro's `currentLocale` (string | undefined) to our `Locale` union. */
export function resolveLocale(input: string | undefined): Locale {
  return input === 'tr' ? 'tr' : 'en';
}
