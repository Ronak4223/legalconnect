import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApp } from "../../state/store.jsx";
import { StatusBadge, Avatar, LawyerPhoto, Tabs, EmptyState, Stepper } from "../../ui/Misc.jsx";
import { Button } from "../../ui/Button.jsx";
import { Modal } from "../../ui/Overlay.jsx";
import { TextField, TextArea, SelectField } from "../../ui/Field.jsx";
import { Ic } from "../../ui/Icons.jsx";
import { STAGES, AREAS } from "../../data/demo.js";
import { personName, lawyerById, clientsOf } from "../../state/selectors.js";
import { dateLong, dateShort, relDay, iso } from "../../utils/format.js";

export default function CasesView({ role }) {
  const { state, session, actions } = useApp();
  const [sp, setSp] = useSearchParams(); const sel = sp.get("c");
  const [tab, setTab] = useState("active"); const [note, setNote] = useState(""); const [dl, setDl] = useState({ label: "", date: "" }); const [nw, setNw] = useState(false); const [form, setForm] = useState({ clientId: "", title: "", category: "" });
  const fileRef = useRef(null);
  const mine = useMemo(() => state.cases.filter((c) => (role === "user" ? c.userId === session.id : c.lawyerId === session.id)).sort((a, b) => b.opened.localeCompare(a.opened)), [state.cases, role, session.id]);
  const list = mine.filter((c) => c.status === tab);
  const cur = mine.find((c) => c.id === sel);
  useEffect(() => { if (cur && cur.status !== tab) setTab(cur.status); }, [sel]); // eslint-disable-line
  const who = (c) => (role === "user" ? lawyerById(state, c.lawyerId)?.name : personName(state, c.userId));
  const open = (id) => setSp({ c: id }, { replace: true });
  const counts = { active: mine.filter((c) => c.status === "active").length, closed: mine.filter((c) => c.status === "closed").length };
  const create = () => { if (!form.clientId || form.title.trim().length < 4 || !form.category) { actions.toast("Choose a client, add a title and pick a category.", "err"); return; } const id = actions.createCase({ ...form, title: form.title.trim() }); setNw(false); setForm({ clientId: "", title: "", category: "" }); open(id); actions.toast("Case opened."); };
  return (
    <>
      <div className={`split ${cur ? "has-sel" : ""}`}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".8rem", gap: ".6rem" }}>
            <Tabs value={tab} onChange={setTab} label="Case status" tabs={[{ value: "active", label: "Active", count: counts.active }, { value: "closed", label: "Completed", count: counts.closed }]} />
            {role === "lawyer" && <Button size="sm" icon="plus" onClick={() => setNw(true)}>New</Button>}
          </div>
          <div className="split-list" style={{ position: "static", maxHeight: "none" }} role="list">
            {list.map((c) => <button type="button" key={c.id} role="listitem" className={`li-item ${cur?.id === c.id ? "on" : ""}`} onClick={() => open(c.id)}><b>{c.title}</b><small>{c.number} · {who(c)}</small><div className="bar" style={{ marginTop: ".6rem" }}><i style={{ width: `${((c.stage + 1) / 5) * 100}%` }} /></div><small style={{ display: "block", marginTop: ".3rem" }}>{STAGES[c.stage]}{c.next ? ` · next: ${dateShort(c.next.date)}` : ""}</small></button>)}
            {!list.length && <EmptyState icon="briefcase" title={tab === "active" ? "No active cases" : "No completed cases"} text={role === "user" ? "When a lawyer opens a case for you, it appears here." : "Open a case from the New button."} />}
          </div>
        </div>
        <div className="split-detail">
          {cur ? <CaseDetail c={cur} role={role} who={who(cur)} back={() => setSp({}, { replace: true })} onNote={(t) => { actions.addNote(cur.id, t); setNote(""); actions.toast("Note added."); }} note={note} setNote={setNote} dl={dl} setDl={setDl} fileRef={fileRef} /> : <div className="panel"><EmptyState icon="briefcase" title="Select a case" text="Choose a case to see its progress, documents and notes." /></div>}
        </div>
      </div>
      <Modal open={nw} onClose={() => setNw(false)} size="sm" title="Open a new case" footer={<><Button variant="ghost" onClick={() => setNw(false)}>Cancel</Button><Button onClick={create}>Open case</Button></>}>
        <div style={{ display: "grid", gap: "1rem" }}>
          <SelectField label="Client" required value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} placeholder="Choose a client" options={clientsOf(state, session.id).map((x) => ({ value: x.id, label: x.name }))} />
          <TextField label="Case title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Tenancy dispute" />
          <SelectField label="Category" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Choose a category" options={AREAS} />
        </div>
      </Modal>
    </>
  );
}

