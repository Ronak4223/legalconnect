import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../state/store.jsx";
import { Tabs, Avatar, EmptyState } from "../../ui/Misc.jsx";
import { Button } from "../../ui/Button.jsx";
import { TextField, PhoneField, SelectField, TextArea, PasswordField, Switch } from "../../ui/Field.jsx";
import { Confirm } from "../../ui/Overlay.jsx";
import { LawyerMini } from "../shared/lawyerParts.jsx";
import { Ic } from "../../ui/Icons.jsx";
import { validate, rules } from "../../utils/validate.js";
import { fileToDataURL } from "../../utils/image.js";
import { useTitle, useGo } from "../../hooks.js";
import { CITIES, LANGS } from "../../data/demo.js";

export default function UserProfile() {
  useTitle("Profile & settings");
  const { state, session, account, actions } = useApp(); const go = useGo();
  const [tab, setTab] = useState("profile"); const [reset, setReset] = useState(false);
  const [f, setF] = useState(() => ({ name: account.name, email: account.email, phone: account.phone || "", city: account.city || "", dob: account.dob || "", gender: account.gender || "", address: account.address || "", about: account.about || "" }));
  const [err, setErr] = useState({}); const [pw, setPw] = useState({ cur: "", next: "", confirm: "" }); const [pwErr, setPwErr] = useState({}); const file = useRef(null);
  const st = state.settings[session.id] || {}; const saved = state.saved[session.id] || [];
  const set = (k) => (e) => { setF((x) => ({ ...x, [k]: e && e.target ? e.target.value : e })); setErr((x) => ({ ...x, [k]: "" })); };
  const save = (e) => { e.preventDefault(); const er = validate(f, { name: rules.name, email: rules.email, phone: rules.phone }); setErr(er); if (Object.keys(er).length) return; actions.updateAccount({ ...f, name: f.name.trim(), email: f.email.trim().toLowerCase() }); actions.toast("Profile saved on this device."); };
  const photo = async (e) => { const url = await fileToDataURL(e.target.files?.[0], 200); if (url) { actions.updateAccount({ avatar: url }); actions.toast("Photo updated."); } };
  const changePw = (e) => { e.preventDefault(); const er = validate(pw, { cur: rules.required, next: rules.password, confirm: rules.match(pw.next) }); setPwErr(er); if (Object.keys(er).length) return; const r = actions.changePassword(pw.cur, pw.next); if (!r.ok) { setPwErr({ cur: r.error }); return; } setPw({ cur: "", next: "", confirm: "" }); actions.toast("Password changed."); };
  const exportData = () => { const mine = { account: { ...account, pass: undefined }, appointments: state.appointments.filter((a) => a.userId === session.id), cases: state.cases.filter((c) => c.userId === session.id), payments: state.payments.filter((p) => p.userId === session.id) }; const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(mine, null, 2)], { type: "application/json" })); a.download = "legalconnect-my-data.json"; a.click(); URL.revokeObjectURL(a.href); };
  return (
    <>
      <div className="ph"><div><h1>Profile & settings</h1><p>Your details, preferences and security. Everything is stored only in this browser.</p></div></div>
      <Tabs value={tab} onChange={setTab} label="Settings sections" tabs={[{ value: "profile", label: "Profile" }, { value: "prefs", label: "Preferences" }, { value: "saved", label: "Saved lawyers", count: saved.length }, { value: "security", label: "Security" }]} />
      <div style={{ maxWidth: 780, marginTop: "1.6rem" }}>
        {tab === "profile" && (
          <form onSubmit={save} noValidate>
            <div style={{ display: "flex", gap: "1.2rem", alignItems: "center", marginBottom: "1.6rem" }}><Avatar name={account.name} src={account.avatar} size={84} /><div><input ref={file} type="file" accept="image/*" className="sr-only" aria-label="Change photo" onChange={photo} /><Button variant="outline" size="sm" icon="upload" onClick={() => file.current.click()}>Change photo</Button>{account.avatar && <Button variant="ghost" size="sm" onClick={() => actions.updateAccount({ avatar: "" })}>Remove</Button>}<p className="hint" style={{ marginTop: ".4rem" }}>JPG or PNG. Stored only in this browser.</p></div></div>
            <div className="form-grid">
              <TextField label="Full name" required value={f.name} onChange={set("name")} error={err.name} autoComplete="name" />
              <TextField label="Email" required type="email" value={f.email} onChange={set("email")} error={err.email} autoComplete="email" />
              <PhoneField value={f.phone} onChange={set("phone")} error={err.phone} />
              <SelectField label="City" value={f.city} onChange={set("city")} placeholder="Select city" options={[...new Set([...CITIES, f.city].filter(Boolean))]} />
              <TextField label="Date of birth" type="date" value={f.dob} onChange={set("dob")} />
              <SelectField label="Gender" value={f.gender} onChange={set("gender")} placeholder="Prefer not to say" options={["Female", "Male", "Non-binary"]} />
              <TextField className="full" label="Address" value={f.address} onChange={set("address")} autoComplete="street-address" />
              <TextArea className="full" label="About you (shared with lawyers you book)" max={300} value={f.about} onChange={set("about")} />
            </div>
            <div style={{ marginTop: "1.4rem" }}><Button type="submit" size="lg" icon="check" className="">Save changes</Button></div>
          </form>)}
        {tab === "prefs" && (<div>
          <Switch label="Email notifications" hint="Appointment updates and lawyer replies" checked={st.emailNotif} onChange={(v) => actions.setSettings({ emailNotif: v })} />
          <Switch label="SMS notifications" hint="Short texts for confirmations" checked={st.smsNotif} onChange={(v) => actions.setSettings({ smsNotif: v })} />
          <Switch label="Appointment reminders" hint="A reminder the day before and an hour before" checked={st.reminders} onChange={(v) => actions.setSettings({ reminders: v })} />
          <Switch label="News & offers" hint="Occasional product updates" checked={st.offers} onChange={(v) => actions.setSettings({ offers: v })} />
          <div style={{ maxWidth: 320, marginTop: "1.4rem" }}><SelectField label="Preferred language" value={st.language || "English"} onChange={(e) => { actions.setSettings({ language: e.target.value }); actions.toast("Preference saved."); }} options={LANGS} /></div></div>)}
        {tab === "saved" && (saved.length ? <div className="rows">{saved.map((id) => { const l = state.lawyers.find((x) => x.id === id); return l ? <LawyerMini key={id} l={l} action={<div className="row-act"><Button to={`/lawyer/${id}?book=1`} size="sm">Book</Button><Button variant="ghost" size="sm" icon="trash" aria-label={`Remove ${l.name}`} onClick={() => actions.toggleSave(id)} /></div>} /> : null; })}</div> : <EmptyState icon="heart" title="No saved lawyers" text="Tap the heart on a lawyer to shortlist them." action="Find a lawyer" to="/find-lawyers" />)}
        {tab === "security" && (<div style={{ display: "grid", gap: "2.2rem" }}>
          <form onSubmit={changePw} noValidate style={{ display: "grid", gap: "1rem", maxWidth: 420 }}><h2 className="h-md">Change password</h2>
            <PasswordField label="Current password" autoComplete="current-password" value={pw.cur} onChange={(e) => setPw({ ...pw, cur: e.target.value })} error={pwErr.cur} />
            <PasswordField label="New password" meter value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} error={pwErr.next} />
            <PasswordField label="Confirm new password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} error={pwErr.confirm} /><div><Button type="submit" className="">Update password</Button></div></form>
          <div><Switch label="Two-step verification" hint="Ask for a code when signing in (demo)" checked={st.twoFactor} onChange={(v) => actions.setSettings({ twoFactor: v })} />
            <div style={{ display: "flex", gap: ".7rem", flexWrap: "wrap", marginTop: "1.4rem" }}><Button variant="outline" icon="download" onClick={exportData}>Download my data</Button><Button variant="danger" icon="refresh" onClick={() => setReset(true)}>Reset demo data</Button></div>
            <p className="hint" style={{ marginTop: ".6rem" }}>Resetting clears everything stored in this browser and restores the sample data.</p></div></div>)}
      </div>
      <Confirm open={reset} onClose={() => setReset(false)} danger confirm="Reset everything" title="Reset all demo data?" text="This clears every account, appointment and message created in this browser and signs you out." onConfirm={() => { actions.resetDemo(); go("/"); }} />
    </>
  );
}
