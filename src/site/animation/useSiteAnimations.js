import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReducedMotion, finePointer } from "./gsap.js";
import { lazyBackgrounds } from "./lazyBackgrounds.js";

/** Splits "a, b, c" computed values at top-level commas (respects parentheses in gradients/urls). */
const splitTop = (s) => { const out = []; let d = 0, cur = ""; for (const ch of s) { if (ch === "(") d++; if (ch === ")") d--; if (ch === "," && !d) { out.push(cur.trim()); cur = ""; } else cur += ch; } out.push(cur.trim()); return out; };

/** Moves only the photograph layer of a multi-layer section background (gradients stay put). */
function parallaxBackground(el) {
  const cs = getComputedStyle(el);
  const imgs = splitTop(cs.backgroundImage), ys = splitTop(cs.backgroundPositionY);
  const idx = imgs.findIndex((v) => v.startsWith("url("));
  if (idx < 0 || ys.length !== imgs.length || !ys[idx].endsWith("%")) return;
  // Keep the whole range inside 0-100%: with background-size: cover, anything outside exposes a gap at the edge.
  const base = parseFloat(ys[idx]), lo = Math.min(Math.max(base - 7, 0), 86), p = { y: lo };
  gsap.to(p, {
    y: lo + 14, ease: "none",
    onUpdate: () => { const a = [...ys]; a[idx] = p.y + "%"; el.style.backgroundPositionY = a.join(", "); },
    scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
  });
}

/**
 * Page-wide scroll choreography for the home page. Everything is created inside one GSAP context (useGSAP) and is reverted on unmount.
 *  - section headings: SplitText line masks
 *  - lead copy, cards and list items: batched fade-up (inline styles are cleared afterwards so CSS hover effects keep working)
 *  - nodes positioned with a CSS transform (.hp-n, .jn-s): opacity only, so their centring is never overwritten
 *  - photographic section backgrounds: subtle parallax on the photo layer only
 *  - scroll progress bar, magnetic call-to-action pills
 */
