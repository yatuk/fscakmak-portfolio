import enStrings from '@data/strings.en.json';
import trStrings from '@data/strings.tr.json';
import type { Locale } from '@ptypes/profile';

/**
 * UI string translations — distinct from profile content.
 * EN file is the schema (anything missing in TR falls back to the key).
 *
 * Usage in .astro frontmatter:
 *   const title = t(locale, 'sections.about');
 *
 * Client-side terminal in Step 3 will receive a slim subset of these
 * via a data attribute; this module is intentionally synchronous and
 * tree-shake-friendly for SSG.
 */
type StringsDict = typeof enStrings;

const dict: Record<Locale, StringsDict> = {
  en: enStrings,
  tr: trStrings as StringsDict,
};

export function t(locale: Locale, key: string): string {
  const parts = key.split('.');
  let cursor: unknown = dict[locale];
  for (const part of parts) {
    if (cursor && typeof cursor === 'object' && part in cursor) {
      cursor = (cursor as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  return typeof cursor === 'string' ? cursor : key;
}

/** Narrow Astro's `currentLocale: string | undefined` to our union. */
export function resolveLocale(input: string | undefined | null): Locale {
  return input === 'tr' ? 'tr' : 'en';
}

export function oppositeLocale(locale: Locale): Locale {
  return locale === 'en' ? 'tr' : 'en';
}

/**
 * Map a pathname to the same content in the target locale.
 * Astro config: trailingSlash 'never', prefixDefaultLocale false.
 *   EN: "/", "/projects"
 *   TR: "/tr", "/tr/projects"
 */
export function swapLocaleInUrl(pathname: string, target: Locale): string {
  const stripped = pathname.replace(/\/+$/, '') || '/';
  let inner = stripped;
  if (stripped === '/tr' || stripped.startsWith('/tr/')) {
    inner = stripped.slice(3) || '/';
  }
  if (target === 'en') {
    return inner;
  }
  return inner === '/' ? '/tr' : `/tr${inner}`;
}
