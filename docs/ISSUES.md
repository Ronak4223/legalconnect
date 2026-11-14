# Issues register (updated for the React/Vite migration)

Everything found **before** changes were made, plus the Phase 6 audit. Status: ✅ fixed · 🟡 partly / mitigated · ⏳ open — needs a decision or content · ℹ️ note.
"Verified" means I ran it (Chromium 141 + axe-core, `qa/`). Items marked *(plan)* come from your development plan and were **not** re-verified against code.

## A. Codebase structure — why it was a mess
| # | Issue | Status |
|---|---|---|
| S1 | Three disconnected artefacts: portal as one 710 KB minified HTML (no source), public site as an 80 KB single file (zip), and (per the plan) a 4.6 MB base64 version. No shared folder, no README, no scripts, no `package.json`. | ✅ one React/Vite project: two apps, one theme, one asset folder, build + QA scripts |
| S2 | **Portal source was never provided** — only the build. | 🟡 now **29 real ES modules** in `src/portal/app/` (explicit imports/exports, npm React/Router, readable names for the routed views). Helper identifiers are still short. Use the original repo if it exists. |
| S3 | Three images embedded as base64 in the portal (~160 KB of 710 KB). | ✅ files in `shared/assets/img`, imported through Vite |
| S4 | CSS and JS inline inside the HTML (both projects). | ✅ React components, CSS files, data modules |
| S5 | Public site loads Tailwind from the CDN (not for production; breaks offline; unpinned). | ✅ Tailwind compiled by Vite/PostCSS, pinned 3.4.17 (site CSS 10 KB gzipped) |
| S6 | Theme defined three times under different names; the portal had a **second `:root` block** (layout sizes + AA status text tones) that a naive split drops — I dropped it once and the pixel-diff caught it. | ✅ unified in `shared/theme/tokens.css`, imported by both apps |
| S7 | `url()` in CSS custom properties resolves relative to the point of use (verified). Moving the public CSS into a subfolder breaks JS-applied backgrounds. | ✅ no longer applies: Vite rewrites CSS URLs at build time |
| S8 | The previous portal build could be double-clicked from disk. ES modules cannot load from `file://`. | ⏳ run via `npm run preview` / any static host (documented in README) |

## B. Assets
| # | Issue | Status |
|---|---|---|
| A1 | Portal used 3 of 27 images; the planned verification illustrations (`trust-1…4`) were unused. | ✅ "What clients see once you're verified" gallery on Verification |
| A2 | `trust-1…4.jpg` carry ~19 px white margins; `trust-2` and `trust-4` also contain slivers of neighbouring images (visible on the public trust cards). | ✅ cropped under the same names; originals in `shared/assets/originals/` |
| A3 | Portal login panel used a 1100 px downscale of `hero-bg`. | ✅ uses the original |
| A4 | 3.4 MB total, JPEG only, no `srcset`/WebP. Largest 239 KB. | ⏳ recommend WebP + responsive sizes |
| A5 | Plan §1.3 also lists empty-state art and extra portraits for the portal. | ⏳ not done — your call (clients currently show initials) |

## C. Public site (the zip's `index.html`)
| # | Issue | Status |
|---|---|---|
| P1 | No meta description, OG tags, theme-colour or favicon. | ✅ added; `noindex` until content is real (**remove at launch**) |
| P2 | No skip link; `<main>` wrapped only the hero text, so every other section was outside a landmark. | ✅ skip link + one `<main>` |
| P3 | 7 dead `href="#"` links (2 logos, Privacy, Terms, 3 socials). | ✅ logos → `#top`; the rest open an honest "not published yet" dialog |
| P4 | axe failures: 60 %-opacity navy text 4.17:1; 10 buttons whose label omitted their visible text; two unnamed `search` landmarks; interactive content inside a `role="img"` container. | ✅ axe: **0 violations** at 1440/768/390 |
| P5 | Login dialog displayed a fake "Signed in as …"; join dialog promised an email. | ✅ login says it's unavailable; join hands off to the portal register page |
| P6 | Hero/trust images had no `width`/`height` (layout shift); no `fetchpriority` on the LCP image. | ✅ |
| P7 | Hard-coded claims: "10K+ Verified Lawyers", "50K+ Happy Clients", "10,000+ verified legal professionals". | ⏳ must be substantiated or removed before launch |
| P8 | No privacy policy, terms, disclaimer, FAQ, contact form, article pages or booking. | ⏳ placeholders only; legal text must come from counsel |
| P9 | Fictional lawyers/testimonials with no disclosure line. | ⏳ |
| P10 | 18 `innerHTML` uses. | ℹ️ reviewed: all built from static data; user input goes through `esc()` — no issue |
| P11 | Lawyer names differ between carousel and directory. *(plan)* | ⏳ not re-verified |

