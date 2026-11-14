import { useMemo, useState } from "react";
import { FAQS } from "../../data/content.js";
import { TextField, SelectField, TextArea, PhoneField } from "../../ui/Field.jsx";
import { Button } from "../../ui/Button.jsx";
import { Tabs, EmptyState } from "../../ui/Misc.jsx";
import { Ic } from "../../ui/Icons.jsx";
import { validate, rules } from "../../utils/validate.js";
import { useTitle, useReveal } from "../../hooks.js";
import { uid } from "../../utils/format.js";
import { useApp } from "../../state/store.jsx";
import stationery from "@shared/assets/img/stationery.webp";

const TOPICS = ["Booking or appointments", "Payments & invoices", "I’m a lawyer", "Technical problem", "Privacy", "Something else"];
export default function Contact() {
  useTitle("Help & contact");
  const { actions } = useApp();
  const rv = useReveal([]);
  const [f, setF] = useState({ name: "", email: "", phone: "", topic: "", message: "" });
  const [err, setErr] = useState({}); const [sent, setSent] = useState(null); const [busy, setBusy] = useState(false);
  const [cat, setCat] = useState("All"); const [q, setQ] = useState("");
  const schema = { name: rules.name, email: rules.email, topic: rules.required, message: rules.minLen(20, "Please write at least 20 characters so we can help") };
  const set = (k) => (e) => { const v = e.target ? e.target.value : e; setF((x) => ({ ...x, [k]: v })); if (err[k]) setErr((x) => ({ ...x, [k]: "" })); };
  const blur = (k) => () => { if (schema[k]) setErr((x) => ({ ...x, [k]: validate(f, { [k]: schema[k] })[k] || "" })); };
  const submit = (e) => {
    e.preventDefault();
    const er = validate(f, { ...schema, phone: (v) => (v ? rules.phone(v) : "") }); setErr(er);
    if (Object.keys(er).length) { document.querySelector('[aria-invalid="true"]')?.focus(); return; }
    setBusy(true);
    setTimeout(() => { const id = "LC-" + uid("").slice(1, 7).toUpperCase(); try { const k = "lc-contact-demo"; const all = JSON.parse(localStorage.getItem(k) || "[]"); all.push({ id, ...f, at: Date.now() }); localStorage.setItem(k, JSON.stringify(all)); } catch { /* ignore */ } setSent(id); setBusy(false); actions.toast("Message sent (demo)."); }, 800);
  };
  const cats = ["All", ...new Set(FAQS.map((x) => x.cat))];
  const faqs = useMemo(() => FAQS.filter((x) => (cat === "All" || x.cat === cat) && (!q || (x.q + x.a).toLowerCase().includes(q.toLowerCase()))), [cat, q]);
  return (
    <div ref={rv}>
      <section className="wrap" style={{ padding: "clamp(2.5rem,6vw,4.5rem) clamp(1.1rem,4vw,3rem) 0" }}>
        <p className="eyebrow" data-rv>Help & contact</p>
        <h1 className="h-xl" style={{ margin: ".7rem 0 1rem", maxWidth: "13ch" }} data-rv>How can we help?</h1>
        <p className="lead" data-rv>Send us a message, or look through the answers below. We reply within one working day.</p>
      </section>
      <section className="wrap" style={{ padding: "2.5rem clamp(1.1rem,4vw,3rem) 0", display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)", gap: "clamp(1.5rem,5vw,5rem)" }} id="contact-grid">
        <div data-rv>
          {sent ? (
            <div className="panel" style={{ textAlign: "center", padding: "3rem 1.5rem" }} role="status"><span className="empty-ic" style={{ margin: "0 auto 1rem", background: "#dcefe5", color: "#17633f" }}><Ic n="check" size={26} /></span><h2 className="h-md">Message received</h2><p className="muted">Your reference is <b>{sent}</b>. A support member will reply to {f.email} within one working day. (Demo: nothing was actually sent.)</p><Button variant="outline" onClick={() => { setSent(null); setF({ name: "", email: "", phone: "", topic: "", message: "" }); }}>Send another message</Button></div>
          ) : (
            <form onSubmit={submit} noValidate className="form-grid" aria-label="Contact form">
              <TextField label="Full name" required value={f.name} onChange={set("name")} onBlur={blur("name")} error={err.name} autoComplete="name" />
              <TextField label="Email" required type="email" value={f.email} onChange={set("email")} onBlur={blur("email")} error={err.email} autoComplete="email" />
              <PhoneField label="Phone (optional)" value={f.phone} onChange={(v) => setF({ ...f, phone: v })} error={err.phone} required={false} />
              <SelectField label="Topic" required value={f.topic} onChange={set("topic")} onBlur={blur("topic")} placeholder="Choose a topic" options={TOPICS} error={err.topic} />
              <TextArea className="full" label="How can we help?" required rows={6} max={600} value={f.message} onChange={set("message")} onBlur={blur("message")} error={err.message} />
              <div className="full" style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}><Button type="submit" size="lg" loading={busy} iconRight="send">Send message</Button><span className="hint">We never share your details.</span></div>
            </form>)}
        </div>
        <aside data-rv>
          <div style={{ position: "relative", borderRadius: 22, overflow: "hidden", aspectRatio: "16/10", marginBottom: "1.5rem" }}><img src={stationery} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
          <ul className="rows" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {[["mail", "Email", "help@legalconnect.example"], ["phone", "Phone", "1800 000 0000 (toll-free)"], ["clock", "Hours", "Mon–Sat, 9:00 AM – 7:00 PM IST"], ["pin", "Office", "Demo Tower, Bandra Kurla Complex, Mumbai"]].map(([ic, a, b]) => <li key={a} className="row"><Ic n={ic} size={18} /><div className="row-main"><small style={{ marginTop: 0 }}>{a}</small><b>{b}</b></div></li>)}
          </ul>
          <p className="hint" style={{ marginTop: "1rem" }}>These are placeholder contact details for the demonstration.</p>
        </aside>
      </section>
      <section className="wrap" style={{ padding: "clamp(3.5rem,8vw,6rem) clamp(1.1rem,4vw,3rem) 0" }} id="faq">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <h2 className="h-lg" data-rv>Frequently asked questions</h2>
          <div className="inp" style={{ width: "min(320px,100%)" }}><span className="inp-ic"><Ic n="search" size={17} /></span><input className="pl" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search answers…" aria-label="Search FAQs" style={{ borderRadius: 999 }} /></div>
        </div>
        <Tabs tabs={cats.map((c) => ({ value: c, label: c }))} value={cat} onChange={setCat} label="FAQ categories" />
        <div className="faq" style={{ marginTop: ".5rem" }}>
          {faqs.map((x) => <details key={x.q}><summary>{x.q}<Ic n="plus" size={20} /></summary><p>{x.a}</p></details>)}
          {!faqs.length && <EmptyState icon="search" title="No answers match" text="Try a different word, or send us a message above." />}
        </div>
      </section>
      <style>{`@media(max-width:860px){#contact-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
