import { useState } from "react";
import { useApp } from "../../state/store.jsx";
import { Tabs, EmptyState } from "../../ui/Misc.jsx";
import { Button, IconButton } from "../../ui/Button.jsx";
import { Ic } from "../../ui/Icons.jsx";
import { ago } from "../../utils/format.js";
import { useGo } from "../../hooks.js";

const KIND = { appointment: "calendar", case: "briefcase", message: "message", payment: "wallet", general: "bell" };
export default function NotificationsView() {
  const { state, session, actions } = useApp(); const go = useGo();
  const [tab, setTab] = useState("all");
  const mine = state.notifications.filter((n) => n.to === session.id).sort((a, b) => b.ts - a.ts);
  const unread = mine.filter((n) => !n.read).length;
  const shown = mine.filter((n) => tab === "all" || (tab === "unread" ? !n.read : n.kind === tab));
  const count = (k) => mine.filter((n) => n.kind === k).length;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "1rem", flexWrap: "wrap" }}>
        <Tabs value={tab} onChange={setTab} label="Notification filters" tabs={[{ value: "all", label: "All", count: mine.length }, { value: "unread", label: "Unread", count: unread }, { value: "appointment", label: "Appointments", count: count("appointment") }, { value: "case", label: "Cases", count: count("case") }, { value: "message", label: "Messages", count: count("message") }, { value: "payment", label: "Payments", count: count("payment") }]} />
        <Button variant="ghost" size="sm" icon="check" disabled={!unread} onClick={() => { actions.markAllNotif(); actions.toast("All notifications marked as read."); }}>Mark all read</Button>
      </div>
      <div className="panel" style={{ marginTop: "1rem", padding: "0 1.3rem" }}>
        {shown.length ? shown.map((n) => (
          <div key={n.id} style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
            <button type="button" className={`nt ${n.read ? "" : "unread"}`} onClick={() => { actions.markNotif(n.id); if (n.link) go(n.link); }}>
              <span className="nt-ic"><Ic n={KIND[n.kind] || "bell"} size={19} /></span>
              <span style={{ flex: 1, minWidth: 0 }}><b>{n.title}</b><p>{n.body}</p></span>
              {!n.read && <i className="dot" aria-label="Unread" />}<time dateTime={new Date(n.ts).toISOString()}>{ago(n.ts)}</time>
            </button>
            <IconButton icon={n.read ? "eye" : "check"} label={n.read ? "Mark as unread" : "Mark as read"} onClick={() => actions.markNotif(n.id, !n.read)} />
            <IconButton icon="trash" label="Delete notification" onClick={() => actions.deleteNotif(n.id)} />
          </div>
        )) : <EmptyState icon="bell" title={tab === "unread" ? "You’re all caught up" : "Nothing here yet"} text="Appointment updates, lawyer replies and case changes will show up here." />}
      </div>
    </div>
  );
}
