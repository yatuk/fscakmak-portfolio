import type { CommandHandler } from './index';
import { escapeHtml } from '@lib/sanitize';
import { GH_CACHE_KEY, GH_CACHE_TTL_MS } from '@config/index';

interface GithubUser {
  login: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  bio: string | null;
  html_url: string;
  name?: string;
}

/** Safe subset for localStorage — no free-text fields. */
interface CachedUser {
  login: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface CacheEntry {
  at: number;
  user: CachedUser;
}

function readCache(username: string): CachedUser | null {
  try {
    const raw = localStorage.getItem(GH_CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (entry.user.login !== username) return null;
    if (Date.now() - entry.at > GH_CACHE_TTL_MS) return null;
    return entry.user;
  } catch {
    return null;
  }
}

function writeCache(user: GithubUser): void {
  try {
    const slim: CachedUser = {
      login: user.login,
      public_repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      created_at: user.created_at,
    };
    const entry: CacheEntry = { at: Date.now(), user: slim };
    localStorage.setItem(GH_CACHE_KEY, JSON.stringify(entry));
  } catch {
    /* private mode */
  }
}

function formatStats(user: GithubUser | CachedUser, cached: boolean): string {
  const since = new Date(user.created_at).getFullYear();
  const bio = 'bio' in user && user.bio
    ? `<div class="t-dim" style="margin-top:6px">${escapeHtml(user.bio)}</div>`
    : '';
  const url = 'html_url' in user ? user.html_url : `https://github.com/${user.login}`;
  return `
<div class="cmd-block">
  <div class="cmd-title">GitHub @${escapeHtml(user.login)}${cached ? ' <span class="t-dim">(cached)</span>' : ''}</div>
  <div class="kv" style="margin-top:8px">
    <div class="kv-row"><span class="kv-k">repos</span><span class="kv-v kv-v-emph">${user.public_repos}</span></div>
    <div class="kv-row"><span class="kv-k">followers</span><span class="kv-v">${user.followers}</span></div>
    <div class="kv-row"><span class="kv-k">following</span><span class="kv-v">${user.following}</span></div>
    <div class="kv-row"><span class="kv-k">member since</span><span class="kv-v">${since}</span></div>
  </div>
  ${bio}
  <div class="cmd-help-hint" style="margin-top:10px">
    <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a>
  </div>
</div>`;
}

async function fetchUser(username: string): Promise<GithubUser> {
  const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}`);
  }
  return res.json() as Promise<GithubUser>;
}

const LOADING_ID = 'gh-stats-loading';

function loadingHtml(username: string): string {
  return `<div class="cmd-block" id="${LOADING_ID}">
  <span class="t-dim">fetching github.com/${escapeHtml(username)}</span>
  <span class="gh-spinner">▋</span>
</div>`;
}

const statsHandler: CommandHandler = ({ profile }) => {
  const username = profile.identity.social.github;
  const cached = readCache(username);
  if (cached) {
    return formatStats(cached, true);
  }

  return {
    html: loadingHtml(username),
    effect: () => {
      fetchUser(username)
        .then((user) => {
          writeCache(user);
          const placeholder = document.getElementById(LOADING_ID);
          if (placeholder) placeholder.outerHTML = formatStats(user, false);
        })
        .catch(() => {
          const placeholder = document.getElementById(LOADING_ID);
          if (placeholder) {
            placeholder.outerHTML = `<div class="cmd-block t-err">
              stats: could not reach GitHub API for @${escapeHtml(username)}.<br>
              <span class="t-dim">Try again later — rate limits happen.</span>
            </div>`;
          }
        });
    },
  };
};

export const githubStatsCommands: Record<string, CommandHandler> = {
  stats: statsHandler,
  'github stats': statsHandler,
};
