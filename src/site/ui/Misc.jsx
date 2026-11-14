import { Link } from "react-router-dom";
import { Ic } from "./Icons.jsx";
import { initials } from "../utils/format.js";

const TONES = { pending: "amber", in_review: "amber", unread: "teal", confirmed: "teal", upcoming: "teal", active: "teal", open: "teal", paid: "green", completed: "green", resolved: "green", verified: "green", closed: "gray", cancelled: "gray", rejected: "red", failed: "red", overdue: "red", refunded: "gray", processing: "amber", scheduled: "amber" };
const LABEL = { in_review: "In review", paid: "Paid", upcoming: "Upcoming" };
export function StatusBadge({ status, children }) {
  const t = TONES[status] || "gray";
  return <span className={`badge b-${t}`}><i aria-hidden="true" />{children || LABEL[status] || status.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase())}</span>;
}
const HUES = ["#0f3f4d", "#1c6b73", "#7a5c2e", "#3b4f7a", "#6b3f5e", "#2f6b4f"];
export function Avatar({ name = "", src, size = 40, className = "" }) {
  const h = HUES[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length];
  return src
    ? <img src={src} alt="" width={size} height={size} className={`avatar ${className}`} style={{ width: size, height: size }} />
    : <span className={`avatar mono ${className}`} style={{ width: size, height: size, background: h, fontSize: size * 0.36 }} aria-hidden="true">{initials(name)}</span>;
}
/** Lawyer portrait. Existing lawyers use the shared CSS image variables (im/sz/ps); newer ones carry their own image URL. */
export function LawyerPhoto({ l, size = 48, zoom = 1, ratio, hero, className = "", style, label }) {
  const h = hero && l.hero ? l.hero : null;
  const img = h ? `url(${h.src})` : l.src ? `url(${l.src})` : `var(--${l.im})`;
  // large portraits: a dedicated high-res crop if we have one, otherwise the shared photo scaled to cover the box
  const big = hero && !h && !l.src;
  const sz = h ? h.sz : big ? "cover" : zoom === 1 ? l.sz : `${parseFloat(l.sz) * zoom}%`;
  const pos = h ? h.ps : big ? `${(l.ps || "50% 20%").split(" ")[0]} 22%` : l.ps;
  const box = ratio ? { width: "100%", aspectRatio: ratio } : { width: size, height: size };
  return <span role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} className={`lphoto ${className}`} style={{ ...box, backgroundImage: img, backgroundSize: sz, backgroundPosition: pos, ...style }} />;
}
export function Stars({ value, size = 14 }) {
  return <span className="stars" aria-label={`${value} out of 5`}>{[1, 2, 3, 4, 5].map((i) => <Ic key={i} n="star" size={size} fill={value >= i - 0.25} className={value >= i - 0.25 ? "on" : ""} />)}</span>;
}
export function Stat({ label, value, sub, icon, trend, spark }) {
  return (
    <div className="stat">
      <div className="stat-top"><span>{label}</span>{icon && <Ic n={icon} size={16} />}</div>
      <div className="stat-v">{value}</div>
      <div className="stat-s">{trend && <b className={trend.startsWith("-") ? "dn" : "up"}>{trend}</b>}{sub}</div>
      {spark}
    </div>
  );
}
export function EmptyState({ icon = "inbox", title, text, action, to, children }) {
  return (
    <div className="empty">
      <span className="empty-ic"><Ic n={icon} size={26} /></span>
      <h3>{title}</h3>{text && <p>{text}</p>}
      {action && (to ? <Link to={to} className="btn btn-primary btn-md"><span>{action}</span></Link> : null)}
      {children}
    </div>
  );
}
export function Tabs({ tabs, value, onChange, label = "Sections" }) {
  const onKey = (e) => {
    const i = tabs.findIndex((t) => t.value === value);
    const j = e.key === "ArrowRight" ? (i + 1) % tabs.length : e.key === "ArrowLeft" ? (i - 1 + tabs.length) % tabs.length : -1;
    if (j >= 0) { e.preventDefault(); onChange(tabs[j].value); document.getElementById(`tab-${tabs[j].value}`)?.focus(); }
  };
  return (
    <div className="tabs" role="tablist" aria-label={label} onKeyDown={onKey}>
      {tabs.map((t) => (
        <button key={t.value} id={`tab-${t.value}`} type="button" role="tab" aria-selected={value === t.value} tabIndex={value === t.value ? 0 : -1} className={value === t.value ? "on" : ""} onClick={() => onChange(t.value)}>
          {t.label}{t.count != null && <em>{t.count}</em>}
        </button>
      ))}
    </div>
  );
}
export function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  return (
    <nav className="pager" aria-label="Pagination">
      <button type="button" onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Previous page"><Ic n="chevL" size={16} /></button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => <button type="button" key={n} className={n === page ? "on" : ""} aria-current={n === page ? "page" : undefined} onClick={() => onChange(n)}>{n}</button>)}
      <button type="button" onClick={() => onChange(page + 1)} disabled={page >= pages} aria-label="Next page"><Ic n="chevR" size={16} /></button>
    </nav>
  );
}
export function Stepper({ steps, current }) {
  return (
    <ol className="stepper" aria-label="Progress">
      {steps.map((s, i) => (
        <li key={s} className={i < current ? "done" : i === current ? "now" : ""} aria-current={i === current ? "step" : undefined}>
          <span className="st-n">{i < current ? <Ic n="check" size={14} /> : i + 1}</span><span className="st-l">{s}</span>
        </li>
      ))}
    </ol>
  );
}
export function Logo({ to = "/", light, className = "" }) {
  return (
    <Link to={to} className={`logo ${light ? "light" : ""} ${className}`} aria-label="LegalConnect home">
      <svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 6v19M10 26h12M7 10h18M7 10l-3 7h6l-3-7ZM25 10l-3 7h6l-3-7Z" /></svg>
      <span>LEGALCONNECT</span>
    </Link>
  );
}
export function Section({ title, action, children, className = "" }) {
  return (
    <section className={`sec ${className}`}>
      {(title || action) && <header className="sec-h"><h2>{title}</h2>{action}</header>}
      {children}
    </section>
  );
}
