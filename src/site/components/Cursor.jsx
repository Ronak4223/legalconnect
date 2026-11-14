import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, finePointer } from "../animation/gsap.js";

/**
 * A small dot that follows the pointer.
 * Purely additive: the native cursor is never hidden, nothing is rendered for touch or reduced-motion users,
 * and the layer is pointer-events:none so it can never block a click.
 */
export default function Cursor() {
  const dot = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !finePointer()) return undefined;
    const d = dot.current;
    gsap.set(d, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "none" }), dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "none" });
    let shown = false;

    const move = (e) => {
      if (!shown) { shown = true; gsap.set(d, { x: e.clientX, y: e.clientY }); gsap.to(d, { autoAlpha: 1, duration: 0.3 }); }
      dx(e.clientX); dy(e.clientY);
    };
    const out = (e) => { if (!e.relatedTarget) { shown = false; gsap.to(d, { autoAlpha: 0, duration: 0.25 }); } };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", out);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", out);
    };
  }, []);

  return (
    <div aria-hidden="true" className="lc-cursor">
      <div ref={dot} className="lc-cursor-dot" />
    </div>
  );
}
