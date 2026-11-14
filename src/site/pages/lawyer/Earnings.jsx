import { useMemo, useState } from "react";
import { useApp } from "../../state/store.jsx";
import { Stat, Tabs, StatusBadge, EmptyState } from "../../ui/Misc.jsx";
import { AreaChart, BarChart, Donut } from "../../ui/Charts.jsx";
import { DataTable } from "../../ui/DataTable.jsx";
import { Button } from "../../ui/Button.jsx";
import { Modal } from "../../ui/Overlay.jsx";
import { TextField } from "../../ui/Field.jsx";
import { InvoiceModal } from "../shared/Invoice.jsx";
import { lawyerMoney, personName } from "../../state/selectors.js";
import { money, dateShort } from "../../utils/format.js";
import { useTitle } from "../../hooks.js";

export default function LawyerEarnings() {
  useTitle("Earnings");
  const { state, session, actions } = useApp();
  const me = session.id, m = useMemo(() => lawyerMoney(state, me), [state, me]);
  const [tab, setTab] = useState("all"); const [wd, setWd] = useState(false); const [amt, setAmt] = useState(""); const [err, setErr] = useState(""); const [inv, setInv] = useState(null);
  const pays = state.payments.filter((p) => p.lawyerId === me).sort((a, b) => b.ts - a.ts);
  const rows = pays.filter((p) => tab === "all" || (tab === "paid" ? p.status === "paid" : p.status === "processing")).slice(0, 40);
  const counts = useMemo(() => { const mm = m.monthly.map((x) => ({ ...x, value: 0 })); pays.filter((p) => p.status === "paid").forEach((p) => { const d = new Date(p.ts), b = mm.find((x) => x.y === d.getFullYear() && x.m === d.getMonth()); if (b) b.value++; }); return mm.slice(-8).map((x, i, a) => ({ label: x.label, value: x.value, accent: i === a.length - 1 })); }, [pays, m]);
  const types = ["video", "phone", "in-person"].map((t, i) => ({ label: { video: "Video", phone: "Phone", "in-person": "In person" }[t], value: state.appointments.filter((a) => a.lawyerId === me && ["confirmed", "completed"].includes(a.status) && a.type === t).length, color: ["#17456b", "#e8c47a", "#7a8da3"][i] }));
  const diff = m.pace;
  const withdraw = () => { const v = Number(amt); if (!v || v < 500) return setErr("Minimum withdrawal is ₹500"); if (v > m.available) return setErr(`You can withdraw up to ${money(m.available)}`); actions.withdraw(v); setWd(false); setAmt(""); setErr(""); actions.toast(`${money(v)} withdrawal started (demo). It will arrive in 1–2 working days.`); };
  return (
    <>
      <div className="ph"><div><h1>Earnings</h1><p>Your consultation income after the 10% platform fee. Demonstration figures.</p></div><Button icon="download" onClick={() => setWd(true)} disabled={m.available < 500}>Withdraw {money(m.available)}</Button></div>
      <div className="stats">
        <Stat label="Total earnings" value={money(m.total)} sub={`${m.count} paid consultations`} icon="rupee" />
        <Stat label="This month" value={money(m.thisMonth)} trend={diff ? `${diff > 0 ? "+" : ""}${diff}%` : undefined} sub="on pace vs last month" icon="trend" />
        <Stat label="Pending" value={money(m.pending)} sub={`${m.pendingCount} in progress`} icon="clock" />
        <Stat label="Available" value={money(m.available)} sub={`${money(m.paidOut)} paid out`} icon="wallet" />
      </div>
      <div className="cols-2" style={{ marginTop: "2.4rem" }}>
        <section><div className="sec-h"><h2>Monthly earnings</h2><span className="muted" style={{ fontSize: ".8rem" }}>Last 12 months</span></div><div className="panel"><AreaChart data={m.monthly} height={250} /></div></section>
        <section><div className="sec-h"><h2>Consultation mix</h2></div><div className="panel" style={{ display: "flex", gap: "1.6rem", alignItems: "center", flexWrap: "wrap" }}><Donut segments={types} center={types.reduce((a, t) => a + t.value, 0)} sub="consultations" /><div className="legend" style={{ flex: 1, minWidth: 150 }}>{types.map((t) => <span key={t.label}><i style={{ background: t.color }} />{t.label}<b>{t.value}</b></span>)}</div></div></section>
      </div>
      <div className="cols-2" style={{ marginTop: "2rem" }}>
        <section><div className="sec-h"><h2>Paid consultations per month</h2></div><div className="panel"><BarChart data={counts} height={170} /></div></section>
        <section><div className="sec-h"><h2>Payout history</h2></div><div className="panel rows">{state.payouts.filter((p) => p.lawyerId === me).sort((a, b) => b.ts - a.ts).map((p) => <div className="row" key={p.id}><div className="row-main"><b>{money(p.amount)}</b><small>{dateShort(new Date(p.ts).toISOString().slice(0, 10))} · to bank account •••• 6021</small></div><StatusBadge status={p.status} /></div>)}{!state.payouts.some((p) => p.lawyerId === me) && <p className="muted" style={{ margin: 0, fontSize: ".88rem" }}>No payouts yet.</p>}</div></section>
      </div>
      <section className="sec">
        <div className="sec-h"><h2>Transactions</h2></div>
        <Tabs value={tab} onChange={setTab} label="Transaction status" tabs={[{ value: "all", label: "All" }, { value: "paid", label: "Paid" }, { value: "processing", label: "Pending" }]} />
        <div className="panel" style={{ marginTop: "1rem", padding: "0 .6rem" }}>
          <DataTable caption="Transactions" rows={rows} empty={<EmptyState icon="wallet" title="No transactions" />}
            columns={[{ key: "ts", label: "Date", render: (p) => dateShort(new Date(p.ts).toISOString().slice(0, 10)) }, { key: "c", label: "Client", render: (p) => personName(state, p.userId) }, { key: "desc", label: "Description", render: (p) => p.desc },
              { key: "g", label: "Fee", className: "num", render: (p) => money(p.amount) }, { key: "n", label: "You receive", className: "num", render: (p) => <b style={{ fontWeight: 500 }}>{money(Math.round(p.amount * 0.9))}</b> }, { key: "s", label: "Status", render: (p) => <StatusBadge status={p.status}>{p.status === "processing" ? "Pending" : undefined}</StatusBadge> }, { key: "i", label: "", render: (p) => <Button variant="ghost" size="sm" icon="file" aria-label={`Invoice ${p.invoice}`} onClick={() => setInv(p.id)} /> }]} />
        </div>
      </section>
      <Modal open={wd} onClose={() => setWd(false)} size="sm" title="Withdraw earnings" subtitle={`Available: ${money(m.available)}`} footer={<><Button variant="ghost" onClick={() => setWd(false)}>Cancel</Button><Button onClick={withdraw}>Withdraw</Button></>}>
        <TextField label="Amount (₹)" type="number" min="500" value={amt} onChange={(e) => { setAmt(e.target.value); setErr(""); }} error={err} data-autofocus /><p className="hint" style={{ marginTop: ".7rem" }}>Demo: no money moves. The withdrawal appears in your payout history.</p>
      </Modal>
      <InvoiceModal id={inv} onClose={() => setInv(null)} />
    </>
  );
}
