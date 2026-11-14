import { gsap, useGSAP, prefersReducedMotion } from "./gsap.js";

/** Counts a number up when it scrolls into view. Writes textContent directly so React does not re-render 60 times a second. */
export function useCountUp(ref, end, { duration = 1.8, suffix = "+" } = {}) {
  useGSAP(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const obj = { v: 0 };
    el.textContent = "0" + suffix;
    gsap.to(obj, {
      v: end, duration, ease: "power3.out",
      onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString("en-US") + suffix; },
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });
  }, { dependencies: [end] });
}
