import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useApp } from "../../state/store.jsx";
import BookingFlow from "../shared/BookingFlow.jsx";
import { nextOpenDays } from "../shared/SlotPicker.jsx";
import { Verified } from "../shared/lawyerParts.jsx";
import { LawyerPhoto, Stars, EmptyState } from "../../ui/Misc.jsx";
import { Button } from "../../ui/Button.jsx";
import { Modal } from "../../ui/Overlay.jsx";
import { Chips, TextArea } from "../../ui/Field.jsx";
import { Ic } from "../../ui/Icons.jsx";
import { useTitle, useGo, useReveal } from "../../hooks.js";
import { money, dateLong, time12, dateShort } from "../../utils/format.js";
import { FEE_BY_TYPE } from "../../data/demo.js";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export default function LawyerProfile() {
  const { id } = useParams();
  const { state, session, actions } = useApp();
  const l = state.lawyers.find((x) => x.id === id);
  useTitle(l ? l.name : "Lawyer not found");
  const [sp, setSp] = useSearchParams();
  const [book, setBook] = useState(false); const [review, setReview] = useState(false); const [rv, setRv] = useState({ rating: "5", text: "" });
  const go = useGo(); const ref = useReveal([id]);
  useEffect(() => { if (sp.get("book") === "1") { setBook(true); const n = new URLSearchParams(sp); n.delete("book"); setSp(n, { replace: true }); } }, [sp, setSp]);
  const reviews = state.reviews[id] || [];
  const dist = useMemo(() => [5, 4, 3, 2, 1].map((s) => ({ s, n: reviews.filter((r) => r.rating === s).length })), [reviews]);
  if (!l) return <div className="wrap" style={{ padding: "6rem 1rem" }}><EmptyState icon="search" title="We couldn’t find that lawyer" text="The profile may have moved or the link is incorrect." action="Browse all lawyers" to="/find-lawyers" /></div>;
  const open = nextOpenDays(l, state.appointments);
  const isUser = session?.role === "user", saved = isUser && (state.saved[session.id] || []).includes(l.id);
  const me = isUser ? state.accounts.find((a) => a.id === session.id) : null;
  const canReview = isUser && state.appointments.some((a) => a.userId === session.id && a.lawyerId === id && a.status === "completed") && !reviews.some((r) => r.name === me?.name);
  const message = () => { if (!isUser) { actions.toast(session ? "Messaging is a client feature." : "Sign in as a client to message a lawyer.", "err"); if (!session) go("/login/user"); return; } const cid = actions.openConversation(l.id); go(`/user/messages?c=${cid}`); };
  const wk = (l.schedule || []).filter((d) => d.on);
  return (
    <div ref={ref}>
      <section className="wrap" style={{ padding: "clamp(1.5rem,4vw,3rem) clamp(1.1rem,4vw,3rem) 2rem" }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: ".82rem", marginBottom: "1.4rem" }} className="muted"><Link to="/find-lawyers">Find lawyers</Link> / {l.area} / {l.name}</nav>
        <div className="prof-hero">
          <div data-rv><LawyerPhoto l={l} ratio="4/5" hero zoom={l.src && l.sz === "cover" ? 1 : 0.5} label={`Portrait of ${l.name}`} style={{ borderRadius: 26, backgroundColor: "#d8dfe2" }} /></div>
          <div>
            <p className="eyebrow" data-rv>{l.areas.join(" · ")}</p>
            <h1 className="h-xl" style={{ margin: ".6rem 0 .8rem" }} data-rv>{l.name} <Verified l={l} /></h1>
            <p className="lead" data-rv>{l.tagline}</p>
            <div className="stats" style={{ gridTemplateColumns: "repeat(4,auto)", margin: "1.6rem 0", justifyContent: "start" }} data-rv>
              {[["Rating", l.reviews ? l.rating.toFixed(1) : "New", l.reviews ? `${l.reviews} reviews` : "No reviews yet"], ["Experience", `${l.exp} yrs`, `Enrolled ${l.barNo?.split("/").pop() || ""}`], ["From", money(Math.round(l.fee * FEE_BY_TYPE.phone)), "phone consultation"], ["City", l.city, l.langs.slice(0, 2).join(", ")]].map(([a, b, c]) => (
                <div className="stat" key={a}><div className="stat-top"><span>{a}</span></div><div className="stat-v" style={{ fontSize: "1.7rem" }}>{b}</div><div className="stat-s">{c}</div></div>))}
            </div>
            <div style={{ display: "flex", gap: ".7rem", flexWrap: "wrap" }} data-rv>
              <Button size="lg" icon="calendar" onClick={() => setBook(true)}>Book consultation</Button>
              <Button size="lg" variant="outline" icon="message" onClick={message}>Message</Button>
              <Button size="lg" variant="ghost" icon="heart" aria-pressed={saved} onClick={() => { if (!isUser) { actions.toast("Sign in as a client to save lawyers.", "err"); return; } actions.toggleSave(l.id); actions.toast(saved ? "Removed from saved lawyers." : "Saved to your lawyers."); }}>{saved ? "Saved" : "Save"}</Button>
            </div>
          </div>
        </div>
      </section>
      <section className="wrap" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 340px", gap: "clamp(1.5rem,4vw,4rem)", alignItems: "start" }} id="profile-body">
        <div>
          <div className="ed-sec" style={{ borderTop: "1px solid var(--line)" }} data-rv><div><h2 className="h-md">About</h2></div><div><p style={{ margin: 0, lineHeight: 1.8, color: "var(--muted)" }}>{l.about}</p></div></div>
          <div className="ed-sec" data-rv><div><h2 className="h-md">Practice areas</h2></div><div className="chips">{l.areas.map((a) => <span key={a} className="chip on" style={{ cursor: "default" }}>{a}</span>)}</div></div>
          <div className="ed-sec" data-rv><div><h2 className="h-md">Qualifications</h2></div><dl className="dl"><dt>Education</dt><dd>{l.quals.join(" · ")}</dd><dt>Courts</dt><dd>{(l.courts || []).join(" · ")}</dd><dt>Bar enrolment</dt><dd>{l.barNo} {l.council ? `— ${l.council}` : ""}</dd><dt>Languages</dt><dd>{l.langs.join(", ")}</dd><dt>On LegalConnect since</dt><dd>{l.joined}</dd></dl></div>
          <div className="ed-sec" data-rv id="availability"><div><h2 className="h-md">Availability</h2><p className="d">Weekly hours. Book to see live times.</p></div>
            <div><div className="avail" aria-label="Weekly availability">{DAYS.map((d, i) => { const s = (l.schedule || []).find((x) => x.day === i); return <div key={d} className={s?.on ? "on" : ""}>{d}<br /><small>{s?.on ? `${s.from.slice(0, 2)}–${s.to.slice(0, 2)}` : "—"}</small></div>; })}</div></div></div>
          <div className="ed-sec" data-rv id="reviews"><div><h2 className="h-md">Client reviews</h2>{l.reviews > 0 && <div style={{ marginTop: "1rem" }}><div className="serif" style={{ fontSize: "3rem", lineHeight: 1 }}>{l.rating.toFixed(1)}</div><Stars value={l.rating} size={16} /><p className="muted" style={{ fontSize: ".82rem" }}>{l.reviews} reviews</p></div>}</div>
            <div>
              {reviews.length ? <>
                <div className="rating-bars" aria-label="Rating distribution">{dist.map((d) => <div key={d.s}><span>{d.s}★</span><div className="bar"><i style={{ width: `${(d.n / reviews.length) * 100}%` }} /></div><span className="muted">{d.n}</span></div>)}</div>
                {reviews.map((r) => <div className="review" key={r.id}><div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}><b style={{ fontWeight: 500 }}>{r.name}</b><span className="muted" style={{ fontSize: ".78rem" }}>{dateShort(r.date)}</span></div><Stars value={r.rating} /><p>{r.text}</p></div>)}
              </> : <p className="muted">No reviews yet.</p>}
              {canReview && <Button variant="outline" icon="star" onClick={() => setReview(true)} className="" style={{ marginTop: "1rem" }}>Write a review</Button>}
            </div></div>
        </div>
        <aside className="sticky-card panel" data-rv style={{ padding: "1.5rem" }} aria-label="Book a consultation">
          <h2 className="h-md">Book a consultation</h2>
          <ul className="rows" style={{ listStyle: "none", margin: "1rem 0", padding: 0 }}>
            {[["video", "Video", 1], ["phone", "Phone", 0.8], ["in-person", "In person", 1.5]].map(([k, n, m]) => <li key={k} className="row" style={{ padding: ".7rem 0" }}><Ic n={{ video: "video", phone: "phone", "in-person": "building" }[k]} size={18} /><div className="row-main">{n} · 45 min</div><b>{money(Math.round(l.fee * m))}</b></li>)}
          </ul>
          <p className="lbl" style={{ marginBottom: ".5rem" }}>Next available</p>
          {open.length ? open.map((o) => <div key={o.date} className="row" style={{ padding: ".5rem 0" }}><Ic n="clock" size={16} /><div className="row-main" style={{ fontSize: ".88rem" }}>{dateLong(o.date)}</div><span className="muted" style={{ fontSize: ".8rem" }}>from {time12(o.first)}</span></div>) : <p className="muted" style={{ fontSize: ".86rem" }}>No openings in the next 3 weeks.</p>}
          <Button size="lg" onClick={() => setBook(true)} className="" style={{ width: "100%", marginTop: "1.1rem" }}>Choose a time</Button>
          <p className="hint" style={{ marginTop: ".8rem", textAlign: "center" }}>Free to cancel before the lawyer confirms.</p>
        </aside>
      </section>
      <BookingFlow lawyer={l} open={book} onClose={() => setBook(false)} />
      <Modal open={review} onClose={() => setReview(false)} size="sm" title="Write a review" footer={<><Button variant="ghost" onClick={() => setReview(false)}>Cancel</Button><Button onClick={() => { if (rv.text.trim().length < 10) { actions.toast("Please write at least 10 characters.", "err"); return; } actions.addReview(l.id, { rating: Number(rv.rating), text: rv.text.trim() }); setReview(false); actions.toast("Thanks — your review is live."); }}>Post review</Button></>}>
        <div style={{ display: "grid", gap: "1rem" }}><Chips label="Rating" multi={false} options={["5", "4", "3", "2", "1"]} value={rv.rating} onChange={(v) => setRv({ ...rv, rating: v })} /><TextArea label="Your experience" value={rv.text} onChange={(e) => setRv({ ...rv, text: e.target.value })} max={400} /></div>
      </Modal>
      <style>{`@media(max-width:900px){#profile-body{grid-template-columns:1fr!important}.sticky-card{position:static!important}.prof-hero .stats{grid-template-columns:repeat(2,1fr)!important}}`}</style>
    </div>
  );
}
