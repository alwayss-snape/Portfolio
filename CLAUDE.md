# Portfolio — Kshitij Chaubey

The full spec is `PORTFOLIO_BUILD_BRIEF.md`. Read it before any milestone work; this file is the short version.

## Hard rules (brief §2, never break)

- **Never commit a resume PDF.** `*.pdf` is in `.gitignore`, and CI fails if `git ls-files '*.pdf'` is non-empty. Never copy a PDF into the repo, not even temporarily.
- The resume is shown **only as page images** (WebP + PNG fallback) in `public/resume/`. No download button, no link to a PDF, anywhere.
- The site and repo must **never reference any external show, film or franchise** that inspired the mood: no names, logos, symbols, character imagery or quoted lines. This includes code comments, commit messages and file names. `PORTFOLIO_BUILD_BRIEF.md` is kept local (gitignored) for this reason; never commit it.
- No analytics, cookies or third-party trackers in v1. Fonts are self-hosted (`@fontsource/*`), never loaded from a CDN.
- Push only to the portfolio repo (`alwayss-snape/Portfolio`), and **only when Kshitij says so**. Ask before renaming repos or changing any GitHub settings.

## Stack

- Vite + React + TypeScript, single page with anchor links (no router).
- 3D: `three`, `@react-three/fiber`, `@react-three/drei` (import only the helpers used). Lazy-load the 3D chunk.
- Motion: `motion` (Framer Motion) for scroll-linked effects.
- Styling: Tailwind CSS v4 via `@tailwindcss/vite`, with design tokens as CSS variables.
- Fonts: Instrument Serif (display, roman + italic), IBM Plex Sans (body), IBM Plex Mono (labels), via `@fontsource/*`.
- Deploy: GitHub Actions → GitHub Pages (`.github/workflows/deploy.yml`).
- Vite `base` comes from the `VITE_BASE` env var (default `/`). The workflow sets `/Portfolio/` until the repo becomes `kshitijchaubey.github.io`, then `/`.

## Where things live

- **All colours and fonts:** `src/theme/tokens.css` (single source of truth; no hard-coded hex values in components, except the 3D scene's material colours which should mirror the tokens).
- **All copy:** `src/content/` (`profile.ts`, `experience.ts`, `stack.ts`, `links.ts`, `resume.ts`). Components never contain copy.
- Sections: `src/sections/`; shared components: `src/components/`; 3D: `src/three/`.
- `projects` exists in the content model and nav but is hidden in v1.

## Design constraints

- Theme "Overcast": light grey-green fog background, single rust accent. No pure black anywhere. AA contrast (`--ink` / `--ink-2` on `--fog` for text).
- Designation is always "Data Scientist & ML Engineer" (kicker, About, `<title>`, meta description).
- Respect `prefers-reduced-motion` (static poster, fully drawn ring). Content must be readable without motion.
- Budget: initial JS (excluding the 3D chunk) < 120 KB gzipped.

## Milestones (brief §9)

1. Scaffold, tokens, fonts, content model, deploy workflow; "hello" page to confirm base path. ← **done**
2. All sections as static, responsive DOM; poster image as hero. ← **done**
3. `CycleRing` with scroll-linked draw-in and list sync. ← **done**
4. `ForestScene` — **hybrid** (decided 2026-10-10, overrides brief §5.2): photo backdrop (`public/hero-backdrop.webp`, ring removed) + live WebGL ring, rain, fog banks, pointer/scroll parallax, poster cross-fade, fallbacks. No procedural trees. ← **done**
5. Resume pipeline (`scripts/resume-to-images.sh`) and viewer; confirm no PDF in git history.
6. Polish: OG image, Lighthouse pass, cross-browser check.

Work one milestone at a time. Stop after each, show the result, and wait for Kshitij before continuing.

## Commands

- `npm run dev` — dev server
- `npm run build` — typecheck + production build (`VITE_BASE=/Portfolio/ npm run build` to test the Pages path)
- `npm run preview` — serve the build
