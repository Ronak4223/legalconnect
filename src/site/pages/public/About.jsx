import { Link } from "react-router-dom";
import { JusticeVideo } from "../../layouts/AuthLayout.jsx";
import { Button } from "../../ui/Button.jsx";
import { Ic } from "../../ui/Icons.jsx";
import { useTitle, useReveal } from "../../hooks.js";
import network from "@shared/assets/img/network-gold.webp";
import laptop from "@shared/assets/img/dashboard-laptop.webp";
import consult from "@shared/assets/img/consult-room.webp";

const STEPS = [["Tell us what’s happening", "Describe your situation in your own words, or pick a practice area. No legal vocabulary needed."], ["Choose a verified lawyer", "Compare experience, reviews, languages and a fee that is shown before you book."], ["Consult and follow through", "Meet by video, phone or in person, then keep your case, documents and messages in one calm place."]];
const CHECKS = [["id", "Identity checked", "Government ID matched to the person behind the profile."], ["shield", "Bar enrolment confirmed", "Enrolment number verified against the State Bar Council."], ["file", "Credentials reviewed", "Degrees, courts and practice areas reviewed by our team."], ["star", "Continuously reviewed", "Ratings and client feedback keep every profile honest."]];
export default function About() {
  useTitle("About");
  const rv = useReveal([]);
  return (
    <div ref={rv}>
      <section className="page-band about-hero" style={{ minHeight: "min(86vh,720px)", display: "flex", alignItems: "flex-end", background: "#050c14" }}>
        <JusticeVideo position="30% 40%" /><div className="sh" style={{ background: "linear-gradient(180deg,rgba(5,12,20,.55),rgba(5,12,20,.2) 40%,rgba(5,12,20,.92))" }} />
        <div className="wrap c" style={{ paddingBottom: "clamp(2.5rem,7vw,5rem)", paddingTop: "9rem" }}>
          <p className="eyebrow" style={{ color: "var(--gold)" }}>About LegalConnect</p>
          <h1 className="h-xl" style={{ margin: ".9rem 0 1.2rem", maxWidth: "16ch" }}>Legal help should feel the way justice looks: clear, even, and fair.</h1>
          <p className="lead" style={{ color: "rgba(255,255,255,.8)" }}>We connect people with verified lawyers across India, and give both sides a calmer way to work together.</p>
        </div>
      </section>
      <section className="wrap" style={{ padding: "clamp(3.5rem,8vw,7rem) clamp(1.1rem,4vw,3rem) 0", display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "clamp(1.5rem,5vw,5rem)" }} id="mission">
        <div><p className="eyebrow" data-rv>Our mission</p><h2 className="h-lg" style={{ marginTop: ".8rem" }} data-rv>Make good legal advice easy to find and easy to trust.</h2></div>
        <div data-rv><p className="lead" style={{ maxWidth: "none" }}>Most people meet a lawyer on the worst day of a year. They don’t know whom to trust, what it should cost, or what happens next. LegalConnect exists to remove that uncertainty: verified credentials, transparent fees, and a single place to book, talk, share documents and follow your case.</p>
          <p className="lead" style={{ maxWidth: "none", marginTop: "1rem" }}>For lawyers, it is a practice dashboard that handles the administration — requests, calendars, client messages, case notes and earnings — so more of the day goes to the work itself.</p></div>
      </section>
      <section className="wrap" style={{ padding: "clamp(3rem,7vw,6rem) clamp(1.1rem,4vw,3rem) 0" }}>
        <div className="stats" data-rv>{[["10,000+", "verified lawyers"], ["50,000+", "clients helped"], ["25+", "practice areas"], ["4.8 / 5", "average rating"]].map(([v, l]) => <div className="stat" key={l}><div className="stat-v">{v}</div><div className="stat-s">{l}</div></div>)}</div>
      </section>
      <section className="wrap" style={{ padding: "clamp(3.5rem,8vw,7rem) clamp(1.1rem,4vw,3rem) 0" }}>
        <p className="eyebrow" data-rv>How it works</p><h2 className="h-lg" style={{ margin: ".8rem 0 2rem" }} data-rv>Three steps, no jargon.</h2>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(1.2rem,3vw,3rem)" }} className="steps3">
          {STEPS.map(([t, d], i) => <li key={t} data-rv style={{ borderTop: "1px solid var(--ink)", paddingTop: "1.2rem" }}><span className="serif" style={{ fontSize: "3rem", color: "var(--gold-deep)", lineHeight: 1 }}>0{i + 1}</span><h3 className="h-md" style={{ margin: ".8rem 0" }}>{t}</h3><p className="muted" style={{ margin: 0, lineHeight: 1.7 }}>{d}</p></li>)}
        </ol>
      </section>
      <section style={{ position: "relative", marginTop: "clamp(4rem,9vw,8rem)", color: "#fff", background: "#0a1a2b", overflow: "hidden" }}>
        <img src={network} alt="" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }} /><div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(6,18,32,.95) 30%,rgba(6,18,32,.35))" }} />
        <div className="wrap" style={{ position: "relative", padding: "clamp(3.5rem,8vw,7rem) clamp(1.1rem,4vw,3rem)" }}>
          <p className="eyebrow" style={{ color: "var(--gold)" }} data-rv>Trust is a process, not a number</p>
          <h2 className="h-lg" style={{ margin: ".8rem 0 2.2rem", maxWidth: "18ch" }} data-rv>Our verification standard.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "2rem" }}>
            {CHECKS.map(([ic, t, d]) => <div key={t} data-rv><Ic n={ic} size={26} style={{ color: "var(--gold)" }} /><h3 className="h-md" style={{ margin: ".9rem 0 .4rem" }}>{t}</h3><p style={{ margin: 0, color: "rgba(255,255,255,.72)", lineHeight: 1.65, fontSize: ".92rem" }}>{d}</p></div>)}
          </div>
        </div>
      </section>
      <section className="wrap" style={{ padding: "clamp(3.5rem,8vw,7rem) clamp(1.1rem,4vw,3rem) 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(1.5rem,5vw,5rem)", alignItems: "center" }} id="platform">
        <div data-rv style={{ display: "grid", gap: "1rem" }}><img src={laptop} alt="A lawyer dashboard showing active cases, response time and compliance" loading="lazy" style={{ borderRadius: 22, width: "100%" }} /><img src={consult} alt="A secure video consultation room with documents, case notes and chat" loading="lazy" style={{ borderRadius: 22, width: "100%" }} /></div>
        <div><p className="eyebrow" data-rv>One platform, two journeys</p><h2 className="h-lg" style={{ margin: ".8rem 0 1.2rem" }} data-rv>Built for clients <em>and</em> for the lawyers who serve them.</h2>
          <p className="lead" data-rv>Clients get a dashboard for appointments, cases, messages and payments. Lawyers get a practice workspace with requests, clients, case notes and earnings. Both sit on the same secure video room, with documents and notes beside the conversation.</p>
          <div style={{ display: "flex", gap: ".7rem", flexWrap: "wrap", marginTop: "1.6rem" }} data-rv><Button to="/find-lawyers" iconRight="arrowR">Find a lawyer</Button><Button to="/register/lawyer" variant="outline">Join as a lawyer</Button></div></div>
      </section>
      <section className="wrap" style={{ padding: "clamp(3.5rem,8vw,6rem) clamp(1.1rem,4vw,3rem) 0" }}>
        <div className="demo-note" data-rv><Ic n="info" size={16} /><span>This website is a frontend demonstration. Lawyers, reviews, cases and payments are fictional, nothing is sent to a server, and no legal advice is given. See our <Link to="/terms" style={{ textDecoration: "underline" }}>terms</Link>.</span></div>
      </section>
      <style>{`@media(max-width:860px){#mission,#platform{grid-template-columns:1fr!important}.steps3{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
