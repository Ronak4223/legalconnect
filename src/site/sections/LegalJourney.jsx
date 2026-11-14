import { useRef, useState } from "react";
import { JOURNEY } from "../data/journey.js";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion, finePointer } from "../animation/gsap.js";

/** Fraction of the path that has been drawn when each stage marker is reached (measured against the artwork). */
const REACHED = [0, 0.26, 0.55, 0.76, 0.93];

export default function LegalJourney() {
  const [on, setOn] = useState(0);
  const rootRef = useRef(null), stageRef = useRef(null), drawRef = useRef(null);

  /**
   * Scroll story.
   *  Desktop (>=768px): the section pins for ~2.4 screens. The camera dollies along the route: the artwork is zoomed in and
   *   pans from stage to stage while the dotted path draws itself and each stage lights up as it is reached; at the end the
   *   camera pulls back to reveal the whole scene. The stage also tilts toward the cursor (CSS 3D) with a light that follows it.
   *  Mobile (<768px): no pinning (it fights touch scrolling). The artwork sticks to the top of the screen while the five steps scroll
   *   beneath it; each step lights its marker and extends the route.
   *  Reduced motion: none of this runs. The full route and all five stages are shown.
   */
  useGSAP(() => {
    if (prefersReducedMotion()) return undefined;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const root = rootRef.current, stage = stageRef.current, draw = drawRef.current;
      root.setAttribute("data-story", "");
      gsap.set(draw, { strokeDashoffset: 1 });
      // Camera: zoom S about an origin chosen so the stage's marker lands near the screen centre. Normalised coordinates, so it
      // is resolution-independent; the origin is clamped to the stage so the zoomed artwork never exposes an edge.
      const S = 1.5, DRAW = 0.8, clamp = (v) => Math.min(1, Math.max(0, v));
      const focus = (k) => { const [, , l, t] = JOURNEY[k]; return `${clamp((0.5 - S * (l / 100)) / (1 - S)) * 100}% ${clamp((0.5 - S * (t / 100)) / (1 - S)) * 100}%`; };
      let last = -1;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root, start: "top top", end: "+=240%", pin: true, scrub: 0.6, anticipatePin: 1,
          onUpdate: (self) => {
            const drawn = 0.03 + 0.97 * Math.min(1, self.progress / DRAW); // mirrors the draw tween below
            const idx = REACHED.reduce((n, r, i) => (drawn >= r ? i : n), 0);
            if (idx !== last) { last = idx; setOn(idx); }
            const cam = self.progress > 0.015 && self.progress < DRAW + 0.04;
            if (cam !== root.hasAttribute("data-cam")) root.toggleAttribute("data-cam", cam);
          },
        },
      });
      tl.set(stage, { scale: S, transformOrigin: focus(0) }, 0)
        .fromTo(draw, { strokeDashoffset: 0.97 }, { strokeDashoffset: 0, duration: DRAW, ease: "none" }, 0);
      for (let k = 1; k < REACHED.length; k++) tl.to(stage, { transformOrigin: focus(k), duration: 0.11, ease: "power2.inOut" }, REACHED[k] * DRAW - 0.11);
      tl.to(stage, { scale: 1.05, transformOrigin: "50% 50%", duration: 1 - DRAW, ease: "power2.inOut" }, DRAW);

      let cleanup = () => {};
      if (finePointer()) {
        const rx = gsap.quickTo(stage, "rotationX", { duration: 1.1, ease: "power3.out" });
        const ry = gsap.quickTo(stage, "rotationY", { duration: 1.1, ease: "power3.out" });
        let raf = 0, nx = 0, ny = 0;
        const apply = () => {
          raf = 0;
          ry(nx * 3.2); rx(ny * -2.4);
          stage.style.setProperty("--gx", (nx + 0.5) * 100 + "%"); stage.style.setProperty("--gy", (ny + 0.5) * 100 + "%");
          stage.style.setProperty("--lx", nx * -9 + "px"); stage.style.setProperty("--ly", ny * -6 + "px");
        };
        const move = (e) => { const r = root.getBoundingClientRect(); nx = (e.clientX - r.left) / r.width - 0.5; ny = (e.clientY - r.top) / r.height - 0.5; if (!raf) raf = requestAnimationFrame(apply); };
        const leave = () => { nx = 0; ny = 0; apply(); };
        root.addEventListener("pointermove", move); root.addEventListener("pointerleave", leave);
        cleanup = () => { root.removeEventListener("pointermove", move); root.removeEventListener("pointerleave", leave); cancelAnimationFrame(raf); };
      }
      return () => { cleanup(); root.removeAttribute("data-story"); root.removeAttribute("data-cam"); gsap.set(stage, { clearProps: "transform,transformOrigin" }); setOn(0); };
    });

    mm.add("(max-width: 767px)", () => {
      const root = rootRef.current, stage = stageRef.current, draw = drawRef.current;
      root.setAttribute("data-story-m", "");
      gsap.set(draw, { strokeDashoffset: 0.97 });
      const items = gsap.utils.toArray(".jn-li", root);
      const reach = (k) => { setOn(k); gsap.to(draw, { strokeDashoffset: Math.max(0, 0.97 - REACHED[k] - 0.04), duration: 0.9, ease: "power2.out", overwrite: true }); };
      const triggers = items.map((li, k) => ScrollTrigger.create({
        trigger: li, start: () => `top ${stage.offsetHeight + 96}px`,
        onEnter: () => reach(k), onLeaveBack: () => reach(Math.max(0, k - 1)),
      }));
      return () => { triggers.forEach((t) => t.kill()); root.removeAttribute("data-story-m"); gsap.set(draw, { clearProps: "strokeDashoffset" }); setOn(0); };
    });

    return () => mm.revert();
  }, { scope: rootRef });

  const flag = (k) => ({ "data-done": k <= on ? "" : undefined, "data-on": k === on ? "" : undefined });
  const hover = (i) => ({ onClick: () => setOn(i), onMouseOver: () => setOn(i), onFocus: () => setOn(i) });
  return (
    <section
      ref={rootRef}
      className="jn text-[#0d2340]"
      id="legal-journey"
    >
      <p className="jn-heading text-center text-xs font-medium uppercase tracking-[.3em] text-[#0d2340]/80 md:text-sm">
        Your legal journey
      </p>
      <div className="jn-stage" id="jn-stage" ref={stageRef}>
        <div className="jn-glow" aria-hidden="true" />
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1299 1211"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <mask id="jn-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width="1299" height="1211">
              <path
                ref={drawRef}
                d="M180 730C280 700 330 650 420 660S600 800 690 790S800 890 860 900S980 1060 1040 1090"
                fill="none" stroke="#fff" strokeWidth="40" strokeLinecap="round" pathLength="1" strokeDasharray="1 1" strokeDashoffset="0"
              />
            </mask>
          </defs>
          <path
            mask="url(#jn-reveal)"
            d="M180 730C280 700 330 650 420 660S600 800 690 790S800 890 860 900S980 1060 1040 1090"
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            strokeDasharray="2 12"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 1px 2px rgba(13,35,64,.55))" }}
          />
        </svg>
        {JOURNEY.map(([t, d, l, tp, side], i) => (
          <div key={t} className="jn-s" style={{ left: l + "%", top: tp + "%" }} {...flag(i)} {...hover(i)}>
            <button type="button" className="jn-c" aria-label={`Stage ${i + 1}: ${t}`}>
              {i + 1}
            </button>
            <div className={"jn-t jn-" + side}>
              <b>{t}</b>
              {d}
            </div>
          </div>
        ))}
      </div>
      <ol className="jn-list mx-auto grid max-w-md gap-2 md:hidden" id="jn-list">
        {JOURNEY.map(([t, d], i) => (
          <li key={t} className="jn-li" {...flag(i)} {...hover(i)}>
            <span className="jn-n">{i + 1}</span>
            <span>
              <b>{t}</b>
              <br />
              {d}
            </span>
          </li>
        ))}
      </ol>
      <div className="jn-footer text-center">
        <a
          className="inline-flex flex-col items-center gap-1 text-xs tracking-[.15em] text-[#0d2340]/75 transition hover:text-[#0d2340]"
          href="#footer"
        >
          Scroll to explore{" "}
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="m8.5 11 3.5 3.5 3.5-3.5" />
          </svg>
        </a>
      </div>
    </section>
  );
}
