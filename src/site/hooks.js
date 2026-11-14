import { useNavigate } from "react-router-dom";
import { transitionTo } from "./animation/transition.js";
import { useEffect, useRef } from "react";

export function useTitle(t) { useEffect(() => { document.title = t ? `${t} · LegalConnect` : "LegalConnect"; }, [t]); }
/** Fades [data-rv] children up as they enter the viewport. Falls back to fully visible for reduced motion / no IntersectionObserver. */
export function useReveal(deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return undefined;
    const els = [...root.querySelectorAll("[data-rv]")];
    els.forEach((e) => e.classList.add("rv"));
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}
export function useQueryState(search, setSearch, defaults) {
  const p = new URLSearchParams(search); const out = {};
  for (const k of Object.keys(defaults)) out[k] = p.get(k) ?? defaults[k];
  const set = (patch) => { const n = new URLSearchParams(search); for (const [k, v] of Object.entries(patch)) { if (v === "" || v == null || v === defaults[k]) n.delete(k); else n.set(k, v); } setSearch(n, { replace: true }); };
  return [out, set];
}

/** navigate() that plays the page-transition curtain when the destination is a different area (public / auth / dashboards). */
export function useGo() { const navigate = useNavigate(); return (to) => transitionTo(to, navigate); }
