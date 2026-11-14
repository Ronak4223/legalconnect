import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../state/store.jsx";
import { Stat, Section, StatusBadge, EmptyState, Stepper } from "../../ui/Misc.jsx";
import { AreaChart, Spark } from "../../ui/Charts.jsx";
import { Button } from "../../ui/Button.jsx";
import { Ic } from "../../ui/Icons.jsx";
import { ApptRow, ApptDetail } from "../shared/Appointments.jsx";
import { lawyerMoney, clientsOf, nextAppt } from "../../state/selectors.js";
import { money, greeting, ago } from "../../utils/format.js";
import { useTitle } from "../../hooks.js";

const VSTEPS = ["Identity", "Bar Council", "Credentials", "Final review"];
export default function LawyerDashboard() {
  useTitle("Dashboard");
  const { state, session, account, lawyer, actions } = useApp();
  const [sel, setSel] = useState(null); const [room, setRoom] = useState(false);
  const me = session.id, first = (account?.name || "").split(" ")[0];
  const appts = state.appointments.filter((a) => a.lawyerId === me);
  const pending = appts.filter((a) => a.status === "pending"), upcoming = nextAppt(appts.filter((a) => a.status === "confirmed"));
  const cases = state.cases.filter((c) => c.lawyerId === me && c.status === "active"), clients = clientsOf(state, me), money_ = lawyerMoney(state, me);
  const diff = money_.pace;
  const activity = state.notifications.filter((n) => n.to === me).sort((a, b) => b.ts - a.ts).slice(0, 5);
  const verified = lawyer?.verification === "verified";
  return (
    <>
      <div className="ph"><div><p className="eyebrow">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p><h1>{greeting()}, {first}</h1><p>Here’s what’s happening in your practice today.</p></div>
        <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}><Button to="/lawyer/profile" variant="outline" icon="id">View my profile</Button><Button to="/lawyer/appointments" icon="calendar">Manage appointments</Button></div></div>
      <div className="panel" style={{ padding: "1.2rem 1.4rem", marginBottom: "1.8rem", display: "grid", gap: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: ".8rem", alignItems: "center" }}><span className="opt-ic" style={{ background: verified ? "#dcefe5" : "#fbeccd", color: verified ? "#17633f" : "#7d5410" }}><Ic n="shield" size={20} /></span><div><b style={{ fontWeight: 500 }}>{verified ? "Verified advocate" : "Verification in review"}</b><div className="muted" style={{ fontSize: ".82rem" }}>{verified ? "Your Bar Council enrolment is verified. The badge shows on your public profile." : "We’re checking your enrolment and documents — usually 1–2 working days. You can use the dashboard meanwhile."}</div></div></div>
          <StatusBadge status={verified ? "verified" : "in_review"} />
        </div>
        {!verified && <Stepper steps={VSTEPS} current={2} />}
      </div>
      <div className="stats">
        <Stat label="Total clients" value={clients.length} sub="across all matters" icon="users" />
        <Stat label="Upcoming consultations" value={upcoming.length} sub={`${pending.length} awaiting reply`} icon="calendar" />
        <Stat label="Active cases" value={cases.length} sub="in progress" icon="briefcase" />
        <Stat label="Earnings this month" value={money(money_.thisMonth)} trend={diff ? `${diff > 0 ? "+" : ""}${diff}%` : undefined} sub="on pace vs last month" icon="rupee" spark={<Spark data={money_.monthly.slice(-7).map((m) => m.value)} />} />
      </div>
      <div className="cols-2" style={{ marginTop: "2.4rem" }}>
        <div>
          <Section title={`New requests${pending.length ? ` (${pending.length})` : ""}`} className="" action={<Link to="/lawyer/appointments" className="link-btn">All appointments</Link>}>
            {pending.length ? <div className="rows">{pending.slice(0, 3).map((a) => <ApptRow key={a.id} a={a} role="lawyer" onOpen={(x) => { setRoom(false); setSel(x.id); }}><Button size="sm" onClick={() => { actions.setAppt(a.id, "accept"); actions.toast("Appointment accepted. The client has been notified."); }}>Accept</Button></ApptRow>)}</div> : <p className="muted" style={{ fontSize: ".9rem" }}>No pending requests. New booking requests appear here.</p>}
          </Section>
          <Section title="Upcoming consultations">
            {upcoming.length ? <div className="rows">{upcoming.slice(0, 4).map((a) => <ApptRow key={a.id} a={a} role="lawyer" onOpen={(x) => { setRoom(false); setSel(x.id); }}><Button size="sm" icon="video" onClick={() => { setRoom(true); setSel(a.id); }}>Join</Button></ApptRow>)}</div> : <EmptyState icon="calendar" title="Nothing scheduled" text="Confirmed consultations appear here." />}
          </Section>
        </div>
        <div>
          <Section title="Earnings overview" action={<Link to="/lawyer/earnings" className="link-btn">Details</Link>}>
            <div className="panel"><AreaChart data={money_.monthly.slice(-6)} height={190} /><div style={{ display: "flex", justifyContent: "space-between", marginTop: ".6rem", fontSize: ".84rem" }}><span className="muted">Available to withdraw</span><b>{money(money_.available)}</b></div></div>
          </Section>
          <Section title="Recent activity"><ul className="timeline">{activity.map((n) => <li key={n.id} className={n.read ? "done" : "now"}><b>{n.title}</b><small>{n.body} · {ago(n.ts)}</small></li>)}{!activity.length && <li className="muted">Nothing yet.</li>}</ul></Section>
        </div>
      </div>
      <Section title="Quick actions"><div className="qa"><Link to="/lawyer/profile?tab=availability"><Ic n="clock" />Set availability</Link><Link to="/lawyer/messages"><Ic n="message" />Reply to clients</Link><Link to="/lawyer/cases"><Ic n="briefcase" />Open cases</Link><Link to="/lawyer/clients"><Ic n="users" />Client list</Link><Link to="/lawyer/profile"><Ic n="edit" />Edit profile</Link></div></Section>
      {sel && <ApptDetail id={sel} role="lawyer" onClose={() => { setSel(null); setRoom(false); }} autoRoom={room} />}
    </>
  );
}
