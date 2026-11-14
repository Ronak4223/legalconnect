import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Modal } from "../../ui/Overlay.jsx";
import { Button } from "../../ui/Button.jsx";
import { OptionCards, SelectField, TextArea, TextField } from "../../ui/Field.jsx";
import { Stepper, LawyerPhoto } from "../../ui/Misc.jsx";
import { Ic } from "../../ui/Icons.jsx";
import { SlotPicker } from "./SlotPicker.jsx";
import { useApp } from "../../state/store.jsx";
import { FEE_BY_TYPE } from "../../data/demo.js";
import { money, dateLong, time12, endTime } from "../../utils/format.js";
import { useGo } from "../../hooks.js";
import scales from "@shared/assets/img/scales-gold.webp";

const STEPS = ["Consultation", "Date & time", "Payment", "Confirmed"];
const TOPICS = { "Family Law": ["Divorce or separation", "Child custody", "Maintenance", "Other family matter"], "Criminal Law": ["Bail or arrest", "FIR / complaint", "Defence strategy", "Other criminal matter"], "Civil Law": ["Money recovery", "Contract dispute", "Tenancy", "Other civil matter"], "Corporate Law": ["Company formation", "Shareholder agreement", "Compliance", "Other business matter"], "Property Law": ["Title check", "Sale / purchase", "Rental agreement", "Other property matter"], "Employment Law": ["Termination", "Employment contract", "Workplace issue", "Other employment matter"] };

