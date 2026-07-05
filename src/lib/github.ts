/* ============================================================
   GitHub repo metadata (stars + last push) — shared by the
   terminal `projects` command and the recruiter view. One
   repos-listing request per owner, cached in localStorage
   for an hour.

   Hydrates:
     [data-gh-stars="owner/repo"]    → "★ 22"
     [data-gh-updated="owner/repo"]  → "updated 3 days ago"
     [data-gh-lastpush="owner"]      → "3 hours ago" (most recent
                                       push across all owner repos;
                                       also unhides the closest
                                       [data-gh-lastpush-row])
   ============================================================ */

const REPOS_CACHE_KEY = 'fsc.gh.repos';
const REPOS_CACHE_TTL_MS = 60 * 60 * 1000;

interface RepoInfo {
  stars: number;
  pushed: string;
}

interface ReposCacheEntry {
  at: number;
  repos: Record<string, RepoInfo>;
}

function readReposCache(): Record<string, RepoInfo> | null {
  try {
    const raw = localStorage.getItem(REPOS_CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as ReposCacheEntry;
    if (Date.now() - entry.at > REPOS_CACHE_TTL_MS) return null;
    return entry.repos;
  } catch {
    return null;
  }
}

function writeReposCache(repos: Record<string, RepoInfo>): void {
  try {
    const entry: ReposCacheEntry = { at: Date.now(), repos };
    localStorage.setItem(REPOS_CACHE_KEY, JSON.stringify(entry));
  } catch {
    /* private mode */
  }
}

async function fetchReposFor(owners: string[]): Promise<Record<string, RepoInfo>> {
  const repos: Record<string, RepoInfo> = {};
  await Promise.all(
    owners.map(async (owner) => {
      const res = await fetch(
        `https://api.github.com/users/${encodeURIComponent(owner)}/repos?per_page=100`,
        { headers: { Accept: 'application/vnd.github+json' } }
      );
      if (!res.ok) return;
      const list = (await res.json()) as {
        full_name: string;
        stargazers_count: number;
        pushed_at: string;
      }[];
      for (const r of list) {
        repos[r.full_name.toLowerCase()] = {
          stars: r.stargazers_count,
          pushed: r.pushed_at,
        };
      }
    })
  );
  return repos;
}

/** "3 days ago" / "3 gün önce" — coarse units, locale-aware. */
function relativeTime(iso: string, locale: string): string | null {
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return null;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'always' });
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return rtf.format(-Math.max(mins, 1), 'minute');
  const hours = Math.floor(mins / 60);
  if (hours < 24) return rtf.format(-hours, 'hour');
  const days = Math.floor(hours / 24);
  if (days < 30) return rtf.format(-days, 'day');
  const months = Math.floor(days / 30);
  if (months < 12) return rtf.format(-months, 'month');
  return rtf.format(-Math.floor(months / 12), 'year');
}

function pageLocale(): string {
  const lang = document.documentElement.lang;
  return lang === 'tr' ? 'tr' : 'en';
}

/**
 * Fill every GitHub-metadata placeholder under `root` with live
 * data. Elements stay hidden when the data is unavailable (API
 * down / rate-limited).
 */
export async function hydrateGithubMeta(root: ParentNode = document): Promise<void> {
  const starEls = Array.from(root.querySelectorAll<HTMLElement>('[data-gh-stars]'));
  const updatedEls = Array.from(root.querySelectorAll<HTMLElement>('[data-gh-updated]'));
  const lastPushEls = Array.from(root.querySelectorAll<HTMLElement>('[data-gh-lastpush]'));
  if (starEls.length + updatedEls.length + lastPushEls.length === 0) return;

  const slugs = new Set<string>();
  for (const el of [...starEls, ...updatedEls]) {
    const slug = (el.dataset.ghStars ?? el.dataset.ghUpdated ?? '').toLowerCase();
    if (slug) slugs.add(slug);
  }
  const owners = new Set(lastPushEls.map((el) => (el.dataset.ghLastpush ?? '').toLowerCase()));

  let repos = readReposCache();
  const missingOwners = new Set<string>();
  for (const slug of slugs) {
    if (!repos || !(slug in repos)) missingOwners.add(slug.split('/')[0]);
  }
  for (const owner of owners) {
    if (!repos || !Object.keys(repos).some((s) => s.startsWith(`${owner}/`))) {
      missingOwners.add(owner);
    }
  }
  if (missingOwners.size > 0) {
    try {
      repos = { ...(repos ?? {}), ...(await fetchReposFor([...missingOwners])) };
      writeReposCache(repos);
    } catch {
      if (!repos) return;
    }
  }
  if (!repos) return;

  const locale = pageLocale();

  for (const el of starEls) {
    const info = repos[(el.dataset.ghStars ?? '').toLowerCase()];
    if (info && info.stars > 0) {
      el.textContent = `★ ${info.stars}`;
      el.hidden = false;
    }
  }

  for (const el of updatedEls) {
    const info = repos[(el.dataset.ghUpdated ?? '').toLowerCase()];
    const rel = info && relativeTime(info.pushed, locale);
    if (rel) {
      el.textContent = locale === 'tr' ? `${rel} güncellendi` : `updated ${rel}`;
      el.hidden = false;
    }
  }

  for (const el of lastPushEls) {
    const owner = (el.dataset.ghLastpush ?? '').toLowerCase();
    const latest = Object.entries(repos)
      .filter(([slug]) => slug.startsWith(`${owner}/`))
      .map(([, info]) => info.pushed)
      .sort()
      .pop();
    const rel = latest && relativeTime(latest, locale);
    if (rel) {
      el.textContent = rel;
      el.hidden = false;
      el.closest<HTMLElement>('[data-gh-lastpush-row]')?.removeAttribute('hidden');
    }
  }
}

/** `owner/repo` slug from a github.com URL, or null for anything else. */
export function githubSlug(url: string | undefined): string | null {
  const m = url?.match(/^https:\/\/github\.com\/([^/]+\/[^/]+?)\/?$/);
  return m ? m[1] : null;
}
