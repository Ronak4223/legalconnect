import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useApp } from "../../state/store.jsx";
import { StatusBadge, LawyerPhoto, Avatar } from "../../ui/Misc.jsx";
import { Button } from "../../ui/Button.jsx";
import { Modal, Confirm } from "../../ui/Overlay.jsx";
import { SelectField, TextArea } from "../../ui/Field.jsx";
import { Ic } from "../../ui/Icons.jsx";
import { SlotPicker } from "./SlotPicker.jsx";
import { InvoiceModal } from "./Invoice.jsx";
import { personName, lawyerById } from "../../state/selectors.js";
import { dateLong, dateShort, time12, endTime, money, fromIso } from "../../utils/format.js";
import { useGo } from "../../hooks.js";

const TYPE = { video: ["video", "Video consultation"], phone: ["phone", "Phone consultation"], "in-person": ["building", "In-person meeting"] };
export const apptOther = (s, a, role) => (role === "user" ? lawyerById(s, a.lawyerId) : null);

export function ApptRow({ a, role, onOpen, children }) {
  const { state } = useApp(); const d = fromIso(a.date);
  const l = lawyerById(state, a.lawyerId), who = role === "user" ? l?.name : personName(state, a.userId);
  return (
    <div className="row" style={{ alignItems: "center" }}>
      <div className="appt-d" aria-hidden="true"><b>{d.getDate()}</b><small>{d.toLocaleDateString("en-IN", { month: "short" })}</small></div>
      <div className="row-main">
        <b><button type="button" className="link-btn" style={{ textDecoration: "none", color: "inherit", font: "inherit", fontWeight: 500, textAlign: "left" }} onClick={() => onOpen(a)}>{a.topic}</button></b>
        <small>{role === "user" ? `Adv. ${who}` : who} · {time12(a.time)} – {time12(endTime(a.time))} · {TYPE[a.type][1].split(" ")[0]}</small>
      </div>
      <StatusBadge status={a.status} />
      <div className="row-act">{children}<Button variant="outline" size="sm" onClick={() => onOpen(a)}>Details</Button></div>
    </div>
  );
}

