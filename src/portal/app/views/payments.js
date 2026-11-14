import w from "react";
import * as n from "react/jsx-runtime";
import { Ds, J, Ke, Kr, ge, go, ol } from "../lib/core.js";
import { Ce, Ft, H, L, Lt, O, Q, Ql, W, Yt, b, le, rt, xe, z } from "../components/ui.js";
import { $h, Dt, He, Mc, Yr, cl, ir, pn } from "../lib/domain.js";
import { Qt, ne } from "../state/store.js";
import { Mt, So, bt, cd, cv, dv, es, ud, ui, uv } from "../components/section.js";

/* app/views/payments.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
export function PaymentsView() {
  const { lawyer: e, appts: t, payouts: s, dispatch: l } = ne(),
    i = xe(),
    r = Qt(),
    { rows: a, summary: o } = w.useMemo(() => $h(t, s, r), [t, s, r]),
    [c, u] = w.useState({ q: "", type: "", status: "", month: "", sort: "new", page: 1 }),
    [d, h] = w.useState(null),
    [m, S] = w.useState(!1),
    v = (g) => u((M) => ({ ...M, page: 1, ...g })),
    N = w.useMemo(() => [...new Set(a.map((g) => ol(g.at)))], [a]),
    A = w.useMemo(() => {
      const g = c.q.trim().toLowerCase();
      let M = a.filter(
        (X) =>
          (!c.type || X.type === c.type) &&
          (!c.status || X.status === c.status) &&
          (!c.month || ol(X.at) === c.month) &&
          (!g ||
            `${X.client || ""} ${X.matter || ""} ${X.ref || ""} ${X.method || ""}`.toLowerCase().includes(g)),
      );
      const q = (X) => (X.type === "payout" ? X.amount : X.net);
      return (
        (M = [...M].sort((X, ue) =>
          c.sort === "old"
            ? new Date(X.at) - new Date(ue.at)
            : c.sort === "amount"
              ? q(ue) - q(X)
              : new Date(ue.at) - new Date(X.at),
        )),
        M
      );
    }, [a, c]),
    f = Math.max(1, Math.ceil(A.length / ui)),
    p = Math.min(c.page, f),
    y = A.slice((p - 1) * ui, p * ui),
    k = !!(c.q || c.type || c.status || c.month),
    E = w.useMemo(() => {
      const g = [];
      for (let M = 5; M >= 0; M--) {
        const q = new Date(r);
        (q.setMonth(q.getMonth() - M),
          g.push({
            label: go(q.toISOString()),
            key: ol(q.toISOString()),
            value: M === 0 ? o.monthNet : e.id === He ? Mc[5 - M] : 0,
          }));
      }
      return g;
    }, [r, o.monthNet, e.id]),
    x = Math.max(...E.map((g) => g.value), 1),
    C = e.payout,
    j = Mt(
      {
        method: (C == null ? void 0 : C.method) || "bank",
        holder: (C == null ? void 0 : C.holder) || e.name,
        bank: (C == null ? void 0 : C.bank) || "",
        acct: "",
        acct2: "",
        ifsc: (C == null ? void 0 : C.ifsc) || "",
        upi: "",
      },
      (g) => {
        const M = {};
        return (
          g.method === "bank"
            ? ((M.holder = Kr(g.holder)),
              g.bank.trim().length < 3 && (M.bank = "Enter the bank name."),
              ((C == null ? void 0 : C.method) === "bank" && !g.acct && !g.acct2) ||
                (/^\d{9,18}$/.test(g.acct)
                  ? g.acct2 !== g.acct && (M.acct2 = "The account numbers do not match.")
                  : (M.acct = "Account numbers have 9–18 digits.")),
              /^[A-Z]{4}0[A-Z0-9]{6}$/.test(g.ifsc.toUpperCase()) ||
                (M.ifsc =
                  "IFSC is 11 characters: 4 letters, a zero, then 6 letters/digits (e.g. DEMO0000001)."))
            : /^[\w.\-]{2,}@[A-Za-z]{2,}$/.test(g.upi) || (M.upi = "Enter a UPI ID such as name@bank."),
          Object.fromEntries(Object.entries(M).filter(([, q]) => q))
        );
      },
      (g) => {
        const M =
          g.method === "bank"
            ? {
                method: "bank",
                holder: g.holder.trim(),
                bank: g.bank.trim(),
                last4: g.acct ? g.acct.slice(-4) : C.last4,
                ifsc: g.ifsc.toUpperCase(),
              }
            : { method: "upi", upiMasked: `${g.upi.slice(0, 2)}***@${g.upi.split("@")[1]}` };
        (l({
          type: "LAWYER_PATCH",
          lawyerId: e.id,
          patch: { payout: M },
          activity: "You updated your payout details",
          href: "/payments",
        }),
          i({ title: "Payout details saved", message: "Only the last 4 digits / a masked ID are kept." }));
      },
    ),
    R = () => {
      const g = [
          "Date",
          "Type",
          "Description",
          "Gross (INR)",
          "Platform fee (INR)",
          "Net / amount (INR)",
          "Status",
          "Reference",
        ],
        M = A.map((q) => [
          new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date(q.at)),
          cd[q.type].replace(/s$/, ""),
          q.type === "payout" ? `Payout to ${q.method}` : `${q.client} — ${q.matter}`,
          q.type === "payout" ? "" : q.gross,
          q.type === "payout" ? "" : q.fee,
          q.type === "payout" ? -q.amount : q.net,
          es[q.status][1],
          q.type === "payout" ? q.ref : cl(q),
        ]);
      (So(
        "legalconnect-demo-transactions.csv",
        "\uFEFF" +
          [g, ...M].map((q) => q.map(cv).join(",")).join(`
`),
        "text/csv",
      ),
        i({
          tone: "info",
          title: "CSV exported",
          message: `${A.length} row${A.length === 1 ? "" : "s"} (fictional data).`,
        }));
    };
  return n.jsxs(n.Fragment, {
    children: [
      n.jsx(Ft, {
        eyebrow: "Account",
        title: "Payments & billing",
        actions: n.jsxs(n.Fragment, {
          children: [
            n.jsx(b, {
              variant: "outline",
              icon: "file",
              onClick: R,
              disabled: A.length === 0,
              children: "Export CSV",
            }),
            n.jsx(b, { icon: "wallet", onClick: () => S(!0), children: "Request payout" }),
          ],
        }),
        children: "Earnings, fees and payouts for your consultations.",
      }),
      n.jsx(O, {
        tone: "info",
        title: "Fictional data — no real money moves",
        className: "lp-mb",
        children:
          "Every amount, receipt and payout on this page is a demonstration. No payment provider is connected and no transaction has occurred.",
      }),
      n.jsxs("div", {
        className: "lp-stats",
        children: [
          n.jsx(Lt, {
            icon: "wallet",
            label: "Available balance",
            value: J(o.available),
            hint: o.available >= pn ? "Ready to withdraw" : `Minimum payout ${J(pn)}`,
            tone: "success",
          }),
          n.jsx(Lt, {
            icon: "clock",
            label: "Pending clearance",
            value: J(o.pending),
            hint: `Clears ${ir} h after completion`,
            tone: "gold",
          }),
          n.jsx(Lt, {
            icon: "rupee",
            label: "This month (net)",
            value: J(o.monthNet),
            hint: o.monthCount
              ? `${o.monthCount} consultation${o.monthCount === 1 ? "" : "s"} · ${J(o.monthGross)} gross · ${J(o.monthFees)} fees`
              : "No completed consultations yet",
          }),
          n.jsx(Lt, {
            icon: "chart",
            label: "Paid out (lifetime)",
            value: J(o.paidOut),
            hint: o.inFlight ? `${J(o.inFlight)} processing` : "Nothing in flight",
            tone: "navy",
          }),
        ],
      }),
      n.jsxs("div", {
        className: "lp-agrid",
        children: [
          n.jsxs("div", {
            className: "lp-amain",
            children: [
              n.jsxs(Q, {
                as: "section",
                "aria-labelledby": "pay-chart",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "pay-chart", children: "Net earnings by month" }),
                    sub: `After the ${Dt * 100}% platform fee · earlier months are illustrative`,
                  }),
                  x <= 1
                    ? n.jsx(le, {
                        level: 3,
                        icon: "chart",
                        title: "No earnings yet",
                        children: "Completed consultations will appear here.",
                      })
                    : n.jsx("div", {
                        className: "lp-bars",
                        role: "img",
                        "aria-label": `Net earnings by month: ${E.map((g) => `${g.label} ${J(g.value)}`).join(", ")}`,
                        children: E.map((g, M) =>
                          n.jsxs(
                            "div",
                            {
                              className: `lp-bar ${M === 5 ? "is-now" : ""}`,
                              children: [
                                n.jsx("span", {
                                  className: "lp-bar-v",
                                  children: g.value ? `${Math.round(g.value / 1e3)}k` : "–",
                                }),
                                n.jsx("i", {
                                  style: { height: `${Math.max((g.value / x) * 100, g.value ? 6 : 2)}%` },
                                }),
                                n.jsx("small", { children: g.label }),
                              ],
                            },
                            g.key,
                          ),
                        ),
                      }),
                ],
              }),
              n.jsxs(Q, {
                as: "section",
                className: "lp-listcard",
                "aria-labelledby": "pay-tx",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "pay-tx", children: "Transactions" }),
                    sub: `${A.length} of ${a.length}`,
                  }),
                  n.jsxs("div", {
                    className: "lp-toolbar lp-toolbar-flush",
                    children: [
                      n.jsxs("div", {
                        className: "lp-search",
                        children: [
                          n.jsx(L, { name: "search", size: 16 }),
                          n.jsx("input", {
                            type: "search",
                            "aria-label": "Search transactions by client, matter or reference",
                            placeholder: "Search client, matter or reference",
                            value: c.q,
                            onChange: (g) => v({ q: g.target.value }),
                          }),
                        ],
                      }),
                      n.jsxs("label", {
                        className: "lp-sel",
                        children: [
                          n.jsx("span", { className: "lp-sr", children: "Filter by type" }),
                          n.jsxs("select", {
                            className: "lp-input lp-select-plain",
                            value: c.type,
                            onChange: (g) => v({ type: g.target.value }),
                            children: [
                              n.jsx("option", { value: "", children: "All types" }),
                              Object.entries(cd).map(([g, M]) =>
                                n.jsx("option", { value: g, children: M }, g),
                              ),
                            ],
                          }),
                        ],
                      }),
                      n.jsxs("label", {
                        className: "lp-sel",
                        children: [
                          n.jsx("span", { className: "lp-sr", children: "Filter by status" }),
                          n.jsxs("select", {
                            className: "lp-input lp-select-plain",
                            value: c.status,
                            onChange: (g) => v({ status: g.target.value }),
                            children: [
                              n.jsx("option", { value: "", children: "All statuses" }),
                              Object.entries(es).map(([g, [, M]]) =>
                                n.jsx("option", { value: g, children: M }, g),
                              ),
                            ],
                          }),
                        ],
                      }),
                      n.jsxs("label", {
                        className: "lp-sel",
                        children: [
                          n.jsx("span", { className: "lp-sr", children: "Filter by month" }),
                          n.jsxs("select", {
                            className: "lp-input lp-select-plain",
                            value: c.month,
                            onChange: (g) => v({ month: g.target.value }),
                            children: [
                              n.jsx("option", { value: "", children: "All months" }),
                              N.map((g) =>
                                n.jsxs(
                                  "option",
                                  { value: g, children: [go(`${g}-15T00:00:00Z`), " ", g.slice(0, 4)] },
                                  g,
                                ),
                              ),
                            ],
                          }),
                        ],
                      }),
                      n.jsxs("label", {
                        className: "lp-sel",
                        children: [
                          n.jsx("span", { className: "lp-sr", children: "Sort transactions" }),
                          n.jsxs("select", {
                            className: "lp-input lp-select-plain",
                            value: c.sort,
                            onChange: (g) => v({ sort: g.target.value }),
                            children: [
                              n.jsx("option", { value: "new", children: "Newest first" }),
                              n.jsx("option", { value: "old", children: "Oldest first" }),
                              n.jsx("option", { value: "amount", children: "Largest amount" }),
                            ],
                          }),
                        ],
                      }),
                      k &&
                        n.jsx(b, {
                          variant: "ghost",
                          size: "sm",
                          onClick: () => u({ q: "", type: "", status: "", month: "", sort: c.sort, page: 1 }),
                          children: "Clear filters",
                        }),
                    ],
                  }),
                  a.length === 0
                    ? n.jsx(le, {
                        level: 3,
                        icon: "wallet",
                        title: "No transactions yet",
                        children:
                          "When you complete a consultation, its payment appears here with the platform fee and clearance status.",
                      })
                    : A.length === 0
                      ? n.jsx(le, {
                          level: 3,
                          icon: "search",
                          title: "No matches",
                          action: n.jsx(b, {
                            variant: "outline",
                            size: "sm",
                            onClick: () =>
                              u({ q: "", type: "", status: "", month: "", sort: c.sort, page: 1 }),
                            children: "Clear filters",
                          }),
                          children: "Nothing matches these filters.",
                        })
                      : n.jsxs(n.Fragment, {
                          children: [
                            n.jsx("ul", {
                              className: "lp-list",
                              children: y.map((g) => {
                                const [M, q] = es[g.status];
                                return n.jsxs(
                                  "li",
                                  {
                                    className: "lp-tx",
                                    children: [
                                      n.jsx("span", {
                                        className: `lp-cr-ic ${g.type === "payout" ? "is-out" : ""}`,
                                        children: n.jsx(L, {
                                          name:
                                            g.type === "payout"
                                              ? "arrowR"
                                              : g.type === "refund"
                                                ? "refresh"
                                                : "rupee",
                                          size: 18,
                                        }),
                                      }),
                                      n.jsxs("div", {
                                        className: "lp-cr-main",
                                        children: [
                                          n.jsx("strong", {
                                            children:
                                              g.type === "payout" ? `Payout to ${g.method}` : g.client,
                                          }),
                                          n.jsx("p", {
                                            children:
                                              g.type === "payout"
                                                ? `Ref ${g.ref}${g.historic ? " · earlier month" : ""}`
                                                : g.type === "refund"
                                                  ? `${g.matter} · cancelled — client refunded in full, no earnings`
                                                  : `${g.matter}${g.status === "pending" ? ` · clears ${Ke(g.clearsAt)}, ${ge(g.clearsAt)}` : ""}`,
                                          }),
                                          n.jsxs("small", {
                                            className: "lp-tx-date",
                                            children: [Ke(g.at), ", ", ge(g.at), " IST"],
                                          }),
                                        ],
                                      }),
                                      n.jsxs("div", {
                                        className: "lp-tx-amt",
                                        children: [
                                          n.jsx("strong", {
                                            className: g.type === "payout" ? "is-neg" : "",
                                            children:
                                              g.type === "payout"
                                                ? `− ${J(g.amount)}`
                                                : g.type === "refund"
                                                  ? J(0)
                                                  : `+ ${J(g.net)}`,
                                          }),
                                          g.type === "payment" &&
                                            n.jsxs("small", {
                                              children: [J(g.gross), " − ", J(g.fee), " fee"],
                                            }),
                                        ],
                                      }),
                                      n.jsxs("div", {
                                        className: "lp-tx-act",
                                        children: [
                                          n.jsx(H, { tone: M, dot: !0, children: q }),
                                          g.type === "payment" &&
                                            n.jsxs(b, {
                                              size: "sm",
                                              variant: "outline",
                                              onClick: () => h(g),
                                              children: [
                                                "Receipt",
                                                n.jsxs("span", {
                                                  className: "lp-sr",
                                                  children: [" for ", g.client],
                                                }),
                                              ],
                                            }),
                                        ],
                                      }),
                                    ],
                                  },
                                  g.id,
                                );
                              }),
                            }),
                            n.jsx(Ql, {
                              page: p,
                              pages: f,
                              total: A.length,
                              perPage: ui,
                              onChange: (g) => u((M) => ({ ...M, page: g })),
                            }),
                          ],
                        }),
                ],
              }),
            ],
          }),
          n.jsxs("aside", {
            className: "lp-aside",
            children: [
              n.jsxs(bt, {
                id: "pay-settings",
                title: "Payout settings",
                sub: "Where withdrawals are sent. Demo only.",
                s: j,
                view: C
                  ? n.jsxs("dl", {
                      className: "lp-dl is-stack",
                      children: [
                        n.jsxs("div", {
                          children: [
                            n.jsx("dt", { children: "Method" }),
                            n.jsx("dd", { children: C.method === "upi" ? "UPI" : "Bank transfer" }),
                          ],
                        }),
                        C.method === "bank"
                          ? n.jsxs(n.Fragment, {
                              children: [
                                n.jsxs("div", {
                                  children: [
                                    n.jsx("dt", { children: "Account holder" }),
                                    n.jsx("dd", { children: C.holder }),
                                  ],
                                }),
                                n.jsxs("div", {
                                  children: [
                                    n.jsx("dt", { children: "Bank" }),
                                    n.jsx("dd", { children: C.bank }),
                                  ],
                                }),
                                n.jsxs("div", {
                                  children: [
                                    n.jsx("dt", { children: "Account" }),
                                    n.jsxs("dd", { children: ["•••• ", C.last4] }),
                                  ],
                                }),
                                n.jsxs("div", {
                                  children: [
                                    n.jsx("dt", { children: "IFSC" }),
                                    n.jsx("dd", { children: C.ifsc }),
                                  ],
                                }),
                              ],
                            })
                          : n.jsxs("div", {
                              children: [
                                n.jsx("dt", { children: "UPI ID" }),
                                n.jsx("dd", { children: C.upiMasked }),
                              ],
                            }),
                      ],
                    })
                  : n.jsx(le, {
                      level: 3,
                      icon: "wallet",
                      title: "No payout method",
                      children: "Add a bank account or UPI ID before requesting a payout.",
                    }),
                children: [
                  n.jsx(O, {
                    tone: "info",
                    title: "Use fictional details only",
                    children: "The full account number is never stored — only the last 4 digits.",
                  }),
                  n.jsx(Ce, {
                    id: "ps-method",
                    label: "Method",
                    options: [
                      { value: "bank", label: "Bank transfer" },
                      { value: "upi", label: "UPI" },
                    ],
                    value: j.draft.method,
                    onChange: (g) => j.set("method", g.target.value),
                  }),
                  j.draft.method === "bank"
                    ? n.jsxs(n.Fragment, {
                        children: [
                          n.jsx(W, {
                            id: "ps-holder",
                            label: "Account holder name",
                            required: !0,
                            value: j.draft.holder,
                            onChange: (g) => j.set("holder", g.target.value),
                            error: j.err.holder,
                          }),
                          n.jsx(W, {
                            id: "ps-bank",
                            label: "Bank name",
                            required: !0,
                            value: j.draft.bank,
                            onChange: (g) => j.set("bank", g.target.value),
                            error: j.err.bank,
                          }),
                          n.jsx(W, {
                            id: "ps-acct",
                            label: "Account number",
                            inputMode: "numeric",
                            autoComplete: "off",
                            required: !C,
                            value: j.draft.acct,
                            onChange: (g) => j.set("acct", g.target.value.replace(/\D/g, "")),
                            error: j.err.acct,
                            hint:
                              (C == null ? void 0 : C.method) === "bank"
                                ? `Leave blank to keep •••• ${C.last4}`
                                : void 0,
                          }),
                          n.jsx(W, {
                            id: "ps-acct2",
                            label: "Confirm account number",
                            inputMode: "numeric",
                            autoComplete: "off",
                            value: j.draft.acct2,
                            onChange: (g) => j.set("acct2", g.target.value.replace(/\D/g, "")),
                            error: j.err.acct2,
                          }),
                          n.jsx(W, {
                            id: "ps-ifsc",
                            label: "IFSC code",
                            required: !0,
                            value: j.draft.ifsc,
                            onChange: (g) => j.set("ifsc", g.target.value.toUpperCase()),
                            error: j.err.ifsc,
                            placeholder: "DEMO0000001",
                          }),
                        ],
                      })
                    : n.jsx(W, {
                        id: "ps-upi",
                        label: "UPI ID",
                        required: !0,
                        value: j.draft.upi,
                        onChange: (g) => j.set("upi", g.target.value),
                        error: j.err.upi,
                        placeholder: "name@bank",
                      }),
                ],
              }),
              n.jsxs(Q, {
                as: "section",
                "aria-labelledby": "pay-po",
                children: [
                  n.jsx(z, { title: n.jsx("span", { id: "pay-po", children: "Recent payouts" }) }),
                  s.length === 0
                    ? n.jsx("p", { className: "lp-muted", children: "No payouts yet." })
                    : n.jsx("ul", {
                        className: "lp-blocked",
                        children: s.slice(0, 5).map((g) => {
                          const [M, q] = es[g.status];
                          return n.jsxs(
                            "li",
                            {
                              children: [
                                n.jsxs("div", {
                                  children: [
                                    n.jsx("strong", { children: J(g.amount) }),
                                    n.jsxs("small", { children: [g.ref, " · ", Ke(g.requestedAt)] }),
                                  ],
                                }),
                                n.jsx(H, { tone: M, dot: !0, children: q }),
                              ],
                            },
                            g.id,
                          );
                        }),
                      }),
                ],
              }),
              n.jsxs(Q, {
                as: "section",
                "aria-labelledby": "pay-how",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "pay-how", children: "How payments work" }),
                    sub: "Illustrative rules for this demo",
                  }),
                  n.jsxs("ul", {
                    className: "lp-next-list",
                    children: [
                      n.jsxs("li", {
                        children: [
                          n.jsx(L, { name: "rupee", size: 16 }),
                          " A platform fee of ",
                          Dt * 100,
                          "% is deducted from each consultation fee.",
                        ],
                      }),
                      n.jsxs("li", {
                        children: [
                          n.jsx(L, { name: "clock", size: 16 }),
                          " A payment becomes withdrawable ",
                          ir,
                          " hours after you mark the consultation completed.",
                        ],
                      }),
                      n.jsxs("li", {
                        children: [
                          n.jsx(L, { name: "wallet", size: 16 }),
                          " The minimum payout is ",
                          J(pn),
                          ". Real payouts would take a few business days.",
                        ],
                      }),
                      n.jsxs("li", {
                        children: [
                          n.jsx(L, { name: "info", size: 16 }),
                          " GST and TDS are not modelled. Ask an accountant how fees and income are treated.",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      n.jsx(Yt, {
        open: !!d,
        onClose: () => h(null),
        title: "Consultation receipt (demo)",
        footer: n.jsxs(n.Fragment, {
          children: [
            n.jsx(b, { variant: "ghost", onClick: () => h(null), children: "Close" }),
            n.jsx(b, {
              icon: "file",
              onClick: () => {
                (So(`receipt-${cl(d)}.html`, dv(d, e), "text/html"),
                  i({
                    tone: "info",
                    title: "Receipt downloaded",
                    message: "Watermarked as a demo document.",
                  }));
              },
              children: "Download",
            }),
          ],
        }),
        children:
          d &&
          n.jsxs("div", {
            className: "lp-receipt",
            children: [
              n.jsx("p", {
                className: "lp-receipt-demo",
                children: "DEMO — not a valid invoice or proof of payment",
              }),
              n.jsxs("dl", {
                className: "lp-sum",
                children: [
                  n.jsxs("div", {
                    children: [n.jsx("dt", { children: "Receipt no." }), n.jsx("dd", { children: cl(d) })],
                  }),
                  n.jsxs("div", {
                    children: [n.jsx("dt", { children: "Date" }), n.jsx("dd", { children: Ds(d.at) })],
                  }),
                  n.jsxs("div", {
                    children: [n.jsx("dt", { children: "Provider" }), n.jsx("dd", { children: e.name })],
                  }),
                  n.jsxs("div", {
                    children: [n.jsx("dt", { children: "Client" }), n.jsx("dd", { children: d.client })],
                  }),
                  n.jsxs("div", {
                    children: [n.jsx("dt", { children: "Service" }), n.jsx("dd", { children: d.matter })],
                  }),
                  n.jsxs("div", {
                    children: [
                      n.jsx("dt", { children: "Status" }),
                      n.jsxs("dd", {
                        children: [
                          es[d.status][1],
                          d.status === "pending" ? ` — clears ${Ke(d.clearsAt)}` : "",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              n.jsx("table", {
                className: "lp-rt",
                children: n.jsxs("tbody", {
                  children: [
                    n.jsxs("tr", {
                      children: [
                        n.jsx("td", { children: "Consultation fee" }),
                        n.jsx("td", { children: J(d.gross) }),
                      ],
                    }),
                    n.jsxs("tr", {
                      children: [
                        n.jsxs("td", { children: ["Platform fee (", Dt * 100, "%)"] }),
                        n.jsxs("td", { children: ["− ", J(d.fee)] }),
                      ],
                    }),
                    n.jsxs("tr", {
                      className: "is-total",
                      children: [
                        n.jsx("td", { children: "Net to provider" }),
                        n.jsx("td", { children: J(d.net) }),
                      ],
                    }),
                  ],
                }),
              }),
            ],
          }),
      }),
      n.jsx(hv, {
        open: m,
        onClose: () => S(!1),
        available: o.available,
        lawyer: e,
        onSetup: () => {
          (S(!1),
            j.start(),
            setTimeout(() => {
              var g;
              return (g = document.getElementById("pay-settings")) == null
                ? void 0
                : g.scrollIntoView({ block: "center" });
            }, 50));
        },
      }),
    ],
  });
}
function hv({ open: e, onClose: t, available: s, lawyer: l, onSetup: i }) {
  const { dispatch: r } = ne(),
    a = xe(),
    [o, c] = w.useState(""),
    [u, d] = w.useState(!1),
    [h, m] = w.useState({}),
    [S, v] = w.useState(!1),
    N = l.payout,
    A = () => {
      (c(""), d(!1), m({}), t());
    },
    f = (p) => {
      p.preventDefault();
      const y = Number(o),
        k = {};
      (o
        ? Number.isInteger(y)
          ? y < pn
            ? (k.amt = `The minimum payout is ${J(pn)}.`)
            : y > s && (k.amt = `You can withdraw at most ${J(s)}.`)
          : (k.amt = "Enter a whole number of rupees.")
        : (k.amt = "Enter an amount."),
        u || (k.ack = "Please confirm that you understand this is a demo."),
        m(k),
        !(k.amt || k.ack) &&
          (v(!0),
          setTimeout(() => {
            (r({
              type: "PAYOUT_REQUEST",
              payout: {
                id: uv("po"),
                lawyerId: l.id,
                amount: y,
                status: "processing",
                requestedAt: new Date().toISOString(),
                ref: `PO-DEMO-${Math.floor(1e3 + Math.random() * 9e3)}`,
                methodLabel: ud(N),
              },
            }),
              v(!1),
              a({ title: "Payout requested (demo)", message: `${J(y)} is processing. No money moves.` }),
              A());
          }, 600)));
    };
  return n.jsx(Yt, {
    open: e,
    onClose: A,
    title: "Request a payout",
    size: "sm",
    footer: N
      ? n.jsxs(n.Fragment, {
          children: [
            n.jsx(b, { variant: "ghost", onClick: A, children: "Cancel" }),
            n.jsx(b, { type: "submit", form: "payout-form", loading: S, children: "Request payout" }),
          ],
        })
      : n.jsxs(n.Fragment, {
          children: [
            n.jsx(b, { variant: "ghost", onClick: A, children: "Cancel" }),
            n.jsx(b, { onClick: i, children: "Set up payout details" }),
          ],
        }),
    children: N
      ? n.jsxs("form", {
          id: "payout-form",
          className: "lp-form",
          noValidate: !0,
          onSubmit: f,
          children: [
            n.jsxs("dl", {
              className: "lp-sum",
              children: [
                n.jsxs("div", {
                  children: [
                    n.jsx("dt", { children: "Available" }),
                    n.jsx("dd", { children: n.jsx("strong", { children: J(s) }) }),
                  ],
                }),
                n.jsxs("div", {
                  children: [n.jsx("dt", { children: "Send to" }), n.jsx("dd", { children: ud(N) })],
                }),
              ],
            }),
            s < pn &&
              n.jsxs(O, {
                tone: "info",
                title: `Below the ${J(pn)} minimum`,
                children: ["Payments become available ", ir, " hours after a consultation is completed."],
              }),
            n.jsx(W, {
              id: "po-amt",
              type: "number",
              inputMode: "numeric",
              label: "Amount (₹)",
              prefix: "₹",
              required: !0,
              value: o,
              onChange: (p) => {
                (c(p.target.value), m({ ...h, amt: "" }));
              },
              error: h.amt,
              hint: `Minimum ${J(pn)}`,
            }),
            n.jsx("button", {
              type: "button",
              className: "lp-link-btn",
              onClick: () => {
                (c(String(s)), m({ ...h, amt: "" }));
              },
              disabled: s <= 0,
              children: "Withdraw everything available",
            }),
            n.jsx(rt, {
              id: "po-ack",
              label: "I understand this is a demo: no money will move and no bank is contacted.",
              checked: u,
              onChange: (p) => {
                (d(p.target.checked), m({ ...h, ack: "" }));
              },
              error: h.ack,
            }),
          ],
        })
      : n.jsx(O, {
          tone: "warning",
          title: "Add payout details first",
          children: "You need a bank account or UPI ID on file before requesting a payout.",
        }),
  });
}
export const di = 10,
  mv = {
    request: "users",
    appointment: "calendar",
    message: "message",
    verify: "shieldCheck",
    payment: "wallet",
    profile: "user",
    info: "info",
  };
Object.fromEntries(Yr);
export const dd = {
  request: "Requests",
  appointment: "Appointments",
  message: "Messages",
  verify: "Verification",
  payment: "Payments",
  profile: "Profile & documents",
};
