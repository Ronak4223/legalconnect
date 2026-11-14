import { Calendar } from "../../ui/Calendar.jsx";
import { iso, fromIso, time12 } from "../../utils/format.js";

const pad = (n) => String(n).padStart(2, "0");
/** Free half-hour slots for a lawyer on a date, from their weekly schedule minus bookings that are pending or confirmed. */
export function slotsFor(lawyer, date, appointments, ignoreId) {
  if (!date) return [];
  const sch = (lawyer.schedule || []).find((x) => x.day === fromIso(date).getDay());
  if (!sch || !sch.on) return [];
  const f = Number(sch.from.slice(0, 2)), t = Number(sch.to.slice(0, 2));
  const taken = new Set(appointments.filter((a) => a.lawyerId === lawyer.id && a.date === date && ["pending", "confirmed"].includes(a.status) && a.id !== ignoreId).map((a) => a.time));
  const now = new Date(), isToday = date === iso(now), out = [];
  for (let h = f; h < t; h++) for (const m of ["00", "30"]) {
    const v = `${pad(h)}:${m}`;
    out.push({ v, off: taken.has(v) || (isToday && h * 60 + Number(m) <= now.getHours() * 60 + now.getMinutes() + 30) });
  }
  return out;
}
export const lawyerWorksOn = (l, d) => !!(l.schedule || []).find((x) => x.day === d.getDay() && x.on);
export function nextOpenDays(lawyer, appointments, n = 3) {
  const out = []; const d = new Date();
  for (let i = 0; i < 21 && out.length < n; i++) { const day = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i); const k = iso(day); const free = slotsFor(lawyer, k, appointments).filter((s) => !s.off); if (free.length) out.push({ date: k, first: free[0].v, count: free.length }); }
  return out;
}
export function SlotPicker({ lawyer, appointments, date, time, onDate, onTime, ignoreId }) {
  const slots = slotsFor(lawyer, date, appointments, ignoreId);
  return (
    <div className="cols-2 even" style={{ gap: "1.6rem" }}>
      <Calendar value={date} onChange={(d) => { onDate(d); onTime(""); }} isDisabled={(d) => !lawyerWorksOn(lawyer, d)} />
      <div>
        <p className="lbl" style={{ marginBottom: ".6rem" }}>{date ? `Available times` : "Choose a date first"}</p>
        {date && !slots.length && <p className="muted" style={{ fontSize: ".88rem" }}>No times on this day.</p>}
        <div className="slots" role="group" aria-label="Times">
          {slots.map((s) => <button key={s.v} type="button" disabled={s.off} className={`slot ${time === s.v ? "on" : ""}`} aria-pressed={time === s.v} onClick={() => onTime(s.v)}>{time12(s.v)}</button>)}
        </div>
      </div>
    </div>
  );
}
