import { useState } from "react";
import { useApp } from "../../state/store.jsx";
import { Tabs, EmptyState } from "../../ui/Misc.jsx";
import { Button } from "../../ui/Button.jsx";
import { Confirm } from "../../ui/Overlay.jsx";
import { SelectField } from "../../ui/Field.jsx";
import { ApptRow, ApptDetail } from "../shared/Appointments.jsx";
import { apptStamp, personName } from "../../state/selectors.js";
import { useTitle } from "../../hooks.js";

export default function LawyerAppointments() {
  useTitle("Appointments");
  const { state, session, actions } = useApp();
  const [tab, setTab] = useState("pending"); const [sel, setSel] = useState(null); const [room, setRoom] = useState(false); const [rej, setRej] = useState(null); const [reason, setReason] = useState("");
  const mine = state.appointments.filter((a) => a.lawyerId === session.id);
  const g = { pending: mine.filter((a) => a.status === "pending"), confirmed: mine.filter((a) => a.status === "confirmed"), completed: mine.filter((a) => a.status === "completed"), cancelled: mine.filter((a) => ["cancelled", "rejected"].includes(a.status)) };
  Object.keys(g).forEach((k) => g[k].sort((a, b) => (k === "completed" || k === "cancelled" ? apptStamp(b) - apptStamp(a) : apptStamp(a) - apptStamp(b))));
  const msg = { pending: ["No pending requests", "New booking requests from clients appear here for you to accept or decline."], confirmed: ["No confirmed appointments", "Accepted consultations appear here."], completed: ["No completed consultations", "Mark a consultation as completed after you finish it."], cancelled: ["Nothing cancelled or declined", ""] }[tab];
  const open = (x) => { setRoom(false); setSel(x.id); };
  return (
    <>
      <div className="ph"><div><h1>Appointments</h1><p>Review requests, manage your calendar and complete consultations.</p></div></div>
      <Tabs value={tab} onChange={setTab} label="Appointment status" tabs={[{ value: "pending", label: "Pending requests", count: g.pending.length }, { value: "confirmed", label: "Confirmed", count: g.confirmed.length }, { value: "completed", label: "Completed", count: g.completed.length }, { value: "cancelled", label: "Cancelled", count: g.cancelled.length }]} />
      <div className="panel" style={{ marginTop: "1rem", padding: "0 1.3rem" }}>
        {g[tab].length ? <div className="rows">{g[tab].map((a) => (
          <ApptRow key={a.id} a={a} role="lawyer" onOpen={open}>
            {a.status === "pending" && <><Button size="sm" variant="ghost" onClick={() => { setReason(""); setRej(a.id); }}>Decline</Button><Button size="sm" onClick={() => { actions.setAppt(a.id, "accept"); actions.toast(`Accepted — ${personName(state, a.userId)} has been notified.`); }}>Accept</Button></>}
            {a.status === "confirmed" && <><Button size="sm" variant="soft" onClick={() => { actions.setAppt(a.id, "complete"); actions.toast("Marked as completed."); }}>Complete</Button><Button size="sm" icon="video" onClick={() => { setRoom(true); setSel(a.id); }}>Join</Button></>}
          </ApptRow>))}</div> : <EmptyState icon="calendar" title={msg[0]} text={msg[1]} />}
      </div>
      {sel && <ApptDetail id={sel} role="lawyer" onClose={() => { setSel(null); setRoom(false); }} autoRoom={room} />}
      <Confirm open={!!rej} onClose={() => setRej(null)} danger confirm="Decline request" title="Decline this request?" onConfirm={() => { actions.setAppt(rej, "reject", { reason: reason || "Not available" }); actions.toast("Request declined. The client will be refunded."); }}>
        <SelectField label="Reason (shared with the client)" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Choose a reason" options={["Not available at that time", "Outside my practice area", "Conflict of interest", "Other"]} />
      </Confirm>
    </>
  );
}