export default function BookingFlow({ lawyer, open, onClose }) {
  const { state, session, actions } = useApp();
  const go = useGo(); const loc = useLocation();
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ type: "video", topic: "", notes: "", date: "", time: "", method: "upi", upi: "", card: "", exp: "", cvv: "" });
  const [err, setErr] = useState({}); const [busy, setBusy] = useState(false); const [done, setDone] = useState(null);
  useEffect(() => { if (open) { setStep(0); setDone(null); setErr({}); } }, [open]);
  const set = (k) => (v) => setF((x) => ({ ...x, [k]: v && v.target ? v.target.value : v }));
  const fee = Math.round(lawyer.fee * FEE_BY_TYPE[f.type]);
  const topics = TOPICS[lawyer.area] || ["General question"];

  if (!session || session.role !== "user") {
    return (
      <Modal open={open} onClose={onClose} title="Sign in to book" subtitle={`Consultation with ${lawyer.name}`} size="sm">
        <p className="muted" style={{ marginTop: 0 }}>{session ? "You are signed in as a lawyer. Booking is a client feature — sign out and use a client account." : "Create a free demo account or sign in to book a consultation."}</p>
        <div style={{ display: "grid", gap: ".6rem", marginTop: "1rem" }}>
          {session ? <Button variant="outline" onClick={() => { actions.logout(); }}>Sign out</Button> : <>
            <Button to="/login/user" state={{ from: loc.pathname + "?book=1" }}>Client log in</Button>
            <Button to="/register/user" variant="outline">Create client account</Button>
            <button type="button" className="link-btn" style={{ marginTop: ".4rem" }} onClick={() => { actions.loginDemo("user"); actions.toast("Signed in as the demo client, Ananya Desai."); }}>Or continue as the demo client</button></>}
        </div>
      </Modal>
    );
  }
  const next = () => {
    const e = {};
    if (step === 0 && !f.topic) e.topic = "Choose what you need help with";
    if (step === 1) { if (!f.date) e.date = "Choose a date"; else if (!f.time) e.date = "Choose a time"; }
    if (step === 2) {
      if (f.method === "upi" && !/^[\w.\-]{2,}@[a-z]{2,}$/i.test(f.upi.trim())) e.upi = "Enter a UPI ID like name@bank";
      if (f.method === "card") { if (f.card.replace(/\s/g, "").length !== 16) e.card = "Enter a 16-digit card number"; if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(f.exp)) e.exp = "MM/YY"; if (!/^\d{3}$/.test(f.cvv)) e.cvv = "3 digits"; }
    }
    setErr(e); if (Object.keys(e).length) return;
    if (step === 2) { setBusy(true); setTimeout(() => { const a = actions.book({ lawyerId: lawyer.id, type: f.type, date: f.date, time: f.time, topic: f.topic, notes: f.notes, method: { upi: "UPI", card: "Card •••• " + f.card.replace(/\s/g, "").slice(-4), net: "Net banking" }[f.method] }); setDone(a); setBusy(false); setStep(3); }, 900); return; }
    setStep(step + 1);
  };
  return (
    <Modal open={open} onClose={onClose} size="lg" title={step === 3 ? "" : `Book ${lawyer.name}`} subtitle={step === 3 ? undefined : `${lawyer.area} · ${lawyer.city}`}
      footer={step === 3 ? null : <>{step > 0 && <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>}<Button iconRight={step === 2 ? "lock" : "arrowR"} loading={busy} onClick={next}>{step === 2 ? `Pay ${money(fee)} (demo)` : "Continue"}</Button></>}>
      {step < 3 && <div style={{ margin: ".2rem 0 1.4rem" }}><Stepper steps={STEPS} current={step} /></div>}
      {step === 0 && (
        <div style={{ display: "grid", gap: "1.2rem" }}>
          <OptionCards name="Consultation type" value={f.type} onChange={set("type")} options={[
            { value: "video", icon: "video", title: "Video consultation", sub: "45 minutes · secure video room", right: money(Math.round(lawyer.fee)) },
            { value: "phone", icon: "phone", title: "Phone consultation", sub: "45 minutes · the lawyer calls you", right: money(Math.round(lawyer.fee * 0.8)) },
            { value: "in-person", icon: "building", title: "In-person meeting", sub: `At the lawyer’s office in ${lawyer.city}`, right: money(Math.round(lawyer.fee * 1.5)) }]} />
          <SelectField label="What do you need help with?" required value={f.topic} onChange={set("topic")} placeholder="Choose a topic" options={topics} error={err.topic} />
          <TextArea label="Anything the lawyer should know? (optional)" value={f.notes} onChange={set("notes")} max={400} />
        </div>)}
      {step === 1 && (<><SlotPicker lawyer={lawyer} appointments={state.appointments} date={f.date} time={f.time} onDate={set("date")} onTime={set("time")} />{err.date && <p className="err" role="alert" style={{ marginTop: ".8rem" }}>{err.date}</p>}</>)}
      {step === 2 && (
        <div className="cols-2" style={{ gap: "1.8rem" }}>
          <div style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
            <OptionCards name="Payment method" value={f.method} onChange={set("method")} options={[{ value: "upi", icon: "phone", title: "UPI", sub: "Pay with any UPI app" }, { value: "card", icon: "card", title: "Debit / credit card", sub: "Visa, Mastercard, RuPay" }, { value: "net", icon: "building", title: "Net banking", sub: "All major banks" }]} />
            {f.method === "upi" && <TextField label="UPI ID" placeholder="name@bank" value={f.upi} onChange={set("upi")} error={err.upi} />}
            {f.method === "card" && <div className="form-grid"><TextField className="full" label="Card number" inputMode="numeric" placeholder="4242 4242 4242 4242" value={f.card} onChange={(e) => setF((x) => ({ ...x, card: e.target.value.replace(/[^\d]/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim() }))} error={err.card} /><TextField label="Expiry" placeholder="MM/YY" value={f.exp} onChange={(e) => setF((x) => ({ ...x, exp: e.target.value.replace(/[^\d/]/g, "").slice(0, 5) }))} error={err.exp} /><TextField label="CVV" inputMode="numeric" placeholder="123" value={f.cvv} onChange={(e) => setF((x) => ({ ...x, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) }))} error={err.cvv} /></div>}
            <div className="demo-note"><Ic n="info" size={16} />Demonstration only — no real payment is taken and nothing is sent anywhere.</div>
          </div>
          <aside className="panel" style={{ alignSelf: "start" }}>
            <div style={{ display: "flex", gap: ".8rem", alignItems: "center", marginBottom: "1rem" }}><LawyerPhoto l={lawyer} size={48} /><div><b style={{ fontWeight: 500 }}>{lawyer.name}</b><div className="muted" style={{ fontSize: ".8rem" }}>{lawyer.area}</div></div></div>
            <dl className="dl"><dt>Type</dt><dd style={{ textTransform: "capitalize" }}>{f.type.replace("-", " ")}</dd><dt>Date</dt><dd>{dateLong(f.date)}</dd><dt>Time</dt><dd>{time12(f.time)} – {time12(endTime(f.time))}</dd><dt>Topic</dt><dd>{f.topic}</dd></dl>
            <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: "1rem 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Total</span><b className="serif" style={{ fontSize: "1.4rem", fontWeight: 500 }}>{money(fee)}</b></div>
          </aside>
        </div>)}
      {step === 3 && done && (
        <div style={{ textAlign: "center", margin: "-1.3rem -1.5rem -1.3rem" }}>
          <div style={{ position: "relative", padding: "3rem 1.5rem 2rem", color: "#fff", borderRadius: "20px 20px 0 0", overflow: "hidden" }}>
            <img src={scales} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(6,18,32,.2),rgba(6,18,32,.85))" }} />
            <div style={{ position: "relative" }}><span style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--gold)", color: "#0d2340", display: "inline-grid", placeItems: "center" }}><Ic n="check" size={30} /></span>
              <h2 className="h-lg" style={{ marginTop: "1rem" }}>Request sent</h2><p style={{ opacity: 0.85, maxWidth: "40ch", margin: ".5rem auto 0" }}>{lawyer.name} will confirm your consultation. We’ll notify you here as soon as they do.</p></div>
          </div>
          <div style={{ padding: "1.5rem" }}>
            <dl className="dl" style={{ justifyContent: "center", textAlign: "left", maxWidth: 360, margin: "0 auto 1.4rem" }}><dt>When</dt><dd>{dateLong(done.date)}, {time12(done.time)}</dd><dt>Type</dt><dd style={{ textTransform: "capitalize" }}>{done.type.replace("-", " ")}</dd><dt>Paid</dt><dd>{money(done.fee)} (demo)</dd><dt>Status</dt><dd>Awaiting confirmation</dd></dl>
            <div style={{ display: "flex", gap: ".6rem", justifyContent: "center", flexWrap: "wrap" }}><Button onClick={() => { onClose(); go("/user/appointments"); }}>View my appointments</Button><Button variant="outline" onClick={onClose}>Done</Button></div>
            {done.autoConfirmAt ? <p className="hint" style={{ marginTop: "1rem" }}>Demo: this lawyer will confirm in a few seconds.</p> : <p className="hint" style={{ marginTop: "1rem" }}>Demo tip: sign in as the lawyer (Aarav Mehta) to accept this request and watch the status update here.</p>}
          </div>
        </div>)}
    </Modal>
  );
}
