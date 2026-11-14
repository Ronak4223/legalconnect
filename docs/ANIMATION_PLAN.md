# LegalConnect — Animation & 3D Storytelling Plan

Status legend: **Built** = implemented and in this repo · **Next** = recommended next phase · **Later** = needs an asset or a product decision.

## 1. Narrative

The page is one continuous story told through the city and the statue of justice:

> *A person with a problem → a global network of law → the right human being → a clear, guided path → trust → resolution.*

Every section should move the story one step forward, and the camera (scroll) should feel like it travels through one world rather than between web sections.

| Act | Sections | Motion idea |
|---|---|---|
| 1. Arrival | Hero | Cinematic video, depth, curtain lifts |
| 2. The world of law | Approach, Stories, Problems, Legal World | Scale and perspective reveal; the globe |
| 3. The people | People, Lawyers | Portraits with depth |
| 4. The path | Your Legal Journey | Camera dolly along the route |
| 5. Proof | Trust, Cases, Insights | Cards dealt in 3D, layered glass |
| 6. Action | Find a lawyer, Services, Practice area, Footer | Calm, precise, fast |

## 2. Common animation system (shared by every section)

| Layer | What | Status |
|---|---|---|
| Smooth scroll | Lenis driven by the GSAP ticker; one clock for scroll and animation | Built |
| Scroll engine | GSAP + ScrollTrigger (+ SplitText) for all choreography; `useGSAP` for React-safe cleanup; `matchMedia` for desktop/mobile variants | Built |
| Page transitions | Two-layer *liquid* curtain (bowed SVG edges) with the brand mark; also the preloader (full once per session, brisk after). Intercepts internal links, the footer's programmatic navigation, portal links and Back/Forward | Built |
| Entrance gate | `onReveal()` — page entrance animations wait for the curtain to lift, so nothing plays unseen | Built |
| Headings | Line-masked, word-by-word rise (re-splits on resize) | Built |
| Section transitions | Dark full-bleed sections arrive as a rounded sheet that widens to full bleed (scrubbed, clears itself) | Built |
| Parallax | Photo layer only moves, gradients stay put; headline lines slide apart in the hero | Built |
| Depth | Cursor-driven tilt (CSS 3D) on stages and cards; cursor follower | Built |
| Cinematic | Selective bloom on the globe, film grain layer, liquid curtain | Built |
| Performance | WebP + phone variants, lazy section artwork, preloads | Built |
| Motion budget | ≤ 1 pinned section in view, transform/opacity only, no layout animation, DPR cap 1.5–1.75, everything pauses off screen | Built |
| Accessibility | `prefers-reduced-motion` disables video, curtain, pins, tilt, cursor, WebGL loop; touch devices get no hover/tilt/cursor | Built |

**Easing vocabulary** (keep to it so the site feels like one hand): `power4.out` for arrivals, `power4.inOut` for transitions, `power2.inOut` for camera moves, `none` for scrubbed values.

## 3. Section-by-section plan

| Section | Built now | Next |
|---|---|---|
| **Preloader / page transition** | Curtain with mark and progress line; waits for fonts and hero poster (max ~1.8 s); wipes up; hero entrance starts as it lifts | Per-route variants (e.g. portal login gets a longer, ceremonial curtain) |
| **Hero** | Looping video (seamless crossfade loop, no audio, poster fallback), cursor depth, headline lines slide apart on scroll | Scroll-linked "dolly": video scale + slight blur-in of the next section; audio-free subtle caustic light sweep across the scales |
| **Approach** | Heading word reveal, icon rise, parallax | Icons as small 3D glass tokens that tilt with the cursor |
| **Stories** | Sheet-rise, parallax, carousel | Cross-dissolve between testimonials with a shared-element portrait zoom |
| **Problems** | Pinned scene: statement read word by word, "one-size-fits-all." struck out in gold, answer line arrives | Hold the last frame for a beat; add a soft light sweep across the skyline |
| **Legal World** | Real Three.js globe (dot-matrix continents, arcs between Indian cities and global hubs); hovering a practice area turns the globe to that region and flares the network; stage tilts with the cursor | Light beams from the globe to the selected sphere; sphere buttons orbit slowly (needs the artwork re-cut into layers) |
| **People** | Portrait carousel | Coverflow 3D carousel with depth blur |
| **Your Legal Journey** | Desktop: pinned story with a camera that dollies along the route, path draws itself, stages light up, cursor light. Mobile: artwork pinned to top while the five steps scroll beneath it | Sound-free "footsteps" particles along the path; a miniature avatar that walks the route |
| **Trust** | Cards dealt in 3D (rotateX from depth, staggered), photo unmask, count-up | Seal stamps onto the certificate when it enters |
| **Cases** | Parallax, carousel | Quote cards drift at different depths |
| **Insights / Library** | Sheet-rise, glass cards | Cards float at different Z with scroll parallax |
| **Find a lawyer / Lawyers** | Word reveal, tilt on rows | Results re-order with FLIP animation when filters change |
| **Services / Practice area** | Rise, tilt | Statue image slow "breathing" parallax; service rows expand with a height-morph |
| **Footer** | Static | Subtle marble light sweep on enter |

