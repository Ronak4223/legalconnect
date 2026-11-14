import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthShell } from "../../layouts/AuthLayout.jsx";
import { TextField, PasswordField, PhoneField, SelectField, TextArea, Chips, FileDrop, Check } from "../../ui/Field.jsx";
import { Button } from "../../ui/Button.jsx";
import { Stepper } from "../../ui/Misc.jsx";
import { Ic } from "../../ui/Icons.jsx";
import { useApp } from "../../state/store.jsx";
import { AREAS, CITIES, LANGS, BAR_COUNCILS, QUALS } from "../../data/demo.js";
import { validate, rules } from "../../utils/validate.js";
import { fileToDataURL } from "../../utils/image.js";
import { useGo } from "../../hooks.js";
import { homeFor } from "../../routes.js";
import laptop from "@shared/assets/img/dashboard-laptop.webp";

const STEPS = ["Personal", "Professional", "Documents", "Review"];
const DRAFT = "lc-lawyer-draft";
const blank = { name: "", email: "", phone: "", password: "", confirm: "", barNo: "", council: "", quals: [], exp: "", areas: [], city: "", fee: "", langs: ["English"], bio: "", terms: false };
const SCHEMA = [
  (v) => ({ name: rules.name, email: rules.email, phone: rules.phone, password: rules.password, confirm: rules.match(v.password) }),
  () => ({ barNo: rules.barNo, council: rules.required, quals: rules.nonEmptyList("Choose at least one qualification"), exp: rules.min(0, "Enter your years of experience"), areas: rules.nonEmptyList("Choose at least one practice area"), city: rules.required, fee: rules.min(500, "Minimum fee is ₹500"), bio: rules.minLen(80, "Write at least 80 characters about your practice") }),
  () => ({}), () => ({}),
];
export default function RegisterLawyer() {
  const { session, actions } = useApp(); const go = useGo();
  const [step, setStep] = useState(0);
  const [f, setF] = useState(() => { try { return { ...blank, ...JSON.parse(sessionStorage.getItem(DRAFT) || "{}"), password: "", confirm: "", terms: false }; } catch { return blank; } });
  const [files, setFiles] = useState({ photo: null, bar: null, id: null, degree: null });
  const [err, setErr] = useState({}); const [busy, setBusy] = useState(false); const [fail, setFail] = useState("");
  useEffect(() => { const { password, confirm, terms, ...rest } = f; try { sessionStorage.setItem(DRAFT, JSON.stringify(rest)); } catch { /* ignore */ } }, [f]);
  useEffect(() => { document.getElementById("main")?.scrollIntoView({ block: "start" }); }, [step]);
  if (session?.role === "lawyer") return <Navigate to={homeFor("lawyer")} replace />;
  const set = (k) => (e) => { const v = e && e.target ? (e.target.type === "checkbox" ? e.target.checked : e.target.value) : e; setF((x) => ({ ...x, [k]: v })); setErr((x) => ({ ...x, [k]: "" })); setFail(""); };
  const blur = (k) => () => { const s = SCHEMA[step](f)[k]; if (s) setErr((x) => ({ ...x, [k]: validate(f, { [k]: s })[k] || "" })); };
  const next = () => {
    const er = validate(f, SCHEMA[step](f));
    if (step === 2) { if (!files.bar) er.bar = "Upload your Bar Council enrolment certificate"; if (!files.id) er.id = "Upload a government ID"; }
    setErr(er); if (Object.keys(er).length) { setTimeout(() => document.querySelector('[aria-invalid="true"],.has-err input')?.focus(), 0); return; }
    setStep(step + 1);
  };
  const submit = async () => {
    if (!f.terms) { setErr({ terms: "Please accept the declaration to submit" }); return; }
    setBusy(true);
    const photo = files.photo ? await fileToDataURL(files.photo, 360) : "";
    setTimeout(() => {
      const r = actions.registerLawyer({ ...f, photo, docs: { bar: files.bar?.name, id: files.id?.name, degree: files.degree?.name } }); setBusy(false);
      if (!r.ok) { setFail(r.error); setStep(0); return; }
      try { sessionStorage.removeItem(DRAFT); } catch { /* ignore */ }
      actions.toast("Application submitted. Welcome to LegalConnect!"); go("/lawyer/dashboard");
    }, 900);
  };
  const Row = ({ l, v, to }) => <div className="row" style={{ padding: ".6rem 0", alignItems: "flex-start" }}><div className="row-main"><small style={{ marginTop: 0 }}>{l}</small><b style={{ fontWeight: 400, fontSize: ".9rem", overflowWrap: "anywhere" }}>{v || "—"}</b></div><button type="button" className="link-btn" onClick={() => setStep(to)} style={{ fontSize: ".8rem" }}>Edit</button></div>;
  return (
    <AuthShell wide title="Join as a lawyer" side={{ image: laptop, pos: "50% 45%", theme: "lawyer", headline: "Join a trusted community of legal professionals.", points: [["users", "Get more clients"], ["star", "Build your reputation"], ["trend", "Grow your practice"]] }}>
      <div style={{ marginBottom: "1.6rem" }}><Stepper steps={STEPS} current={step} /></div>
      {fail && <div className="demo-note" role="alert" style={{ marginBottom: "1rem", background: "#f8dfd9", borderColor: "#e0b3a8", color: "#8f3220" }}>{fail} <Link to="/login/lawyer" style={{ textDecoration: "underline" }}>Log in</Link></div>}
      {step === 0 && <>
        <h1>Create your professional account</h1><p className="muted">Step 1 of 4 — your personal details.</p>
        <div className="form-grid" style={{ marginTop: "1.2rem" }}>
          <TextField className="full" label="Full name" required autoComplete="name" value={f.name} onChange={set("name")} onBlur={blur("name")} error={err.name} />
          <TextField label="Email address" required type="email" autoComplete="email" value={f.email} onChange={set("email")} onBlur={blur("email")} error={err.email} />
          <PhoneField value={f.phone} onChange={set("phone")} onBlur={blur("phone")} error={err.phone} />
          <PasswordField label="Password" required meter value={f.password} onChange={set("password")} onBlur={blur("password")} error={err.password} />
          <PasswordField label="Confirm password" required value={f.confirm} onChange={set("confirm")} onBlur={blur("confirm")} error={err.confirm} />
        </div></>}
      {step === 1 && <>
        <h1>Your professional profile</h1><p className="muted">Step 2 of 4 — what clients see on your public profile.</p>
        <div className="form-grid" style={{ marginTop: "1.2rem" }}>
          <TextField label="Bar Council enrolment no." required placeholder="D/1234/2015" value={f.barNo} onChange={set("barNo")} onBlur={blur("barNo")} error={err.barNo} />
          <SelectField label="State Bar Council" required value={f.council} onChange={set("council")} placeholder="Select council" options={BAR_COUNCILS} error={err.council} />
          <div className="full"><Chips label="Qualifications" required options={QUALS} value={f.quals} onChange={set("quals")} error={err.quals} /></div>
          <TextField label="Years of experience" required type="number" min="0" max="60" value={f.exp} onChange={set("exp")} onBlur={blur("exp")} error={err.exp} />
          <SelectField label="City of practice" required value={f.city} onChange={set("city")} placeholder="Select city" options={CITIES} error={err.city} />
          <div className="full"><Chips label="Practice areas" required options={AREAS} value={f.areas} onChange={set("areas")} error={err.areas} /></div>
          <TextField label="Consultation fee (₹, video)" required type="number" min="500" step="100" value={f.fee} onChange={set("fee")} onBlur={blur("fee")} error={err.fee} hint="Phone is 20% lower, in-person 50% higher." />
          <div><Chips label="Languages" options={LANGS} value={f.langs} onChange={set("langs")} /></div>
          <TextArea className="full" label="Professional biography" required max={600} value={f.bio} onChange={set("bio")} onBlur={blur("bio")} error={err.bio} hint="Plain language works best." />
        </div></>}
      {step === 2 && <>
        <h1>Verification documents</h1><p className="muted">Step 3 of 4 — we verify your enrolment before your profile is listed.</p>
        <div style={{ display: "grid", gap: "1.1rem", marginTop: "1.2rem" }}>
          <FileDrop label="Profile photograph" icon="user" accept="image/*" hint="JPG or PNG, a clear head-and-shoulders photo" file={files.photo} onFile={(x) => setFiles((s) => ({ ...s, photo: x }))} />
          <FileDrop label="Bar Council enrolment certificate *" icon="shield" accept=".pdf,image/*" hint="PDF or image" file={files.bar} error={err.bar} onFile={(x) => { setFiles((s) => ({ ...s, bar: x })); setErr((e) => ({ ...e, bar: "" })); }} />
          <FileDrop label="Government ID *" icon="id" accept=".pdf,image/*" hint="Aadhaar, passport or driving licence" file={files.id} error={err.id} onFile={(x) => { setFiles((s) => ({ ...s, id: x })); setErr((e) => ({ ...e, id: "" })); }} />
          <FileDrop label="Degree certificate (optional)" icon="file" accept=".pdf,image/*" hint="LL.B. / LL.M." file={files.degree} onFile={(x) => setFiles((s) => ({ ...s, degree: x }))} />
          <div className="demo-note"><Ic n="info" size={16} />Upload is a demonstration: files are not sent anywhere. Only the file names and a small preview of your photo are kept in this browser.</div>
        </div></>}
      {step === 3 && <>
        <h1>Review and submit</h1><p className="muted">Step 4 of 4 — check everything before you submit.</p>
        <div className="rows" style={{ marginTop: "1rem" }}>
          <Row to={0} l="Name" v={f.name} /><Row to={0} l="Email · phone" v={`${f.email} · +91 ${f.phone}`} /><Row to={1} l="Enrolment" v={`${f.barNo.toUpperCase()} — ${f.council}`} /><Row to={1} l="Qualifications" v={f.quals.join(", ")} />
          <Row to={1} l="Practice" v={`${f.areas.join(", ")} · ${f.exp} yrs · ${f.city} · ₹${f.fee}`} /><Row to={2} l="Documents" v={[files.photo && "photo", files.bar && "Bar certificate", files.id && "ID", files.degree && "degree"].filter(Boolean).join(", ")} />
        </div>
        <div style={{ marginTop: "1.2rem" }}><Check checked={f.terms} onChange={set("terms")} error={err.terms}>I confirm the information is accurate and agree to the <Link to="/terms" target="_blank">Terms</Link> and <Link to="/privacy" target="_blank">Privacy Policy</Link>.</Check></div></>}
      <div style={{ display: "flex", justifyContent: "space-between", gap: ".8rem", marginTop: "1.8rem", flexWrap: "wrap" }}>
        {step > 0 ? <Button variant="ghost" icon="arrowL" onClick={() => setStep(step - 1)}>Back</Button> : <span />}
        {step < 3 ? <Button size="lg" iconRight="arrowR" onClick={next}>Next</Button> : <Button size="lg" loading={busy} iconRight="check" onClick={submit}>Submit application</Button>}
      </div>
      <p className="muted" style={{ textAlign: "center", marginTop: "1.2rem", fontSize: ".86rem" }}>Already have an account? <Link to="/login/lawyer" style={{ textDecoration: "underline", color: "var(--ink)" }}>Log in</Link></p>
    </AuthShell>
  );
}
