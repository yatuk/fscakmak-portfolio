---
name: Fatih Serdar Çakmak Portfolio
description: An editorial security portfolio with a companion interactive terminal.
colors:
  portfolio-bg: "#101310"
  paper: "#eef0e8"
  muted: "#a6afa3"
  line: "#31382f"
  lime: "#c3ec88"
  primary-ink: "#172110"
  primary-hover: "#d7f4af"
  project-surface: "#1c261a"
  project-surface-alt: "#202823"
typography:
  display:
    fontFamily: "Manrope, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(48px, 5.8vw, 78px)"
    fontWeight: 600
    lineHeight: 1.03
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Manrope, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(28px, 3vw, 40px)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Manrope, system-ui, -apple-system, sans-serif"
    fontSize: "16px"
    lineHeight: 1.8
  metadata:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "11px"
rounded:
  button: "3px"
  terminal-link: "4px"
  terminal-window: "7px"
components:
  button-primary:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.primary-ink}"
    rounded: "{rounded.button}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.primary-ink}"
---

# Design System: Fatih Serdar Çakmak

## Overview

The built direction is an editorial security fieldbook: dark olive surfaces, generous reading space, lime emphasis, and small technical diagrams. This is a code-led record, not an approved visual comp. The homepage presents the profile directly for recruiters; English and Turkish terminal routes provide an optional interactive exploration surface.

Source of truth: `src/components/RecruiterView.astro`, `src/styles/recruiter.css`, `src/components/TerminalShell.astro`, `src/styles/terminal.css`, `src/styles/tokens.css`, and `PRODUCT.md`. Frontmatter captures the recruiter palette and observed type roles; terminal themes remain defined in `tokens.css`.

## Colors

Use `paper` for primary reading text, `muted` for descriptions and metadata, and `line` for section dividers on `portfolio-bg`. Lime marks the surname, principal action, current status, selected skill headings, and diagram nodes. Project illustrations use two quiet green surfaces rather than bright promotional artwork.

The terminal's default theme now draws its semantic `--color-*` properties directly from the recruiter palette (`tokens.css`): dark olive ground, paper text, lime for links/accent/prompt. This is deliberate — the terminal and CV are one product and should read as one, not two different sites. Severity/data hues stay distinct where they carry meaning (SOC command output: red/orange for critical/high alerts, warm gold for tags and typed commands) — those are functional, not brand decoration, and are not touched. The macOS-style traffic-light dots were recolored to the same olive/lime pair for the same reason. The alternate themes (`cyberpunk`, `matrix`, `catppuccin`, selectable via the `theme` command) remain intentionally distinct skins — a user opt-in, not the default identity.

## Typography

Manrope carries headings and prose. JetBrains Mono carries code, dates, tags, and technical labels. Manrope includes Latin extended files for Turkish characters.

The hero name is the largest element, with tight tracking and a balanced two-line composition. The statement below it uses 22–30px type at 1.3 line height. Section headings use the headline token; project titles are 26px at weight 500. Descriptions generally use 14–16px and 1.8–1.95 line height. The hero introduction stays within 48ch. Small mono labels are supporting information, not the primary explanation.

## Layout

The recruiter container is centered at a maximum 1280px with 56px horizontal padding. The hero uses a 1.3:1 grid and 64px gap; featured projects use two equal columns with a 28px gap. Experience and additional project rows use a 1:2 grid. Thin rules and generous vertical spacing establish the page rhythm: major sections begin with 86px of space.

At 1000px, horizontal padding becomes 32px. At 700px, it becomes 22px; navigation wraps into a second row, content grids become single columns, the decorative hero diagram hides, and major section spacing reduces to 54px. The name is 58px on mobile, reducing to 49px at 360px with 16px page padding. Contact addresses can wrap anywhere. Credentials stack and writing dates move above titles.

Terminal content is capped at 1120px with an independently scrolling body and 32px internal padding. At 640px, outer padding becomes 12px 10px and inner padding 20px 16px. Quick-command buttons remain visible at every size. The title hides below 1100px to protect the controls; decorative window dots and score labels hide on small screens. Structured command output can scroll horizontally.

Print styles use white paper, dark text, compact spacing, and hide navigation, actions, diagrams, and footer. Writing and article surfaces retain their own narrower reading layouts.

## Elevation & Depth

The recruiter page is flat: spacing, thin borders, and tonal surfaces separate content without card shadows. The terminal is a distinct window with the existing `--shadow-window` shadow and raised title bar. Keep terminal chrome local to that experience.

## Shapes

Use restrained rectangular forms: 3px corners on the main button and project artwork, 4px on the terminal entry link, and 7px on the terminal window. Round dots indicate status or decorate window chrome. Terminal command chips retain their pill shape. The hero shield and project architecture diagrams are SVG/CSS elements, not raster assets.

## Components

- **Navigation:** lowercase `fsc.` wordmark, section links, language switch, and outlined terminal link. Preserve visible English/Turkish route access and direct paths back to the recruiter view.
- **Actions:** lime primary button with dark text, minimum 50px height, and a 160ms background transition. Secondary actions use text and directional glyphs. Recruiter focus uses a 2px lime outline with 5px offset.
- **Project presentations:** two featured diagrams followed by unboxed descriptions and plain mono tags. Additional projects, experience, credentials, and writing use ruled rows rather than a uniform card grid.
- **Contact:** prominent email link, social links, and a copy button. Copy results use `role="status"`, including a failure message that points visitors to the email link.
- **Terminal:** clearly described as a portfolio simulation. A labeled input accepts commands; quick commands and suggestions are native buttons. Output uses `role="log"` with polite live announcements. Input text is 16px; chips and suggestions have a minimum 44px height. Keep keyboard focus visible and decorative glyphs hidden from assistive technology.
- **Motion:** use brief state transitions. Shared reduced-motion rules reduce animation and transitions and restore automatic scrolling. Terminal input focus does not animate or add text glow.

## Do's and Don'ts

- **Do** keep professional facts and project descriptions tied to existing profile data.
- **Do** preserve bilingual navigation, the downloadable resume, writing, and terminal commands.
- **Do** use lime sparingly for hierarchy and interaction while keeping prose readable.
- **Do** preserve semantic links, native buttons, labeled controls, focus treatment, and mobile wrapping.
- **Don't** make visitors use a terminal to access the profile.
- **Don't** introduce invented employment, performance claims, or decorative metrics.
- **Don't** replace the editorial reading surface with terminal chrome or add em dashes to site copy.
