import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthShell } from "../../layouts/AuthLayout.jsx";
import { TextField, PasswordField } from "../../ui/Field.jsx";
import { Button } from "../../ui/Button.jsx";
import { Ic } from "../../ui/Icons.jsx";
import { useApp } from "../../state/store.jsx";
import { validate, rules } from "../../utils/validate.js";
import stationery from "@shared/assets/img/stationery.webp";

export default function Forgot() {
  const { actions } = useApp();
  const [step, setStep] = useState(0); const [f, setF] = useState({ email: "", code: "", password: "", confirm: "" }); const [err, setErr] = useState({}); const [role, setRole] = useState("user"); const [busy, setBusy] = useState(false);
  const set = (k) => (e) => { setF((x) => ({ ...x, [k]: e.target.value })); setErr((x) => ({ ...x, [k]: "" })); };
  const send = (e) => { e.preventDefault(); const er = validate(f, { email: rules.email }); setErr(er); if (Object.keys(er).length) return; setBusy(true); setTimeout(() => { actions.requestReset(f.email); setBusy(false); setStep(1); }, 600); };
  const reset = (e) => {
    e.preventDefault(); const er = validate(f, { code: rules.required, password: rules.password, confirm: rules.match(f.password) }); setErr(er); if (Object.keys(er).length) return;
    const r = actions.confirmReset(f.email, f.code, f.password); if (!r.ok) { setErr({ code: r.error }); return; } setRole(r.role); setStep(2); actions.toast("Password updated.");
  };
  return (
    <AuthShell title="Reset password" side={{ image: stationery, pos: "50% 50%", headline: "A fresh start takes a minute.", points: [["lock", "We never show or email your password"], ["shield", "Reset codes expire quickly"]] }}>
      <p className="eyebrow">Account recovery</p>
      {step === 0 && <><h1 style={{ margin: ".5rem 0" }}>Forgot your password?</h1><p className="muted">Enter your email and we’ll send a reset code.</p>
        <form onSubmit={send} noValidate style={{ display: "grid", gap: "1rem", marginTop: "1.4rem" }}><TextField label="Email address" type="email" icon="mail" value={f.email} onChange={set("email")} error={err.email} autoComplete="email" /><Button type="submit" size="lg" loading={busy} className="">Send reset code</Button></form></>}
      {step === 1 && <><h1 style={{ margin: ".5rem 0" }}>Check your inbox</h1><p className="muted">If an account exists for <b>{f.email}</b>, a 6-digit code is on its way.</p>
        <div className="demo-note" style={{ margin: "1rem 0" }}><Ic n="info" size={16} />Demo: no email is sent. Use the code <b>482913</b> (it only works for an existing account).</div>
        <form onSubmit={reset} noValidate style={{ display: "grid", gap: "1rem" }}><TextField label="6-digit code" inputMode="numeric" value={f.code} onChange={set("code")} error={err.code} /><PasswordField label="New password" meter value={f.password} onChange={set("password")} error={err.password} /><PasswordField label="Confirm new password" value={f.confirm} onChange={set("confirm")} error={err.confirm} /><Button type="submit" size="lg" className="">Reset password</Button></form>
        <button type="button" className="link-btn" style={{ marginTop: "1rem" }} onClick={() => setStep(0)}>Use a different email</button></>}
      {step === 2 && <div style={{ textAlign: "center", padding: "1rem 0" }}><span className="empty-ic" style={{ margin: "0 auto 1rem", background: "#dcefe5", color: "#17633f" }}><Ic n="check" size={26} /></span><h1>Password updated</h1><p className="muted">You can now log in with your new password.</p><Button to={`/login/${role}`} size="lg" className="">Go to log in</Button></div>}
      <p className="muted" style={{ textAlign: "center", marginTop: "1.6rem", fontSize: ".88rem" }}><Link to="/login/user" style={{ textDecoration: "underline", color: "var(--ink)" }}>Client log in</Link> · <Link to="/login/lawyer" style={{ textDecoration: "underline", color: "var(--ink)" }}>Lawyer log in</Link></p>
    </AuthShell>
  );
}
