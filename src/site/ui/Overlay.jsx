import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Ic } from "./Icons.jsx";
import { Button } from "./Button.jsx";

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
let locks = 0;
function useOverlay(open, onClose, ref) {
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    locks++; document.documentElement.classList.add("no-scroll");
    const el = ref.current;
    (el?.querySelector("[data-autofocus]") || el?.querySelector(FOCUSABLE))?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose?.(); }
      if (e.key === "Tab" && el) {
        const f = [...el.querySelectorAll(FOCUSABLE)].filter((x) => x.offsetParent !== null);
        if (!f.length) return;
        const a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); if (--locks === 0) document.documentElement.classList.remove("no-scroll"); prev?.focus?.(); };
  }, [open, onClose, ref]);
}
export function Modal({ open, onClose, title, subtitle, children, footer, size = "md", className = "" }) {
  const ref = useRef(null);
  useOverlay(open, onClose, ref);
  if (!open) return null;
  return createPortal(
    <div className="ov" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div ref={ref} className={`modal m-${size} ${className}`} role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal-h">
          <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><Ic n="x" size={18} /></button>
        </header>
        <div className="modal-b">{children}</div>
        {footer && <footer className="modal-f">{footer}</footer>}
      </div>
    </div>, document.body);
}
export function Drawer({ open, onClose, title, children, className = "" }) {
  const ref = useRef(null);
  useOverlay(open, onClose, ref);
  if (!open) return null;
  return createPortal(
    <div className="ov ov-r" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <aside ref={ref} className={`drawer ${className}`} role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal-h"><h2>{title}</h2><button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><Ic n="x" size={18} /></button></header>
        <div className="modal-b">{children}</div>
      </aside>
    </div>, document.body);
}
export function Confirm({ open, onClose, onConfirm, title, text, confirm = "Confirm", danger, children }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm" footer={<><Button variant="ghost" onClick={onClose}>Keep it</Button><Button variant={danger ? "danger" : "primary"} onClick={() => { onConfirm(); onClose(); }}>{confirm}</Button></>}>
      {text && <p className="muted">{text}</p>}{children}
    </Modal>
  );
}
/** Menu button. items: [{label, icon, to, onClick, danger, divider}] */
export function Menu({ trigger, items, align = "right", label = "Menu", className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const away = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === "Escape") { setOpen(false); ref.current?.querySelector("button")?.focus(); } };
    document.addEventListener("mousedown", away); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, [open]);
  const onKey = (e) => {
    if (!open) return;
    const els = [...ref.current.querySelectorAll('[role="menuitem"]')]; const i = els.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); els[(i + 1) % els.length]?.focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); els[(i - 1 + els.length) % els.length]?.focus(); }
  };
  return (
    <div className={`menu ${className}`} ref={ref} onKeyDown={onKey}>
      <button type="button" className="menu-t" aria-haspopup="menu" aria-expanded={open} aria-label={label} onClick={() => { setOpen((o) => !o); setTimeout(() => ref.current?.querySelector('[role="menuitem"]')?.focus(), 0); }}>{trigger}</button>
      {open && (
        <div className={`menu-p ${align}`} role="menu">
          {items.map((it, i) => it.divider ? <hr key={i} /> : it.to
            ? <Link key={i} to={it.to} role="menuitem" className={it.danger ? "danger" : ""} onClick={() => setOpen(false)}>{it.icon && <Ic n={it.icon} size={16} />}{it.label}</Link>
            : <button key={i} type="button" role="menuitem" className={it.danger ? "danger" : ""} onClick={() => { setOpen(false); it.onClick?.(); }}>{it.icon && <Ic n={it.icon} size={16} />}{it.label}</button>)}
        </div>)}
    </div>
  );
}
