import { Link } from "react-router-dom";
import { Ic } from "./Icons.jsx";

/** variant: primary | gold | outline | ghost | danger | soft ; size: sm | md | lg. Pass `to` for a router link. */
export function Button({ variant = "primary", size = "md", icon, iconRight, loading, to, className = "", children, ...p }) {
  const cls = `btn btn-${variant} btn-${size} ${className}`;
  const inner = (<>
    {loading ? <span className="spin" aria-hidden="true" /> : icon && <Ic n={icon} size={size === "sm" ? 15 : 17} />}
    {children && <span>{children}</span>}
    {iconRight && !loading && <Ic n={iconRight} size={size === "sm" ? 15 : 17} />}
  </>);
  if (to) return <Link to={to} className={cls} {...p}>{inner}</Link>;
  return <button type="button" className={cls} disabled={loading || p.disabled} {...p}>{inner}</button>;
}
export const IconButton = ({ icon, label, className = "", ...p }) => (
  <button type="button" className={`icon-btn ${className}`} aria-label={label} title={label} {...p}><Ic n={icon} size={18} /></button>
);
