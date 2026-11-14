import w from "react";
import * as n from "react/jsx-runtime";
import { useNavigate as Me, useParams as Mr, Link as P } from "react-router-dom";
import { Gn, Lr, kn, qt } from "../lib/core.js";
import { Et, H, L, Q, b, le, lt, xe, z } from "../components/ui.js";
import { Qt, ne, ur, ws } from "../state/store.js";
import { Fr, Qr } from "./verify-email.js";
import { Uc } from "../components/appointment-dialogs.js";
import { Kc, Tr, dm } from "../components/crm-dialogs.js";

/* app/views/client-profile.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
export function ClientProfileView() {
  const { id: e } = Mr(),
    { clients: t, cases: s, appts: l, convs: i, lawyer: r, dispatch: a } = ne(),
    o = Me(),
    c = xe(),
    u = Qt(),
    d = t.find((x) => x.id === e),
    [h, m] = w.useState((d == null ? void 0 : d.notes) || ""),
    [S, v] = w.useState(!0),
    [N, A] = w.useState(!1);
  if (
    (w.useEffect(() => {
      (m((d == null ? void 0 : d.notes) || ""), v(!0));
    }, [e]),
    !d)
  )
    return n.jsx(Q, {
      children: n.jsx(le, {
        icon: "users",
        title: "Client not found",
        action: n.jsx(P, {
          className: "lp-btn lp-btn-primary lp-btn-md",
          to: "/clients",
          children: n.jsx("span", { children: "Back to clients" }),
        }),
        children: "This client doesn’t exist or isn’t in your directory.",
      }),
    });
  const f = s.filter((x) => x.clientId === e),
    p = l.filter((x) => x.clientId === e).sort((x, C) => new Date(C.startsAt) - new Date(x.startsAt)),
    y = i.find((x) => x.clientId === e),
    k = y ? y.messages.slice(-3) : [],
    E = () => {
      if (y) return o(`/messages/${y.id}`);
      const x = `cv_${Date.now().toString(36)}`;
      (a({
        type: "CONV_ENSURE",
        conv: { id: x, lawyerId: r.id, clientId: e, lastReadAt: new Date().toISOString(), messages: [] },
      }),
        o(`/messages/${x}`));
    };
  return n.jsxs(n.Fragment, {
    children: [
      n.jsxs(P, {
        to: "/clients",
        className: "lp-back",
        children: [n.jsx(L, { name: "chevL", size: 16 }), " All clients"],
      }),
      n.jsxs("header", {
        className: "lp-page-h lp-detail-h",
        children: [
          n.jsxs("div", {
            className: "lp-detail-id",
            children: [
              n.jsx(lt, { name: d.name, size: 56 }),
              n.jsxs("div", {
                children: [
                  n.jsxs("p", { className: "lp-eyebrow", children: ["Client since ", Gn(d.since)] }),
                  n.jsx("h1", { className: "lp-h1", children: d.name }),
                  n.jsxs("div", {
                    className: "lp-ar-meta",
                    children: [
                      d.tags.map((x) => n.jsx(H, { children: x }, x)),
                      n.jsx("span", { children: d.city }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          n.jsxs("div", {
            className: "lp-page-actions",
            children: [
              n.jsx(b, { icon: "message", onClick: E, children: "Message" }),
              n.jsx(b, { variant: "outline", icon: "briefcase", onClick: () => A(!0), children: "New case" }),
            ],
          }),
        ],
      }),
      n.jsx(Kc, { className: "lp-mb" }),
      n.jsxs("div", {
        className: "lp-vgrid",
        children: [
          n.jsxs("div", {
            className: "lp-vmain",
            children: [
              n.jsxs(Q, {
                "aria-labelledby": "cp-cases",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "cp-cases", children: "Cases" }),
                    sub: `${f.filter((x) => x.status !== "closed").length} open · ${f.length} total`,
                  }),
                  f.length === 0
                    ? n.jsx(le, {
                        icon: "briefcase",
                        title: "No cases for this client",
                        action: n.jsx(b, {
                          size: "sm",
                          variant: "outline",
                          onClick: () => A(!0),
                          children: "Open a case",
                        }),
                        children: "Open a case to track deadlines, notes and documents.",
                      })
                    : n.jsx("ul", {
                        className: "lp-list",
                        children: f.map((x) => {
                          const C = ur(x);
                          return n.jsxs(
                            "li",
                            {
                              className: "lp-cr is-flat",
                              children: [
                                n.jsx("span", {
                                  className: "lp-cr-ic",
                                  children: n.jsx(L, { name: "briefcase", size: 18 }),
                                }),
                                n.jsxs("div", {
                                  className: "lp-cr-main",
                                  children: [
                                    n.jsx(P, {
                                      to: `/cases/${x.id}`,
                                      className: "lp-ar-t",
                                      children: x.title,
                                    }),
                                    n.jsx("div", {
                                      className: "lp-ar-meta",
                                      children: n.jsx(Uc, { status: x.status }),
                                    }),
                                  ],
                                }),
                                n.jsx("div", {
                                  className: "lp-cr-side",
                                  children: x.status !== "closed" ? n.jsx(Tr, { d: C, now: u }) : null,
                                }),
                              ],
                            },
                            x.id,
                          );
                        }),
                      }),
                ],
              }),
              n.jsxs(Q, {
                "aria-labelledby": "cp-appts",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "cp-appts", children: "Appointment history" }),
                    sub: `${p.length} consultation${p.length === 1 ? "" : "s"}`,
                  }),
                  p.length === 0
                    ? n.jsx(le, {
                        icon: "calendar",
                        title: "No consultations yet",
                        children: "Consultations with this client will be listed here.",
                      })
                    : n.jsx("ul", {
                        className: "lp-list",
                        children: p.map((x) =>
                          n.jsxs(
                            "li",
                            {
                              className: "lp-cr is-flat",
                              children: [
                                n.jsx("span", {
                                  className: "lp-cr-ic",
                                  children: n.jsx(L, { name: Fr(x.type), size: 18 }),
                                }),
                                n.jsxs("div", {
                                  className: "lp-cr-main",
                                  children: [
                                    n.jsx(P, {
                                      to: `/appointments/${x.id}`,
                                      className: "lp-ar-t",
                                      children: x.matter,
                                    }),
                                    n.jsxs("p", { children: [Lr(x.startsAt, u), " · ", kn[x.type]] }),
                                  ],
                                }),
                                n.jsx("div", {
                                  className: "lp-cr-side",
                                  children: n.jsx(Qr, { a: x, now: u }),
                                }),
                              ],
                            },
                            x.id,
                          ),
                        ),
                      }),
                ],
              }),
              n.jsxs(Q, {
                "aria-labelledby": "cp-msg",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "cp-msg", children: "Communication" }),
                    action: n.jsx(b, {
                      size: "sm",
                      variant: "outline",
                      icon: "message",
                      onClick: E,
                      children: y ? "Open conversation" : "Start conversation",
                    }),
                    sub: "Mock messaging — not delivered to anyone.",
                  }),
                  k.length === 0
                    ? n.jsx(le, {
                        icon: "message",
                        title: "No messages yet",
                        children: "Start a conversation to keep communication with this client in one place.",
                      })
                    : n.jsx("ul", {
                        className: "lp-mini-msgs",
                        children: k.map((x) =>
                          n.jsxs(
                            "li",
                            {
                              className: x.from === "lawyer" ? "is-me" : "",
                              children: [
                                n.jsx("strong", {
                                  children: x.from === "lawyer" ? "You" : d.name.split(" ")[0],
                                }),
                                n.jsx("p", { children: x.text }),
                                n.jsx("small", { children: qt(x.at, u) }),
                              ],
                            },
                            x.id,
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
              n.jsxs(Q, {
                "aria-labelledby": "cp-contact",
                children: [
                  n.jsx(z, { title: n.jsx("span", { id: "cp-contact", children: "Contact" }) }),
                  n.jsxs("dl", {
                    className: "lp-dl is-stack",
                    children: [
                      n.jsxs("div", {
                        children: [n.jsx("dt", { children: "Email" }), n.jsx("dd", { children: d.email })],
                      }),
                      n.jsxs("div", {
                        children: [n.jsx("dt", { children: "Phone" }), n.jsx("dd", { children: d.phone })],
                      }),
                      n.jsxs("div", {
                        children: [n.jsx("dt", { children: "City" }), n.jsx("dd", { children: d.city })],
                      }),
                      n.jsxs("div", {
                        children: [
                          n.jsx("dt", { children: "Last message" }),
                          n.jsx("dd", { children: y && ws(y) ? qt(ws(y).at, u) : "—" }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              n.jsxs(Q, {
                "aria-labelledby": "cp-notes",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "cp-notes", children: "Private notes" }),
                    sub: "Only you see these. Demo: stored in this browser.",
                  }),
                  n.jsx(Et, {
                    id: "cp-notes-t",
                    label: "Notes about this client",
                    rows: 5,
                    value: h,
                    onChange: (x) => {
                      (m(x.target.value), v(!1));
                    },
                  }),
                  n.jsxs("div", {
                    className: "lp-actions",
                    children: [
                      n.jsx(b, {
                        size: "sm",
                        disabled: S,
                        onClick: () => {
                          (a({ type: "CLIENT_NOTES", id: e, notes: h }), v(!0), c({ title: "Notes saved" }));
                        },
                        children: "Save notes",
                      }),
                      !S && n.jsx("span", { className: "lp-hint", children: "Unsaved changes" }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      n.jsx(dm, { open: N, onClose: () => A(!1), clientId: e }),
    ],
  });
}
export const md = {
    agreement: "Agreement",
    correspondence: "Correspondence",
    filing: "Filing",
    id: "Identity document",
    other: "Other",
  },
  fd = (e) => `${e}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
