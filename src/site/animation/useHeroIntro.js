import { gsap, SplitText, useGSAP, prefersReducedMotion, finePointer } from "./gsap.js";
import { onReveal } from "./transition.js";

/**
 * Hero: staged entrance (image settles, header drops in, headline lines rise out of a mask, then copy, search and stats),
 * plus a scroll-linked parallax on the photograph and a gentle fade as the hero leaves.
 * `root` is the hero container; its direct children are: media (poster + video), veil, header, content, stats.
 * With a fine pointer the footage drifts a few pixels against the cursor and the copy drifts with it, giving the hero real depth.
 */
export function useHeroIntro(rootRef) {
  useGSAP(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const [img, , header, content, stats] = root.children; // `img` is the media wrapper
    const h1 = content.querySelector("h1");
    const rest = [...content.children].filter((el) => el !== h1);

    gsap.set([header, ...rest, stats], { autoAlpha: 0 });
    gsap.set(img, { scale: 1.18 });
    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
    onReveal(() => tl.play()); // starts as the page-transition curtain begins to lift
    tl.to(img, { scale: 1, duration: 2.6, ease: "power2.out" }, 0)
      .fromTo(header, { y: -24 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 0.15)
      .fromTo(rest, { y: 28 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.12, clearProps: "transform" }, 0.75)
      .fromTo(stats, { y: 30 }, { y: 0, autoAlpha: 1, duration: 0.9, clearProps: "transform" }, 1.25);

    SplitText.create(h1, {
      type: "lines", mask: "lines", autoSplit: true,
      onSplit: (self) => { const t = gsap.from(self.lines, { yPercent: 115, duration: 1.15, ease: "power4.out", stagger: 0.12, delay: 0.25, paused: true }); onReveal(() => t.play());
        // Scroll: the headline lines slide apart horizontally (alternating directions) as the hero leaves.
        gsap.to(self.lines, { xPercent: (i) => (i % 2 ? 7 : -5), ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
      },
    });

    // Scroll-linked parallax. The image sits at scale 1 after the intro; parallax moves it with yPercent (GPU-friendly).
    gsap.to(img, { yPercent: 14, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    gsap.to(content, { yPercent: -8, autoAlpha: 0.15, ease: "none", scrollTrigger: { trigger: root, start: "35% top", end: "bottom top", scrub: true } });

    // Cursor depth: footage (far) and copy (near) move in opposite directions. quickTo keeps it cheap.
    if (finePointer()) {
      const layers = gsap.utils.toArray(".hero-bg-img", root);
      gsap.set(layers, { scale: 1.06 });
      const mx = layers.map((l) => gsap.quickTo(l, "x", { duration: 1.4, ease: "power3.out" }));
      const my = layers.map((l) => gsap.quickTo(l, "y", { duration: 1.4, ease: "power3.out" }));
      const cx = gsap.quickTo(".hero-copy", "x", { duration: 1.1, ease: "power3.out" });
      const cy = gsap.quickTo(".hero-copy", "y", { duration: 1.1, ease: "power3.out" });
      const move = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
        mx.forEach((f) => f(nx * -26)); my.forEach((f) => f(ny * -16));
        cx(nx * 8); cy(ny * 5);
      };
      root.addEventListener("pointermove", move);
      return () => root.removeEventListener("pointermove", move);
    }
  }, { scope: rootRef });
}
