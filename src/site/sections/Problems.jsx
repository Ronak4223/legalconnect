import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "../animation/gsap.js";

/**
 * "Legal problems are never one-size-fits-all." is staged as a scene (desktop, motion allowed): the section pins and the
 * statement is read to you word by word, then "one-size-fits-all." is struck out, then the answer — "Neither should your
 * legal guidance." — arrives. On phones it is a normal word reveal; with reduced motion it is simply the finished text.
 */
export default function Problems() {
  const root = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return undefined;
    const mm = gsap.matchMedia();
    const h = root.current.querySelector("#pb-h"), sub = root.current.querySelector(".pb-sub");

    mm.add("(min-width: 768px)", () => {
      const split = SplitText.create(h, { type: "words" });
      const words = split.words, strike = words[words.length - 1];
      strike.classList.add("pb-strike");
      gsap.set(words, { opacity: 0.14 });
      gsap.set(sub, { opacity: 0, y: 28 });
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "+=140%", pin: true, scrub: 0.6, anticipatePin: 1 } })
        .to(words, { opacity: 1, stagger: 0.12, duration: 0.3, ease: "none" }, 0)
        .to(strike, { "--s": 1, duration: 0.3, ease: "power2.inOut" }, ">0.08")
        .to(strike, { opacity: 0.38, duration: 0.25, ease: "none" }, "<0.12")
        .to(sub, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, ">-0.05")
        .to({}, { duration: 0.2 });
      return () => { split.revert(); gsap.set(sub, { clearProps: "opacity,transform" }); };
    });

    mm.add("(max-width: 767px)", () => {
      SplitText.create(h, {
        type: "lines,words", mask: "lines", autoSplit: true,
        onSplit: (self) => gsap.from(self.words, { yPercent: 118, duration: 1, ease: "power4.out", stagger: 0.06, scrollTrigger: { trigger: h, start: "top 88%", once: true } }),
      });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section
      ref={root}
      className="pb relative flex min-h-[85vh] items-center overflow-hidden px-6 py-20 text-[#0d2340] md:min-h-[100vh] md:px-14"
      id="problems"
    >
      <div className="max-w-2xl">
        <h2 id="pb-h" className="font-serif text-[clamp(2rem,4.6vw,4.25rem)] font-normal uppercase leading-[1.12] tracking-[.01em]">
          Legal problems
          <br />
          are never
          <br />
          one-size-fits-all.
        </h2>
        <p className="pb-sub mt-6 text-base text-[#0d2340]/75 md:text-lg">Neither should your legal guidance.</p>
      </div>
    </section>
  );
}
