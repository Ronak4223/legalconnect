# Premium transformation — change report

Scope: public home page only. Routes, portal, content and section artwork are unchanged. One dependency added: `three@0.169.0` (lazy-loaded, 120 KB gzip, only fetched near the Legal World section).

## Hero video
- `src/site/components/HeroVideo.jsx` (new) replaces the static hero image. Poster `hero-poster.jpg` (first frame of the loop) is always rendered; the video fades in once playing.
- Source clip had a near-silent audio track: stripped. The 5 s clip's end is cross-faded into its start and baked into a 4 s seamless loop (`shared/assets/video/hero-loop*.{mp4,webm}`; desktop 1.3 MB / mobile 0.37 MB). H.264 preferred, VP9 WebM fallback.
- Skipped for prefers-reduced-motion and Save-Data; paused off-screen / tab hidden; poster remains on any failure.
- `useHeroIntro.js`: cursor-depth parallax on footage and copy.
- Original `hero-bg.jpg` is kept (still used elsewhere).

## Legal World (3D globe)
- `GlobeCanvas.jsx` + `animation/globe.js` (new): Three.js dot-matrix globe (continents from `land-mask.png`, generated from Natural Earth 110m), graticule, gold city arcs, pulsing city markers, atmosphere; drawn exactly over the painted globe. Lazy import, renders only while visible, one still frame for reduced motion, painted globe as fallback.
- `Help.jsx`: the whole stage tilts toward the cursor (flat plane, so the six practice-area buttons stay registered to the artwork).

## Your Legal Journey
- `LegalJourney.jsx`: desktop (>=768px) pinned scroll story — the dotted route draws via an SVG mask, stages 1–5 light up as it reaches them, unreached labels are ghosted, CSS-3D stage tilt + cursor light. Below 768px / reduced motion: static, everything shown.
- Fixed a pre-existing bug: on mobile `.jn` was `display:flex` without a column direction, putting heading, artwork and list in a row.

## Site-wide (`useSiteAnimations.js`, `Cursor.jsx`, `site.css`)
- Word-by-word heading reveals (line-masked, re-split on resize).
- Sheet-rise: `.st .jy .ex .li` arrive as a rounded sheet that widens to full bleed (scrubbed; clip removed when complete).
- Trust-card photo unmask reveal; card depth-tilt (`.tr-c .rs .rs-row .fl-t .pa-w .pa-art .lc-a`); cursor follower; nav underline micro-interaction.
- All motion is gated by `prefers-reduced-motion` and fine-pointer checks.

## Verification
`npm run build` passes; `qa/react_site.py` (desktop/tablet/mobile overflow, console, images, axe, behaviours, reduced motion) all PASS on the production build.

---

## Round 2 — transitions, camera journey, more 3D

- **Page transitions** (`PageTransition.jsx`, `animation/transition.js`): two-layer curtain with the brand mark; doubles as the preloader; intercepts internal links, the footer's programmatic navigation (`SiteContext.jsx`), portal links, and Back/Forward; entrance animations wait for it (`onReveal`). Disabled for reduced motion.
- **Your Legal Journey:** desktop camera dolly (zoom + pan stage to stage, pull-back finale); **mobile** artwork sticks to the top while the steps scroll beneath (no pinning). Fixes the row-layout bug shown in the phone screenshot (it was in the original CSS).
- **Legal World:** hovering/focusing a practice area turns the globe to a region and flares the network (`globe.focus/pulse`).
- **Hero:** seamless looping video with a poster fallback, headline lines slide apart on scroll.
- **Trust:** cards are dealt in 3D.
- **Fonts:** Lora + Inter self-hosted (Fontsource); Google Fonts removed from the public page.
- **Fixes:** reveal triggers now fire for any element that is on screen (`top 97%`; the original `top 90%` could leave an element fully visible but hidden by a few pixels), soft cursor hover state, mobile journey contrast.
- **QA:** `qa/react_site.py` waits updated for the transition (Privacy / Back). 40/40 checks pass on the production build.
- **Plan:** see `docs/ANIMATION_PLAN.md` (sections, system, fonts, 3D models, Next.js recommendation, phases).


---