## 4. Typography

* **Now:** Lora (headings) + Inter (UI), unchanged, but **self-hosted** via Fontsource variable fonts — no Google Fonts requests, no layout flash from a third-party CDN, and the real fonts render in every test environment. Only the Latin subset is downloaded unless other scripts appear (~86 KB for both).
* **Why not swap yet:** the brief says to keep the existing LegalConnect identity. If you want a bolder editorial feel, two drop-in options that pair well with the current palette are **Fraunces** (soft, high-contrast display serif with optical sizing) or **Instrument Serif** (very elegant, tight). Both are available as `@fontsource-variable/*` packages; the change is two lines in `main.jsx` and `tailwind.config.js`.
* **Motion typography:** SplitText lines/words (Built). **Next:** variable-font weight animation on scroll for the hero headline (Fraunces/Inter support weight and optical-size axes), and a character-scramble on stat numbers.

## 5. 3D elements and models

| Element | Approach | Status |
|---|---|---|
| Globe | Procedural (Three.js), dot-matrix from a 44 KB land mask, custom shaders | Built |
| Hero dust | Canvas 2D with real perspective (deliberately not Three.js, so the 120 KB library stays out of the first paint) | Built |
| Stage tilt / camera | CSS 3D + GSAP transform origin | Built |
| **Scales of Justice model** | A real 3D model (GLB). Needs a modelled asset: commission or license a low-poly, PBR-textured scales (< 400 KB, Draco-compressed), load with `GLTFLoader` + `DRACOLoader`, light with an HDRI environment (`RoomEnvironment` or a sunset HDR matching the hero). Place it in the "Your legal journey starts here" band; the beam tilts with scroll. | Later (asset needed) |
| Gavel / document / seal | Same pipeline, used for Trust ("stamp" interaction) | Later |
| Layered artwork | Ask the illustrator/AI pipeline for **layered exports** (sky / city / platform / spheres). Real layers unlock true parallax and orbiting spheres without cropping the painting | Later |

**Rule:** one WebGL context on screen at a time, lazy-loaded, paused off screen, one still frame for reduced motion, painted fallback.

## 6. Next.js — recommendation

Not migrated, deliberately.

* The animation stack (GSAP, Lenis, Three.js) is framework-agnostic; **Next.js does not make the animations better**.
* It *would* help with: server-rendered HTML for SEO (lawyer profile pages, articles), `next/font`, image optimisation, route-level code splitting, and a proper `/lawyers/[slug]` structure. Those matter once the directory has real, indexable content.
* A migration is a rewrite of routing, the portal's separate entry point and the build; it contradicts "do not rewrite unnecessarily".
* **When to do it:** when real lawyer/article data arrives and SEO becomes a goal. Plan: Next.js App Router; keep every component; wrap GSAP code in client components with `useGSAP`; replace `PageTransition`'s router hooks with the App Router's `usePathname`/`useRouter` (the curtain logic itself carries over unchanged); use the View Transitions API for the cross-document part; `next/font` replaces Fontsource.

## 7. Other improvements recommended

1. **Performance:** self-hosted fonts (done), preload the Latin Lora file, serve `avif/webp` versions of the large JPEG artwork (several are 300 KB–1 MB), add `fetchpriority` to the LCP poster (done), measure with Lighthouse on a mid-range Android phone.
2. **Real-device test:** all testing here used headless Chromium with software rendering; check scroll smoothness and the globe on real phones before launch. If low-end devices stutter, drop dust particles (`N`) and cap the globe's DPR to 1.
3. **Content:** the site is `noindex` with demo data; remove when real content is in.
4. **Analytics hooks:** fire events on journey stage reached, globe region focus, and search from the hero — these are the interactions that show whether the storytelling works.
5. **Sound:** none by design (the video is silent). If ambient audio is ever added it must be opt-in.

## 8. Suggested phases

1. **Done:** video hero, curtain transitions, globe, journey story, 3D trust cards, self-hosted fonts.
2. **Polish (1–2 weeks):** layered artwork, avif/webp pipeline, hero scroll dolly, coverflow people carousel, filter FLIP animation, real-device tuning.
3. **Signature moment (2–4 weeks, needs asset):** 3D Scales of Justice model in the CTA band plus the stamp interaction on Trust.
4. **Platform (when content exists):** Next.js migration for SEO and lawyer profile pages.
