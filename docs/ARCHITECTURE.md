# Architecture

## 1. One project, two apps
`vite.config.js` declares two HTML entries (`index.html` → site, `portal/index.html` → portal). They build together, share one React chunk, and import the same theme and images from `shared/` through the `@shared` alias. Rule: a visual constant lives in `shared/theme/tokens.css`; an image lives in `shared/assets/img`. Nothing else is duplicated.

Build output (gzipped): React 54 KB · GSAP 55 KB · Motion 49 KB · site code 18 KB · portal code 76 KB. The site loads React + GSAP + Motion + site; the portal loads React + GSAP + portal (it does not load Motion).

## 2. Public site
**Structure.** `pages/Home` composes 18 section components inside one `<main>`; `SiteContext` holds cross-section state (hero search, area picker, dialog, directory filters) and exposes one `act(name, payload)` dispatcher — a direct replacement for the old `data-a` click hooks. Carousels (testimonials, people, cases) keep their own local state.

**How it was converted.** The old page was ~30 KB of static HTML plus a 430-line `site.js`. A DOM-based converter turned each section into JSX with every Tailwind class intact; the JS-filled regions were then rebuilt as React state. With animations disabled the React page is **pixel-equivalent** to the original (0.001 % of pixels differ on desktop, 0.004 % on mobile; identical page heights).

**Animation (all of it respects `prefers-reduced-motion`; reduced-motion users get the static page and native scrolling):**
| Layer | Library | What it does |
|---|---|---|
| Smooth scroll | **Lenis**, driven by GSAP's ticker so Lenis and ScrollTrigger share one clock | Inertial scrolling; paused while a dialog is open; all programmatic scrolling goes through `useSmoothScroll().scrollTo` |
| Hero | **GSAP** timeline + **SplitText** | Image settles, header drops in, headline lines rise from masks, then copy/search/stats; scroll-linked parallax and fade on exit |
| Sections | GSAP **ScrollTrigger** + SplitText | Heading line-masks; batched fade-up for copy, cards and list items; opacity-only reveals for nodes positioned with a CSS transform (so their centring is never overwritten); parallax on the *photo layer only* of multi-layer backgrounds (range clamped to 0–100 %); scroll-progress bar; count-up statistic; magnetic call-to-action pills (fine pointers only) |
| UI state | **Motion** (`motion/react`) | Dialog spring-in; directory rows animate in/out and re-order with layout animations |

GSAP inline styles are cleared after each reveal so CSS hover effects keep working.

## 3. Lawyer portal
29 ES modules. `main.js` is the entry; the original single-scope bundle was split along its real module boundaries and a dependency graph generated the `import`/`export` lines. The 14 names the app used from the inlined React/Router bundle were identified from their definitions and replaced by npm imports. Images come from `shared/assets/img` via `src/portal/app/00-assets.js`.

**Motion is deliberately restrained here:** a short capped stagger when a route renders (`animation/useRouteEnter.js`). **Lenis is not used in the portal** — it is a dense data UI with sticky columns, tables and modal dialogs, where native scrolling is more predictable; adding it is a small change if you want it.

**Robustness (from Phase 6):** validated state loader (falls back to sample data), error boundary with *Reload / Restore sample data*, route guards, hash routing.

## 4. Things that will bite
- `url()` inside a CSS custom property resolves where it is **used**. The site's JS applies `--i2`-style variables via inline styles; Vite rewrites those URLs at build time, so this is safe here — but don't move to runtime-generated relative paths.
- React Router v7 future flags are enabled in both apps (`v7_startTransition`, `v7_relativeSplatPath`); with them the URL changes before the next route renders, so tests must wait for the heading rather than counting it immediately.
- Scanning with axe *during* the portal's route animation reports false colour-contrast failures (elements are semi-transparent); the QA scripts wait for the animation to settle.
