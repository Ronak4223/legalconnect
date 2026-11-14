import { useEffect, useRef } from "react";
import maskUrl from "@shared/assets/img/land-mask.png";
import { ScrollTrigger, prefersReducedMotion, finePointer } from "../animation/gsap.js";

/**
 * Real-time 3D globe for the Legal World section, laid exactly over the globe painted into the artwork.
 * three.js is imported lazily when the section is within ~one screen of the viewport, so it costs nothing above the fold.
 * Progressive enhancement: with no WebGL, with an error, or before it has loaded, the painted globe underneath is simply visible.
 * Rendering runs only while on screen; reduced-motion users get one still frame.
 */
export default function GlobeCanvas({ apiRef }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    try {
      const gl = document.createElement("canvas").getContext("webgl2") || document.createElement("canvas").getContext("webgl");
      if (!gl) return undefined;
    } catch { return undefined; }

    const stage = canvas.parentElement;
    const reduce = prefersReducedMotion();
    let api = null, cancelled = false, visible = false, st = null, ro = null, io2 = null, onMove = null;

    const boot = async () => {
      try {
        const { createGlobe } = await import("../animation/globe.js");
        if (cancelled) return;
        api = await createGlobe(canvas, { maskUrl });
        if (cancelled) { api.dispose(); api = null; return; }
        if (apiRef) apiRef.current = api;
        canvas.hidden = false; // only now does the canvas take up space (it is display:none until the globe exists)
        api.resize();
        api.renderOnce();
        canvas.setAttribute("data-ready", "");
        if (reduce) return;

        ro = new ResizeObserver(() => { api?.resize(); if (!visible) api?.renderOnce(); });
        ro.observe(canvas);
        io2 = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) api.start(); else api.stop(); }, { threshold: 0 });
        io2.observe(canvas);
        st = ScrollTrigger.create({ trigger: stage, start: "top bottom", end: "bottom top", onUpdate: (self) => api?.setScroll(self.progress - 0.5) });
        if (finePointer()) {
          onMove = (e) => { const r = stage.getBoundingClientRect(); api?.setPointer((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5); };
          stage.addEventListener("pointermove", onMove);
        }
      } catch (err) {
        console.warn("[globe] falling back to the painted globe:", err);
      }
    };

    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); boot(); } }, { rootMargin: "100% 0px" });
    io.observe(stage); // the canvas itself is display:none until it boots, so it cannot be observed

    return () => {
      cancelled = true;
      io.disconnect(); io2?.disconnect(); ro?.disconnect(); st?.kill();
      if (onMove) stage.removeEventListener("pointermove", onMove);
      if (apiRef) apiRef.current = null;
      api?.dispose();
    };
  }, []);

  return <canvas ref={ref} className="hp-globe" aria-hidden="true" hidden />;
}
