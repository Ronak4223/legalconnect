import { useState } from "react";
import { useApp } from "../../state/store.jsx";
import { DataTable } from "../../ui/DataTable.jsx";
import { Tabs, StatusBadge, EmptyState, Stat } from "../../ui/Misc.jsx";
import { Button } from "../../ui/Button.jsx";
import { InvoiceModal } from "../shared/Invoice.jsx";
import { lawyerById } from "../../state/selectors.js";
import { money, dateShort } from "../../utils/format.js";
import { Ic } from "../../ui/Icons.jsx";
import { useTitle } from "../../hooks.js";

export default function UserPayments() {
  useTitle("Payments");
  const { state, session } = useApp();
  const [tab, setTab] = useState("all"); const [inv, setInv] = useState(null);
  const mine = state.payments.filter((p) => p.userId === session.id).sort((a, b) => b.ts - a.ts);
  const sum = (st) => mine.filter((p) => p.status === st).reduce((a, p) => a + p.amount, 0);
  const rows = mine.filter((p) => tab === "all" || p.status === tab);
  return (
    <>
      <div className="ph"><div><h1>Payments & billing</h1><p>Your consultation payments and invoices.</p></div></div>
      <div className="stats s3"><Stat label="Total paid" value={money(sum("paid"))} sub={`${mine.filter((p) => p.status === "paid").length} payments`} icon="wallet" /><Stat label="Processing" value={money(sum("processing"))} sub="held until confirmed" icon="clock" /><Stat label="Refunded" value={money(sum("refunded"))} sub="returned to you" icon="refresh" /></div>
      <div className="cols-2" style={{ marginTop: "2.4rem" }}>
        <section>
          <div className="sec-h"><h2>Transaction history</h2></div>
          <Tabs value={tab} onChange={setTab} label="Payment status" tabs={[{ value: "all", label: "All", count: mine.length }, { value: "paid", label: "Paid" }, { value: "processing", label: "Processing" }, { value: "refunded", label: "Refunded" }]} />
          <div className="panel" style={{ marginTop: "1rem", padding: "0 .6rem" }}>
            <DataTable caption="Payments" rows={rows} empty={<EmptyState icon="wallet" title="No payments" text="Payments for your consultations appear here." />}
              columns={[{ key: "ts", label: "Date", render: (p) => dateShort(new Date(p.ts).toISOString().slice(0, 10)) }, { key: "desc", label: "Description", render: (p) => <><b style={{ fontWeight: 500 }}>{p.desc}</b><div className="muted" style={{ fontSize: ".76rem" }}>{lawyerById(state, p.lawyerId)?.name} · {p.method}</div></> },
                { key: "amount", label: "Amount", className: "num", render: (p) => money(p.amount) }, { key: "status", label: "Status", render: (p) => <StatusBadge status={p.status} /> }, { key: "inv", label: "Invoice", render: (p) => <Button variant="ghost" size="sm" icon="file" onClick={() => setInv(p.id)}>View</Button> }]} />
          </div>
        </section>
        <aside>
          <div className="sec-h"><h2>Payment methods</h2></div>
          <div className="panel" style={{ display: "grid", gap: ".8rem" }}>
            {[["card", "Visa •••• 4821", "Expires 08/28 · default"], ["phone", "UPI — ananya@upi", "Verified"]].map(([ic, a, b]) => <div key={a} className="row" style={{ padding: ".4rem 0" }}><span className="opt-ic"><Ic n={ic} size={19} /></span><div className="row-main"><b>{a}</b><small>{b}</small></div></div>)}
            <div className="demo-note"><Ic n="info" size={16} />Demonstration only. No real payment details are stored.</div>
          </div>
        </aside>
      </div>
      <InvoiceModal id={inv} onClose={() => setInv(null)} />
    </>
  );
}
