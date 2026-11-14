import { useState } from "react";
import { useApp } from "../../state/store.jsx";
import { Tabs, EmptyState } from "../../ui/Misc.jsx";
import { Button } from "../../ui/Button.jsx";
import { ApptRow, ApptDetail } from "../shared/Appointments.jsx";
import { apptStamp } from "../../state/selectors.js";
import { useTitle } from "../../hooks.js";

export default function UserAppointments() {
  useTitle("My appointments");
  const { state, session } = useApp();
  const [tab, setTab] = useState("upcoming"); const [sel, setSel] = useState(null); const [room, setRoom] = useState(false);
  const mine = state.appointments.filter((a) => a.userId === session.id);
  const groups = { upcoming: mine.filter((a) => ["pending", "confirmed"].includes(a.status)).sort((a, b) => apptStamp(a) - apptStamp(b)), completed: mine.filter((a) => a.status === "completed").sort((a, b) => apptStamp(b) - apptStamp(a)), cancelled: mine.filter((a) => ["cancelled", "rejected"].includes(a.status)).sort((a, b) => apptStamp(b) - apptStamp(a)) };
  const empty = { upcoming: ["No upcoming appointments", "Book a consultation to see it here."], completed: ["No completed consultations yet", "Past consultations and invoices appear here."], cancelled: ["Nothing cancelled", "Cancelled or declined requests appear here."] }[tab];
  return (
    <>
      <div className="ph"><div><h1>My appointments</h1><p>Consultations with your lawyers — upcoming, completed and cancelled.</p></div><Button to="/find-lawyers" icon="plus">Book a consultation</Button></div>
      <Tabs value={tab} onChange={setTab} label="Appointment status" tabs={[{ value: "upcoming", label: "Upcoming", count: groups.upcoming.length }, { value: "completed", label: "Completed", count: groups.completed.length }, { value: "cancelled", label: "Cancelled", count: groups.cancelled.length }]} />
      <div className="panel" style={{ marginTop: "1rem", padding: "0 1.3rem" }}>
        {groups[tab].length ? <div className="rows">{groups[tab].map((a) => <ApptRow key={a.id} a={a} role="user" onOpen={(x) => { setRoom(false); setSel(x.id); }}>{a.status === "confirmed" && <Button size="sm" icon="video" onClick={() => { setRoom(true); setSel(a.id); }}>Join</Button>}</ApptRow>)}</div>
          : <EmptyState icon="calendar" title={empty[0]} text={empty[1]} action={tab === "upcoming" ? "Find a lawyer" : undefined} to={tab === "upcoming" ? "/find-lawyers" : undefined} />}
      </div>
      {sel && <ApptDetail id={sel} role="user" onClose={() => { setSel(null); setRoom(false); }} autoRoom={room} />}
    </>
  );
}
