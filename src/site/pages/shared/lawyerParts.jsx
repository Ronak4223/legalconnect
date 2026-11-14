import { Link } from "react-router-dom";
import { LawyerPhoto, Stars } from "../../ui/Misc.jsx";
import { Button } from "../../ui/Button.jsx";
import { Ic } from "../../ui/Icons.jsx";
import { money } from "../../utils/format.js";

export const Verified = ({ l }) => l.verification === "verified" ? <span title="Bar Council enrolment verified" style={{ color: "var(--brand-2)", display: "inline-flex" }}><Ic n="shield" size={16} /></span> : null;
export const RatingText = ({ l }) => (l.reviews ? <span className="meta-r"><Stars value={l.rating} /> <b style={{ fontWeight: 500 }}>{l.rating.toFixed(1)}</b> <span className="muted">({l.reviews})</span></span> : <span className="pill-tag">New on LegalConnect</span>);

/** Editorial list row used in the directory. */
export function LawyerRow({ l, saved, onSave }) {
  return (
    <article className="lrow">
      <Link to={`/lawyer/${l.id}`} aria-label={`${l.name}'s profile`}><LawyerPhoto l={l} size={96} /></Link>
      <div style={{ minWidth: 0 }}>
        <h3><Link to={`/lawyer/${l.id}`} style={{ textDecoration: "none" }}>{l.name}</Link> <Verified l={l} /></h3>
        <div className="muted" style={{ fontSize: ".9rem", marginTop: ".15rem" }}>{l.areas.join(" · ")}</div>
        <div className="meta"><span><Ic n="pin" size={15} />{l.city}</span><span><Ic n="briefcase" size={15} />{l.exp} yrs</span><span><Ic n="globe" size={15} />{l.langs.slice(0, 3).join(", ")}</span><RatingText l={l} /></div>
        <p className="muted" style={{ fontSize: ".88rem", margin: ".7rem 0 0", maxWidth: "58ch" }}>{l.tagline}</p>
      </div>
      <div className="side">
        <div className="fee">{money(l.fee)}<small>per video consultation</small></div>
        <div style={{ display: "flex", gap: ".5rem" }}>
          {onSave && <button type="button" className="icon-btn" style={{ border: "1px solid var(--line)" }} aria-pressed={!!saved} aria-label={saved ? `Remove ${l.name} from saved` : `Save ${l.name}`} onClick={() => onSave(l.id)}><Ic n="heart" size={18} fill={saved} /></button>}
          <Button to={`/lawyer/${l.id}`} variant="outline" size="sm">View profile</Button>
          <Button to={`/lawyer/${l.id}?book=1`} size="sm">Book</Button>
        </div>
      </div>
    </article>
  );
}
/** Compact row for dashboards. */
export function LawyerMini({ l, action }) {
  return (
    <div className="row">
      <LawyerPhoto l={l} size={46} />
      <div className="row-main"><b><Link to={`/lawyer/${l.id}`} style={{ textDecoration: "none" }}>{l.name}</Link></b><small>{l.area} · {l.city} · {l.reviews ? `★ ${l.rating.toFixed(1)}` : "New"}</small></div>
      {action || <Button to={`/lawyer/${l.id}`} variant="outline" size="sm">View</Button>}
    </div>
  );
}
