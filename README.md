# fscakmak.com

[![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)

Terminal-themed personal site with a recruiter-facing CV view. Dual-language (EN/TR), static Astro build, self-hosted fonts, zero client-side framework.

## What it does

A retro terminal emulator in the browser — visitors type commands to explore a SOC analyst's profile. The same content is also rendered as a traditional CV page for recruiters. Both views share a typed JSON data layer and i18n strings.

## Highlights

- **Terminal engine** — input handling, tab autocomplete, command history (sessionStorage), scoring system with hidden commands, Konami code easter egg
- **Command registry** — 40+ commands (help, whoami, skills, experience, projects, mitre, logs, alerts, ioc, threat, scan, skillmatrix, neofetch, etc.), each a pure function consuming typed profile data
- **Boot sequence** — fake kernel init with character-by-character typing, skippable, reduced-motion aware
- **Entry screen** — CSS glitch title, typing animation, dual-view routing (terminal / recruiter)
- **Recruiter view** — SOC-dashboard aesthetic, single-page CV with status panel, metrics bar, writeups section
- **i18n** — EN/TR, locale-aware routing (`/` `/tr` `/cv` `/tr/cv`), hreflang tags, JSON-LD Person schema
- **Theming** — 4 themes (Tokyo Night, Cyberpunk, Matrix, Catppuccin), no-flash init via inline script, persisted to localStorage
- **CSP nonces** — per-request `crypto.randomUUID()` nonces via Cloudflare Pages Function, no `unsafe-inline`
- **Font subsetting** — JetBrains Mono (terminal) and Manrope (CV), self-hosted via `@fontsource`, loaded per page route

## Stack

| Layer | Choice |
|---|---|
| Framework | Astro 5 (static output, directory format) |
| Language | TypeScript (strict, `verbatimModuleSyntax`) |
| Styling | Vanilla CSS with custom properties, 4 themes |
| Fonts | `@fontsource/jetbrains-mono` + `@fontsource/manrope` |
| CSP | Cloudflare Pages Function (`functions/_middleware.ts`) |
| Hosting | Cloudflare Pages |

## Dev

```bash
npm install
npm run dev        # localhost:4321
npm run build      # → dist/
npm run check      # astro check (0 errors expected)
```

## Structure

```
src/
├── pages/            # index.astro (terminal), cv.astro (recruiter), tr/ variants
├── layouts/          # BaseLayout.astro
├── components/       # TerminalShell, RecruiterView, HeaderControls, toggles
├── core/             # terminal.ts (shell engine), i18n.ts, scoring.ts, boot.ts
├── commands/         # one file per terminal command, barrel-exported
├── config/           # site constants, terminal config (POINTS, MAX_SCORE, localStorage keys)
├── data/             # profile JSON (EN/TR), UI strings, writeups
├── lib/              # sanitize.ts, profile.ts
├── types/            # Profile, Locale, Identity, SkillGroups, etc.
└── styles/           # tokens.css, globals.css, terminal.css, recruiter.css, fonts
```

## License

MIT
