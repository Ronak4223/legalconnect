# LegalConnect

One **React + Vite** project with two apps that share a theme and an image folder:

| App | URL (dev / preview) | Stack |
|---|---|---|
| **Public site** | `/` | React 18, React Router, Tailwind, **GSAP** (ScrollTrigger, SplitText), **Lenis**, **Motion** |
| **Lawyer portal** | `/portal/` | React 18, React Router (hash routes), plain CSS, GSAP (route-enter) |

```
legalconnect/
├── index.html · portal/index.html     ← the two HTML entries
├── vite.config.js · tailwind.config.js · postcss.config.js
├── shared/
│   ├── theme/tokens.css              ← the theme (single source of truth)
│   └── assets/img/                   ← all 27 images · originals/ · MANIFEST.md
├── src/
│   ├── site/
│   │   ├── main.jsx · App.jsx · SiteContext.jsx
│   │   ├── pages/                    Home · LegalPage (/privacy, /terms) · NotFound
│   │   ├── sections/                 18 section components (Hero, Approach, Stories, … Footer)
│   │   ├── components/               Icon · glyphs · Dialog · directory (filters, rows, pager)
│   │   ├── animation/                gsap.js · SmoothScroll (Lenis) · useHeroIntro · useSiteAnimations · useCountUp
│   │   ├── data/                     areas · lawyers · stories · people · journey · articles
│   │   └── styles/                   index.css (tokens + Tailwind + site.css)
│   └── portal/
│       ├── app/                      29 ES modules: lib · data · state · components · views · main.js
│       ├── animation/useRouteEnter.js
│       └── styles/                   18 CSS files, imported in cascade order by index.css
├── qa/                               Playwright + axe-core scripts · results.txt
├── docs/                             ARCHITECTURE · ISSUES · THEME · QA_REPORT
└── tools/legacy/                     one-time migration scripts (provenance)
```

## Run
```bash
npm install
npm run dev        # http://localhost:5173/  and  /portal/
npm run build      # → dist/
npm run preview    # serves dist/ on http://localhost:4173/
```
The build uses ES modules, so **open it through a server** (`npm run preview`), not by double-clicking `dist/index.html`. (The previous single-file portal build could be double-clicked; this one cannot.)

Portal demo login: `aarav.mehta@example.com` / `Demo@1234` — all data is fictional and stays in the browser.

## QA
```bash
npm run build && npm run preview &          # then, with Playwright installed (pip install playwright && playwright install chromium):
python3 qa/react_site.py http://localhost:4173/
python3 qa/behave.py http://localhost:4173/portal/     # also ui2.py, sec.py, boundary.py, deepcorrupt.py, audit.py
python3 qa/site_visual_diff.py <old-page.html> http://localhost:4173/
```
Latest results: `qa/results.txt` (94 checks passing, 0 failing).

## Read this first
- **Portal identifiers.** The portal's original source was never provided; `src/portal/app/` was recovered from the minified build. It is now real ES modules (explicit imports/exports, npm React/Router) and the routed views have readable names, but most helper names are still short (`ne`, `Vl`, `xe`…). Use the original repository if you have it.
- **Demo content.** Lawyers, clients, testimonials, payments and statistics are fictional. The public site is `noindex` until that changes (remove the meta tag in `index.html`).
- **Hosting.** The site uses `BrowserRouter` (`/privacy`, `/terms`), so a static host needs a fallback to `index.html` for unknown paths. The portal uses hash routes and needs nothing.
