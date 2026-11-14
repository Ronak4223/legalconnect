import w from "react";
import * as n from "react/jsx-runtime";
import { useNavigate as Me, Link as P } from "react-router-dom";
import { Ds, J, Lr, go, qt, ry } from "../lib/core.js";
import { H, L, Lt, O, Q, le, z } from "../components/ui.js";
import { $h, He, Mc } from "../lib/domain.js";
import { Qt, Tl, ki, ne } from "../state/store.js";
import { um } from "./verify-email.js";
import { Lc, jo } from "../components/appointment-dialogs.js";
import { Tr, _y, ev } from "../components/crm-dialogs.js";

/* app/views/dashboard.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
export function DashboardView() {
  const { lawyer: e, appts: t, payouts: s, activity: l, cases: i, clients: r } = ne(),
    a = Me(),
    o = Qt(),
    c = Lc(),
    u = e.verification,
    d = u.status === "approved",
    [h, m] = Tl[u.status],
    S = w.useMemo(
      () =>
        t
          .filter((g) => g.status === "requested")
          .sort((g, M) => new Date(g.expiresAt || g.startsAt) - new Date(M.expiresAt || M.startsAt)),
      [t],
    ),
    v = w.useMemo(
      () =>
        t
          .filter((g) => g.status === "scheduled" && new Date(g.startsAt).getTime() > o - 36e5)
          .sort((g, M) => new Date(g.startsAt) - new Date(M.startsAt)),
      [t, o],
    ),
    { summary: N } = w.useMemo(() => $h(t, s, o), [t, s, o]),
    A = N.monthNet,
    f = N.monthGross,
    p = N.monthCount,
    y = w.useMemo(() => {
      const g = [];
      for (let M = 5; M >= 0; M--) {
        const q = new Date(o);
        (q.setMonth(q.getMonth() - M), g.push(q.toISOString()));
      }
      return g.map((M, q) => ({ label: go(M), value: q === 5 ? A : e.id === He ? Mc[q] : 0 }));
    }, [o, A, e.id]),
    k = Math.max(...y.map((g) => g.value), 1),
    E = S.filter((g) => um(g, o)).length,
    x = l.slice(0, 5),
    C = i.filter(ki),
    j = w.useMemo(
      () =>
        C.flatMap((g) =>
          g.deadlines.filter((M) => !M.done).map((M) => ({ ...M, caseId: g.id, caseTitle: g.title })),
        ).sort((g, M) => new Date(g.due) - new Date(M.due)),
      [i],
    ),
    R = j.filter((g) => new Date(g.due).getTime() < o + 7 * 864e5).length;
  return n.jsxs(n.Fragment, {
    children: [
      n.jsx("section", {
        className: "lp-banner",
        style: { "--lp-banner": `url(${_y})` },
        "aria-label": "Welcome",
        children: n.jsxs("div", {
          className: "lp-banner-in",
          children: [
            n.jsx("p", { className: "lp-eyebrow is-light", children: Ds(new Date(o).toISOString()) }),
            n.jsxs("h1", { className: "lp-banner-h", children: [ry(o), ", ", e.name.split(" ")[0]] }),
            n.jsx("p", {
              children:
                S.length > 0
                  ? `You have ${S.length} consultation ${S.length === 1 ? "request" : "requests"} waiting for a response.`
                  : "Here’s what’s happening with your practice today.",
            }),
          ],
        }),
      }),
      !d &&
        n.jsx(O, {
          tone: u.status === "rejected" ? "danger" : "warning",
          title:
            u.status === "pending"
              ? "Your verification is in review"
              : "Complete verification to start accepting consultations",
          className: "lp-mb",
          action: n.jsx(P, {
            className: "lp-btn lp-btn-outline lp-btn-sm",
            to: "/verification",
            children: n.jsx("span", {
              children: u.status === "pending" ? "View status" : "Open verification",
            }),
          }),
          children:
            u.status === "pending"
              ? "You can look around, but accepting requests unlocks after approval."
              : "Requests stay visible, but you cannot accept them until your credentials are approved.",
        }),
      n.jsxs("div", {
        className: "lp-stats",
        children: [
          n.jsx(Lt, {
            icon: "users",
            label: "New requests",
            value: S.length,
            hint: E ? `${E} expiring within 24 h` : "Awaiting your response",
            tone: "gold",
            onClick: () => a("/appointments?tab=requests"),
          }),
          n.jsx(Lt, {
            icon: "calendar",
            label: "Upcoming consultations",
            value: v.length,
            hint: v[0] ? `Next: ${Lr(v[0].startsAt, o)}` : "None scheduled",
            onClick: () => a("/appointments?tab=upcoming"),
          }),
          n.jsx(Lt, {
            icon: "briefcase",
            label: "Active cases",
            value: C.length,
            hint: R ? `${R} deadline${R === 1 ? "" : "s"} due within 7 days` : "No deadlines this week",
            tone: "navy",
            onClick: () => a("/clients?tab=cases"),
          }),
          n.jsx(Lt, {
            icon: "rupee",
            label: "Earnings this month",
            value: J(A),
            hint: p ? `${p} completed · ${J(f)} gross` : "No completed consultations yet",
            tone: "success",
            onClick: () => a("/payments"),
          }),
        ],
      }),
      n.jsxs("div", {
        className: "lp-dgrid",
        children: [
          n.jsxs("div", {
            className: "lp-dmain",
            children: [
              n.jsxs(Q, {
                "aria-labelledby": "d-req",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "d-req", children: "Pending consultation requests" }),
                    sub: "Respond before they expire.",
                    action:
                      S.length > 0 &&
                      n.jsx(P, {
                        className: "lp-link",
                        to: "/appointments?tab=requests",
                        children: "View all",
                      }),
                  }),
                  S.length === 0
                    ? n.jsx(le, {
                        icon: "users",
                        title: "No pending requests",
                        children:
                          "New consultation requests from clients will appear here as soon as they are made.",
                      })
                    : n.jsx("ul", {
                        className: "lp-list",
                        children: S.slice(0, 3).map((g) =>
                          n.jsx(jo, { a: g, now: o, canAccept: d, onAction: c.open }, g.id),
                        ),
                      }),
                ],
              }),
              n.jsxs(Q, {
                "aria-labelledby": "d-up",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "d-up", children: "Upcoming consultations" }),
                    action:
                      v.length > 0 &&
                      n.jsx(P, {
                        className: "lp-link",
                        to: "/appointments?tab=upcoming",
                        children: "View all",
                      }),
                  }),
                  v.length === 0
                    ? n.jsx(le, {
                        icon: "calendar",
                        title: "Nothing scheduled",
                        action: n.jsx(P, {
                          className: "lp-btn lp-btn-outline lp-btn-sm",
                          to: "/appointments?tab=requests",
                          children: n.jsx("span", { children: "Review requests" }),
                        }),
                        children:
                          "Accepted consultations will show up here with their time and join details.",
                      })
                    : n.jsx("ul", {
                        className: "lp-list",
                        children: v
                          .slice(0, 4)
                          .map((g) => n.jsx(jo, { a: g, now: o, showActions: !1 }, g.id)),
                      }),
                ],
              }),
            ],
          }),
          n.jsxs("div", {
            className: "lp-dside",
            children: [
              n.jsxs(Q, {
                "aria-labelledby": "d-ver",
                children: [
                  n.jsx(z, { title: n.jsx("span", { id: "d-ver", children: "Verification" }) }),
                  n.jsxs("div", {
                    className: "lp-vmini",
                    children: [
                      n.jsx(H, { tone: h, dot: !0, children: m }),
                      n.jsx("p", {
                        children: {
                          approved: "Your credentials are approved (demo).",
                          pending: "Under review — typically 2–3 business days.",
                          rejected: "A document needs to be replaced.",
                          incomplete: "Submit your documents to get verified.",
                        }[u.status],
                      }),
                      n.jsx(P, {
                        className: "lp-link",
                        to: "/verification",
                        children: "Open verification centre →",
                      }),
                    ],
                  }),
                ],
              }),
              n.jsxs(Q, {
                "aria-labelledby": "d-qa",
                children: [
                  n.jsx(z, { title: n.jsx("span", { id: "d-qa", children: "Quick actions" }) }),
                  n.jsxs("div", {
                    className: "lp-qa",
                    children: [
                      n.jsxs(P, {
                        to: "/appointments?tab=requests",
                        children: [
                          n.jsx(L, { name: "users", size: 18 }),
                          n.jsx("span", { children: "Review requests" }),
                        ],
                      }),
                      n.jsxs(P, {
                        to: "/verification",
                        children: [
                          n.jsx(L, { name: "upload", size: 18 }),
                          n.jsx("span", { children: "Upload documents" }),
                        ],
                      }),
                      n.jsxs(P, {
                        to: "/availability",
                        children: [
                          n.jsx(L, { name: "clock", size: 18 }),
                          n.jsx("span", { children: "Set availability" }),
                        ],
                      }),
                      n.jsxs(P, {
                        to: "/profile",
                        children: [
                          n.jsx(L, { name: "user", size: 18 }),
                          n.jsx("span", { children: "Update profile" }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              n.jsxs(Q, {
                "aria-labelledby": "d-dl",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "d-dl", children: "Upcoming deadlines" }),
                    action:
                      j.length > 0 &&
                      n.jsx(P, { className: "lp-link", to: "/clients?tab=cases", children: "All cases" }),
                  }),
                  j.length === 0
                    ? n.jsx(le, {
                        icon: "clock",
                        title: "No open deadlines",
                        children: "Deadlines you add to cases appear here.",
                      })
                    : n.jsx("ul", {
                        className: "lp-feed",
                        children: j.slice(0, 4).map((g) =>
                          n.jsxs(
                            "li",
                            {
                              children: [
                                n.jsx("span", {
                                  className: "lp-feed-ic",
                                  children: n.jsx(L, { name: "clock", size: 15 }),
                                }),
                                n.jsxs("div", {
                                  children: [
                                    n.jsx(P, { to: `/cases/${g.caseId}`, children: g.title }),
                                    n.jsx("small", { children: g.caseTitle }),
                                    n.jsx(Tr, { d: g, now: o }),
                                  ],
                                }),
                              ],
                            },
                            g.id,
                          ),
                        ),
                      }),
                ],
              }),
              n.jsxs(Q, {
                "aria-labelledby": "d-earn",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "d-earn", children: "Earnings overview" }),
                    sub: "Net of 10% platform fee · illustrative",
                  }),
                  k <= 1
                    ? n.jsx(le, {
                        icon: "chart",
                        title: "No earnings yet",
                        children: "Completed consultations will appear here.",
                      })
                    : n.jsx("div", {
                        className: "lp-bars",
                        role: "img",
                        "aria-label": `Net earnings by month: ${y.map((g) => `${g.label} ${J(g.value)}`).join(", ")}`,
                        children: y.map((g, M) =>
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
                                  style: { height: `${Math.max((g.value / k) * 100, g.value ? 6 : 2)}%` },
                                }),
                                n.jsx("small", { children: g.label }),
                              ],
                            },
                            g.label + M,
                          ),
                        ),
                      }),
                  n.jsxs("p", {
                    className: "lp-hint",
                    children: [
                      "Figures are fictional. ",
                      n.jsx(P, { className: "lp-link", to: "/payments", children: "Open payments" }),
                    ],
                  }),
                ],
              }),
              n.jsxs(Q, {
                "aria-labelledby": "d-act",
                children: [
                  n.jsx(z, { title: n.jsx("span", { id: "d-act", children: "Recent activity" }) }),
                  x.length === 0
                    ? n.jsx(le, { icon: "clock", title: "No activity yet" })
                    : n.jsx("ul", {
                        className: "lp-feed",
                        children: x.map((g) =>
                          n.jsxs(
                            "li",
                            {
                              children: [
                                n.jsx("span", {
                                  className: "lp-feed-ic",
                                  children: n.jsx(L, { name: ev[g.kind] || "info", size: 15 }),
                                }),
                                n.jsxs("div", {
                                  children: [
                                    n.jsx(P, { to: g.href || "/dashboard", children: g.text }),
                                    n.jsx("small", { children: qt(g.at, o) }),
                                  ],
                                }),
                              ],
                            },
                            g.id,
                          ),
                        ),
                      }),
                ],
              }),
            ],
          }),
        ],
      }),
      c.node,
    ],
  });
}
