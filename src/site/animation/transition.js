import { prefersReducedMotion } from "./gsap.js";

/**
 * Tiny gate shared by the page-transition curtain and the page's own entrance animations (hero intro etc.).
 * Entrance animations call onReveal(fn): fn runs as soon as the curtain starts lifting (or immediately if no curtain is covering).
 * That way the hero headline rises *as* the curtain opens instead of playing unseen behind it.
 */
let open = prefersReducedMotion();
let queue = [];

export const closeGate = () => { if (!prefersReducedMotion()) open = false; };
export const openGate = () => { open = true; const q = queue; queue = []; q.forEach((fn) => { try { fn(); } catch { /* ignore */ } }); };
export const onReveal = (fn) => { if (open) fn(); else queue.push(fn); };

/** Programmatic navigation with the curtain. PageTransition registers the implementation; callers fall back to plain navigate(). */
let navigator = null;
export const setTransitionNavigator = (fn) => { navigator = fn; };
export const transitionTo = (path, fallback) => (navigator ? navigator(path) : fallback(path));
