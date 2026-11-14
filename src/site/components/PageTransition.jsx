import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../animation/gsap.js";
import { useSmoothScroll } from "../animation/SmoothScroll.jsx";
import { closeGate, openGate, setTransitionNavigator } from "../animation/transition.js";
import { zoneOf } from "../routes.js";

/** Moving between pages of the same area (inside a dashboard, between auth pages, between inner public pages) is instant; the curtain is for changing area or entering/leaving Home. */
const quiet = (a, b) => zoneOf(a) === zoneOf(b) && (zoneOf(a) !== "public" || (a !== "/" && b !== "/"));
const isFile = (p) => /\.[a-z0-9]{2,5}$/i.test(p);
const TOP = -40, BOT = 140; // the curtain is drawn in a 100x100 viewBox and overshoots it, so "covered" really means covered
/** A band between a top and a bottom edge; each edge can bow (center leads) while it moves, which is what makes the wipe look liquid. */
const band = (t, tb, b, bb) => `M0 ${t} Q50 ${t - 2 * tb} 100 ${t} L100 ${b} Q50 ${b - 2 * bb} 0 ${b} Z`;
const FULL = band(TOP, 0, BOT, 0);
const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

/**
 * Page transitions: a two-layer curtain (teal edge, ink body) wipes up over the page, shows the LegalConnect mark,
 * then continues upward to reveal the next page. It covers
 *  - the very first load (doubles as the preloader: waits for fonts + hero poster, never longer than ~2 s),
 *  - in-app route changes (a capture-phase click handler on internal links, so no component needs changing),
 *  - links that leave for the lawyer portal (a different document),
 *  - browser Back/Forward (instant cover + reveal, since those cannot be intercepted).
 * Reduced-motion users get plain, instant navigation: the curtain is never shown.
 */
