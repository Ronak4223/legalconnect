import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { AuthShell } from "../../layouts/AuthLayout.jsx";
import { TextField, PasswordField, Check } from "../../ui/Field.jsx";
import { Button } from "../../ui/Button.jsx";
import { Ic } from "../../ui/Icons.jsx";
import { useApp } from "../../state/store.jsx";
import { validate, rules } from "../../utils/validate.js";
import { homeFor, zoneOf } from "../../routes.js";
import { useGo } from "../../hooks.js";
import { DEMO_PASSWORD } from "../../data/demo.js";
import network from "@shared/assets/img/network-gold.webp";

const COPY = {
  user: { title: "Client log in", h: "Welcome back", sub: "Sign in to manage your consultations, cases and messages.", demo: "ananya.desai@example.com", other: ["lawyer", "I’m a lawyer"], reg: "/register/user",
    side: { video: true, pos: "35% 40%", headline: "Your legal journey, in good hands.", points: [["shield", "Verified lawyers across India"], ["calendar", "Book in minutes, meet by video"], ["lock", "Private by design"]] } },
  lawyer: { title: "Lawyer log in", h: "Welcome back, counsel", sub: "Access your professional dashboard: requests, clients, cases and earnings.", demo: "aarav.mehta@example.com", other: ["user", "I’m a client"], reg: "/register/lawyer",
    side: { image: network, pos: "50% 50%", theme: "lawyer", headline: "Your practice, beautifully organised.", points: [["users", "Clients and cases in one place"], ["chart", "Earnings at a glance"], ["message", "Secure messaging and video"]] } },
};
export default function Login({ role }) {
  const c = COPY[role]; const { session, actions } = useApp(); const loc = useLocation(); const go = useGo();
  const [f, setF] = useState({ email: "", password: "", remember: true }); const [err, setErr] = useState({}); const [busy, setBusy] = useState(false); const [fail, setFail] = useState("");
  if (session?.role === role) return <Navigate to={homeFor(role)} replace />;
  const dest = () => {
    const from = loc.state?.from || "";
    const mine = role === "user" ? from.startsWith("/user") : /^\/lawyer\/(dashboard|profile|appointments|clients|cases|messages|earnings|notifications|settings)/.test(from);
    return mine || (from && zoneOf(from) === "public") ? from : homeFor(role);
  };
  const set = (k) => (e) => { setF((x) => ({ ...x, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value })); setErr((x) => ({ ...x, [k]: "" })); setFail(""); };
  const submit = (e) => {
    e.preventDefault();
    const er = validate(f, { email: rules.email, password: rules.required }); setErr(er); if (Object.keys(er).length) return;
    setBusy(true);
    setTimeout(() => { const r = actions.login(role, f.email, f.password); setBusy(false); if (!r.ok) { setFail(r.error); return; } actions.toast("Welcome back!"); go(dest()); }, 600);
  };
  const demo = () => { actions.loginDemo(role); actions.toast(`Signed in as the demo ${role === "user" ? "client" : "lawyer"}.`); go(dest()); };
  return (
    <AuthShell title={c.title} side={c.side}>
      <p className="eyebrow">{role === "user" ? "Client" : "Lawyer"} sign in</p>
      <h1 style={{ margin: ".5rem 0 .5rem" }}>{c.h}</h1><p className="muted" style={{ marginTop: 0 }}>{c.sub}</p>
      {loc.state?.mismatch && <div className="demo-note" style={{ margin: "1rem 0" }}><Ic n="info" size={16} />You’re signed in with a different account type. Sign in here to continue.</div>}
      {fail && <div className="demo-note" role="alert" style={{ margin: "1rem 0", background: "#f8dfd9", borderColor: "#e0b3a8", color: "#8f3220" }}><Ic n="alert" size={16} />{fail}</div>}
      <form onSubmit={submit} noValidate style={{ display: "grid", gap: "1rem", marginTop: "1.4rem" }}>
        <TextField label="Email address" type="email" icon="mail" autoComplete="email" placeholder="you@example.com" value={f.email} onChange={set("email")} error={err.email} />
        <PasswordField label="Password" autoComplete="current-password" placeholder="Your password" value={f.password} onChange={set("password")} error={err.password} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}><Check label="Remember me" checked={f.remember} onChange={set("remember")} /><Link to="/forgot-password" style={{ fontSize: ".84rem", textDecoration: "underline" }}>Forgot password?</Link></div>
        <Button type="submit" size="lg" loading={busy} iconRight="arrowR" className="">Log in</Button>
      </form>
      <div className="divider">or</div>
      <div className="panel" style={{ padding: "1rem 1.1rem", display: "grid", gap: ".7rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: ".8rem", alignItems: "center", flexWrap: "wrap" }}><div><b style={{ fontWeight: 500, fontSize: ".9rem" }}>Try the demo account</b><div className="muted" style={{ fontSize: ".78rem" }}>{c.demo} · {DEMO_PASSWORD}</div></div><Button variant="soft" size="sm" onClick={demo}>Use demo account</Button></div>
        <div style={{ display: "flex", gap: ".6rem" }}>{["Google", "LinkedIn"].map((n) => <Button key={n} variant="outline" size="sm" onClick={() => actions.toast(`${n} sign-in isn’t part of this demo.`, "err")} className="" style={{ flex: 1 }}>{n}</Button>)}</div>
      </div>
      <p className="muted" style={{ textAlign: "center", marginTop: "1.4rem", fontSize: ".88rem" }}>New here? <Link to={c.reg} style={{ textDecoration: "underline", color: "var(--ink)" }}>Create an account</Link> · <Link to={`/login/${c.other[0]}`} style={{ textDecoration: "underline", color: "var(--ink)" }}>{c.other[1]}?</Link></p>
    </AuthShell>
  );
}
