import { useRef, useState } from "react";
import { useSite } from "../SiteContext.jsx";
import { GLYPHS } from "../components/glyphs.jsx";
import { HELP_NODES } from "../data/areas.js";
import GlobeCanvas from "../components/GlobeCanvas.jsx";
import { gsap, useGSAP, prefersReducedMotion, finePointer } from "../animation/gsap.js";

export default function Help() {
  const { act, setHeroQuery } = useSite();
  const [sel, setSel] = useState(null);
  const rootRef = useRef(null), stageRef = useRef(null), globeRef = useRef(null);
  // Each practice area turns the globe to a region (degrees east): India, Europe, Americas, SE Asia, Gulf, UK.
  const REGION = { Family: 78, Criminal: 12, Civil: -74, Corporate: 104, Property: 55, Employment: -2 };

  // Whole-stage tilt toward the cursor. Artwork, globe and the six buttons tilt together (they stay registered);
  // buttons and globe sit at different translateZ, so they separate a little from the painting as it turns.
  useGSAP(() => {
    const root = rootRef.current, stage = stageRef.current;
    gsap.set(stage, { scale: 0.96, transformPerspective: 0 });
    if (prefersReducedMotion() || !finePointer()) return undefined;
    const rx = gsap.quickTo(stage, "rotationX", { duration: 1.2, ease: "power3.out" });
    const ry = gsap.quickTo(stage, "rotationY", { duration: 1.2, ease: "power3.out" });
    const move = (e) => {
      const r = stage.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
      ry(Math.max(-0.5, Math.min(0.5, nx)) * 5); rx(Math.max(-0.5, Math.min(0.5, ny)) * -4);
    };
    const leave = () => { rx(0); ry(0); };
    root.addEventListener("pointermove", move); root.addEventListener("pointerleave", leave);
    return () => { root.removeEventListener("pointermove", move); root.removeEventListener("pointerleave", leave); };
  }, { scope: rootRef });

  return (
    <section ref={rootRef} className="hp relative isolate overflow-hidden pb-16 pt-20 text-white md:pt-24" id="help">
      <h2 className="text-center font-serif text-[clamp(1.9rem,3.6vw,3.25rem)] font-normal uppercase leading-[1.12]">
        What do you need
        <br />
        help with?
      </h2>
      <div
        className="hp-stage relative mt-6 w-full"
        id="hp-stage"
        role="group"
        aria-label="Practice areas"
        ref={stageRef}
      >
        <GlobeCanvas apiRef={globeRef} />
        {HELP_NODES.map(([n, ic, l, t, w]) => (
          <button
            key={n}
            type="button"
            className="hp-n"
            aria-pressed={sel === n + " Law"}
            style={{ left: l + "%", top: t + "%", width: w + "%" }}
            onMouseEnter={() => globeRef.current?.focus(REGION[n])}
            onFocus={() => globeRef.current?.focus(REGION[n])}
            onMouseLeave={() => globeRef.current?.focus(null)}
            onBlur={() => globeRef.current?.focus(null)}
            onClick={() => {
              setSel(n + " Law");
              setHeroQuery(n + " Law");
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {GLYPHS[ic]}
            </svg>
            <span>
              {n}
              <br />
              Law
            </span>
          </button>
        ))}
      </div>
      <p className="mt-2 min-h-[1.5rem] text-center text-sm text-white/80" id="hp-out" role="status" aria-live="polite">
        {sel && (
          <>
            {sel} selected.{" "}
            <button type="button" className="underline underline-offset-4" onClick={() => act("find")}>
              Find a {sel} lawyer →
            </button>
          </>
        )}
      </p>
      <div className="mt-4 text-center">
        <button className="pill" type="button" onClick={() => act("areas")}>
          Explore All Areas <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
