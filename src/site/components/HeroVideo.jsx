import { useEffect, useRef } from "react";
import poster from "@shared/assets/img/hero-poster.webp";
import posterSm from "@shared/assets/img/hero-poster-sm.webp";
import videoDesktop from "@shared/assets/video/hero-loop.mp4";
import videoMobile from "@shared/assets/video/hero-loop-sm.mp4";
import webmDesktop from "@shared/assets/video/hero-loop.webm";
import webmMobile from "@shared/assets/video/hero-loop-sm.webm";

/**
 * Full-bleed hero background: a poster image (always rendered, so there is never a blank frame or layout shift)
 * with the looping video fading in on top once it is actually playing.
 *
 * - The clip is pre-baked as a seamless loop (end cross-faded into start) with no audio track, so playback is
 *   plain `loop` — no JavaScript on the hot path.
 * - A smaller encode is chosen on narrow screens (<source media> is not honoured for <video>, hence the JS pick), and
 *   H.264 MP4 is preferred with a VP9 WebM fallback for browsers built without H.264 (e.g. Chromium, some Linux builds).
 * - The video is skipped (poster only) for prefers-reduced-motion and Save-Data, and paused while off screen or
 *   when the tab is hidden. If playback fails for any reason the poster simply stays.
 * Both layers share `.hero-bg-img` so object-fit / object-position are defined in one place (site.css).
 */
export default function HeroVideo() {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = navigator.connection?.saveData === true;
    if (reduce || saveData) return undefined;

    const small = window.matchMedia("(max-width: 767px)").matches;
    v.muted = true;
    v.defaultMuted = true;
    const mp4 = v.canPlayType('video/mp4; codecs="avc1.640028"') !== "" || v.canPlayType('video/mp4; codecs="avc1.4d401f"') !== "";
    v.src = mp4 ? (small ? videoMobile : videoDesktop) : (small ? webmMobile : webmDesktop);
    v.load();

    let visible = true;
    const sync = () => {
      if (visible && !document.hidden) v.play().catch(() => {});
      else v.pause();
    };
    const onPlaying = () => v.setAttribute("data-ready", "");
    v.addEventListener("playing", onPlaying);
    v.addEventListener("canplay", sync);

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { threshold: 0.05 });
    io.observe(v);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("canplay", sync);
      v.pause();
      v.removeAttribute("src");
      v.load();
    };
  }, []);

  return (
    <div
      className="hero-media absolute inset-0 -z-20 overflow-hidden bg-[#050c18]"
      role="img"
      aria-label="Statue of Lady Justice holding scales against a stormy sky and a sunset city skyline"
    >
      <img className="hero-bg-img absolute inset-0 h-full w-full object-cover" width="1672" height="940" fetchpriority="high" decoding="async" src={poster} srcSet={`${posterSm} 900w, ${poster} 1672w`} sizes="100vw" alt="" />
      <video
        ref={ref}
        className="hero-bg-img hero-bg-video absolute inset-0 h-full w-full object-cover"
        poster={poster}
        width="1672"
        height="940"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
