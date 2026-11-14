import w from "react";
import * as n from "react/jsx-runtime";
import { Ds, J, bl } from "../lib/core.js";
import { O, Q, b, z } from "./ui.js";
import { Dt, cl } from "../lib/domain.js";

/* app/components/section.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
export function Mt(e, t, s) {
  const [l, i] = w.useState(!1),
    [r, a] = w.useState(e),
    [o, c] = w.useState({});
  return {
    editing: l,
    draft: r,
    err: o,
    setDraft: a,
    setErr: c,
    start: () => {
      (a(e), c({}), i(!0));
    },
    cancel: () => {
      (i(!1), c({}));
    },
    set: (u, d) => {
      (a((h) => ({ ...h, [u]: d })), c((h) => ({ ...h, [u]: "" })));
    },
    save: () => {
      const u = t(r);
      if ((c(u), Object.keys(u).length)) {
        setTimeout(() => {
          var d;
          return (d = document.querySelector('[aria-invalid="true"], .has-error input, .has-error button')) ==
            null
            ? void 0
            : d.focus();
        }, 0);
        return;
      }
      (s(r), i(!1));
    },
  };
}
export function bt({ id: e, title: t, sub: s, s: l, view: i, children: r }) {
  const a = Object.keys(l.err).length;
  return n.jsxs(Q, {
    as: "section",
    id: e,
    "aria-labelledby": `${e}-h`,
    children: [
      n.jsx(z, {
        title: n.jsx("span", { id: `${e}-h`, children: t }),
        sub: s,
        action:
          !l.editing &&
          n.jsxs(b, {
            size: "sm",
            variant: "outline",
            icon: "edit",
            onClick: l.start,
            children: ["Edit", n.jsxs("span", { className: "lp-sr", children: [" ", t] })],
          }),
      }),
      l.editing
        ? n.jsxs("form", {
            className: "lp-form",
            noValidate: !0,
            onSubmit: (o) => {
              (o.preventDefault(), l.save());
            },
            children: [
              a > 0 && n.jsx(O, { tone: "danger", title: `Please fix ${a} ${a === 1 ? "field" : "fields"}` }),
              r,
              n.jsxs("div", {
                className: "lp-actions",
                children: [
                  n.jsx(b, { type: "submit", children: "Save changes" }),
                  n.jsx(b, { variant: "ghost", onClick: l.cancel, children: "Cancel" }),
                ],
              }),
            ],
          })
        : i,
    ],
  });
}
export function So(e, t, s = "text/plain") {
  const l = URL.createObjectURL(new Blob([t], { type: `${s};charset=utf-8` })),
    i = document.createElement("a");
  ((i.href = l),
    (i.download = e),
    document.body.appendChild(i),
    i.click(),
    i.remove(),
    setTimeout(() => URL.revokeObjectURL(l), 1500));
}
export const ct = (e) =>
    String(e ?? "").replace(
      /[&<>"']/g,
      (t) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[t],
    ),
  cv = (e) => {
    if (typeof e == "number" && isFinite(e)) return String(e);
    let t = String(e ?? "");
    return (/^[=+\-@\t\r]/.test(t) && (t = `'${t}`), /[",\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t);
  },
  ui = 8,
  es = {
    pending: ["warning", "Clearing"],
    available: ["success", "Available"],
    processing: ["info", "Processing"],
    paid: ["success", "Paid"],
    refunded: ["neutral", "Refunded"],
    failed: ["danger", "Failed"],
  },
  cd = { payment: "Consultation payments", payout: "Payouts", refund: "Refunds" },
  uv = (e) => `${e}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
  ud = (e) => (e.method === "upi" ? `UPI ${e.upiMasked}` : `${e.bank} •••• ${e.last4}`);
export function dv(e, t) {
  return `<!doctype html><html lang="en"><meta charset="utf-8"><title>Receipt ${ct(cl(e))} (DEMO)</title>
<style>body{font:15px/1.5 system-ui,sans-serif;max-width:620px;margin:2rem auto;padding:0 1rem;color:#0d2340}h1{font:500 1.6rem Georgia,serif;margin:.2rem 0}.demo{background:#fbe9d0;border:1px solid #c58a2b;padding:.6rem .8rem;border-radius:8px;font-weight:600}table{width:100%;border-collapse:collapse;margin:1rem 0}td{padding:.5rem 0;border-bottom:1px solid #ddd}td:last-child{text-align:right}.t td{font-weight:700;border-bottom:0}small{color:#555}</style>
<p class="demo">DEMO DOCUMENT — fictional data. Not a valid invoice, tax invoice or proof of payment.</p>
<h1>Consultation receipt</h1><p>Receipt no. <strong>${ct(cl(e))}</strong><br>Date: ${ct(Ds(e.at))}</p>
<p><strong>Provider:</strong> ${ct(t.name)}, ${ct(t.title)}<br><strong>Client:</strong> ${ct(e.client)}<br><strong>Service:</strong> ${ct(e.matter)} (${ct(bl[e.consultType] || "Consultation")})</p>
<table><tr><td>Consultation fee</td><td>${ct(J(e.gross))}</td></tr><tr><td>Platform fee (${Dt * 100}%, illustrative)</td><td>− ${ct(J(e.fee))}</td></tr><tr class="t"><td>Net to provider</td><td>${ct(J(e.net))}</td></tr></table>
<p><small>Status: ${ct(es[e.status][1])}. Tax treatment (GST / TDS) is not modelled in this prototype.</small></p></html>`;
}