## Round 3 — performance, cinematic effects, signature scenes, UI polish

**Regression fixed (shipped in round 2):** the 3D globe never booted. Its canvas had been set `hidden` to satisfy a QA heuristic, and an element with `display:none` cannot be observed by the IntersectionObserver that triggers the lazy boot. Now the *stage* is observed, the canvas is revealed only when ready, and `qa/react_site.py` has a guard (`3D globe boots when its section is approached`).

### Performance (measured: same machine, same script, desktop 1440 / mobile 390)
| | before | after |
|---|---|---|
| Desktop, first load | 4,731 KB | 2,181 KB (-54%) |
| Desktop, full scroll | 4,932 KB | ~2,400-3,000 KB |
| Mobile, first load | 4,146 KB | ~1,330 KB (-68%) |
| Mobile, full scroll | 4,347 KB | ~1,860-1,970 KB (-55%) |

- All public artwork converted to WebP (3.05 MB -> 1.98 MB) with 900px variants for phones. The original JPEGs stay (the portal uses them).
- **Lazy section artwork** (`animation/lazyBackgrounds.js`): each image variable is only defined under `.is-near`, added when a section is within ~2 screens, so below-the-fold images are not requested at load. Parallax now arms after the image exists. Until then each section shows a same-tone fallback colour so text is always readable.
- Responsive hero poster (`srcset`), media-conditional `preload` of the poster, `preload` of the two Latin font files.
- The preloader curtain is a full ceremony once per session; later full page loads get a brisk version.
- LCP in this sandbox is not a reliable number (software rendering, large run-to-run variance), and the candidate is the hero headline, which is deliberately revealed after the curtain. Bytes are the solid win; measure LCP on a real device.

### Cinematic
- **Globe bloom** (`globe.js`): custom selective bloom that preserves a transparent canvas (glow layers -> half-res buffer -> two-pass blur -> additive composite); strength rises when a practice area flares the network.
- **Liquid page transition**: the curtain is two animated SVG bands whose leading edges bow while they move (teal edge, ink body), instead of a flat wipe.
- **Film grain**: one fixed layer animated by transform only; desktop + motion-allowed only.

### Signature scroll scene
- **Problems** (`Problems.jsx`): the section pins and the statement is read word by word, "one-size-fits-all." is struck out in gold, then "Neither should your legal guidance." arrives. Phones: word reveal. Reduced motion: finished text.
- **Depth**: the Insights and Library glass cards drift at their own pace (`.lc-float`).

### UI polish
- Gold + glass tokens (`--gold`, `--glass-edge`), gold selection and focus rings, teal-to-gold scroll progress, gold hairlines between hero stats, pill hover sweep, glass inner-edge on cards, `text-wrap: balance/pretty`.
- Contrast: Library card labels (`.lc-t`, `.lc-m`) darkened. They were marginal and axe could not see it while a photo was behind them.

### QA: 42/42 on the production build (new checks: globe boots; Problems scene finished state).

---

## Round 4 — multi-page platform

See `docs/APP_PLATFORM.md` for routes, architecture, demo accounts, interactions and limitations.

- 36 routes: public site (find lawyers, lawyer profile + booking, legal services, about, contact/help), authentication (client + 4-step lawyer onboarding, logins, password reset), client dashboard (7 pages) and a visually distinct lawyer dashboard (9 pages). Frontend-only, state in localStorage, with cross-role flows (book -> accept -> status).
- Shared UI kit (`src/site/ui`), role-themed layouts, zone-aware page transitions, app pages code-split (Home bundle unchanged in weight), Lenis only on public pages.
- Home page integrated: hero nav, Login/Register/Join entry points, directory and carousel profile links, footer links.
- Supplied assets: 11 images + the new video (silent seamless loop on sign-in screens and About).
- **Regression fixed (from round 3):** the People carousel and directory photos had lost their CSS image variables when unused ones were removed; restored, and a QA guard (`inline var() photos all resolve to an image`) added.
- QA: `qa/react_site.py` 44/44 (home), `qa/app_routes.py` 30 routes x 2 widths clean, `qa/app_flows.py` 61/61. `npm run qa:app` runs the last two.
