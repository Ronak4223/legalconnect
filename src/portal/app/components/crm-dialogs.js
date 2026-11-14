import w from "react";
import * as n from "react/jsx-runtime";
import { useNavigate as Me } from "react-router-dom";
import { IMG } from "../00-assets.js";
import { Bt, Ie, Ke, Kr, Ur, Vl, wc } from "../lib/core.js";
import { Ce, Et, H, O, W, Yt, b, xe } from "./ui.js";
import { Ll, rr } from "../lib/domain.js";
import { ne } from "../state/store.js";

/* app/components/crm-dialogs.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
export function Tr({ d: e, now: t = Date.now() }) {
  if (!e) return n.jsx("span", { className: "lp-muted", children: "No open deadlines" });
  const s = Math.round((new Date(e.due).getTime() - t) / 864e5);
  return e.done
    ? n.jsx(H, { tone: "success", children: "Done" })
    : new Date(e.due).getTime() < t
      ? n.jsxs(H, { tone: "danger", children: ["Overdue · ", Ke(e.due)] })
      : s <= 3
        ? n.jsxs(H, { tone: "warning", children: ["Due ", s <= 0 ? "today" : `in ${s} d`, " · ", Ke(e.due)] })
        : n.jsxs(H, { children: ["Due ", Ke(e.due)] });
}
export const Kc = ({ className: e = "" }) =>
    n.jsx(O, {
      tone: "info",
      title: "Fictional data — not secure case management",
      className: e,
      children:
        "Everything here is sample data stored only in this browser. Never enter real client details or privileged information in this prototype.",
    }),
  wo = (e) => `${e}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
export function $y({ open: e, onClose: t }) {
  const { dispatch: s, lawyer: l, clients: i } = ne(),
    r = Me(),
    a = xe(),
    [o, c] = w.useState({ name: "", email: "", phone: "", city: "" }),
    [u, d] = w.useState({}),
    h = (v) => (N) => {
      (c((A) => ({ ...A, [v]: N.target.value })), d((A) => ({ ...A, [v]: "" })));
    },
    m = () => {
      (c({ name: "", email: "", phone: "", city: "" }), d({}), t());
    },
    S = (v) => {
      v.preventDefault();
      const N = i.some((p) => p.email.toLowerCase() === o.email.trim().toLowerCase()),
        A = {
          name: Kr(o.name),
          email: Vl(o.email) || (N ? "A client with this email already exists." : ""),
          phone: wc(o.phone),
          city: Bt(o.city, "City"),
        };
      if ((d(A), Object.values(A).some(Boolean))) return;
      const f = {
        id: wo("cl"),
        lawyerId: l.id,
        name: o.name.trim(),
        email: o.email.trim(),
        phone: `+91 ${o.phone.replace(/\D/g, "")}`,
        city: o.city,
        tags: [],
        since: new Date().toISOString(),
        notes: "",
      };
      (s({ type: "CLIENT_ADD", client: f }),
        a({ title: "Client added", message: f.name }),
        m(),
        r(`/clients/${f.id}`));
    };
  return n.jsx(Yt, {
    open: e,
    onClose: m,
    title: "Add a client",
    footer: n.jsxs(n.Fragment, {
      children: [
        n.jsx(b, { variant: "ghost", onClick: m, children: "Cancel" }),
        n.jsx(b, { type: "submit", form: "add-client", children: "Add client" }),
      ],
    }),
    children: n.jsxs("form", {
      id: "add-client",
      className: "lp-form",
      noValidate: !0,
      onSubmit: S,
      children: [
        n.jsx(O, {
          tone: "info",
          title: "Use fictional details only",
          children: "This demo is not a secure place for real client information.",
        }),
        n.jsx(W, {
          id: "ac-name",
          label: "Full name",
          required: !0,
          value: o.name,
          onChange: h("name"),
          error: u.name,
          autoComplete: "off",
        }),
        n.jsxs("div", {
          className: "lp-grid2",
          children: [
            n.jsx(W, {
              id: "ac-email",
              type: "email",
              label: "Email",
              required: !0,
              value: o.email,
              onChange: h("email"),
              error: u.email,
              autoComplete: "off",
            }),
            n.jsx(W, {
              id: "ac-phone",
              type: "tel",
              inputMode: "numeric",
              label: "Mobile",
              prefix: "+91",
              required: !0,
              value: o.phone,
              onChange: h("phone"),
              error: u.phone,
              autoComplete: "off",
            }),
          ],
        }),
        n.jsx(Ce, {
          id: "ac-city",
          label: "City",
          required: !0,
          options: rr,
          value: o.city,
          onChange: h("city"),
          error: u.city,
        }),
      ],
    }),
  });
}
export function dm({ open: e, onClose: t, clientId: s = "" }) {
  const { dispatch: l, lawyer: i, clients: r } = ne(),
    a = Me(),
    o = xe(),
    c = {
      clientId: s,
      title: "",
      area: (i == null ? void 0 : i.primaryArea) || "",
      summary: "",
      dlTitle: "",
      dlDate: "",
    },
    [u, d] = w.useState(c),
    [h, m] = w.useState({}),
    S = (f) => (p) => {
      (d((y) => ({ ...y, [f]: p.target.value })), m((y) => ({ ...y, [f]: "" })));
    },
    v = () => {
      (d(c), m({}), t());
    },
    N = Ie(new Date().toISOString()),
    A = (f) => {
      f.preventDefault();
      const p = {
        clientId: u.clientId ? "" : "Choose a client.",
        title: u.title.trim().length >= 5 ? "" : "Give the case a title of at least 5 characters.",
        area: Bt(u.area, "Practice area"),
        dlDate:
          u.dlTitle.trim() && !u.dlDate
            ? "Pick a due date."
            : u.dlDate && u.dlDate < N
              ? "Pick today or a later date."
              : "",
        dlTitle: u.dlDate && !u.dlTitle.trim() ? "Describe the deadline." : "",
      };
      if ((m(p), Object.values(p).some(Boolean))) return;
      const y = wo("cs"),
        k = new Date().toISOString(),
        E = {
          id: y,
          lawyerId: i.id,
          clientId: u.clientId,
          title: u.title.trim(),
          area: u.area,
          status: "active",
          summary: u.summary.trim(),
          openedAt: k,
          deadlines: u.dlTitle.trim()
            ? [
                {
                  id: wo("dl"),
                  title: u.dlTitle.trim(),
                  due: Ur(new Date(`${u.dlDate}T12:00:00+05:30`).getTime(), 0, 17, 0),
                  done: !1,
                },
              ]
            : [],
          notes: [],
          docs: [],
          events: [{ at: k, text: "Case opened" }],
        };
      (l({ type: "CASE_ADD", case: E }),
        o({ title: "Case opened", message: E.title }),
        v(),
        a(`/cases/${y}`));
    };
  return n.jsx(Yt, {
    open: e,
    onClose: v,
    title: "Open a new case",
    footer: n.jsxs(n.Fragment, {
      children: [
        n.jsx(b, { variant: "ghost", onClick: v, children: "Cancel" }),
        r.length > 0 && n.jsx(b, { type: "submit", form: "new-case", children: "Open case" }),
      ],
    }),
    children:
      r.length === 0
        ? n.jsx(O, {
            tone: "warning",
            title: "Add a client first",
            children: "A case belongs to a client. Close this dialog and use “Add client”.",
          })
        : n.jsxs("form", {
            id: "new-case",
            className: "lp-form",
            noValidate: !0,
            onSubmit: A,
            children: [
              n.jsx(Ce, {
                id: "nc-client",
                label: "Client",
                required: !0,
                options: r.map((f) => ({ value: f.id, label: f.name })),
                value: u.clientId,
                onChange: S("clientId"),
                error: h.clientId,
              }),
              n.jsx(W, {
                id: "nc-title",
                label: "Case title",
                required: !0,
                value: u.title,
                onChange: S("title"),
                error: h.title,
                placeholder: "e.g. Shareholder agreement review",
              }),
              n.jsx(Ce, {
                id: "nc-area",
                label: "Practice area",
                required: !0,
                options: Ll,
                value: u.area,
                onChange: S("area"),
                error: h.area,
              }),
              n.jsx(Et, {
                id: "nc-sum",
                label: "Summary (optional)",
                rows: 3,
                value: u.summary,
                onChange: S("summary"),
              }),
              n.jsxs("fieldset", {
                className: "lp-fieldset",
                children: [
                  n.jsx("legend", { className: "lp-label", children: "First deadline (optional)" }),
                  n.jsxs("div", {
                    className: "lp-grid2",
                    children: [
                      n.jsx(W, {
                        id: "nc-dl",
                        label: "What is due?",
                        value: u.dlTitle,
                        onChange: S("dlTitle"),
                        error: h.dlTitle,
                      }),
                      n.jsx(W, {
                        id: "nc-dd",
                        type: "date",
                        label: "Due date",
                        min: N,
                        value: u.dlDate,
                        onChange: S("dlDate"),
                        error: h.dlDate,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
  });
}
export const _y = IMG["approach.jpg"],
  ev = {
    request: "users",
    payment: "rupee",
    message: "message",
    verify: "shieldCheck",
    appointment: "calendar",
  };
