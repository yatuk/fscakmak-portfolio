# fscakmak.com — portfolio v2

[![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)

Terminal-themed, multi-language portfolio for **Fatih Serdar Çakmak** — Cyber Security Operations (SOC) Intern @ Fibabanka & ITU Computer Engineering student.

## Routes

| Path        | View      | Locale |
|-------------|-----------|--------|
| `/`         | Terminal  | EN     |
| `/tr`       | Terminal  | TR     |
| `/cv`       | Recruiter | EN     |
| `/tr/cv`    | Recruiter | TR     |

Mobile (<768px) visitors land on `/cv` automatically; a one-click "Force terminal mode" link saves the preference.

## Terminal commands

Documented: `help` · `help -v` · `whoami` · `cat about.txt` · `skills` · `experience` · `git log` · `projects` · `education` · `certs` · `mitre` · `languages` · `contact` · `socials` · `neofetch` · `ls` · `theme [name]` · `tree` · `download resume` · `clear`

Hidden (tab-autocomplete to find): `matrix` · `sl` · `coffee` · `ping` · `nmap` · `hack` · `pwd` · `history` · `date` · `42` · `cat /etc/passwd` · `cat .secret/flag.txt` · `sudo rm -rf /` · `rm -rf /` · `whoami --root` · `exit`

Plus the Konami code for +30 bonus points.

## Stack

- **Astro 5** — static site generation, built-in i18n routing
- **TypeScript** (strict)
- **Vanilla CSS** with design tokens — 4 themes (Tokyo Night default, Cyberpunk, Matrix, Catppuccin Mocha), no-flash boot via inline init
- **Cloudflare Pages** — deploy target with `_headers` (CSP/HSTS), `.well-known/security.txt`, hreflang, JSON-LD Person schema

## Local dev

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # → dist/
npm run preview   # serve dist/ locally
npm run check     # astro check (TS + content) — 0/0/0 expected
```

## Project structure

```
public/                     # static assets, _headers, robots, security.txt, manifest
src/
├── pages/
│   ├── index.astro         # / — terminal EN
│   ├── cv.astro            # /cv — recruiter EN
│   └── tr/
│       ├── index.astro     # /tr — terminal TR
│       └── cv.astro        # /tr/cv — recruiter TR
├── layouts/BaseLayout.astro
├── components/
│   ├── TerminalShell.astro
│   ├── RecruiterView.astro
│   ├── HeaderControls.astro · LanguageToggle.astro · ViewToggle.astro
├── core/
│   ├── terminal.ts         # input runner, history, score, Konami
│   └── i18n.ts             # t(locale, key) + locale URL helpers
├── commands/               # one file per command — each consumes profile+strings
│   └── easter-eggs.ts · matrix.ts · theme.ts · mitre.ts · tree.ts · download.ts · …
├── data/
│   ├── profile.{en,tr}.json   # CV-verbatim content
│   └── strings.{en,tr}.json   # UI labels
├── lib/profile.ts          # getProfile(locale) loader
├── styles/
│   ├── tokens.css · globals.css
│   ├── terminal.css · recruiter.css
└── types/profile.ts
legacy/index.html           # v1 reference — preserved verbatim
```

## Deploy (Cloudflare Pages, GitHub-connected)

1. Push this repo to GitHub.
2. In Cloudflare → Pages → **Create application → Connect to Git** → pick this repo.
3. Build settings (Cloudflare auto-detects most of these from `wrangler.toml`):
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** 20 (pinned via `.nvmrc`)
4. **Save and Deploy**. First build is ~30s.
5. Add **Custom domain → `fscakmak.com`**. Since the apex is already on Cloudflare DNS, you get a one-click setup and automatic SSL.

Every `git push origin main` triggers a new production deploy; pushes to branches publish to preview URLs.

## License

MIT — see `LICENSE` (TODO).