export default function PageTransition() {
  const wrap = useRef(null), A = useRef(null), B = useRef(null), mark = useRef(null), line = useRef(null);
  const shapeA = useRef({ t: TOP, tb: 0, b: BOT, bb: 0 }), shapeB = useRef({ t: TOP, tb: 0, b: BOT, bb: 0 });
  const draw = useCallback(() => {
    const a = shapeA.current, b = shapeB.current;
    A.current?.setAttribute("d", band(a.t, a.tb, a.b, a.bb)); B.current?.setAttribute("d", band(b.t, b.tb, b.b, b.bb));
  }, []);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { lenis } = useSmoothScroll();
  const reduce = prefersReducedMotion();
  const viaClick = useRef(false), prev = useRef(pathname), busy = useRef(false), guard = useRef(0);

  const cover = useCallback(() => new Promise((resolve) => {
    const w = wrap.current, sa = shapeA.current, sb = shapeB.current;
    closeGate();
    w.setAttribute("data-active", "");
    gsap.killTweensOf([sa, sb, mark.current]);
    Object.assign(sa, { t: BOT, tb: 0, b: BOT, bb: 0 }); Object.assign(sb, { t: BOT, tb: 0, b: BOT, bb: 0 }); draw();
    gsap.set(mark.current, { autoAlpha: 0, y: 18 });
    gsap.set(line.current, { "--p": 0 });
    const tl = gsap.timeline({ onComplete: resolve, onUpdate: draw });
    [[sa, 0], [sb, 0.1]].forEach(([st, at]) => {
      tl.to(st, { t: TOP, duration: 0.75, ease: "power4.inOut" }, at)
        .to(st, { tb: 13, duration: 0.32, ease: "sine.out" }, at)
        .to(st, { tb: 0, duration: 0.45, ease: "sine.inOut" }, at + 0.32);
    });
    tl.to(mark.current, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.45)
      .to(line.current, { "--p": 1, duration: 0.5, ease: "power2.inOut" }, 0.5);
  }), [draw]);

  const coverNow = useCallback(() => {
    closeGate();
    wrap.current.setAttribute("data-active", "");
    gsap.killTweensOf([shapeA.current, shapeB.current, mark.current]);
    Object.assign(shapeA.current, { t: TOP, tb: 0, b: BOT, bb: 0 }); Object.assign(shapeB.current, { t: TOP, tb: 0, b: BOT, bb: 0 }); draw();
    gsap.set(mark.current, { autoAlpha: 1, y: 0 });
    gsap.set(line.current, { "--p": 1 });
  }, [draw]);

  const reveal = useCallback((delay = 0) => {
    const w = wrap.current, sa = shapeA.current, sb = shapeB.current;
    const tl = gsap.timeline({ delay, onUpdate: draw, onComplete: () => { w.removeAttribute("data-active"); busy.current = false; } });
    tl.to(mark.current, { autoAlpha: 0, y: -14, duration: 0.3, ease: "power2.in" }, 0);
    // the ink layer leaves first, then the teal edge follows it up the screen
    [[sb, 0.12], [sa, 0.24]].forEach(([st, at]) => {
      tl.to(st, { b: TOP, duration: 0.95, ease: "power4.inOut" }, at)
        .to(st, { bb: 14, duration: 0.4, ease: "sine.out" }, at)
        .to(st, { bb: 0, duration: 0.55, ease: "sine.inOut" }, at + 0.4);
    });
    tl.call(openGate, null, 0.42); // entrance animations start while the curtain is still lifting
  }, [draw]);

  // First load: preloader.
  useEffect(() => {
    if (reduce) { wrap.current.removeAttribute("data-active"); openGate(); return undefined; }
    closeGate();
    gsap.set(mark.current, { autoAlpha: 0, y: 18 });
    gsap.set(line.current, { "--p": 0 });
    // Full ceremony once per session; later full page loads get a brisk version.
    let seen = false; try { seen = sessionStorage.getItem("lc-intro") === "1"; sessionStorage.setItem("lc-intro", "1"); } catch { /* storage blocked */ }
    const MIN = seen ? 250 : 800, MAX = seen ? 900 : 1500;
    const t0 = performance.now();
    gsap.to(mark.current, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.1 });
    const prog = gsap.to(line.current, { "--p": 0.85, duration: 1.4, ease: "power2.out" });
    const poster = new Image(); poster.src = document.querySelector(".hero-media img")?.currentSrc || "";
    const ready = Promise.race([
      Promise.all([document.fonts?.ready, poster.src ? poster.decode().catch(() => {}) : null]),
      new Promise((r) => setTimeout(r, MAX)),
    ]);
    let dead = false;
    ready.then(() => {
      if (dead) return;
      const wait = Math.max(0, MIN - (performance.now() - t0)) / 1000; // always show the mark for a moment
      prog.kill();
      gsap.to(line.current, { "--p": 1, duration: 0.35, delay: wait });
      reveal(wait + (seen ? 0.1 : 0.35));
    });
    return () => { dead = true; };
  }, [reduce, reveal]);

  // Route changes (clicked links already covered the page; Back/Forward cover instantly here, before paint).
  useLayoutEffect(() => {
    if (prev.current === pathname) return undefined; // StrictMode re-runs and same-route renders
    const from = prev.current; prev.current = pathname;
    if (reduce) return undefined;
    if (quiet(from, pathname)) { viaClick.current = false; return undefined; }
    if (!viaClick.current) coverNow();
    viaClick.current = false;
    lenis.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    let r1 = 0, r2 = 0;
    r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => { ScrollTrigger.refresh(); reveal(0.12); }); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, [pathname, reduce, coverNow, reveal, lenis]);

  const go = useCallback((to) => {
    if (quiet(window.location.pathname.slice(BASE.length) || "/", to.split(/[?#]/)[0])) { navigate(to); return; }
    if (busy.current) return;
    busy.current = true;
    cover().then(() => {
      viaClick.current = true;
      navigate(to);
      clearTimeout(guard.current); // safety: never leave the page covered if the route did not change
      guard.current = setTimeout(() => { if (wrap.current?.hasAttribute("data-active") && busy.current) reveal(0); }, 2500);
    });
  }, [cover, navigate, reveal]);

  useEffect(() => { if (reduce) return undefined; setTransitionNavigator(go); return () => setTransitionNavigator(null); }, [go, reduce]);

  // Intercept internal links (capture phase, so it runs before React Router's own handler).
  useEffect(() => {
    if (reduce) return undefined;
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || busy.current) return;
      const rel = url.pathname.startsWith(BASE) ? url.pathname.slice(BASE.length) || "/" : url.pathname;
      const cur = window.location.pathname.startsWith(BASE) ? window.location.pathname.slice(BASE.length) || "/" : window.location.pathname;
      const toPortal = rel.startsWith("/portal");
      if (!toPortal && (isFile(rel) || rel === cur || quiet(cur, rel))) return; // same page or same area: the router handles it without the curtain
      e.preventDefault(); e.stopPropagation();
      if (toPortal) { busy.current = true; cover().then(() => window.location.assign(url.href)); return; }
      go(rel + url.search + url.hash);
    };
    document.addEventListener("click", onClick, true);
    const onShow = (e) => { if (e.persisted) { busy.current = false; wrap.current?.removeAttribute("data-active"); openGate(); } }; // restored from bfcache
    window.addEventListener("pageshow", onShow);
    return () => { document.removeEventListener("click", onClick, true); window.removeEventListener("pageshow", onShow); clearTimeout(guard.current); };
  }, [reduce, cover, go]);

  return (
    <div ref={wrap} className="lc-curtain" data-active="" aria-hidden="true">
      <svg className="lc-curtain-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path ref={A} d={FULL} fill="#0f3f4d" />
        <path ref={B} d={FULL} fill="#050c18" />
      </svg>
      <div ref={mark} className="lc-curtain-mark">
        <svg viewBox="0 0 32 32" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 6v19M10 26h12M7 10h18M7 10l-3 7h6l-3-7ZM25 10l-3 7h6l-3-7Z" />
        </svg>
        <span className="lc-curtain-word">LEGALCONNECT</span>
        <i ref={line} className="lc-curtain-line" />
      </div>
    </div>
  );
}
