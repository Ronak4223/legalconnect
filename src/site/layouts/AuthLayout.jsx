import { Link } from "react-router-dom";
import { Logo } from "../ui/Misc.jsx";
import { Ic } from "../ui/Icons.jsx";
import { useTitle } from "../hooks.js";
import { useEffect, useRef } from "react";
import videoSm from "@shared/assets/video/justice-loop-sm.mp4";
import videoLg from "@shared/assets/video/justice-loop.mp4";
import webmSm from "@shared/assets/video/justice-loop-sm.webm";
import webmLg from "@shared/assets/video/justice-loop.webm";
import poster from "@shared/assets/img/justice-poster.webp";

/** Silent looping background used on the sign-in screens and the About hero. Poster first; skipped for reduced motion / Save-Data. */
export function JusticeVideo({ className = "bg", position = "50% 40%" }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current; if (!v) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || navigator.connection?.saveData) return undefined;
    const small = window.matchMedia("(max-width: 900px)").matches;
    const mp4 = v.canPlayType('video/mp4; codecs="avc1.640028"') !== "";
    v.muted = true; v.src = mp4 ? (small ? videoSm : videoLg) : (small ? webmSm : webmLg); v.load();
    const play = () => { if (!document.hidden) v.play().catch(() => {}); else v.pause(); };
    v.addEventListener("canplay", play); document.addEventListener("visibilitychange", play);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : v.pause())); io.observe(v);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", play); v.pause(); v.removeAttribute("src"); v.load(); };
  }, []);
  return (<><img className={className} src={poster} alt="" style={{ objectPosition: position }} /><video ref={ref} className={className} style={{ objectPosition: position, opacity: 0, transition: "opacity 1.2s" }} muted loop playsInline preload="auto" aria-hidden="true" tabIndex={-1} onPlaying={(e) => { e.currentTarget.style.opacity = 1; }} /></>);
}

/** Split-screen shell for every authentication page. */
export function AuthShell({ title, side, wide, children, back = true }) {
  useTitle(title);
  return (
    <div className="app auth" data-theme={side?.theme || "user"}>
      <aside className="auth-vis">
        {side?.video ? <JusticeVideo position={side.pos} /> : <img className="bg" src={side?.image} alt="" style={{ objectPosition: side?.pos || "50% 50%" }} />}
        <div className="sh" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Logo light />{back && <Link to="/" className="btn btn-ghost btn-sm" style={{ color: "#fff" }}><Ic n="arrowL" size={15} />Back to site</Link>}</div>
        <div>
          <h2>{side?.headline}</h2>
          {side?.points && <ul>{side.points.map(([ic, t]) => <li key={t}><Ic n={ic} size={18} />{t}</li>)}</ul>}
        </div>
      </aside>
      <div>
        <div className="auth-top"><Logo /><Link to="/" className="btn btn-ghost btn-sm"><Ic n="arrowL" size={15} />Site</Link></div>
        <main className="auth-main" id="main"><div className={`auth-card ${wide ? "wide" : ""}`}>{children}</div></main>
      </div>
    </div>
  );
}