## D. Lawyer portal (Phase 6 audit)
| # | Issue | Status |
|---|---|---|
| L1 | **White screen**: no error boundary and shallow state validation — 4 of 7 partial-corruption cases blanked every route, even `#/login`. | ✅ deep validator + error boundary (both tested) |
| L2 | Skip link set the URL to `#lp-main`; the hash router treated it as a route and the page vanished. | ✅ |
| L3 | Mobile drawer: 12 hidden links in the tab order; open drawer didn't take focus, page behind stayed live, Tab escaped (incl. toasts). | ✅ |
| L4 | CSV export: payouts exported as text `'-58000`; dates had no year. | ✅ numbers stay numeric; ISO dates (IST) |
| L5 | Name validator rejected Devanagari/Tamil/Telugu/Bengali names and the curly apostrophe. | ✅ |
| L6 | Accessible-name mismatches: logo and account button (every route). | ✅ |
| L7 | Calendar day buttons: axe label-in-name (it joins adjacent spans into "4Off"). | ⏳ the richer label is better for screen readers; restructure the cell in source if strict 2.5.3 is required |
| L8 | `code{}` rule unscoped. `html{}`/`body{}` are global. | ✅ `code` scoped · ⏳ scope `html/body` if the portal is ever embedded in another page |
| L9 | Tap targets: text links 15–23 px tall. | 🟡 now 34–35 px. Notification switches are 44×26 (meets AA 24 px, below the 36 px goal) |
| L10 | Focus jumped into `<main>` on first load (skip link never offered); failed dialog submit left focus on the button. | ✅ |
| L11 | `--lc-text-2`/`--lc-text-3` are 72 %/70 % navy — redundant. | ⏳ cosmetic |
| L12 | Brand teal `#2f8f83` is 3.52:1 on ivory. | ℹ️ fine for fills/borders; the portal uses teal-700 for text |

### Verified clean
No horizontal overflow at 320/390/768/1440 on any route · no JS errors · route guards, unknown IDs, sign-out/back · XSS payloads rejected or rendered as text · passwords never in storage · appointment times identical across time zones · reduced motion · dialog focus trap/return · 308 KB gzip, ~70 ms local load.

## G. React migration (new)
| # | Issue | Status |
|---|---|---|
| G1 | Public site was static HTML + a 430-line `site.js` (DOM lookups by id, `innerHTML`, a `data-a` click dispatcher). | ✅ 18 React sections + context; **pixel-equivalent** to the original with animation off (0.001 % / 0.004 % of pixels) |
| G2 | Hidden coupling in the old CSS: the "Family Law" filter pill is dark only because the button carries `data-f="area"`. My first port dropped the attribute; the pixel diff caught it. | ✅ restored |
| G3 | React 18 warns on `fetchPriority` (React 19 syntax) and Router v7 future flags — visible only in dev mode, not in production builds. | ✅ lowercase `fetchpriority`; future flags enabled |
| G4 | Parallax on multi-layer section backgrounds could expose an edge gap (my first range went to −0.15 %). | ✅ range clamped to 0–100 %, photo layer only |
| G5 | GSAP is free (incl. ScrollTrigger/SplitText) under GSAP's standard licence, which has restrictions (e.g. not for building tools that compete with Webflow-style animation builders). | ⏳ please check the licence terms for your use |
| G6 | JS weight: React 54 + GSAP 55 + Motion 49 + site 18 KB gzipped on the site (≈176 KB). | ⏳ acceptable, but SplitText/ScrollTrigger could be lazy-loaded after first paint if LCP matters |
| G7 | `BrowserRouter` (`/privacy`, `/terms`) needs an SPA fallback on static hosts. | ⏳ documented |
| G8 | **Lenis is not used in the portal** (dense data UI, sticky columns, modal dialogs). | ⏳ your call |
| G9 | Section files are generated code: long, but formatted and now ordinary source. Marketing numbers ("10K+", "610 lawyers") are still hard-coded in the JSX/data. | ⏳ P7 |
| G10 | Automated a11y scans that run while the portal's route animation is mid-flight report false colour-contrast failures (semi-transparent elements). | ℹ️ QA scripts now wait for the animation to settle |

## E. Corrections to what I said earlier
- I reported unprefixed `.demo`, `td`, `.t td` CSS selectors as leaks. They belong to the **receipt popup's own HTML template**, not the portal stylesheet. The real leaks were `code{}` (fixed) and `html`/`body`.
- I first reported the 26 "unnamed" nav links at tablet/mobile as a possible bug. It was my probe reading `innerText` of the visually hidden drawer; axe reports none.

## F. Decisions I need from you
1. Do you have the portal's original `src/`? (S2)
5. Which "other" libraries did you have in mind? I added Motion (UI transitions) and React Router; I did not add any others without a reason (e.g. Swiper for carousels, a form library, TanStack Query once there is a backend).
2. Public-site claims, legal pages and the fictional-data disclosure (P7–P9).
3. Calendar-cell labels and 36 px switches (L7, L9).
4. Empty-state art / more portraits for the portal (A5), WebP + responsive images (A4).
