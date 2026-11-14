# QA report

Raw output: [`qa/results.txt`](../qa/results.txt) — **94 checks passing, 0 failing** on the production build served by `vite preview`.

## Method
Chromium 141 (Playwright), axe-core (wcag2a/2aa/21a/21aa + best-practice), Google Fonts blocked in the sandbox (system fallbacks render), fixed clock for visual diffs.

## Results
| Area | Result |
|---|---|
| Site fidelity | React vs original page, animation off: identical page height; **0.001 %** (desktop) / **0.004 %** (mobile) of pixels differ |
| Site behaviour | hero search, area picker, three carousels, journey, help nodes, directory (search, filter, sort, pagination), dialogs, Esc, login, footer routes, unknown route — all pass |
| Site assets | all 25 images load at 1440 / 768 / 390; no horizontal overflow |
| Site a11y | axe: **0 violations** at all three viewports |
| Site animation | Lenis active; SplitText ran; after jumping to the bottom and walking back, no content left invisible; reduced-motion: Lenis off, hero and mid-page fully visible immediately; dev mode (StrictMode) console clean |
| Portal fidelity | modular React build vs previous single-file build, all 18 routes × desktop/mobile: max **0.004 %** difference |
| Portal behaviour/security/UI | behave 27 · ui2 · sec · error boundary · 7 partial-corruption cases · drawer focus — all pass |
| Portal a11y | axe: 1 rule left, calendar day-button label-in-name (ISSUES L7); no overflow |

## Defects the tests caught during this migration
1. Filter pill lost its dark style (dropped `data-f`) — pixel diff.
2. Parallax range could expose a background gap — manual inspection of computed positions.
3. Dev-only React warnings (`fetchPriority`, Router future flags) — dev-mode console check.
4. Preview-server crash on rebuild and two test races (heading count right after a transition-based navigation; axe scanning mid-animation) — test harness fixes, not app bugs.

## Not covered
Real fonts, Safari/Firefox, real screen readers/devices, Lenis feel on trackpads vs wheels, the original portal test suites (never provided), and content/legal accuracy of anything on the public site.
