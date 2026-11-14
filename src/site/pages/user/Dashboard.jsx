import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../state/store.jsx";
import { Stat, Section, StatusBadge, EmptyState } from "../../ui/Misc.jsx";
import { Button } from "../../ui/Button.jsx";
import { Ic } from "../../ui/Icons.jsx";
import { ApptRow, ApptDetail } from "../shared/Appointments.jsx";
import { LawyerMini } from "../shared/lawyerParts.jsx";
import { nextAppt, lawyerById } from "../../state/selectors.js";
import { greeting, ago } from "../../utils/format.js";
import { STAGES } from "../../data/demo.js";
import { useTitle, useGo } from "../../hooks.js";
import skyline from "@shared/assets/img/journey.webp";

export default function UserDashboard() {
  useTitle("Dashboard");
  const { state, session, account } = useApp(); const go = useGo();
  const [sel, setSel] = useState(null); const [room, setRoom] = useState(false); const [q, setQ] = useState("");
  const me = session.id, first = (account?.name || "").split(" ")[0];
  const appts = state.appointments.filter((a) => a.userId === me), upcoming = nextAppt(appts);
  const cases = state.cases.filter((c) => c.userId === me && c.status === "active");
  const unread = state.conversations.filter((c) => c.userId === me).reduce((a, c) => a + (c.ul || 0), 0);
  const saved = state.saved[me] || [];
  const areas = new Set([...cases.map((c) => c.category), ...appts.map((a) => lawyerById(state, a.lawyerId)?.area)]);
  const booked = new Set(appts.map((a) => a.lawyerId));
  const rec = state.lawyers.filter((l) => !booked.has(l.id)).sort((a, b) => (areas.has(b.area) - areas.has(a.area)) || b.rating - a.rating).slice(0, 3);
  const activity = state.notifications.filter((n) => n.to === me).sort((a, b) => b.ts - a.ts).slice(0, 5);
  return (
    <>
      <div className="hero-b">
        <img className="bg" src={skyline} alt="" /><div className="sh" />
        <h1>{greeting()}, {first}</h1><p>Your legal journey, your control.</p>
        <form role="search" onSubmit={(e) => { e.preventDefault(); go(`/find-lawyers?q=${encodeURIComponent(q)}`); }} style={{ maxWidth: 520 }}>
          <div className="inp"><span className="inp-ic"><Ic n="search" size={18} /></span><input className="pl" style={{ borderRadius: 999, minHeight: 50, background: "#fff", paddingLeft: "2.8rem" }} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for lawyers, practice areas or locations…" aria-label="Search lawyers" /></div>
        </form>
      </div>
      <div className="stats">
        <Stat label="Upcoming consultations" value={upcoming.length} sub={upcoming[0] ? "next " + new Date(upcoming[0].date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "none scheduled"} icon="calendar" />
        <Stat label="Active cases" value={cases.length} sub="in progress" icon="briefcase" />
        <Stat label="Saved lawyers" value={saved.length} sub="shortlist" icon="heart" />
        <Stat label="Unread messages" value={unread} sub={unread ? "waiting for you" : "all read"} icon="message" />
      </div>
      <div className="cols-2" style={{ marginTop: "2.4rem" }}>
        <Section title="Upcoming appointments" action={<Link to="/user/appointments" className="link-btn">View all</Link>}>
          {upcoming.length ? <div className="rows">{upcoming.slice(0, 3).map((a) => <ApptRow key={a.id} a={a} role="user" onOpen={(x) => { setRoom(false); setSel(x.id); }}>{a.status === "confirmed" && <Button size="sm" icon="video" onClick={() => { setRoom(true); setSel(a.id); }}>Join</Button>}</ApptRow>)}</div>
            : <EmptyState icon="calendar" title="No upcoming appointments" text="Book a consultation with a verified lawyer in a few minutes." action="Find a lawyer" to="/find-lawyers" />}
        </Section>
        <Section title="Recommended lawyers" action={<Link to="/find-lawyers" className="link-btn">Browse all</Link>}><div className="rows">{rec.map((l) => <LawyerMini key={l.id} l={l} />)}</div></Section>
      </div>
      <div className="cols-2" style={{ marginTop: ".6rem" }}>
        <Section title="Case status" action={<Link to="/user/cases" className="link-btn">All cases</Link>}>
          {cases.length ? <div className="rows">{cases.map((c) => <div key={c.id} className="row" style={{ flexWrap: "wrap" }}><div className="row-main"><b>{c.title}</b><small>{c.number} · {STAGES[c.stage]}</small></div><div style={{ width: 140 }}><div className="bar"><i style={{ width: `${((c.stage + 1) / 5) * 100}%` }} /></div><small className="muted" style={{ fontSize: ".72rem" }}>Stage {c.stage + 1} of 5</small></div><Button to={`/user/cases?c=${c.id}`} variant="outline" size="sm">Open</Button></div>)}</div> : <p className="muted">No active cases. A lawyer opens a case for you after your consultation.</p>}
        </Section>
        <Section title="Recent activity">
          <ul className="timeline" style={{ marginTop: ".4rem" }}>{activity.map((n) => <li key={n.id} className={n.read ? "done" : "now"}><b>{n.title}</b><small>{n.body} · {ago(n.ts)}</small></li>)}{!activity.length && <li className="muted">Nothing yet.</li>}</ul>
        </Section>
      </div>
      <Section title="Quick actions"><div className="qa"><Link to="/find-lawyers"><Ic n="search" />Find a lawyer</Link><Link to="/user/messages"><Ic n="message" />Open messages</Link><Link to="/user/cases"><Ic n="upload" />Upload a document</Link><Link to="/user/payments"><Ic n="wallet" />View invoices</Link><Link to="/contact"><Ic n="help" />Get help</Link></div></Section>
      {sel && <ApptDetail id={sel} role="user" onClose={() => { setSel(null); setRoom(false); }} autoRoom={room} />}
    </>
  );
}
