import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { zoneOf } from "../routes.js";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap.js";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis share one clock.
 * Disabled entirely for prefers-reduced-motion (native scrolling, instant jumps).
 * Anything that needs to scroll programmatically uses useSmoothScroll().scrollTo — never scrollIntoView directly.
 */
const Ctx = createContext({ scrollTo: () => {}, stop: () => {}, start: () => {}, lenis: null });
export const useSmoothScroll = () => useContext(Ctx);

export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);
  const { pathname } = useLocation();
  const smooth = zoneOf(pathname) === "public"; // dashboards and forms keep native scrolling (inner scroll areas, sticky bars)

  useEffect(() => {
    if (prefersReducedMotion() || !smooth) return undefined;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, anchors: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => { gsap.ticker.remove(tick); lenis.destroy(); lenisRef.current = null; };
  }, [smooth]);

  const scrollTo = useCallback((target, { center = false, offset = 0 } = {}) => {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (!el) return;
    const off = center ? -(window.innerHeight - el.offsetHeight) / 2 + offset : offset;
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(el, { offset: off, duration: 1.3 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + off, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, []);

  const value = useMemo(() => ({
    scrollTo, lenis: lenisRef,
    stop: () => lenisRef.current?.stop(), start: () => lenisRef.current?.start(),
  }), [scrollTo]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
