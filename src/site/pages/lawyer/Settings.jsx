import { useState } from "react";
import { useApp } from "../../state/store.jsx";
import { Tabs } from "../../ui/Misc.jsx";
import { Button } from "../../ui/Button.jsx";
import { TextField, PhoneField, SelectField, PasswordField, Switch } from "../../ui/Field.jsx";
import { Confirm } from "../../ui/Overlay.jsx";
import { validate, rules } from "../../utils/validate.js";
import { useTitle, useGo } from "../../hooks.js";
import { LANGS } from "../../data/demo.js";

export default function LawyerSettings() {
  useTitle("Settings");
  const { state, session, account, actions } = useApp(); const go = useGo();
  const [tab, setTab] = useState("account"); const [reset, setReset] = useState(false);
  const st = state.settings[session.id] || {};
  const [f, setF] = useState({ email: account.email, phone: account.phone || "" }); const [err, setErr] = useState({});
  const [pw, setPw] = useState({ cur: "", next: "", confirm: "" }); const [pwErr, setPwErr] = useState({});
  const saveAcc = (e) => { e.preventDefault(); const er = validate(f, { email: rules.email, phone: rules.phone }); setErr(er); if (Object.keys(er).length) return; actions.updateAccount({ email: f.email.trim().toLowerCase(), phone: f.phone }); actions.toast("Account details saved."); };
  const changePw = (e) => { e.preventDefault(); const er = validate(pw, { cur: rules.required, next: rules.password, confirm: rules.match(pw.next) }); setPwErr(er); if (Object.keys(er).length) return; const r = actions.changePassword(pw.cur, pw.next); if (!r.ok) { setPwErr({ cur: r.error }); return; } setPw({ cur: "", next: "", confirm: "" }); actions.toast("Password changed."); };
  return (
    <>
      <div className="ph"><div><h1>Settings</h1><p>Account, consultation preferences, notifications and security.</p></div></div>
      <Tabs value={tab} onChange={setTab} label="Settings sections" tabs={[{ value: "account", label: "Account" }, { value: "practice", label: "Consultations" }, { value: "notify", label: "Notifications" }, { value: "security", label: "Security" }]} />
      <div style={{ maxWidth: 720, marginTop: "1.6rem" }}>
        {tab === "account" && <form onSubmit={saveAcc} noValidate className="form-grid"><TextField className="full" label="Name" value={account.name} disabled hint="Edit your name on the My profile page." /><TextField label="Sign-in email" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} error={err.email} /><PhoneField value={f.phone} onChange={(v) => setF({ ...f, phone: v })} error={err.phone} /><SelectField label="Language" value={st.language || "English"} onChange={(e) => { actions.setSettings({ language: e.target.value }); actions.toast("Preference saved."); }} options={LANGS} /><div className="full"><Button type="submit" className="">Save account</Button></div></form>}
        {tab === "practice" && <div>
          <Switch label="Auto-accept requests" hint="Confirm every booking that fits your availability, without a manual step" checked={st.autoAccept} onChange={(v) => { actions.setSettings({ autoAccept: v }); actions.toast(v ? "New requests will be accepted automatically (demo)." : "Manual review restored."); }} />
          <div className="form-grid" style={{ marginTop: "1.4rem" }}><SelectField label="Default consultation length" value={String(st.duration || 45)} onChange={(e) => { actions.setSettings({ duration: Number(e.target.value) }); actions.toast("Saved."); }} options={[{ value: "30", label: "30 minutes" }, { value: "45", label: "45 minutes" }, { value: "60", label: "60 minutes" }]} /><SelectField label="Buffer between consultations" value={String(st.buffer ?? 10)} onChange={(e) => { actions.setSettings({ buffer: Number(e.target.value) }); actions.toast("Saved."); }} options={[{ value: "0", label: "None" }, { value: "10", label: "10 minutes" }, { value: "15", label: "15 minutes" }]} /></div></div>}
        {tab === "notify" && <div><Switch label="Email notifications" hint="New requests, messages and payments" checked={st.emailNotif} onChange={(v) => actions.setSettings({ emailNotif: v })} /><Switch label="SMS alerts" hint="Urgent requests only" checked={st.smsNotif} onChange={(v) => actions.setSettings({ smsNotif: v })} /><Switch label="Appointment reminders" hint="An hour before every consultation" checked={st.reminders} onChange={(v) => actions.setSettings({ reminders: v })} /><Switch label="Product updates" checked={st.offers} onChange={(v) => actions.setSettings({ offers: v })} /></div>}
        {tab === "security" && <div style={{ display: "grid", gap: "2.2rem" }}>
          <form onSubmit={changePw} noValidate style={{ display: "grid", gap: "1rem", maxWidth: 420 }}><h2 className="h-md">Change password</h2><PasswordField label="Current password" autoComplete="current-password" value={pw.cur} onChange={(e) => setPw({ ...pw, cur: e.target.value })} error={pwErr.cur} /><PasswordField label="New password" meter value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} error={pwErr.next} /><PasswordField label="Confirm new password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} error={pwErr.confirm} /><div><Button type="submit" className="">Update password</Button></div></form>
          <div><Switch label="Two-step verification" hint="Ask for a code when signing in (demo)" checked={st.twoFactor} onChange={(v) => actions.setSettings({ twoFactor: v })} /><div style={{ marginTop: "1.4rem" }}><Button variant="danger" icon="refresh" onClick={() => setReset(true)}>Reset demo data</Button></div></div></div>}
      </div>
      <Confirm open={reset} onClose={() => setReset(false)} danger confirm="Reset everything" title="Reset all demo data?" text="This clears every account, appointment and message created in this browser and signs you out." onConfirm={() => { actions.resetDemo(); go("/"); }} />
    </>
  );
}
