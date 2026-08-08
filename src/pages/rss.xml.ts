import type { APIRoute } from 'astro';
import writeups from '@data/writeups.json';

interface Writeup {
  title: string;
  url?: string;
  path?: string;
  date: string;
  lang: string;
  tags: string[];
  summary: string;
  summary_tr: string;
}

const SITE = 'https://fscakmak.com';

const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** "2026-07" → RFC-822 date at the first of the month, UTC. */
const pubDate = (ym: string) => new Date(`${ym}-01T00:00:00Z`).toUTCString();

export const GET: APIRoute = () => {
  const items = (writeups as Writeup[])
    .map((w) => {
      const link = w.path ? `${SITE}${w.path}` : (w.url ?? SITE);
      const desc = w.lang === 'tr' ? w.summary_tr : w.summary;
      const cats = w.tags.map((t) => `<category>${esc(t)}</category>`).join('');
      return `    <item>
      <title>${esc(w.title)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="true">${esc(link)}</guid>
      <pubDate>${pubDate(w.date)}</pubDate>
      <description>${esc(desc)}</description>
      ${cats}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Fatih Serdar Çakmak — Writeups</title>
    <link>${SITE}/writeups</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Security writeups on detection engineering, malware analysis, AI/LLM security, and web security.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
