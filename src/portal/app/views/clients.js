import w from "react";
import * as n from "react/jsx-runtime";
import { Link as P, useSearchParams as Ks } from "react-router-dom";
import { Lr, qt } from "../lib/core.js";
import { Ec, Ft, H, L, Q, Ql, b, le, lt, qs } from "../components/ui.js";
import { Qt, ki, ne, ur, ws } from "../state/store.js";
import { Uc } from "../components/appointment-dialogs.js";
import { $y, Kc, Tr, dm } from "../components/crm-dialogs.js";
import { pi } from "./settings.js";

/* app/views/clients.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
export function ClientsView() {
  const { clients: e, cases: t, appts: s, convs: l } = ne(),
    i = Qt(),
    [r, a] = Ks(),
    [o, c] = w.useState(!0),
    [u, d] = w.useState(!1),
    [h, m] = w.useState(!1);
  w.useEffect(() => {
    const Y = setTimeout(() => c(!1), 400);
    return () => clearTimeout(Y);
  }, []);
  const S = r.get("tab") === "cases" ? "cases" : "clients",
    v = r.get("q") || "",
    N = r.get("f") || "",
    A = r.get("sort") || "",
    f = Number(r.get("page") || 1),
    p = (Y) => {
      const Z = new URLSearchParams(r);
      (Object.entries(Y).forEach(([te, D]) => (D ? Z.set(te, D) : Z.delete(te))),
        "page" in Y || Z.delete("page"),
        a(Z, { replace: !0 }));
    },
    y = (Y) => a(Y === "cases" ? { tab: "cases" } : {}, { replace: !0 }),
    k = w.useMemo(() => Object.fromEntries(e.map((Y) => [Y.id, Y])), [e]),
    E = w.useMemo(
      () =>
        Object.fromEntries(
          e.map((Y) => {
            const Z = t.filter(($) => $.clientId === Y.id),
              te = s
                .filter(
                  ($) =>
                    $.clientId === Y.id &&
                    $.status === "scheduled" &&
                    new Date($.startsAt).getTime() > i - 36e5,
                )
                .sort(($, K) => new Date($.startsAt) - new Date(K.startsAt))[0],
              D = l.find(($) => $.clientId === Y.id),
              T = D && ws(D),
              B = s
                .filter(($) => $.clientId === Y.id && new Date($.startsAt).getTime() <= i)
                .map(($) => $.startsAt),
              ae = [T == null ? void 0 : T.at, ...B].filter(Boolean).sort().pop() || Y.since;
            return [Y.id, { open: Z.filter(ki).length, total: Z.length, next: te, last: ae }];
          }),
        ),
      [e, t, s, l, i],
    ),
    x = w.useMemo(() => {
      const Y = v.trim().toLowerCase();
      let Z = e.filter(
        (te) =>
          (!Y || `${te.name} ${te.email} ${te.city}`.toLowerCase().includes(Y)) &&
          (!N ||
            (N === "active" && E[te.id].open > 0) ||
            (N === "upcoming" && E[te.id].next) ||
            (N === "idle" && !E[te.id].open && !E[te.id].next)),
      );
      return (
        (Z = [...Z].sort((te, D) =>
          A === "recent"
            ? new Date(E[D.id].last) - new Date(E[te.id].last)
            : A === "newest"
              ? new Date(D.since) - new Date(te.since)
              : te.name.localeCompare(D.name),
        )),
        Z
      );
    }, [e, v, N, A, E]),
    C = r.get("status") || "open",
    j = w.useMemo(() => {
      const Y = v.trim().toLowerCase();
      let Z = t.filter((D) => {
        var T;
        return (
          (C === "all" || (C === "open" ? ki(D) : D.status === C)) &&
          (!Y ||
            `${D.title} ${((T = k[D.clientId]) == null ? void 0 : T.name) || ""}`.toLowerCase().includes(Y))
        );
      });
      const te = (D) => {
        const T = ur(D);
        return T ? new Date(T.due).getTime() : 1 / 0;
      };
      return (
        (Z = [...Z].sort((D, T) =>
          A === "opened"
            ? new Date(T.openedAt) - new Date(D.openedAt)
            : A === "title"
              ? D.title.localeCompare(T.title)
              : te(D) - te(T),
        )),
        Z
      );
    }, [t, v, C, A, k]),
    R = S === "clients" ? x : j,
    g = Math.max(1, Math.ceil(R.length / pi)),
    M = Math.min(f, g),
    q = R.slice((M - 1) * pi, M * pi),
    X = !!(v || N || (S === "cases" && C !== "open")),
    ue = () => p({ q: "", f: "", status: "" });
  return n.jsxs(n.Fragment, {
    children: [
      n.jsx(Ft, {
        eyebrow: "Practice",
        title: "Clients & cases",
        actions: n.jsxs(n.Fragment, {
          children: [
            n.jsx(b, { variant: "outline", icon: "plus", onClick: () => d(!0), children: "Add client" }),
            n.jsx(b, { icon: "briefcase", onClick: () => m(!0), children: "New case" }),
          ],
        }),
        children: "Your client directory, with the cases, deadlines and conversations that belong to each.",
      }),
      n.jsx(Kc, { className: "lp-mb" }),
      n.jsxs(Q, {
        className: "lp-listcard",
        children: [
          n.jsx(qs, {
            label: "Clients and cases",
            value: S,
            onChange: y,
            tabs: [
              { id: "clients", label: "Clients", count: e.length },
              { id: "cases", label: "Cases", count: t.filter(ki).length },
            ],
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
                    "aria-label":
                      S === "clients"
                        ? "Search clients by name, email or city"
                        : "Search cases by title or client",
                    placeholder: S === "clients" ? "Search name, email or city" : "Search case or client",
                    value: v,
                    onChange: (Y) => p({ q: Y.target.value }),
                  }),
                ],
              }),
              S === "clients"
                ? n.jsxs(n.Fragment, {
                    children: [
                      n.jsxs("label", {
                        className: "lp-sel",
                        children: [
                          n.jsx("span", { className: "lp-sr", children: "Filter clients" }),
                          n.jsxs("select", {
                            className: "lp-input lp-select-plain",
                            value: N,
                            onChange: (Y) => p({ f: Y.target.value }),
                            children: [
                              n.jsx("option", { value: "", children: "All clients" }),
                              n.jsx("option", { value: "active", children: "With an open case" }),
                              n.jsx("option", {
                                value: "upcoming",
                                children: "With an upcoming consultation",
                              }),
                              n.jsx("option", { value: "idle", children: "No open work" }),
                            ],
                          }),
                        ],
                      }),
                      n.jsxs("label", {
                        className: "lp-sel",
                        children: [
                          n.jsx("span", { className: "lp-sr", children: "Sort clients" }),
                          n.jsxs("select", {
                            className: "lp-input lp-select-plain",
                            value: A,
                            onChange: (Y) => p({ sort: Y.target.value }),
                            children: [
                              n.jsx("option", { value: "", children: "Name A–Z" }),
                              n.jsx("option", { value: "recent", children: "Recently active" }),
                              n.jsx("option", { value: "newest", children: "Newest client" }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  })
                : n.jsxs(n.Fragment, {
                    children: [
                      n.jsxs("label", {
                        className: "lp-sel",
                        children: [
                          n.jsx("span", { className: "lp-sr", children: "Filter cases by status" }),
                          n.jsxs("select", {
                            className: "lp-input lp-select-plain",
                            value: C,
                            onChange: (Y) => p({ status: Y.target.value }),
                            children: [
                              n.jsx("option", { value: "open", children: "All open" }),
                              n.jsx("option", { value: "active", children: "Active" }),
                              n.jsx("option", { value: "awaiting_client", children: "Awaiting client" }),
                              n.jsx("option", { value: "on_hold", children: "On hold" }),
                              n.jsx("option", { value: "closed", children: "Closed" }),
                              n.jsx("option", { value: "all", children: "All, including closed" }),
                            ],
                          }),
                        ],
                      }),
                      n.jsxs("label", {
                        className: "lp-sel",
                        children: [
                          n.jsx("span", { className: "lp-sr", children: "Sort cases" }),
                          n.jsxs("select", {
                            className: "lp-input lp-select-plain",
                            value: A,
                            onChange: (Y) => p({ sort: Y.target.value }),
                            children: [
                              n.jsx("option", { value: "", children: "Next deadline" }),
                              n.jsx("option", { value: "opened", children: "Recently opened" }),
                              n.jsx("option", { value: "title", children: "Title A–Z" }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
              X && n.jsx(b, { variant: "ghost", size: "sm", onClick: ue, children: "Clear filters" }),
            ],
          }),
          n.jsx("p", {
            className: "lp-sr",
            "aria-live": "polite",
            children: o ? "Loading" : `${R.length} ${S === "clients" ? "clients" : "cases"}`,
          }),
          o
            ? n.jsx("div", { className: "lp-pad", children: n.jsx(Ec, { lines: 4, height: 52 }) })
            : R.length === 0
              ? X
                ? n.jsx(le, {
                    level: 2,
                    icon: "search",
                    title: "No matches",
                    action: n.jsx(b, {
                      variant: "outline",
                      size: "sm",
                      onClick: ue,
                      children: "Clear filters",
                    }),
                    children: "Nothing matches your search and filters.",
                  })
                : S === "clients"
                  ? n.jsx(le, {
                      level: 2,
                      icon: "users",
                      title: "No clients yet",
                      action: n.jsx(b, {
                        size: "sm",
                        icon: "plus",
                        onClick: () => d(!0),
                        children: "Add your first client",
                      }),
                      children: "Clients appear here once you accept a consultation or add them yourself.",
                    })
                  : n.jsx(le, {
                      level: 2,
                      icon: "briefcase",
                      title: "No cases yet",
                      action: n.jsx(b, {
                        size: "sm",
                        icon: "briefcase",
                        onClick: () => m(!0),
                        children: "Open a case",
                      }),
                      children:
                        "Cases hold your notes, deadlines and document references for a client matter.",
                    })
              : n.jsxs(n.Fragment, {
                  children: [
                    n.jsx("ul", {
                      className: "lp-list",
                      children:
                        S === "clients"
                          ? q.map((Y) => {
                              const Z = E[Y.id];
                              return n.jsxs(
                                "li",
                                {
                                  className: "lp-cr",
                                  children: [
                                    n.jsx(lt, { name: Y.name, size: 42 }),
                                    n.jsxs("div", {
                                      className: "lp-cr-main",
                                      children: [
                                        n.jsx(P, {
                                          to: `/clients/${Y.id}`,
                                          className: "lp-ar-t",
                                          children: Y.name,
                                        }),
                                        n.jsxs("p", { children: [Y.city, " · ", Y.email] }),
                                        n.jsxs("div", {
                                          className: "lp-ar-meta",
                                          children: [
                                            n.jsxs("span", { children: ["Last contact ", qt(Z.last, i)] }),
                                            Y.tags.map((te) => n.jsx(H, { children: te }, te)),
                                          ],
                                        }),
                                      ],
                                    }),
                                    n.jsxs("div", {
                                      className: "lp-cr-side",
                                      children: [
                                        Z.open > 0
                                          ? n.jsxs(H, {
                                              tone: "info",
                                              children: [Z.open, " open ", Z.open === 1 ? "case" : "cases"],
                                            })
                                          : n.jsx(H, { children: "No open cases" }),
                                        Z.next &&
                                          n.jsxs("small", { children: ["Next: ", Lr(Z.next.startsAt, i)] }),
                                      ],
                                    }),
                                  ],
                                },
                                Y.id,
                              );
                            })
                          : q.map((Y) => {
                              var te;
                              const Z = ur(Y);
                              return n.jsxs(
                                "li",
                                {
                                  className: "lp-cr",
                                  children: [
                                    n.jsx("span", {
                                      className: "lp-cr-ic",
                                      children: n.jsx(L, { name: "briefcase", size: 20 }),
                                    }),
                                    n.jsxs("div", {
                                      className: "lp-cr-main",
                                      children: [
                                        n.jsx(P, {
                                          to: `/cases/${Y.id}`,
                                          className: "lp-ar-t",
                                          children: Y.title,
                                        }),
                                        n.jsxs("p", {
                                          children: [
                                            ((te = k[Y.clientId]) == null ? void 0 : te.name) ||
                                              "Unknown client",
                                            " · ",
                                            Y.area,
                                          ],
                                        }),
                                        n.jsxs("div", {
                                          className: "lp-ar-meta",
                                          children: [
                                            n.jsx(Uc, { status: Y.status }),
                                            n.jsxs("span", {
                                              children: [
                                                Y.docs.length,
                                                " ",
                                                Y.docs.length === 1 ? "document" : "documents",
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    n.jsxs("div", {
                                      className: "lp-cr-side",
                                      children: [
                                        Y.status !== "closed"
                                          ? n.jsx(Tr, { d: Z, now: i })
                                          : n.jsx("span", { className: "lp-muted", children: "Closed" }),
                                        Z && Y.status !== "closed" && n.jsx("small", { children: Z.title }),
                                      ],
                                    }),
                                  ],
                                },
                                Y.id,
                              );
                            }),
                    }),
                    n.jsx(Ql, {
                      page: M,
                      pages: g,
                      total: R.length,
                      perPage: pi,
                      onChange: (Y) => p({ page: String(Y) }),
                    }),
                  ],
                }),
        ],
      }),
      n.jsx($y, { open: u, onClose: () => d(!1) }),
      n.jsx(dm, { open: h, onClose: () => m(!1) }),
    ],
  });
}