function CaseDetail({ c, role, who, back, onNote, note, setNote, dl, setDl, fileRef }) {
  const { state, actions } = useApp();
  const l = lawyerById(state, c.lawyerId);
  const days = c.next ? Math.round((new Date(c.next.date) - new Date(iso(new Date()))) / 86400000) : null;
  return (
    <article>
      <button type="button" className="btn btn-ghost btn-sm back-m" onClick={back} style={{ marginBottom: ".8rem" }}><Ic n="arrowL" size={15} />All cases</button>
      <header style={{ display: "flex", gap: "1rem", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div><p className="eyebrow">{c.number} · {c.category}</p><h2 className="h-lg" style={{ margin: ".4rem 0" }}>{c.title}</h2>
          <div style={{ display: "flex", gap: ".6rem", alignItems: "center" }}>{role === "user" && l ? <LawyerPhoto l={l} size={30} /> : <Avatar name={who || ""} size={30} />}<span className="muted" style={{ fontSize: ".88rem" }}>{role === "user" ? `Adv. ${who}` : who}</span></div></div>
        <StatusBadge status={c.status === "closed" ? "completed" : "active"}>{c.status === "closed" ? "Completed" : "In progress"}</StatusBadge>
      </header>
      <p className="muted" style={{ lineHeight: 1.7, maxWidth: "62ch" }}>{c.summary}</p>
      <div style={{ margin: "1.6rem 0" }}><Stepper steps={STAGES} current={c.stage + (c.status === "closed" ? 1 : 0)} /></div>
      {role === "lawyer" && c.status === "active" && (
        <div className="panel" style={{ display: "flex", gap: ".8rem", alignItems: "end", flexWrap: "wrap", padding: "1rem 1.2rem", marginBottom: "1rem" }}>
          <SelectField label="Case stage" value={String(c.stage)} onChange={(e) => { actions.setStage(c.id, Number(e.target.value)); actions.toast("Stage updated. The client has been notified."); }} options={STAGES.map((s, i) => ({ value: String(i), label: `${i + 1}. ${s}` }))} />
          {c.stage < STAGES.length - 1 && <Button variant="soft" iconRight="arrowR" onClick={() => { actions.setStage(c.id, c.stage + 1); actions.toast(`Moved to ${STAGES[c.stage + 1]}.`); }}>Advance to {STAGES[c.stage + 1]}</Button>}
        </div>)}
      <div className="cols-2 even" style={{ gap: "2rem", marginTop: ".6rem" }}>
        <section>
          <h3 className="h-md" style={{ marginBottom: ".8rem" }}>Progress</h3>
          <ol className="timeline">{STAGES.map((s, i) => <li key={s} className={i < c.stage || (c.status === "closed" && i <= c.stage) ? "done" : i === c.stage ? "now" : ""}><b>{s}</b><small>{c.stageDates[i] ? dateLong(c.stageDates[i]) : "Upcoming"}</small></li>)}</ol>
          <h3 className="h-md" style={{ margin: "1.6rem 0 .6rem" }}>Important dates</h3>
          {c.deadlines.length ? <ul className="rows" style={{ listStyle: "none", margin: 0, padding: 0 }}>{c.deadlines.map((d) => <li key={d.id} className="row" style={{ padding: ".7rem 0" }}><Ic n="calendar" size={17} /><div className="row-main"><b style={{ fontWeight: 500, fontSize: ".9rem" }}>{d.label}</b><small>{dateLong(d.date)}</small></div><span className="pill-tag">{relDay(d.date)}</span></li>)}</ul> : <p className="muted" style={{ fontSize: ".88rem" }}>No upcoming dates.</p>}
          {role === "lawyer" && c.status === "active" && <form onSubmit={(e) => { e.preventDefault(); if (!dl.label.trim() || !dl.date) { actions.toast("Add a label and a date.", "err"); return; } actions.addDeadline(c.id, dl.label.trim(), dl.date); setDl({ label: "", date: "" }); actions.toast("Deadline added."); }} style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginTop: ".8rem" }}><TextField label="" aria-label="Deadline label" placeholder="Add a deadline" value={dl.label} onChange={(e) => setDl({ ...dl, label: e.target.value })} /><TextField label="" aria-label="Deadline date" type="date" value={dl.date} onChange={(e) => setDl({ ...dl, date: e.target.value })} /><Button type="submit" variant="outline" size="sm" icon="plus" className="">Add</Button></form>}
        </section>
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".8rem" }}><h3 className="h-md">Documents</h3>
            <><input ref={fileRef} type="file" className="sr-only" aria-label="Upload a document" onChange={(e) => { const f = e.target.files?.[0]; if (f) { actions.addDoc(c.id, f); actions.toast(`${f.name} added (demo — not uploaded).`); e.target.value = ""; } }} /><Button variant="outline" size="sm" icon="upload" onClick={() => fileRef.current?.click()}>Upload</Button></></div>
          <ul className="rows" style={{ listStyle: "none", margin: 0, padding: 0 }}>{c.docs.map((d) => <li key={d.id} className="row" style={{ padding: ".7rem 0" }}><Ic n="file" size={18} /><div className="row-main"><b style={{ fontWeight: 500, fontSize: ".9rem", overflowWrap: "anywhere" }}>{d.name}</b><small>{d.size} · {d.by} · {dateShort(d.date)}</small></div><Button variant="ghost" size="sm" icon="download" aria-label={`Download ${d.name}`} onClick={() => actions.toast("Downloads are simulated in this demo.")} /></li>)}{!c.docs.length && <li className="muted" style={{ fontSize: ".88rem" }}>No documents yet.</li>}</ul>
          <h3 className="h-md" style={{ margin: "1.8rem 0 .8rem" }}>Notes</h3>
          <form onSubmit={(e) => { e.preventDefault(); if (note.trim().length < 3) return; onNote(note.trim()); }} style={{ display: "grid", gap: ".6rem" }}><TextArea label="" aria-label="Add a note" rows={2} placeholder={role === "lawyer" ? "Add a case note (visible to the client)" : "Add a note for your lawyer"} value={note} onChange={(e) => setNote(e.target.value)} /><div><Button type="submit" size="sm" disabled={note.trim().length < 3}>Add note</Button></div></form>
          <div style={{ marginTop: ".6rem" }}>{c.notes.map((n) => <div key={n.id} className="review" style={{ padding: "1rem 0" }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: ".8rem" }}><b style={{ fontWeight: 500 }}>{n.by === "lawyer" ? "Lawyer" : "Client"}</b><span className="muted">{dateShort(n.date)}</span></div><p style={{ marginTop: ".3rem" }}>{n.text}</p></div>)}</div>
        </section>
      </div>
    </article>
  );
}
