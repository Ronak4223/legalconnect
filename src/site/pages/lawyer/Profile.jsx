import { useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useApp } from "../../state/store.jsx";
import { Tabs, LawyerPhoto, Stars, StatusBadge } from "../../ui/Misc.jsx";
import { Button } from "../../ui/Button.jsx";
import { TextField, TextArea, SelectField, Chips, Switch, PhoneField } from "../../ui/Field.jsx";
import { Ic } from "../../ui/Icons.jsx";
import { AREAS, CITIES, LANGS, QUALS, BAR_COUNCILS } from "../../data/demo.js";
import { validate, rules } from "../../utils/validate.js";
import { fileToDataURL } from "../../utils/image.js";
import { money } from "../../utils/format.js";
import { useTitle } from "../../hooks.js";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const HOURS = Array.from({ length: 13 }, (_, i) => `${String(i + 8).padStart(2, "0")}:00`);
export default function LawyerProfile() {
  useTitle("My profile");
  const { session, account, lawyer, actions } = useApp();
  const [sp, setSp] = useSearchParams(); const tab = sp.get("tab") || "basic"; const setTab = (t) => setSp({ tab: t }, { replace: true });
  const [d, setD] = useState(() => ({ name: lawyer.name, phone: account.phone || "", city: lawyer.city, langs: lawyer.langs, tagline: lawyer.tagline, about: lawyer.about, quals: lawyer.quals, council: lawyer.council || "", courts: (lawyer.courts || []).join(", "), exp: String(lawyer.exp), areas: lawyer.areas, fee: String(lawyer.fee), schedule: lawyer.schedule, src: lawyer.src || "" }));
  const [err, setErr] = useState({}); const [dirty, setDirty] = useState(false); const photo = useRef(null);
  const set = (k) => (e) => { const v = e && e.target ? e.target.value : e; setD((x) => ({ ...x, [k]: v })); setErr((x) => ({ ...x, [k]: "" })); setDirty(true); };
  const day = (i, patch) => { setD((x) => ({ ...x, schedule: x.schedule.map((s) => (s.day === i ? { ...s, ...patch } : s)) })); setDirty(true); };
  const save = () => {
    const er = validate(d, { name: rules.name, phone: rules.phone, tagline: rules.minLen(10, "Add a short headline"), about: rules.minLen(60, "Write at least 60 characters"), quals: rules.nonEmptyList(), areas: rules.nonEmptyList(), fee: rules.min(500, "Minimum fee is ₹500"), exp: rules.min(0, "Enter years of experience") });
    setErr(er); if (Object.keys(er).length) { const t = er.name || er.phone || er.tagline || er.about ? "basic" : er.quals || er.exp ? "pro" : "practice"; setTab(t); actions.toast("Please fix the highlighted fields.", "err"); return; }
    actions.updateLawyer({ name: d.name.trim(), city: d.city, langs: d.langs, tagline: d.tagline.trim(), about: d.about.trim(), quals: d.quals, council: d.council, courts: d.courts.split(",").map((x) => x.trim()).filter(Boolean), exp: Number(d.exp), areas: d.areas, area: d.areas[0], fee: Number(d.fee), schedule: d.schedule, ...(d.src ? { src: d.src, sz: lawyer.src ? "cover" : lawyer.sz, ps: lawyer.src ? "center" : lawyer.ps } : {}) });
    actions.updateAccount({ name: d.name.trim(), phone: d.phone }); setDirty(false); actions.toast("Profile saved. Your public profile is updated.");
  };
  const pickPhoto = async (e) => { const url = await fileToDataURL(e.target.files?.[0], 420); if (url) { setD((x) => ({ ...x, src: url })); setDirty(true); } };
  const preview = { ...lawyer, name: d.name, city: d.city, tagline: d.tagline, about: d.about, areas: d.areas, area: d.areas[0], exp: Number(d.exp) || 0, fee: Number(d.fee) || 0, langs: d.langs, quals: d.quals, ...(d.src ? { src: d.src, sz: "cover", ps: "center" } : {}) };
  return (
    <>
      <div className="ph"><div><h1>My profile</h1><p>What clients see on your public profile. Changes go live when you save.</p></div>
        <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}><Button variant="outline" to={`/lawyer/${lawyer.id}`} icon="eye">View public profile</Button><Button icon="check" onClick={save} disabled={!dirty}>Save changes</Button></div></div>
      <Tabs value={tab} onChange={setTab} label="Profile sections" tabs={[{ value: "basic", label: "Basic info" }, { value: "pro", label: "Professional" }, { value: "practice", label: "Practice & fees" }, { value: "availability", label: "Availability" }, { value: "preview", label: "Preview" }]} />
      {tab === "basic" && <div>
        <div className="ed-sec" style={{ borderTop: 0 }}><div><h3>Photo</h3><p className="d">A clear head-and-shoulders photo builds trust.</p></div><div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}><LawyerPhoto l={preview} size={96} /><div><input ref={photo} type="file" accept="image/*" className="sr-only" aria-label="Change profile photo" onChange={pickPhoto} /><Button variant="outline" size="sm" icon="upload" onClick={() => photo.current.click()}>Change photo</Button></div></div></div>
        <div className="ed-sec"><div><h3>Identity</h3><p className="d">Your name and contact details.</p></div><div className="form-grid"><TextField label="Full name" required value={d.name} onChange={set("name")} error={err.name} /><PhoneField value={d.phone} onChange={(v) => { setD((x) => ({ ...x, phone: v })); setDirty(true); setErr((x) => ({ ...x, phone: "" })); }} error={err.phone} /><TextField label="Email" value={account.email} disabled hint="Contact support to change your sign-in email." /><SelectField label="City" value={d.city} onChange={set("city")} options={CITIES} /></div></div>
        <div className="ed-sec"><div><h3>About you</h3><p className="d">A headline and a short biography in plain language.</p></div><div style={{ display: "grid", gap: "1rem" }}><TextField label="Headline" required value={d.tagline} onChange={set("tagline")} error={err.tagline} max={90} /><TextArea label="Biography" required rows={6} max={700} value={d.about} onChange={set("about")} error={err.about} /><Chips label="Languages" options={LANGS} value={d.langs} onChange={set("langs")} /></div></div></div>}
      {tab === "pro" && <div>
        <div className="ed-sec" style={{ borderTop: 0 }}><div><h3>Enrolment</h3><p className="d">Verified against the State Bar Council.</p></div><div className="form-grid"><TextField label="Bar enrolment no." value={lawyer.barNo} disabled /><SelectField label="State Bar Council" value={d.council} onChange={set("council")} options={BAR_COUNCILS} /><div className="full"><StatusBadge status={lawyer.verification === "verified" ? "verified" : "in_review"} /></div></div></div>
        <div className="ed-sec"><div><h3>Qualifications</h3></div><div style={{ display: "grid", gap: "1rem" }}><Chips label="Degrees & certifications" options={[...new Set([...QUALS, ...d.quals])]} value={d.quals} onChange={set("quals")} error={err.quals} /><TextField label="Courts you appear in" value={d.courts} onChange={set("courts")} hint="Separate with commas" /><TextField label="Years of experience" type="number" min="0" value={d.exp} onChange={set("exp")} error={err.exp} /></div></div></div>}
      {tab === "practice" && <div>
        <div className="ed-sec" style={{ borderTop: 0 }}><div><h3>Practice areas</h3><p className="d">The first one you pick is your primary area.</p></div><Chips label="" options={AREAS} value={d.areas} onChange={set("areas")} error={err.areas} /></div>
        <div className="ed-sec"><div><h3>Consultation fees</h3><p className="d">You set the video fee. Phone and in-person are derived from it.</p></div><div style={{ display: "grid", gap: "1rem", maxWidth: 420 }}><TextField label="Video consultation fee (₹)" type="number" min="500" step="100" value={d.fee} onChange={set("fee")} error={err.fee} />
          <div className="panel" style={{ padding: "1rem" }}><dl className="dl"><dt>Video</dt><dd>{money(Number(d.fee) || 0)}</dd><dt>Phone (−20%)</dt><dd>{money(Math.round((Number(d.fee) || 0) * 0.8))}</dd><dt>In person (+50%)</dt><dd>{money(Math.round((Number(d.fee) || 0) * 1.5))}</dd><dt>You receive</dt><dd>90% of each fee</dd></dl></div></div></div></div>}
      {tab === "availability" && <div className="ed-sec" style={{ borderTop: 0 }}><div><h3>Weekly availability</h3><p className="d">Clients can only book inside these hours. Existing bookings are never removed.</p></div>
        <div className="sched">{[1, 2, 3, 4, 5, 6, 0].map((i) => { const s = d.schedule.find((x) => x.day === i); return (
          <div className="d" key={i}><b style={{ fontWeight: 500 }}>{DAYS[i]}</b><button type="button" role="switch" aria-checked={s.on} aria-label={`${DAYS[i]} available`} className={`sw ${s.on ? "on" : ""}`} onClick={() => day(i, { on: !s.on })}><i /></button>
            {s.on ? <div className="tm"><select aria-label={`${DAYS[i]} start`} value={s.from} onChange={(e) => day(i, { from: e.target.value })}>{HOURS.slice(0, -1).map((h) => <option key={h}>{h}</option>)}</select>to<select aria-label={`${DAYS[i]} end`} value={s.to} onChange={(e) => day(i, { to: e.target.value })}>{HOURS.slice(1).filter((h) => h > s.from).map((h) => <option key={h}>{h}</option>)}</select></div> : <span className="muted" style={{ fontSize: ".82rem" }}>Unavailable</span>}</div>); })}</div></div>}
      {tab === "preview" && <div style={{ maxWidth: 820, marginTop: "1.6rem" }}>
        <p className="hint" style={{ marginBottom: "1rem" }}>This is how your profile header appears to clients (unsaved changes included).</p>
        <div className="panel" style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "1.6rem", padding: "1.6rem" }}>
          <LawyerPhoto l={preview} ratio="4/5" hero zoom={preview.src && preview.sz === "cover" ? 1 : 0.5} style={{ borderRadius: 18 }} />
          <div><p className="eyebrow">{preview.areas.join(" · ")}</p><h2 className="h-lg" style={{ margin: ".4rem 0" }}>{preview.name}</h2><p className="muted">{preview.tagline}</p>
            <div style={{ display: "flex", gap: "1.4rem", flexWrap: "wrap", fontSize: ".88rem", margin: "1rem 0" }}><span><Stars value={lawyer.rating || 0} /> {lawyer.reviews ? lawyer.rating.toFixed(1) : "New"}</span><span><Ic n="briefcase" size={14} /> {preview.exp} yrs</span><span><Ic n="pin" size={14} /> {preview.city}</span><span><b>{money(preview.fee)}</b> / video</span></div>
            <p className="muted" style={{ fontSize: ".88rem", lineHeight: 1.7 }}>{preview.about.slice(0, 220)}{preview.about.length > 220 ? "…" : ""}</p></div></div></div>}
    </>
  );
}
