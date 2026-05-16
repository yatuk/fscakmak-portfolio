# fscakmak.com — portfolio v2

[![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)

Terminal-themed, multi-language portfolio for **Fatih Serdar Çakmak** — Cyber Security Operations (SOC) Intern @ Fibabanka & ITU Computer Engineering student.

## Stack

- **Astro 5** — static site generation, built-in i18n routing (`/`, `/tr`)
- **TypeScript** (strict)
- **Vanilla CSS** with design tokens (`src/styles/tokens.css`)
- **Cloudflare Pages** — deploy target with `_headers` + `security.txt`

## Local dev

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # → dist/
npm run preview   # serve dist/ locally
npm run check     # astro check (TS + content)
```

## Project structure

```
public/                     # static assets, _headers, robots, security.txt
src/
├── pages/
│   ├── index.astro         # EN landing (default locale)
│   └── tr/index.astro      # TR landing
├── layouts/
│   └── BaseLayout.astro    # <head>, OG, JSON-LD, skip link
├── styles/
│   ├── tokens.css          # palette + themes (Tokyo Night default)
│   └── globals.css         # reset, focus, scrollbar
├── core/                   # terminal runner, i18n, theme, score (Step 2+)
├── commands/               # one file per command (Step 3+)
├── data/                   # profile.{tr,en}.json (CV-verbatim source of truth)
├── lib/
│   └── profile.ts          # getProfile(locale) loader
├── components/             # Astro components
└── types/
    └── profile.ts          # shape of profile JSON
legacy/
└── index.html              # v1 reference — preserved verbatim
```

## Status

- ✅ Step 0 — scaffold (Astro, TS, tokens, layout, locale routing, security headers)
- ✅ Step 1 — data-driven content (`profile.{tr,en}.json`, CV-aligned)
- ⏳ Step 2 — i18n runtime, language toggle, prerendered locale routes
- ⏳ Step 3+ — terminal core, commands, recruiter view, MITRE matrix…

## Deploy

Cloudflare Pages auto-detects from `wrangler.toml`. Build cmd: `npm run build`, output: `dist/`.

## License

MIT — see `LICENSE`.
