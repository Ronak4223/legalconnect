import { useId, useState } from "react";
import { Ic } from "./Icons.jsx";
import { passwordScore } from "../utils/validate.js";

function Wrap({ id, label, hint, error, required, children, className = "" }) {
  return (
    <div className={`fld ${error ? "has-err" : ""} ${className}`}>
      {label && <label htmlFor={id} className="lbl">{label}{required && <span aria-hidden="true"> *</span>}</label>}
      {children}
      {error ? <p id={`${id}-e`} className="err" role="alert">{error}</p> : hint ? <p id={`${id}-h`} className="hint">{hint}</p> : null}
    </div>
  );
}
const aria = (id, error, hint) => ({ id, "aria-invalid": error ? true : undefined, "aria-describedby": error ? `${id}-e` : hint ? `${id}-h` : undefined });

export function TextField({ label, hint, error, required, icon, right, className, ...p }) {
  const id = useId();
  return (
    <Wrap id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <div className="inp">
        {icon && <span className="inp-ic"><Ic n={icon} size={17} /></span>}
        <input className={icon ? "pl" : ""} {...aria(id, error, hint)} {...p} />
        {right}
      </div>
    </Wrap>
  );
}
export function PasswordField({ meter, ...p }) {
  const [show, setShow] = useState(false);
  const s = passwordScore(p.value);
  return (
    <div>
      <TextField {...p} type={show ? "text" : "password"} icon="lock" autoComplete={p.autoComplete || "new-password"}
        right={<button type="button" className="inp-btn" onClick={() => setShow((x) => !x)} aria-label={show ? "Hide password" : "Show password"}><Ic n={show ? "eyeOff" : "eye"} size={17} /></button>} />
      {meter && p.value ? (
        <div className="meter" aria-live="polite"><i className={s >= 1 ? `on s${s}` : ""} /><i className={s >= 2 ? `on s${s}` : ""} /><i className={s >= 3 ? `on s${s}` : ""} /><i className={s >= 4 ? `on s${s}` : ""} /><span>{["", "Weak", "Fair", "Good", "Strong"][s]}</span></div>
      ) : null}
    </div>
  );
}
export function PhoneField({ label = "Phone number", error, value, onChange, ...p }) {
  const id = useId();
  return (
    <Wrap id={id} label={label} error={error} required className={p.className}>
      <div className="inp phone">
        <span className="cc" aria-hidden="true">+91</span>
        <input {...aria(id, error)} inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210" value={value} onChange={(e) => onChange(e.target.value.replace(/[^\d\s]/g, "").slice(0, 11))} {...p} />
      </div>
    </Wrap>
  );
}
export function SelectField({ label, hint, error, required, options, placeholder, className, ...p }) {
  const id = useId();
  return (
    <Wrap id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <div className="inp sel">
        <select {...aria(id, error, hint)} {...p}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (typeof o === "string" ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>))}
        </select>
        <Ic n="chevD" size={16} className="sel-ic" />
      </div>
    </Wrap>
  );
}
export function TextArea({ label, hint, error, required, className, max, ...p }) {
  const id = useId();
  return (
    <Wrap id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <div className="inp"><textarea rows={4} {...aria(id, error, hint)} maxLength={max} {...p} /></div>
      {max ? <p className="count">{String(p.value || "").length}/{max}</p> : null}
    </Wrap>
  );
}
export function Check({ label, error, children, ...p }) {
  const id = useId();
  return (
    <div className={`chk ${error ? "has-err" : ""}`}>
      <input type="checkbox" id={id} {...p} aria-invalid={error ? true : undefined} />
      <label htmlFor={id}>{label || children}</label>
      {error && <p className="err" role="alert">{error}</p>}
    </div>
  );
}
export function Switch({ checked, onChange, label, hint, id: idp }) {
  const gen = useId(); const id = idp || gen;
  return (
    <div className="sw-row">
      <div><label htmlFor={id} className="sw-l">{label}</label>{hint && <p className="hint">{hint}</p>}</div>
      <button type="button" role="switch" id={id} aria-checked={!!checked} className={`sw ${checked ? "on" : ""}`} onClick={() => onChange(!checked)}><i /></button>
    </div>
  );
}
/** Multi- or single-choice chips. */
export function Chips({ label, options, value, onChange, multi = true, error, required }) {
  const id = useId();
  const toggle = (o) => onChange(multi ? (value.includes(o) ? value.filter((x) => x !== o) : [...value, o]) : o);
  return (
    <div className={`fld ${error ? "has-err" : ""}`} role="group" aria-labelledby={`${id}-l`}>
      {label && <span id={`${id}-l`} className="lbl">{label}{required && <span aria-hidden="true"> *</span>}</span>}
      <div className="chips">
        {options.map((o) => { const on = multi ? value.includes(o) : value === o; return (
          <button type="button" key={o} className={`chip ${on ? "on" : ""}`} aria-pressed={on} onClick={() => toggle(o)}>{on && <Ic n="check" size={14} />}{o}</button>); })}
      </div>
      {error && <p className="err" role="alert">{error}</p>}
    </div>
  );
}
/** Big selectable option cards (consultation type, payment method ...). */
export function OptionCards({ options, value, onChange, name }) {
  return (
    <div className="opts" role="radiogroup" aria-label={name}>
      {options.map((o) => (
        <button type="button" key={o.value} role="radio" aria-checked={value === o.value} className={`opt ${value === o.value ? "on" : ""}`} onClick={() => onChange(o.value)}>
          {o.icon && <span className="opt-ic"><Ic n={o.icon} size={20} /></span>}
          <span className="opt-t"><b>{o.title}</b><small>{o.sub}</small></span>
          {o.right && <span className="opt-r">{o.right}</span>}
          <span className="opt-dot" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
export function FileDrop({ label, hint, file, onFile, accept, error, icon = "upload", round }) {
  const id = useId();
  return (
    <div className={`fld ${error ? "has-err" : ""}`}>
      {label && <span className="lbl">{label}</span>}
      <label htmlFor={id} className={`drop ${file ? "has" : ""} ${round ? "round" : ""}`}>
        <Ic n={file ? "checkC" : icon} size={22} />
        <span className="drop-t">{file ? file.name : "Click to choose a file"}<small>{file ? `${Math.max(1, Math.round(file.size / 1024))} KB — demo only, not uploaded` : hint}</small></span>
        <input id={id} type="file" accept={accept} className="sr-only" onChange={(e) => onFile(e.target.files?.[0] || null)} />
      </label>
      {error && <p className="err" role="alert">{error}</p>}
    </div>
  );
}
