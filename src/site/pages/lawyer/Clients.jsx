import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useApp } from "../../state/store.jsx";
import { DataTable } from "../../ui/DataTable.jsx";
import { Avatar, EmptyState, StatusBadge } from "../../ui/Misc.jsx";
import { Drawer } from "../../ui/Overlay.jsx";
import { Button } from "../../ui/Button.jsx";
import { Ic } from "../../ui/Icons.jsx";
import { clientsOf, apptStamp } from "../../state/selectors.js";
import { dateLong, dateShort, time12 } from "../../utils/format.js";
import { useTitle, useGo } from "../../hooks.js";

export default function LawyerClients() {
  useTitle("Clients");
  const { state, session, actions } = useApp(); const go = useGo();
  const [sp, setSp] = useSearchParams(); const q = sp.get("q") || "", sel = sp.get("c");
  const me = session.id;
  const rows = useMemo(() => clientsOf(state, me).map((c) => {
    const ap = state.appointments.filter((a) => a.lawyerId === me && a.userId === c.id), cs = state.cases.filter((x) => x.lawyerId === me && x.userId === c.id);
    const last = ap.filter((a) => a.status === "completed").sort((a, b) => apptStamp(b) - apptStamp(a))[0];
    return { ...c, ap, cs, active: cs.filter((x) => x.status === "active").length, last: last?.date };
  }).filter((c) => !q || (c.name + c.email + (c.city || "")).toLowerCase().includes(q.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name)), [state, me, q]);
  const cur = rows.find((r) => r.id === sel) || clientsOf(state, me).map((c) => rows.find((r) => r.id === c.id)).find((r) => r?.id === sel);
  const msg = (c) => { const id = actions.openConversation(c.id); go(`/lawyer/messages?c=${id}`); };
  return (
    <>
      <div className="ph"><div><h1>Clients</h1><p>{rows.length} {rows.length === 1 ? "client" : "clients"}{q ? ` matching “${q}”` : ""}.</p></div>
        <div className="inp" style={{ width: "min(320px,100%)" }}><span className="inp-ic"><Ic n="search" size={17} /></span><input className="pl" style={{ borderRadius: 999 }} placeholder="Search clients" aria-label="Search clients" value={q} onChange={(e) => { const n = new URLSearchParams(sp); if (e.target.value) n.set("q", e.target.value); else n.delete("q"); setSp(n, { replace: true }); }} /></div></div>
      <div className="panel" style={{ padding: "0 .6rem" }}>
        <DataTable caption="Clients" rows={rows} onRowClick={(r) => setSp({ ...(q ? { q } : {}), c: r.id }, { replace: true })} empty={<EmptyState icon="users" title="No clients found" text={q ? "Try a different name." : "Clients appear here after their first booking."} />}
          columns={[{ key: "name", label: "Client", render: (r) => <span style={{ display: "inline-flex", gap: ".7rem", alignItems: "center" }}><Avatar name={r.name} size={38} /><span><b style={{ fontWeight: 500 }}>{r.name}</b><div className="muted" style={{ fontSize: ".76rem" }}>{r.email}</div></span></span> },
            { key: "city", label: "City", render: (r) => r.city || "—" }, { key: "cs", label: "Active cases", render: (r) => r.active }, { key: "ap", label: "Consultations", render: (r) => r.ap.filter((a) => a.status === "completed").length }, { key: "last", label: "Last consultation", render: (r) => (r.last ? dateShort(r.last) : "—") },
            { key: "go", label: "", render: (r) => <Button variant="ghost" size="sm" iconRight="chevR">Open</Button> }]} />
      </div>
      <Drawer open={!!cur} onClose={() => { const n = new URLSearchParams(sp); n.delete("c"); setSp(n, { replace: true }); }} title="Client profile">
        {cur && <div style={{ display: "grid", gap: "1.6rem" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}><Avatar name={cur.name} size={72} /><div><h3 className="h-md">{cur.name}</h3><p className="muted" style={{ margin: 0, fontSize: ".86rem" }}>Client since {cur.since || "2026"}</p></div></div>
          <dl className="dl"><dt>Email</dt><dd>{cur.email}</dd><dt>Phone</dt><dd>{cur.phone ? `+91 ${cur.phone}` : "—"}</dd><dt>City</dt><dd>{cur.city || "—"}</dd></dl>
          <div style={{ display: "flex", gap: ".6rem" }}><Button icon="message" onClick={() => msg(cur)}>Message</Button><Button variant="outline" icon="briefcase" to={`/lawyer/cases${cur.cs[0] ? `?c=${cur.cs[0].id}` : ""}`}>Cases</Button></div>
          <section><h4 className="h-md" style={{ marginBottom: ".5rem" }}>Associated cases</h4>{cur.cs.length ? <div className="rows">{cur.cs.map((c) => <div className="row" key={c.id}><div className="row-main"><b><Link to={`/lawyer/cases?c=${c.id}`} style={{ textDecoration: "none" }}>{c.title}</Link></b><small>{c.number}</small></div><StatusBadge status={c.status === "closed" ? "completed" : "active"}>{c.status === "closed" ? "Completed" : "Active"}</StatusBadge></div>)}</div> : <p className="muted" style={{ fontSize: ".88rem" }}>No cases yet.</p>}</section>
          <section><h4 className="h-md" style={{ marginBottom: ".5rem" }}>Consultation history</h4><div className="rows">{[...cur.ap].sort((a, b) => apptStamp(b) - apptStamp(a)).map((a) => <div className="row" key={a.id}><div className="row-main"><b>{a.topic}</b><small>{dateLong(a.date)} · {time12(a.time)}</small></div><StatusBadge status={a.status} /></div>)}</div></section>
        </div>}
      </Drawer>
    </>
  );
}
