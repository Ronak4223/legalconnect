/**
 * Lazy section artwork. The CSS only defines a section's background-image variable under `.is-near`, so the browser does not
 * request the picture until this adds the class — when the section is within ~2 screens of the viewport. This keeps the first
 * load to the hero + the section directly below it instead of every image on the page.
 * Runs regardless of motion preferences. Fires `lc:near` on the element so features that read the computed background
 * (the parallax) can start once the image URL is actually present.
 */
const TARGETS = ".ap,.st,.jy,.ins,.ex,.sv-top,.pb,.hp-stage,.jn-stage,.fl-img,.tr,.li,.sv-cta,.fl-top,.pa-top";

export function lazyBackgrounds(root) {
  const els = [...root.querySelectorAll(TARGETS)];
  const mark = (el) => { el.classList.add("is-near"); el.dispatchEvent(new CustomEvent("lc:near")); };
  if (!("IntersectionObserver" in window)) { els.forEach(mark); return () => {}; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { mark(e.target); io.unobserve(e.target); }
  }, { rootMargin: "200% 0px 200% 0px" });
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}
