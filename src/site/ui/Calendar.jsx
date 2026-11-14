import { useState } from "react";
import { Ic } from "./Icons.jsx";
import { iso, fromIso, monthYear } from "../utils/format.js";

const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
/** Month-grid date picker. value is "YYYY-MM-DD"; isDisabled(Date) lets the caller block days (past, unavailable ...). */
export function Calendar({ value, onChange, isDisabled = () => false, minDate = new Date() }) {
  const [view, setView] = useState(() => { const d = value ? fromIso(value) : new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const first = view.getDay(), days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const today = iso(new Date()), min = iso(minDate);
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1))];
  const move = (n) => setView(new Date(view.getFullYear(), view.getMonth() + n, 1));
  const canPrev = iso(new Date(view.getFullYear(), view.getMonth(), 0)) >= min;
  return (
    <div className="cal">
      <div className="cal-h">
        <button type="button" onClick={() => move(-1)} disabled={!canPrev} aria-label="Previous month"><Ic n="chevL" size={16} /></button>
        <b aria-live="polite">{monthYear(view)}</b>
        <button type="button" onClick={() => move(1)} aria-label="Next month"><Ic n="chevR" size={16} /></button>
      </div>
      <div className="cal-g" role="grid">
        {DOW.map((d) => <span key={d} className="dow" role="columnheader">{d}</span>)}
        {cells.map((d, i) => {
          if (!d) return <span key={i} />;
          const k = iso(d), off = k < min || isDisabled(d);
          return <button type="button" key={k} role="gridcell" disabled={off} className={`${k === value ? "on" : ""} ${k === today ? "today" : ""}`} aria-pressed={k === value} aria-label={d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} onClick={() => onChange(k)}>{d.getDate()}</button>;
        })}
      </div>
    </div>
  );
}
