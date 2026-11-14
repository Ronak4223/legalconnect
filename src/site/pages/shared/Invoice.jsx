import { useApp } from "../../state/store.jsx";
import { Modal } from "../../ui/Overlay.jsx";
import { Button } from "../../ui/Button.jsx";
import { StatusBadge, Logo } from "../../ui/Misc.jsx";
import { personName, lawyerById } from "../../state/selectors.js";
import { money } from "../../utils/format.js";

/** Printable invoice (demo). "Download" saves a standalone HTML copy; "Print" uses the browser's print dialog. */
export function InvoiceModal({ id, onClose }) {
  const { state } = useApp();
  const p = state.payments.find((x) => x.id === id);
  if (!p) return null;
  const l = lawyerById(state, p.lawyerId), client = personName(state, p.userId), date = new Date(p.ts).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const gst = Math.round(p.amount * 0.18 / 1.18), base = p.amount - gst;
  const download = () => {
    const html = `<!doctype html><meta charset="utf-8"><title>${p.invoice}</title><body style="font-family:Georgia,serif;max-width:640px;margin:40px auto;color:#0d2340"><h1>LegalConnect — Invoice ${p.invoice}</h1><p>DEMO INVOICE — not a real tax document.</p><p>Date: ${date}<br>Billed to: ${client}<br>Lawyer: ${l?.name}</p><hr><p>${p.desc}</p><p>Fee: ₹${base.toLocaleString("en-IN")}<br>GST (18%): ₹${gst.toLocaleString("en-IN")}<br><b>Total: ₹${p.amount.toLocaleString("en-IN")}</b></p><p>Status: ${p.status}<br>Method: ${p.method}</p></body>`;
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([html], { type: "text/html" })); a.download = `${p.invoice}.html`; a.click(); URL.revokeObjectURL(a.href);
  };
  return (
    <Modal open onClose={onClose} size="md" title={`Invoice ${p.invoice}`} subtitle="Demonstration invoice" footer={<><Button variant="outline" icon="file" onClick={() => window.print()}>Print</Button><Button icon="download" onClick={download}>Download</Button></>}>
      <div id="invoice" style={{ border: "1px solid var(--line)", borderRadius: 14, padding: "1.4rem", background: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}><Logo to="/" /><div style={{ textAlign: "right", fontSize: ".84rem" }}><b>{p.invoice}</b><div className="muted">{date}</div><StatusBadge status={p.status} /></div></div>
        <dl className="dl" style={{ margin: "1.4rem 0" }}><dt>Billed to</dt><dd>{client}</dd><dt>Lawyer</dt><dd>{l?.name} · {l?.barNo}</dd><dt>Payment method</dt><dd>{p.method}</dd></dl>
        <table className="tbl" style={{ marginTop: ".5rem" }}><tbody>
          <tr><td>{p.desc}</td><td className="num">{money(base)}</td></tr><tr><td>GST (18%)</td><td className="num">{money(gst)}</td></tr>
          <tr><td><b>Total</b></td><td className="num"><b className="serif" style={{ fontSize: "1.3rem", fontWeight: 500 }}>{money(p.amount)}</b></td></tr></tbody></table>
        <p className="hint" style={{ marginTop: "1rem" }}>This is a demonstration invoice generated in your browser. It is not a tax document.</p>
      </div>
    </Modal>
  );
}
