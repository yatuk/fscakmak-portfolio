---
name: Fatih Serdar Çakmak Portfolio
description: A charcoal-paper notebook home with a companion interactive terminal.
colors:
  paper: "#1b1a17"
  ink: "#ebe6d9"
  muted: "#a8a191"
  faint: "#8a8476"
  rule: "#3a3830"
  chalk: "#c3ec88"
  code-bg: "#24221e"
typography:
  hand:
    fontFamily: "Kalam, cursive"
    use: "h1 name, section headings, margin notes"
  body:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "19px (18px under 640px)"
    lineHeight: 1.65
  metadata:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "12.5–13px"
---

# Design System: Fatih Serdar Çakmak

## Overview

Two surfaces, one person. The home page, the writing index, and articles are a notebook: one narrow column of dark charcoal paper, handwritten headings, serif reading text, and a few hand-drawn pen marks. The terminal (`/terminal`, `/tr/terminal`) is the machine: a dark olive window with its own palette and themes. The terminal is deliberately left as it is; the notebook ties back to it through the lime accent (used as chalk) and JetBrains Mono for dates and labels.

The CV page was retired. `/cv` and `/tr/cv` redirect to home (`astro.config.mjs` and `public/_redirects`) for old links and the terminal page's crawlable summary. The terminal's titlebar has a single `←` back button (no label, aria-label "Back to home") that goes straight to home.

Source of truth: `src/styles/notebook.css`, `src/components/HomeView.astro`, `WriteupsView.astro`, `ArticleView.astro`, `TopBar.astro`, `HandRule.astro`, `NotebookFooter.astro`. Terminal: `TerminalShell.astro`, `terminal.css`, `tokens.css`.

## Colors

`ink` on `paper` for reading text, `muted` for descriptions and the p.s. line, `faint` for mono dates and meta (still 4.6:1 on paper), `rule` for hand-drawn dividers and link underlines. `chalk` (the terminal's lime) is used sparingly: the name underline, the one highlighted word in the lede, link hover, and the `>_` prompt in the top bar.

The notebook uses its own fixed palette, not the `--color-*` tokens. The terminal's `theme` command rewrites those tokens site-wide, and the notebook should not change color when someone tries the matrix theme.

## Typography

Kalam carries the name (700) and section headings (400, lowercase: "what i do", "work", "building", "also made", "writing", "say hi"). Source Serif 4 carries everything people actually read. JetBrains Mono is for dates, language/tags, the top bar, and small links like "live ↗". All three load latin + latin-ext so Turkish renders correctly.

## Layout

A single column, max 620px, centered, 128px top padding (96px on mobile). Sections are separated by hand-drawn SVG dividers (`HandRule`, three slightly different wobbles). Lists are one line per item: **name** — short description, with mono meta trailing (dropping below on mobile). No cards, no grids, no hero art.

The top bar sits absolutely in the top-right: an `EN / TR` switch and a `>_ terminal` chip. It is hidden on the terminal pages, which have their own titlebar.

## Motion

Only the hero's pen marks animate: the name underline, the margin-note arrow, and the squiggle under the highlighted word draw in once, in sequence (`drawStrokes` in `src/lib/motion.ts`, WAAPI). They are pre-hidden only under `(scripting: enabled) and (prefers-reduced-motion: no-preference)`, so they render finished without JS or with reduced motion. Nothing else moves.

## Components

- **TopBar:** language switch + terminal chip, 44px touch targets, fixed hex colors.
- **HomeView:** name + margin note + lede, then what i do (with a p.s. on school and certs), work (from `experience`), building / also made (from `projects`, using each project's `short` line), writing (from `writeups.json`), say hi (email, links, copy-email button with a `role="status"` result).
- **WriteupsView / ArticleView:** same column, mono meta row, serif titles, handwritten article subheadings, code on a darker block.
- **NotebookFooter:** a pointer to the terminal and the source link.

## Do's and Don'ts

- **Do** keep copy short, first person, and factual. One line per project.
- **Do** keep the terminal untouched when changing the notebook.
- **Don't** add cards, metrics, badges, or invented claims.
- **Don't** use chalk for large areas; it is a pen, not a fill.
- **Don't** add em dashes as decoration in prose (the " — " between a name and its description is the list format, not a sentence device).
