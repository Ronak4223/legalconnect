import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthShell } from "../../layouts/AuthLayout.jsx";
import { TextField, PasswordField, PhoneField, Check } from "../../ui/Field.jsx";
import { Button } from "../../ui/Button.jsx";
import { useApp } from "../../state/store.jsx";
import { validate, rules } from "../../utils/validate.js";
import { useGo } from "../../hooks.js";
import { homeFor } from "../../routes.js";
import skyline from "@shared/assets/img/journey.webp";

export default function RegisterUser() {
  const { session, actions } = useApp(); const go = useGo();
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", confirm: "", terms: false });
  const [err, setErr] = useState({}); const [busy, setBusy] = useState(false); const [fail, setFail] = useState("");
  if (session?.role === "user") return <Navigate to={homeFor("user")} replace />;
  const schema = (v) => ({ name: rules.name, email: rules.email, phone: rules.phone, password: rules.password, confirm: rules.match(v.password), terms: rules.checked("Please accept the terms to continue") });
  const set = (k) => (e) => { const v = e && e.target ? (e.target.type === "checkbox" ? e.target.checked : e.target.value) : e; setF((x) => ({ ...x, [k]: v })); setErr((x) => ({ ...x, [k]: "" })); setFail(""); };
  const blur = (k) => () => setErr((x) => ({ ...x, [k]: validate(f, { [k]: schema(f)[k] })[k] || "" }));
  const submit = (e) => {
    e.preventDefault(); const er = validate(f, schema(f)); setErr(er);
    if (Object.keys(er).length) { setTimeout(() => document.querySelector('[aria-invalid="true"]')?.focus(), 0); return; }
    setBusy(true);
    setTimeout(() => { const r = actions.registerUser({ name: f.name, email: f.email, phone: f.phone, password: f.password }); setBusy(false); if (!r.ok) { setFail(r.error); return; } actions.toast("Account created. Welcome to LegalConnect!"); go("/user/dashboard"); }, 700);
  };
  return (
    <AuthShell title="Create client account" side={{ image: skyline, pos: "55% 60%", headline: "Your legal journey, in good hands.", points: [["shield", "Every lawyer is verified"], ["wallet", "Fees shown before you book"], ["lock", "Your conversations stay private"]] }}>
      <p className="eyebrow">Client account</p>
      <h1 style={{ margin: ".5rem 0" }}>Create your account</h1><p className="muted" style={{ marginTop: 0 }}>It takes a minute. No real data is stored anywhere but this browser.</p>
      {fail && <div className="demo-note" role="alert" style={{ margin: "1rem 0", background: "#f8dfd9", borderColor: "#e0b3a8", color: "#8f3220" }}>{fail} <Link to="/login/user" style={{ textDecoration: "underline" }}>Log in</Link></div>}
      <form onSubmit={submit} noValidate className="form-grid" style={{ marginTop: "1.4rem" }}>
        <TextField className="full" label="Full name" required autoComplete="name" value={f.name} onChange={set("name")} onBlur={blur("name")} error={err.name} />
        <TextField className="full" label="Email address" required type="email" autoComplete="email" value={f.email} onChange={set("email")} onBlur={blur("email")} error={err.email} />
        <PhoneField className="full" value={f.phone} onChange={set("phone")} error={err.phone} onBlur={blur("phone")} />
        <PasswordField className="full" label="Password" required meter value={f.password} onChange={set("password")} onBlur={blur("password")} error={err.password} hint="At least 8 characters with upper and lower case letters and a number." />
        <PasswordField className="full" label="Confirm password" required value={f.confirm} onChange={set("confirm")} onBlur={blur("confirm")} error={err.confirm} />
        <div className="full"><Check checked={f.terms} onChange={set("terms")} error={err.terms}>I agree to the <Link to="/terms" target="_blank">Terms of Service</Link> and <Link to="/privacy" target="_blank">Privacy Policy</Link>.</Check></div>
        <div className="full"><Button type="submit" size="lg" loading={busy} iconRight="arrowR" className="" style={{ width: "100%" }}>Create account</Button></div>
      </form>
      <p className="muted" style={{ textAlign: "center", marginTop: "1.2rem", fontSize: ".88rem" }}>Already registered? <Link to="/login/user" style={{ textDecoration: "underline", color: "var(--ink)" }}>Log in</Link> · Are you a lawyer? <Link to="/register/lawyer" style={{ textDecoration: "underline", color: "var(--ink)" }}>Join here</Link></p>
    </AuthShell>
  );
}
