/* ============================================================
   GitHub star counts — shared by the terminal `projects`
   command and the recruiter view. One repos-listing request
   per owner, cached in localStorage for an hour.
   ============================================================ */

const STARS_CACHE_KEY = 'fsc.gh.stars';
const STARS_CACHE_TTL_MS = 60 * 60 * 1000;

interface StarsCacheEntry {
  at: number;
  stars: Record<string, number>;
}

function readStarsCache(): Record<string, number> | null {
  try {
    const raw = localStorage.getItem(STARS_CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as StarsCacheEntry;
    if (Date.now() - entry.at > STARS_CACHE_TTL_MS) return null;
    return entry.stars;
  } catch {
    return null;
  }
}

function writeStarsCache(stars: Record<string, number>): void {
  try {
    const entry: StarsCacheEntry = { at: Date.now(), stars };
    localStorage.setItem(STARS_CACHE_KEY, JSON.stringify(entry));
  } catch {
    /* private mode */
  }
}

async function fetchStarsFor(slugs: string[]): Promise<Record<string, number>> {
  const owners = [...new Set(slugs.map((s) => s.split('/')[0]))];
  const stars: Record<string, number> = {};
  await Promise.all(
    owners.map(async (owner) => {
      const res = await fetch(
        `https://api.github.com/users/${encodeURIComponent(owner)}/repos?per_page=100`,
        { headers: { Accept: 'application/vnd.github+json' } }
      );
      if (!res.ok) return;
      const repos = (await res.json()) as { full_name: string; stargazers_count: number }[];
      for (const r of repos) stars[r.full_name.toLowerCase()] = r.stargazers_count;
    })
  );
  return stars;
}

/**
 * Fill every `[data-gh-stars="owner/repo"]` element under `root`
 * with its live star count. Elements stay hidden when the count
 * is unknown (API down / rate-limited) or zero.
 */
export async function hydrateStars(root: ParentNode = document): Promise<void> {
  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-gh-stars]'));
  if (els.length === 0) return;

  const slugs = [...new Set(els.map((el) => (el.dataset.ghStars ?? '').toLowerCase()))];
  let stars = readStarsCache();
  const missing = slugs.filter((s) => !stars || !(s in stars));
  if (missing.length > 0) {
    try {
      stars = { ...(stars ?? {}), ...(await fetchStarsFor(missing)) };
      writeStarsCache(stars);
    } catch {
      if (!stars) return;
    }
  }

  for (const el of els) {
    const count = stars?.[(el.dataset.ghStars ?? '').toLowerCase()];
    if (typeof count === 'number' && count > 0) {
      el.textContent = `★ ${count}`;
      el.hidden = false;
    }
  }
}

/** `owner/repo` slug from a github.com URL, or null for anything else. */
export function githubSlug(url: string | undefined): string | null {
  const m = url?.match(/^https:\/\/github\.com\/([^/]+\/[^/]+?)\/?$/);
  return m ? m[1] : null;
}