export function ApptDetail({ id, role, onClose, autoRoom }) {
  const { state, actions } = useApp(); const go = useGo();
  const a = state.appointments.find((x) => x.id === id);
  const [mode, setMode] = useState(""); const [reason, setReason] = useState(""); const [room, setRoom] = useState(!!autoRoom); const [inv, setInv] = useState(null);
  const [r, setR] = useState({ date: "", time: "" });
  useEffect(() => { setMode(""); setReason(""); setR({ date: "", time: "" }); setRoom(!!autoRoom); }, [id, autoRoom]);
  if (!a) return null;
  const l = lawyerById(state, a.lawyerId), client = personName(state, a.userId), pay = state.payments.find((p) => p.apptId === a.id);
  const live = ["pending", "confirmed"].includes(a.status);
  const who = role === "user" ? `Adv. ${l?.name}` : client;
  const rejectReasons = ["Not available at that time", "Outside my practice area", "Conflict of interest", "Other"];
  const cancelReasons = ["My plans changed", "Booked by mistake", "Found another lawyer", "Other"];
  return (
    <>
      <Modal open={!mode} onClose={onClose} size="md" title={a.topic} subtitle={`${who} · ${dateLong(a.date)}`}
        footer={<>
          {role === "lawyer" && a.status === "pending" && <><Button variant="danger" onClick={() => setMode("reject")}>Decline</Button><Button onClick={() => { actions.setAppt(a.id, "accept"); actions.toast("Appointment accepted. The client has been notified."); }}>Accept</Button></>}
          {live && <Button variant="outline" onClick={() => setMode("reschedule")}>Reschedule</Button>}
          {live && !(role === "lawyer" && a.status === "pending") && <Button variant="ghost" onClick={() => setMode("cancel")}>Cancel</Button>}
          {role === "lawyer" && a.status === "confirmed" && <Button variant="soft" icon="checkC" onClick={() => { actions.setAppt(a.id, "complete"); actions.toast("Marked as completed."); }}>Mark completed</Button>}
          {a.status === "confirmed" && <Button icon="video" onClick={() => setRoom(true)}>Join meeting</Button>}
          {a.status === "completed" && pay && <Button variant="outline" icon="file" onClick={() => setInv(pay.id)}>Invoice</Button>}
          {a.status === "completed" && role === "user" && l && <Button onClick={() => { onClose(); go(`/lawyer/${l.id}#reviews`); }}>Leave a review</Button>}
        </>}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.2rem" }}>
          {role === "user" && l ? <LawyerPhoto l={l} size={56} /> : <Avatar name={client} size={56} />}
          <div style={{ flex: 1 }}><b style={{ fontWeight: 500 }}>{who}</b><div className="muted" style={{ fontSize: ".84rem" }}>{role === "user" ? `${l?.area} · ${l?.city}` : "Client"}</div></div><StatusBadge status={a.status} />
        </div>
        <dl className="dl">
          <dt>Type</dt><dd>{TYPE[a.type][1]}</dd><dt>Date</dt><dd>{dateLong(a.date)}</dd><dt>Time</dt><dd>{time12(a.time)} – {time12(endTime(a.time))}</dd>
          <dt>Fee</dt><dd>{money(a.fee)}{pay ? <> · <StatusBadge status={pay.status} /></> : null}</dd>
          {a.notes && <><dt>Notes</dt><dd>{a.notes}</dd></>}{a.reason && <><dt>Reason</dt><dd>{a.reason}</dd></>}
        </dl>
        {a.status === "pending" && role === "user" && <div className="demo-note" style={{ marginTop: "1.2rem" }}><Ic n="clock" size={16} />Awaiting confirmation. {a.autoConfirmAt ? "In this demo the lawyer confirms within seconds." : "Demo tip: sign in as the lawyer (Aarav Mehta) to accept this request."}</div>}
        {role === "user" && l && <p style={{ marginTop: "1rem" }}><Link to={`/lawyer/${l.id}`} className="link-btn">View lawyer profile</Link></p>}
      </Modal>
      <Modal open={mode === "reschedule"} onClose={() => setMode("")} size="md" title="Reschedule" subtitle={role === "user" ? "The lawyer will need to confirm the new time." : "The client will be notified."}
        footer={<><Button variant="ghost" onClick={() => setMode("")}>Back</Button><Button disabled={!r.date || !r.time} onClick={() => { actions.setAppt(a.id, "reschedule", r); actions.toast(`Moved to ${dateShort(r.date)}, ${time12(r.time)}.`); setMode(""); onClose(); }}>Confirm new time</Button></>}>
        {l && <SlotPicker lawyer={l} appointments={state.appointments} ignoreId={a.id} date={r.date} time={r.time} onDate={(d) => setR((x) => ({ ...x, date: d }))} onTime={(t) => setR((x) => ({ ...x, time: t }))} />}
      </Modal>
      <Confirm open={mode === "cancel"} onClose={() => setMode("")} danger confirm="Cancel appointment" title="Cancel this appointment?" onConfirm={() => { actions.setAppt(a.id, "cancel", { reason: reason || "Cancelled" }); actions.toast("Appointment cancelled. Payment refunded (demo)."); onClose(); }}>
        <SelectField label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Choose a reason" options={cancelReasons} />
      </Confirm>
      <Confirm open={mode === "reject"} onClose={() => setMode("")} danger confirm="Decline request" title="Decline this request?" onConfirm={() => { actions.setAppt(a.id, "reject", { reason: reason || "Not available" }); actions.toast("Request declined. The client will be refunded."); onClose(); }}>
        <SelectField label="Reason (shared with the client)" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Choose a reason" options={rejectReasons} />
      </Confirm>
      {room && <ConsultationRoom a={a} role={role} onClose={() => setRoom(false)} />}
      <InvoiceModal id={inv} onClose={() => setInv(null)} />
    </>
  );
}

