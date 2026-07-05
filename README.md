# fscakmak.com

[![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)

Personal site of a SOC analyst, built as a terminal emulator. Visitors explore the profile by typing commands; the same content is also rendered as a conventional CV page for recruiters. Both views read from one typed JSON data layer with EN/TR translations. Static Astro build, no client-side framework.

Live at [fscakmak.com](https://fscakmak.com).

## Features

- Terminal shell with tab autocomplete, command history, a scoring system with hidden commands, and a skippable boot sequence
- ~40 commands (`whoami`, `projects`, `mitre`, `logs`, `alerts`, `writeups`, ...), each a pure function over typed profile data
- Recruiter view: single-page CV with a status panel, live metrics, and Medium writeups
- Live GitHub metadata on project cards — star counts and last-push times fetched client-side, cached in localStorage for an hour, hidden when the API is unreachable
- Four color themes with no-flash init, persisted per visitor
- Locale-aware routing (`/`, `/tr`, `/cv`, `/tr/cv`) with hreflang tags and JSON-LD
- Offline support via a small service worker: cache-first for hashed assets, network-first for pages
- Fonts self-hosted through `@fontsource`, latin + latin-ext subsets only, preloaded per route

## Development

```bash
npm install
npm run dev        # localhost:4321
npm run build      # → dist/
npm run check      # astro check
```

The Open Graph image is a generated artifact — after changing it, run:

```bash
node scripts/generate-og.mjs
```

## Project structure

```
src/
├── pages/            # index.astro (terminal), cv.astro (recruiter), tr/ variants
├── layouts/          # BaseLayout.astro — head, meta, font preloads, SW registration
├── components/       # TerminalShell, RecruiterView, HeaderControls, toggles
├── core/             # terminal.ts (shell engine), i18n.ts, scoring.ts, boot.ts
├── commands/         # one file per terminal command, barrel-exported
├── config/           # site constants, terminal config
├── data/             # profile JSON (EN/TR), UI strings, writeups
├── lib/              # github.ts (repo metadata), sanitize.ts, profile.ts
├── types/            # Profile, Locale, Identity, ...
└── styles/           # tokens.css, globals.css, terminal.css, recruiter.css, fonts
public/
├── sw.js             # service worker
└── _headers          # CSP and caching headers for Cloudflare Pages
scripts/
├── generate-og.mjs   # renders public/og-image.png from an inline SVG
└── generate-icons.mjs
```

## Deployment

Hosted on Cloudflare Pages as a plain static build (`dist/`). Security headers, including the CSP, are set statically in `public/_headers`.

## License

MIT
