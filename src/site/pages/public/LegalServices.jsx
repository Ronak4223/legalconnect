import { Link } from "react-router-dom";
import { SERVICES, SITUATIONS } from "../../data/content.js";
import { useApp } from "../../state/store.jsx";
import { Button } from "../../ui/Button.jsx";
import { Ic } from "../../ui/Icons.jsx";
import { useTitle, useReveal } from "../../hooks.js";
import { money } from "../../utils/format.js";
import hero from "@shared/assets/img/scales-gold.webp";

export default function LegalServices() {
  useTitle("Legal services");
  const { state } = useApp();
  const rv = useReveal([]);
  const from = (area) => { const f = state.lawyers.filter((l) => l.areas.includes(area)).map((l) => Math.round(l.fee * 0.8)); return f.length ? Math.min(...f) : null; };
  const count = (area) => state.lawyers.filter((l) => l.areas.includes(area)).length;
  return (
    <div ref={rv}>
      <section className="page-band" style={{ minHeight: "min(70vh,560px)", display: "flex", alignItems: "flex-end" }}>
        <img className="bg" src={hero} alt="" style={{ objectPosition: "60% 50%" }} /><div className="sh" />
        <div className="wrap c" style={{ paddingBottom: "clamp(2.5rem,6vw,4.5rem)", paddingTop: "8rem" }}>
          <p className="eyebrow" style={{ color: "var(--gold)" }}>Legal services</p>
          <h1 className="h-xl" style={{ margin: ".8rem 0 1.1rem", maxWidth: "13ch" }}>Legal support for every chapter.</h1>
          <p className="lead" style={{ color: "rgba(255,255,255,.8)" }}>Six practice areas, one standard: verified lawyers, fees shown upfront, and advice you can act on.</p>
          <nav aria-label="Practice areas" className="chips" style={{ marginTop: "1.6rem" }}>{SERVICES.map((s) => <a key={s.area} href={`#${s.area.split(" ")[0].toLowerCase()}`} className="chip" style={{ background: "rgba(255,255,255,.08)", borderColor: "rgba(255,255,255,.25)", color: "#fff" }}>{s.area}</a>)}</nav>
        </div>
      </section>
      {SERVICES.map((s, i) => (
        <section key={s.area} id={s.area.split(" ")[0].toLowerCase()} className="wrap" style={{ padding: "clamp(3rem,7vw,6rem) clamp(1.1rem,4vw,3rem)", borderBottom: "1px solid var(--line)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(1.5rem,5vw,5rem)", alignItems: "center" }} className={`svc ${i % 2 ? "rev" : ""}`}>
            <div data-rv style={{ order: i % 2 ? 2 : 1 }}>
              <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", aspectRatio: "4/3" }}>
                <img src={s.img} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: s.pos }} />
                <span className="serif" style={{ position: "absolute", left: "1.2rem", bottom: ".6rem", color: "#fff", fontSize: "4.5rem", lineHeight: 1, textShadow: "0 2px 24px rgba(0,0,0,.45)" }}>0{i + 1}</span>
              </div>
            </div>
            <div style={{ order: i % 2 ? 1 : 2 }}>
              <p className="eyebrow" data-rv><Ic n={s.icon} size={15} style={{ verticalAlign: "-3px", marginRight: 6 }} />{s.tag}</p>
              <h2 className="h-lg" style={{ margin: ".7rem 0 1rem" }} data-rv>{s.area}</h2>
              <p className="lead" data-rv>{s.blurb}</p>
              <ul className="rows" style={{ listStyle: "none", padding: 0, margin: "1.6rem 0", display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "2rem" }} data-rv>
                {s.items.map((t) => <li key={t} className="row" style={{ padding: ".7rem 0", fontSize: ".9rem", borderTop: "1px solid var(--line-2)" }}><Ic n="check" size={15} /><span className="row-main">{t}</span></li>)}
              </ul>
              <div style={{ display: "flex", gap: "1.2rem", alignItems: "center", flexWrap: "wrap" }} data-rv>
                <Button to={`/find-lawyers?area=${encodeURIComponent(s.area)}`} iconRight="arrowR">Find a {s.area.replace(" Law", "")} lawyer</Button>
                <span className="muted" style={{ fontSize: ".84rem" }}>{count(s.area)} lawyers{from(s.area) ? ` · consultations from ${money(from(s.area))}` : ""}</span>
              </div>
            </div>
          </div>
        </section>
      ))}
      <section className="wrap" style={{ padding: "clamp(3rem,7vw,6rem) clamp(1.1rem,4vw,3rem) 0" }}>
        <p className="eyebrow" data-rv>Not sure where to start?</p>
        <h2 className="h-lg" style={{ margin: ".7rem 0 1.6rem", maxWidth: "20ch" }} data-rv>Start with what’s happening.</h2>
        <div className="qa" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }} data-rv>
          {SITUATIONS.map(([t, a]) => <Link key={t} to={`/find-lawyers?area=${encodeURIComponent(a)}`}><Ic n="arrowR" size={17} /><span style={{ flex: 1 }}>{t}</span><small className="muted">{a.replace(" Law", "")}</small></Link>)}
        </div>
      </section>
      <style>{`@media(max-width:820px){.svc{grid-template-columns:1fr!important}.svc>*{order:initial!important}.svc ul{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