/** Full-screen video room (a simulation: there is no live video). Mirrors the supplied consultation reference. */
export function ConsultationRoom({ a, role, onClose }) {
  const { state, actions } = useApp();
  const l = lawyerById(state, a.lawyerId), c = state.cases.find((x) => x.lawyerId === a.lawyerId && x.userId === a.userId);
  const [sec, setSec] = useState(0); const [mic, setMic] = useState(true); const [cam, setCam] = useState(true);
  const [chat, setChat] = useState([{ f: "other", t: role === "user" ? "Hello, I can hear you well. Shall we start?" : "Hello Advocate, ready when you are." }]); const [msg, setMsg] = useState("");
  useEffect(() => { const t = setInterval(() => setSec((x) => x + 1), 1000); document.documentElement.classList.add("no-scroll"); const k = (e) => e.key === "Escape" && onClose(); document.addEventListener("keydown", k); return () => { clearInterval(t); document.documentElement.classList.remove("no-scroll"); document.removeEventListener("keydown", k); }; }, [onClose]);
  const clock = `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
  const send = (e) => { e.preventDefault(); if (!msg.trim()) return; setChat((x) => [...x, { f: "me", t: msg.trim() }]); setMsg(""); setTimeout(() => setChat((x) => [...x, { f: "other", t: "Noted — let’s cover that next." }]), 1400); };
  const person = role === "user" ? l?.name : personName(state, a.userId);
  return createPortal(
    <div className="room" role="dialog" aria-modal="true" aria-label="Consultation room">
      <div className="room-h"><span className="t">LEGAL CONNECT</span><span aria-label="Call duration" style={{ color: "var(--gold)", fontFamily: "Lora Variable,serif", fontSize: "1.5rem" }}>{clock}</span></div>
      <div className="room-v">
        {role === "user" && l ? <LawyerPhoto l={l} ratio="auto" hero zoom={l.src ? 0.5 : 0.32} style={{ width: "100%", height: "100%", borderRadius: 0, filter: cam ? "none" : "brightness(.2)" }} label={`${l.name} on video`} /> : <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: "#0b1a2b" }}><Avatar name={person || ""} size={140} /></div>}
        <div style={{ position: "absolute", left: "1rem", bottom: "1rem", background: "rgba(0,0,0,.55)", padding: ".35rem .8rem", borderRadius: 99, fontSize: ".85rem" }}>{role === "user" ? `Adv. ${person}` : person}</div>
        <div className="self"><div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: "#14283d" }}><Avatar name="You" size={54} /></div></div>
        <div style={{ position: "absolute", top: "1rem", left: "1rem", background: "rgba(0,0,0,.55)", padding: ".35rem .8rem", borderRadius: 99, fontSize: ".74rem" }}>Demo room — no live video</div>
      </div>
      <aside className="room-s">
        <div><h4>Documents</h4><div style={{ display: "flex", gap: ".7rem", flexWrap: "wrap" }}>{(c?.docs?.slice(0, 2) || [{ name: "Contract Draft_v3.pdf" }, { name: "NDA_Template.docx" }]).map((d) => <div key={d.name} style={{ width: 118, background: "#fff", color: "#0d2340", borderRadius: 8, padding: ".7rem", fontSize: ".68rem", minHeight: 120 }}><b style={{ fontSize: ".64rem", overflowWrap: "anywhere" }}>{d.name}</b><div style={{ marginTop: ".5rem", display: "grid", gap: 4 }}>{[90, 80, 95, 70, 85, 60].map((w, i) => <i key={i} style={{ height: 3, width: `${w}%`, background: "#cfd6df", display: "block" }} />)}</div></div>)}</div></div>
        <div><h4>Case notes</h4><ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: ".88rem", lineHeight: 1.6, color: "rgba(255,255,255,.85)" }}>{(c?.notes?.slice(0, 3).map((n) => n.text) || ["Client's primary concern noted.", "Key documents submitted.", "Next step: draft response."]).map((t) => <li key={t}>{t}</li>)}</ul></div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 160 }}><h4>Chat</h4>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: ".5rem", overflow: "auto" }}>{chat.map((m, i) => <div key={i} style={{ alignSelf: m.f === "me" ? "flex-end" : "flex-start", background: m.f === "me" ? "#1c6b73" : "rgba(255,255,255,.12)", padding: ".5rem .8rem", borderRadius: 14, fontSize: ".84rem", maxWidth: "88%" }}>{m.t}</div>)}</div>
          <form onSubmit={send} style={{ display: "flex", gap: ".4rem", marginTop: ".6rem" }}><input value={msg} onChange={(e) => setMsg(e.target.value)} aria-label="Chat message" placeholder="Type a message…" style={{ flex: 1, borderRadius: 99, border: "1px solid rgba(255,255,255,.2)", background: "rgba(255,255,255,.08)", color: "#fff", padding: ".6rem .9rem", font: "inherit", fontSize: ".85rem" }} /><button type="submit" className="icon-btn" style={{ background: "#1c6b73", color: "#fff" }} aria-label="Send"><Ic n="send" size={16} /></button></form></div>
      </aside>
      <div className="room-c">
        <button type="button" className={mic ? "on" : "off"} aria-pressed={mic} aria-label={mic ? "Mute microphone" : "Unmute microphone"} onClick={() => setMic(!mic)}><Ic n="mic" size={22} /></button>
        <button type="button" className={cam ? "on" : "off"} aria-pressed={cam} aria-label={cam ? "Turn camera off" : "Turn camera on"} onClick={() => setCam(!cam)}><Ic n="video" size={22} /></button>
        <button type="button" aria-label="Share a file" onClick={() => actions.toast("File sharing is simulated in this demo.")}><Ic n="upload" size={22} /></button>
        <button type="button" aria-label="Share screen" onClick={() => actions.toast("Screen sharing is simulated in this demo.")}><Ic n="share" size={22} /></button>
        <button type="button" className="end" onClick={onClose}>End Call</button>
      </div>
    </div>, document.body);
}
