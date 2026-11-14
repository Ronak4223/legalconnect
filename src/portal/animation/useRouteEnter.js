import { useEffect } from "react";
import gsap from "gsap";

const SELECTOR = [
  "#lp-main > :not(dialog):not(.lp-stats):not(.lp-dgrid):not(.lp-agrid):not(.lp-vgrid)", // page header, banner, alerts, lists
  "#lp-main > .lp-stats > *", "#lp-main > .lp-dgrid > *", "#lp-main > .lp-agrid > *", "#lp-main > .lp-vgrid > *", // cards inside the grids
].join(", ");

/**
 * Route-enter choreography for the portal: page blocks rise in with a short, capped stagger (<= ~0.8 s total).
 * Deliberately restrained — this is a working tool, not a marketing page. No smooth-scroll library here: native scrolling keeps
 * sticky columns, keyboard paging and long tables predictable. Skipped for prefers-reduced-motion. Inline styles are cleared afterwards.
 */
export function useRouteEnter(routeKey) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const main = document.getElementById("lp-main");
    if (!main) return undefined;
    const targets = main.ownerDocument.querySelectorAll(SELECTOR);
    if (!targets.length) return undefined;
    const tween = gsap.fromTo(targets, { autoAlpha: 0, y: 14 }, {
      autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: { each: 0.04, amount: 0.35 },
      clearProps: "opacity,visibility,transform",
    });
    return () => { tween.kill(); gsap.set(targets, { clearProps: "opacity,visibility,transform" }); };
  }, [routeKey]);
}
