import w from "react";
import * as n from "react/jsx-runtime";
import { useSearchParams as Ks } from "react-router-dom";
import { Ec, Ft, L, O, Q, Ql, b, le, qs } from "../components/ui.js";
import { Qt, ne } from "../state/store.js";
import { Lc, jo } from "../components/appointment-dialogs.js";

/* app/views/appointments.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
const oi = 5,
  ci = [
    ["requests", "Requests", (e) => e.status === "requested"],
    ["upcoming", "Upcoming", (e) => e.status === "scheduled"],
    ["completed", "Completed", (e) => e.status === "completed"],
    ["history", "Cancelled & declined", (e) => e.status === "cancelled" || e.status === "declined"],
  ],
  xa = {
    requests: [
      "users",
      "No pending requests",
      "When a client asks to consult you, the request appears here for you to accept or decline.",
    ],
    upcoming: [
      "calendar",
      "No upcoming consultations",
      "Accepted consultations are listed here with their date, time and join details.",
    ],
    completed: [
      "check",
      "No completed consultations yet",
      "Finished consultations and their fees will be listed here.",
    ],
    history: ["file", "Nothing here", "Cancelled and declined consultations are kept here for your records."],
  };
export function AppointmentsView() {
  const { appts: e, lawyer: t } = ne(),
    s = Qt(),
    [l, i] = Ks(),
    r = Lc(),
    [a, o] = w.useState(!0);
  w.useEffect(() => {
    const E = setTimeout(() => o(!1), 450);
    return () => clearTimeout(E);
  }, []);
  const c = Object.fromEntries(ci.map(([E, , x]) => [E, e.filter(x).length])),
    u = ci.some(([E]) => E === l.get("tab")) ? l.get("tab") : c.requests ? "requests" : "upcoming",
    d = l.get("q") || "",
    h = l.get("type") || "",
    m = l.get("sort") || "soonest",
    S = Number(l.get("page") || 1),
    v = (E) => {
      const x = new URLSearchParams(l);
      (Object.entries(E).forEach(([C, j]) => (j ? x.set(C, j) : x.delete(C))),
        "page" in E || x.delete("page"),
        i(x, { replace: !0 }));
    },
    N = w.useMemo(() => {
      const E = ci.find(([g]) => g === u)[2],
        x = d.trim().toLowerCase();
      let C = e
        .filter(E)
        .filter(
          (g) =>
            (!h || g.type === h) &&
            (!x || `${g.client.name} ${g.matter} ${g.client.city}`.toLowerCase().includes(x)),
        );
      const j = (g) => new Date(g.startsAt).getTime(),
        R = u === "completed" || u === "history" ? -1 : 1;
      return (
        (C = C.sort((g, M) => (m === "soonest" ? R : -R) * (j(g) - j(M)))),
        u === "requests" &&
          m === "soonest" &&
          (C = C.sort((g, M) => new Date(g.expiresAt) - new Date(M.expiresAt))),
        C
      );
    }, [e, u, d, h, m]),
    A = Math.max(1, Math.ceil(N.length / oi)),
    f = Math.min(S, A),
    p = N.slice((f - 1) * oi, f * oi),
    y = !!(d || h),
    k = t.verification.status === "approved";
  return n.jsxs(n.Fragment, {
    children: [
      n.jsx(Ft, {
        eyebrow: "Practice",
        title: "Appointments",
        children:
          "Respond to requests, manage upcoming consultations and review your history. Times are shown in IST.",
      }),
      !k &&
        u === "requests" &&
        c.requests > 0 &&
        n.jsx(O, {
          tone: "warning",
          title: "You can’t accept requests until you’re verified",
          className: "lp-mb",
          children: "Requests stay here and expire on their own deadline. Complete verification to respond.",
        }),
      n.jsxs(Q, {
        className: "lp-listcard",
        children: [
          n.jsx(qs, {
            label: "Appointment lists",
            tabs: ci.map(([E, x]) => ({ id: E, label: x, count: c[E] })),
            value: u,
            onChange: (E) => v({ tab: E }),
          }),
          n.jsxs("div", {
            className: "lp-toolbar",
            children: [
              n.jsxs("div", {
                className: "lp-search",
                children: [
                  n.jsx(L, { name: "search", size: 16 }),
                  n.jsx("input", {
                    type: "search",
                    "aria-label": "Search appointments by client, matter or city",
                    placeholder: "Search client, matter or city",
                    value: d,
                    onChange: (E) => v({ q: E.target.value }),
                  }),
                ],
              }),
              n.jsxs("label", {
                className: "lp-sel",
                children: [
                  n.jsx("span", { className: "lp-sr", children: "Filter by consultation type" }),
                  n.jsxs("select", {
                    className: "lp-input lp-select-plain",
                    value: h,
                    onChange: (E) => v({ type: E.target.value }),
                    children: [
                      n.jsx("option", { value: "", children: "All types" }),
                      n.jsx("option", { value: "video", children: "Video" }),
                      n.jsx("option", { value: "phone", children: "Phone" }),
                      n.jsx("option", { value: "in_person", children: "In person" }),
                    ],
                  }),
                ],
              }),
              n.jsxs("label", {
                className: "lp-sel",
                children: [
                  n.jsx("span", { className: "lp-sr", children: "Sort order" }),
                  n.jsxs("select", {
                    className: "lp-input lp-select-plain",
                    value: m,
                    onChange: (E) => v({ sort: E.target.value }),
                    children: [
                      n.jsx("option", {
                        value: "soonest",
                        children:
                          u === "requests"
                            ? "Expiring first"
                            : u === "upcoming"
                              ? "Soonest first"
                              : "Newest first",
                      }),
                      n.jsx("option", {
                        value: "latest",
                        children: u === "upcoming" ? "Latest first" : "Oldest first",
                      }),
                    ],
                  }),
                ],
              }),
              y &&
                n.jsx(b, {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => v({ q: "", type: "" }),
                  children: "Clear filters",
                }),
            ],
          }),
          n.jsx("p", {
            className: "lp-sr",
            "aria-live": "polite",
            children: a ? "Loading" : `${N.length} ${N.length === 1 ? "result" : "results"}`,
          }),
          a
            ? n.jsx("div", { className: "lp-pad", children: n.jsx(Ec, { lines: 4, height: 56 }) })
            : N.length === 0
              ? y
                ? n.jsx(le, {
                    icon: "search",
                    title: "No matches",
                    action: n.jsx(b, {
                      variant: "outline",
                      size: "sm",
                      onClick: () => v({ q: "", type: "" }),
                      children: "Clear filters",
                    }),
                    children: "Nothing matches your search and filters in this list.",
                  })
                : n.jsx(le, { icon: xa[u][0], title: xa[u][1], children: xa[u][2] })
              : n.jsxs(n.Fragment, {
                  children: [
                    n.jsx("ul", {
                      className: "lp-list",
                      children: p.map((E) =>
                        n.jsx(
                          jo,
                          { a: E, now: s, canAccept: k, onAction: r.open, showActions: u === "requests" },
                          E.id,
                        ),
                      ),
                    }),
                    n.jsx(Ql, {
                      page: f,
                      pages: A,
                      total: N.length,
                      perPage: oi,
                      onChange: (E) => v({ page: String(E) }),
                    }),
                  ],
                }),
        ],
      }),
      r.node,
    ],
  });
}
