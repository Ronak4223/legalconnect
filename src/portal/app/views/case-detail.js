import w from "react";
import * as n from "react/jsx-runtime";
import { useParams as Mr, Link as P } from "react-router-dom";
import { Bn, Gn, Ie, Ke, Lr, Ur, ge, kn } from "../lib/core.js";
import { Ce, Et, L, O, Q, W, Yt, b, le, mt, rt, xe, z } from "../components/ui.js";
import { Qt, ne, ur } from "../state/store.js";
import { Fr, Qr } from "./verify-email.js";
import { $s, Uc } from "../components/appointment-dialogs.js";
import { Kc, Tr } from "../components/crm-dialogs.js";
import { fd, md } from "./client-profile.js";

/* app/views/case-detail.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
export function CaseDetailView() {
  const { id: e } = Mr(),
    { cases: t, clients: s, appts: l, dispatch: i } = ne(),
    r = xe(),
    a = Qt(),
    o = t.find((K) => K.id === e),
    c = o && s.find((K) => K.id === o.clientId),
    [u, d] = w.useState({ title: "", date: "" }),
    [h, m] = w.useState({}),
    [S, v] = w.useState(""),
    [N, A] = w.useState(""),
    [f, p] = w.useState(null),
    [y, k] = w.useState(null),
    [E, x] = w.useState(null),
    [C, j] = w.useState(!1),
    [R, g] = w.useState({ name: "", kind: "", note: "" }),
    [M, q] = w.useState({}),
    [X, ue] = w.useState(null);
  if (!o)
    return n.jsx(Q, {
      children: n.jsx(le, {
        icon: "briefcase",
        title: "Case not found",
        action: n.jsx(P, {
          className: "lp-btn lp-btn-primary lp-btn-md",
          to: "/clients?tab=cases",
          children: n.jsx("span", { children: "Back to cases" }),
        }),
        children: "This case doesn’t exist or isn’t assigned to you.",
      }),
    });
  const Y = Ie(new Date().toISOString()),
    Z = [...o.deadlines].sort((K, _) => K.done - _.done || new Date(K.due) - new Date(_.due)),
    te = ur(o),
    D = l
      .filter((K) => K.clientId === o.clientId)
      .sort((K, _) => new Date(_.startsAt) - new Date(K.startsAt))
      .slice(0, 4),
    T = (K) => {
      K !== o.status &&
        (K === "closed" || o.status === "closed"
          ? x(K)
          : (i({ type: "CASE_STATUS", id: e, status: K, label: $s[K][1] }),
            r({ title: "Status updated", message: $s[K][1] })));
    },
    B = (K) => {
      K.preventDefault();
      const _ = {
        title: u.title.trim() ? "" : "Describe the deadline.",
        date: u.date ? (u.date < Y ? "Pick today or a later date." : "") : "Pick a due date.",
      };
      (m(_),
        !(_.title || _.date) &&
          (i({
            type: "DEADLINE_ADD",
            id: e,
            deadline: {
              id: fd("dl"),
              title: u.title.trim(),
              due: Ur(new Date(`${u.date}T12:00:00+05:30`).getTime(), 0, 17, 0),
              done: !1,
            },
          }),
          d({ title: "", date: "" }),
          r({ title: "Deadline added" })));
    },
    ae = (K) => {
      if ((K.preventDefault(), !S.trim())) return A("Write a note first.");
      if (S.length > 2e3) return A("Notes are limited to 2,000 characters.");
      (i({ type: "CASE_NOTE_ADD", id: e, text: S.trim() }), v(""), A(""), r({ title: "Note added" }));
    },
    $ = (K) => {
      K.preventDefault();
      const _ = {
        name: R.name.trim().length >= 3 ? "" : "Enter the document name (at least 3 characters).",
        kind: R.kind ? "" : "Choose a type.",
      };
      (q(_),
        !(_.name || _.kind) &&
          (i({
            type: "CASE_DOC_ADD",
            id: e,
            doc: {
              id: fd("dc"),
              name: R.name.trim(),
              kind: R.kind,
              addedAt: new Date().toISOString(),
              note: R.note.trim(),
            },
          }),
          g({ name: "", kind: "", note: "" }),
          q({}),
          j(!1),
          r({ title: "Document reference added" })));
    };
  return n.jsxs(n.Fragment, {
    children: [
      n.jsxs(P, {
        to: "/clients?tab=cases",
        className: "lp-back",
        children: [n.jsx(L, { name: "chevL", size: 16 }), " All cases"],
      }),
      n.jsxs("header", {
        className: "lp-page-h lp-detail-h",
        children: [
          n.jsxs("div", {
            children: [
              n.jsxs("p", { className: "lp-eyebrow", children: [o.area, " · opened ", Gn(o.openedAt)] }),
              n.jsx("h1", { className: "lp-h1", children: o.title }),
              n.jsxs("div", {
                className: "lp-ar-meta",
                children: [
                  n.jsx(Uc, { status: o.status }),
                  c && n.jsx(P, { className: "lp-link", to: `/clients/${c.id}`, children: c.name }),
                ],
              }),
            ],
          }),
          n.jsx("div", {
            className: "lp-page-actions",
            children: n.jsxs("label", {
              className: "lp-sel",
              children: [
                n.jsx("span", { className: "lp-sr", children: "Change case status" }),
                n.jsx("select", {
                  className: "lp-input lp-select-plain",
                  value: o.status,
                  onChange: (K) => T(K.target.value),
                  children: Object.entries($s).map(([K, [, _]]) =>
                    n.jsx("option", { value: K, children: _ }, K),
                  ),
                }),
              ],
            }),
          }),
        ],
      }),
      n.jsx(Kc, { className: "lp-mb" }),
      o.status === "closed" &&
        n.jsx(O, {
          tone: "success",
          title: "This case is closed",
          className: "lp-mb",
          children:
            "Notes and history are kept for your records. Reopen it from the status menu if work resumes.",
        }),
      n.jsxs("div", {
        className: "lp-vgrid",
        children: [
          n.jsxs("div", {
            className: "lp-vmain",
            children: [
              n.jsxs(Q, {
                "aria-labelledby": "cd-sum",
                children: [
                  n.jsx(z, { title: n.jsx("span", { id: "cd-sum", children: "Summary" }) }),
                  n.jsx("p", { className: "lp-quote", children: o.summary || "No summary yet." }),
                ],
              }),
              n.jsxs(Q, {
                "aria-labelledby": "cd-dl",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "cd-dl", children: "Deadlines" }),
                    sub:
                      te && o.status !== "closed"
                        ? `Next: ${te.title}`
                        : "Track dates that must not be missed.",
                  }),
                  Z.length === 0
                    ? n.jsx(le, {
                        icon: "clock",
                        title: "No deadlines",
                        children: "Add the first key date below.",
                      })
                    : n.jsx("ul", {
                        className: "lp-dls",
                        children: Z.map((K) =>
                          n.jsxs(
                            "li",
                            {
                              className: K.done ? "is-done" : "",
                              children: [
                                n.jsx(rt, {
                                  id: `dl-${K.id}`,
                                  label: K.title,
                                  checked: K.done,
                                  onChange: () => i({ type: "DEADLINE_TOGGLE", id: e, did: K.id }),
                                }),
                                n.jsx(Tr, { d: K, now: a }),
                                n.jsx("button", {
                                  type: "button",
                                  className: "lp-icon-btn",
                                  "aria-label": `Delete deadline ${K.title}`,
                                  onClick: () => k(K),
                                  children: n.jsx(L, { name: "trash", size: 16 }),
                                }),
                              ],
                            },
                            K.id,
                          ),
                        ),
                      }),
                  n.jsxs("form", {
                    className: "lp-inline-form",
                    noValidate: !0,
                    onSubmit: B,
                    children: [
                      n.jsx(W, {
                        id: "dl-t",
                        label: "New deadline",
                        value: u.title,
                        onChange: (K) => {
                          (d({ ...u, title: K.target.value }), m({ ...h, title: "" }));
                        },
                        error: h.title,
                        placeholder: "e.g. File reply",
                      }),
                      n.jsx(W, {
                        id: "dl-d",
                        type: "date",
                        label: "Due date",
                        min: Y,
                        value: u.date,
                        onChange: (K) => {
                          (d({ ...u, date: K.target.value }), m({ ...h, date: "" }));
                        },
                        error: h.date,
                      }),
                      n.jsx(b, { type: "submit", variant: "outline", icon: "plus", children: "Add" }),
                    ],
                  }),
                ],
              }),
              n.jsxs(Q, {
                "aria-labelledby": "cd-notes",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "cd-notes", children: "Case notes" }),
                    sub: "Private to you. Demo: stored in this browser.",
                  }),
                  n.jsxs("form", {
                    className: "lp-form",
                    noValidate: !0,
                    onSubmit: ae,
                    children: [
                      n.jsx(Et, {
                        id: "cn-note",
                        label: "Add a note",
                        rows: 3,
                        value: S,
                        onChange: (K) => {
                          (v(K.target.value), A(""));
                        },
                        error: N,
                        hint: `${S.length}/2000`,
                      }),
                      n.jsx("div", {
                        className: "lp-actions",
                        children: n.jsx(b, { type: "submit", size: "sm", children: "Add note" }),
                      }),
                    ],
                  }),
                  o.notes.length === 0
                    ? n.jsx(le, {
                        icon: "file",
                        title: "No notes yet",
                        children: "Notes you add are listed here, newest first.",
                      })
                    : n.jsx("ul", {
                        className: "lp-notelist",
                        children: o.notes.map((K) =>
                          n.jsxs(
                            "li",
                            {
                              children: [
                                n.jsxs("div", {
                                  children: [
                                    n.jsx("p", { children: K.text }),
                                    n.jsxs("small", { children: [Ke(K.at), ", ", ge(K.at)] }),
                                  ],
                                }),
                                n.jsx("button", {
                                  type: "button",
                                  className: "lp-icon-btn",
                                  "aria-label": "Delete note",
                                  onClick: () => p(K),
                                  children: n.jsx(L, { name: "trash", size: 16 }),
                                }),
                              ],
                            },
                            K.id,
                          ),
                        ),
                      }),
                ],
              }),
              n.jsxs(Q, {
                "aria-labelledby": "cd-docs",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "cd-docs", children: "Document references" }),
                    sub: "Names only — the files themselves are not stored in this prototype.",
                    action: n.jsx(b, {
                      size: "sm",
                      variant: "outline",
                      icon: "plus",
                      onClick: () => j(!0),
                      children: "Add reference",
                    }),
                  }),
                  o.docs.length === 0
                    ? n.jsx(le, {
                        icon: "file",
                        title: "No documents referenced",
                        children: "Add the agreements, filings and correspondence that belong to this case.",
                      })
                    : n.jsx("ul", {
                        className: "lp-list",
                        children: o.docs.map((K) =>
                          n.jsxs(
                            "li",
                            {
                              className: "lp-cr is-flat",
                              children: [
                                n.jsx("span", {
                                  className: "lp-cr-ic",
                                  children: n.jsx(L, { name: "file", size: 18 }),
                                }),
                                n.jsxs("div", {
                                  className: "lp-cr-main",
                                  children: [
                                    n.jsx("strong", { children: K.name }),
                                    n.jsxs("p", {
                                      children: [
                                        md[K.kind] || "Other",
                                        " · added ",
                                        Gn(K.addedAt),
                                        K.note ? ` · ${K.note}` : "",
                                      ],
                                    }),
                                  ],
                                }),
                                n.jsx("button", {
                                  type: "button",
                                  className: "lp-icon-btn",
                                  "aria-label": `Remove reference ${K.name}`,
                                  onClick: () => ue(K),
                                  children: n.jsx(L, { name: "trash", size: 16 }),
                                }),
                              ],
                            },
                            K.id,
                          ),
                        ),
                      }),
                ],
              }),
            ],
          }),
          n.jsxs("aside", {
            className: "lp-vside",
            children: [
              c &&
                n.jsxs(Q, {
                  "aria-labelledby": "cd-cl",
                  children: [
                    n.jsx(z, { title: n.jsx("span", { id: "cd-cl", children: "Client" }) }),
                    n.jsxs("dl", {
                      className: "lp-dl is-stack",
                      children: [
                        n.jsxs("div", {
                          children: [
                            n.jsx("dt", { children: "Name" }),
                            n.jsx("dd", {
                              children: n.jsx(P, {
                                className: "lp-link",
                                to: `/clients/${c.id}`,
                                children: c.name,
                              }),
                            }),
                          ],
                        }),
                        n.jsxs("div", {
                          children: [n.jsx("dt", { children: "Email" }), n.jsx("dd", { children: c.email })],
                        }),
                        n.jsxs("div", {
                          children: [n.jsx("dt", { children: "City" }), n.jsx("dd", { children: c.city })],
                        }),
                      ],
                    }),
                  ],
                }),
              n.jsxs(Q, {
                "aria-labelledby": "cd-rel",
                children: [
                  n.jsx(z, { title: n.jsx("span", { id: "cd-rel", children: "Related consultations" }) }),
                  D.length === 0
                    ? n.jsx("p", {
                        className: "lp-muted",
                        children: "No consultations with this client yet.",
                      })
                    : n.jsx("ul", {
                        className: "lp-list",
                        children: D.map((K) =>
                          n.jsxs(
                            "li",
                            {
                              className: "lp-cr is-flat is-tight",
                              children: [
                                n.jsx("span", {
                                  className: "lp-cr-ic",
                                  children: n.jsx(L, { name: Fr(K.type), size: 16 }),
                                }),
                                n.jsxs("div", {
                                  className: "lp-cr-main",
                                  children: [
                                    n.jsx(P, {
                                      to: `/appointments/${K.id}`,
                                      className: "lp-ar-t",
                                      children: K.matter,
                                    }),
                                    n.jsxs("p", { children: [Lr(K.startsAt, a), " · ", kn[K.type]] }),
                                    n.jsx("div", {
                                      className: "lp-ar-meta",
                                      children: n.jsx(Qr, { a: K, now: a }),
                                    }),
                                  ],
                                }),
                              ],
                            },
                            K.id,
                          ),
                        ),
                      }),
                ],
              }),
              n.jsxs(Q, {
                "aria-labelledby": "cd-hist",
                children: [
                  n.jsx(z, { title: n.jsx("span", { id: "cd-hist", children: "Case history" }) }),
                  n.jsx("ol", {
                    className: "lp-timeline",
                    children: [...o.events]
                      .sort((K, _) => new Date(_.at) - new Date(K.at))
                      .slice(0, 8)
                      .map((K, _) =>
                        n.jsxs(
                          "li",
                          {
                            children: [
                              n.jsx("span", { className: "lp-tl-dot is-lawyer" }),
                              n.jsxs("div", {
                                children: [
                                  n.jsx("p", { children: K.text }),
                                  n.jsxs("small", { children: [Ke(K.at), ", ", ge(K.at)] }),
                                ],
                              }),
                            ],
                          },
                          _,
                        ),
                      ),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      n.jsx(mt, {
        open: !!E,
        onClose: () => x(null),
        title: E === "closed" ? "Close this case?" : "Reopen this case?",
        confirmLabel: E === "closed" ? "Close case" : "Reopen case",
        tone: E === "closed" ? "danger" : "primary",
        onConfirm: () => {
          (i({ type: "CASE_STATUS", id: e, status: E, label: $s[E][1] }),
            r({ tone: "info", title: E === "closed" ? "Case closed" : "Case reopened" }),
            x(null));
        },
        children: n.jsx("p", {
          children:
            E === "closed"
              ? "Closed cases leave your active list and stop showing deadlines on the dashboard. You can reopen it later."
              : "The case returns to your active list with its open deadlines.",
        }),
      }),
      n.jsx(mt, {
        open: !!f,
        onClose: () => p(null),
        title: "Delete this note?",
        confirmLabel: "Delete note",
        tone: "danger",
        onConfirm: () => {
          (i({ type: "CASE_NOTE_DEL", id: e, noteId: f.id }),
            p(null),
            r({ tone: "info", title: "Note deleted" }));
        },
        children: n.jsx("p", { children: "This can’t be undone." }),
      }),
      n.jsx(mt, {
        open: !!y,
        onClose: () => k(null),
        title: "Delete this deadline?",
        confirmLabel: "Delete deadline",
        tone: "danger",
        onConfirm: () => {
          (i({ type: "DEADLINE_DEL", id: e, did: y.id }),
            k(null),
            r({ tone: "info", title: "Deadline deleted" }));
        },
        children: n.jsxs("p", {
          children: ["“", y == null ? void 0 : y.title, "” will be removed from this case."],
        }),
      }),
      n.jsx(mt, {
        open: !!X,
        onClose: () => ue(null),
        title: "Remove this reference?",
        confirmLabel: "Remove",
        tone: "danger",
        onConfirm: () => {
          (i({ type: "CASE_DOC_DEL", id: e, docId: X.id }),
            ue(null),
            r({ tone: "info", title: "Reference removed" }));
        },
        children: n.jsx("p", { children: "Only the reference is removed; no file is affected." }),
      }),
      n.jsx(Yt, {
        open: C,
        onClose: () => {
          (j(!1), q({}));
        },
        title: "Add a document reference",
        footer: n.jsxs(n.Fragment, {
          children: [
            n.jsx(b, {
              variant: "ghost",
              onClick: () => {
                (j(!1), q({}));
              },
              children: "Cancel",
            }),
            n.jsx(b, { type: "submit", form: "add-doc", children: "Add reference" }),
          ],
        }),
        children: n.jsxs("form", {
          id: "add-doc",
          className: "lp-form",
          noValidate: !0,
          onSubmit: $,
          children: [
            n.jsx(W, {
              id: "doc-n",
              label: "Document name",
              required: !0,
              value: R.name,
              onChange: (K) => {
                (g({ ...R, name: K.target.value }), q({ ...M, name: "" }));
              },
              error: M.name,
              placeholder: "e.g. Lease_draft_v3.pdf",
            }),
            n.jsx(Ce, {
              id: "doc-k",
              label: "Type",
              required: !0,
              options: Object.entries(md).map(([K, _]) => ({ value: K, label: _ })),
              value: R.kind,
              onChange: (K) => {
                (g({ ...R, kind: K.target.value }), q({ ...M, kind: "" }));
              },
              error: M.kind,
            }),
            n.jsx(Et, {
              id: "doc-t",
              label: "Note (optional)",
              rows: 2,
              value: R.note,
              onChange: (K) => g({ ...R, note: K.target.value }),
            }),
          ],
        }),
      }),
    ],
  });
}
export const Bs = 2e3,
  Nv = (e, t) => {
    const s = Bn(e, t);
    return s === "Today" ? ge(e) : s === "Yesterday" ? "Yesterday" : Ke(e);
  };