export function useSiteAnimations(rootRef) {
  useEffect(() => lazyBackgrounds(rootRef.current), [rootRef]); // section artwork is fetched on approach (any motion preference)
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const root = rootRef.current, q = gsap.utils.selector(root);

    // Headings: each line is masked; the words inside it rise in sequence (lines on narrow screens re-split automatically).
    q("section h2:not(#rs-h):not(#pb-h)").forEach((h) => {
      SplitText.create(h, {
        type: "lines,words", mask: "lines", autoSplit: true,
        onSplit: (self) => gsap.from(self.words, { yPercent: 118, rotate: 2.5, transformOrigin: "0% 100%", duration: 1.1, ease: "power4.out", stagger: 0.055, scrollTrigger: { trigger: h, start: "top 88%", once: true } }),
      });
    });

    const rise = q(".ey, section h2:not(#pb-h) + p, .ap-i, .fl-t, .sv-i, .pa-w, .pa-art, .rs-why, #ins-card, .lnk");
    gsap.set(rise, { autoAlpha: 0, y: 28 });
    ScrollTrigger.batch(rise, { start: "top 97%", // any element that is on screen must be revealed
       once: true, onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, overwrite: true, clearProps: "opacity,visibility,transform" }) });

    const fade = q(".hp-n, .jn-s");
    gsap.set(fade, { autoAlpha: 0 });
    ScrollTrigger.batch(fade, { start: "top 97%", once: true, onEnter: (els) => gsap.to(els, { autoAlpha: 1, duration: 0.9, ease: "power2.out", stagger: 0.12, overwrite: true, clearProps: "opacity,visibility" }) });

    const mm = gsap.matchMedia();
    mm.add({ wide: "(min-width: 768px)", narrow: "(max-width: 767px)" }, () => {
      const els = q(".ap, .jy, .ins, .ex, .pb, .tr, .li, .st");
      // the photo URL only exists in the computed style once the section is "near" (see lazyBackgrounds.js)
      const arm = (e) => { if (e.classList.contains("is-near")) parallaxBackground(e); else e.addEventListener("lc:near", () => parallaxBackground(e), { once: true }); };
      els.forEach(arm);
      return () => els.forEach((e) => { e.style.backgroundPositionY = ""; });
    });


    // Sheet-rise: dark full-bleed sections arrive as a rounded sheet that widens to the full viewport as it comes up.
    // Scroll-scrubbed; the clip is removed once complete so nothing that overhangs the section is ever cut off.
    mm.add({ wide: "(min-width: 768px)", narrow: "(max-width: 767px)" }, (ctx) => {
      const { wide } = ctx.conditions, inset = wide ? "3.4vw" : "3vw", rad = wide ? "34px" : "22px";
      const from = `inset(0px ${inset} 0px ${inset} round ${rad} ${rad} 0px 0px)`, to = "inset(0px 0vw 0px 0vw round 0px 0px 0px 0px)";
      q(".st, .jy, .ex, .li").forEach((el) => {
        gsap.fromTo(el, { clipPath: from }, {
          clipPath: to, ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "top 35%", scrub: true, onLeave: () => { el.style.clipPath = ""; } },
        });
      });
    });

    // Trust cards are dealt in 3D: they tip up out of depth one after another (perspective set per card, cleared afterwards).
    const deal = q(".tr-c");
    if (deal.length) {
      gsap.set(deal, { autoAlpha: 0 });
      ScrollTrigger.create({
        trigger: deal[0], start: "top 95%", once: true,
        onEnter: () => gsap.fromTo(deal, { rotationX: 38, y: 90, z: -220, autoAlpha: 0, transformPerspective: 1100, transformOrigin: "50% 100%" },
          { rotationX: 0, y: 0, z: 0, autoAlpha: 1, duration: 1.3, ease: "power4.out", stagger: 0.14, clearProps: "opacity,visibility,transform" }),
      });
    }

    // Image reveal for the trust-card photographs: unmask upward while easing out of a slight zoom.
    q(".tr-c img").forEach((img) => {
      gsap.fromTo(img, { clipPath: "inset(100% 0% 0% 0% round 12px)", scale: 1.25 }, {
        clipPath: "inset(0% 0% 0% 0% round 12px)", scale: 1, duration: 1.3, ease: "power4.out",
        scrollTrigger: { trigger: img, start: "top 90%", once: true }, clearProps: "clipPath,scale",
      });
    });

    // Depth tilt on cards: they turn toward the cursor and lift. Fine pointers only; the CSS hover lift is switched off
    // for these (via .is-tilt) so the two never fight. Waits until the entrance reveal has finished.
    if (finePointer()) {
      q(".tr-c, .rs, .rs-row, .fl-t, .pa-w, .pa-art, .lc-a").forEach((el) => {
        el.classList.add("is-tilt");
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" }), ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });
        const ready = () => el.style.visibility !== "hidden" && el.style.opacity === "";
        const enter = () => { if (!ready()) return; gsap.set(el, { transformPerspective: 900 }); gsap.to(el, { y: -5, duration: 0.5, ease: "power3.out", overwrite: "auto" }); };
        const move = (e) => { if (!ready()) return; const r = el.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 9); rx(((e.clientY - r.top) / r.height - 0.5) * -9); };
        const leave = () => { rx(0); ry(0); gsap.to(el, { y: 0, duration: 0.7, ease: "power3.out", overwrite: "auto", onComplete: () => gsap.set(el, { clearProps: "transform" }) }); };
        el.addEventListener("pointerenter", enter); el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
      });
    }

    // Depth: floating glass cards drift against the scroll at their own pace (CSS var -> `translate`, so existing transforms are untouched).
    q(".lc-float").forEach((el) => gsap.fromTo(el, { "--fy": "38px" }, { "--fy": "-38px", ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } }));

    gsap.fromTo("#scroll-progress", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

    if (finePointer()) {
      q(".pill").forEach((btn) => {
        const x = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" }), y = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });
        const move = (e) => { const r = btn.getBoundingClientRect(); x((e.clientX - (r.left + r.width / 2)) * 0.25); y((e.clientY - (r.top + r.height / 2)) * 0.35); };
        const leave = () => { x(0); y(0); };
        btn.addEventListener("mousemove", move); btn.addEventListener("mouseleave", leave);
      });
    }
  }, { scope: rootRef });
}
