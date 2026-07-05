<h1 align="center">fscakmak.com</h1>

<p align="center">
  <b>Terminal-themed personal site with a recruiter-facing CV view.</b><br/>
  A SOC analyst's profile you explore by typing commands — or read as a plain CV.
</p>

<p align="center">
  <a href="https://fscakmak.com"><img src="https://raw.githubusercontent.com/yatuk/fscakmak-portfolio/main/public/og-image.png" alt="fscakmak.com terminal view" width="750"/></a>
</p>

<p align="center">
  <a href="https://astro.build"><img src="https://img.shields.io/badge/Astro-5.x-FF5D01?logo=astro&logoColor=white" alt="Astro 5"/></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white" alt="TypeScript"/></a>
  <a href="https://pages.cloudflare.com"><img src="https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare&logoColor=white" alt="Cloudflare Pages"/></a>
  <a href="https://github.com/yatuk/fscakmak-portfolio"><img src="https://img.shields.io/github/last-commit/yatuk/fscakmak-portfolio" alt="Last commit"/></a>
</p>

<p align="center">
  <a href="#features">Features</a> |
  <a href="#development">Development</a> |
  <a href="#project-structure">Project Structure</a> |
  <a href="#deployment">Deployment</a> |
  <a href="https://fscakmak.com"><b>Live Site</b></a>
</p>

---

## Overview

Two views over one typed JSON data layer, in English and Turkish:

| View | Route | What it is |
|---|---|---|
| Terminal | `/`, `/tr` | Browser terminal emulator — autocomplete, history, hidden commands, scoring |
| Recruiter | `/cv`, `/tr/cv` | Single-page CV with status panel, live metrics, and writeups |

Static Astro build, no client-side framework.

---

## Features

- ~40 terminal commands (`whoami`, `projects`, `mitre`, `logs`, `alerts`, `writeups`, ...), each a pure function over typed profile data
- Boot sequence with character-by-character typing — skippable, reduced-motion aware
- Live GitHub metadata on project cards: star counts and last-push times, fetched client-side, cached in localStorage for an hour, hidden when the API is unreachable
- Four color themes (Tokyo Night, Cyberpunk, Matrix, Catppuccin) with no-flash init, persisted per visitor
- Locale-aware routing with hreflang tags and JSON-LD Person schema
- Offline support: small service worker, cache-first for hashed assets, network-first for pages
- Fonts self-hosted via `@fontsource`, latin + latin-ext subsets only, preloaded per route

---

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

---

## Project Structure

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

---

## Deployment

Hosted on Cloudflare Pages as a plain static build (`dist/`). Security headers, including the CSP, are set statically in `public/_headers`.

---

## License

[MIT](LICENSE) (c) 2026 Fatih Serdar Cakmak
