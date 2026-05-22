import type { CommandHandler } from './index';

const CACHE_KEY = 'fsc.github.stats';
const CACHE_TTL_MS = 60 * 60 * 1000;

interface GithubUser {
  login: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  bio: string | null;
  html_url: string;
}

interface CacheEntry {
  at: number;
  user: GithubUser;
}

function readCache(username: string): GithubUser | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (entry.user.login !== username) return null;
    if (Date.now() - entry.at > CACHE_TTL_MS) return null;
    return entry.user;
  } catch {
    return null;
  }
}

function writeCache(user: GithubUser): void {
  try {
    const entry: CacheEntry = { at: Date.now(), user };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    /* private mode */
  }
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return c;
    }
  });
}

function formatStats(user: GithubUser, cached: boolean): string {
  const since = new Date(user.created_at).getFullYear();
  const bio = user.bio ? `<div class="t-dim" style="margin-top:6px">${esc(user.bio)}</div>` : '';
  return `
<div class="cmd-block">
  <div class="cmd-title">📊 GitHub @${esc(user.login)}${cached ? ' <span class="t-dim">(cached)</span>' : ''}</div>
  <div class="kv" style="margin-top:8px">
    <div class="kv-row"><span class="kv-k">repos</span><span class="kv-v kv-v-emph">${user.public_repos}</span></div>
    <div class="kv-row"><span class="kv-k">followers</span><span class="kv-v">${user.followers}</span></div>
    <div class="kv-row"><span class="kv-k">following</span><span class="kv-v">${user.following}</span></div>
    <div class="kv-row"><span class="kv-k">member since</span><span class="kv-v">${since}</span></div>
  </div>
  ${bio}
  <div class="cmd-help-hint" style="margin-top:10px">
    <a href="${esc(user.html_url)}" target="_blank" rel="noopener noreferrer">${esc(user.html_url)}</a>
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
  <span class="t-dim">fetching github.com/${esc(username)}</span>
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
              stats: could not reach GitHub API for @${esc(username)}.<br>
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
