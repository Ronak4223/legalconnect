import w from "react";
import * as n from "react/jsx-runtime";
import {
  useLocation as Nt,
  useNavigate as Me,
  Outlet as Ux,
  Link as P,
  NavLink as Wx,
} from "react-router-dom";
import { IMG } from "../00-assets.js";
import { useRouteEnter } from "../../animation/useRouteEnter.js";
import { qt } from "../lib/core.js";
import { H, L, O, b, er, lt, mt, qr, xe } from "./ui.js";
import { My, Tl, am, id, ne } from "../state/store.js";

/* app/components/shell.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
let lpBoot = location.hash; // hash at page load (see focus effect in the layout component)

function by() {
  const { lawyer: e, dispatch: t, signOut: s, resetAll: l, convs: i } = ne(),
    r = Me(),
    a = xe(),
    [o, c] = w.useState(!1);
  return n.jsxs("div", {
    className: "lp-demo",
    role: "region",
    "aria-label": "Demo mode notice",
    children: [
      n.jsx("span", { className: "lp-demo-tag", children: "DEMO" }),
      n.jsx("span", {
        className: "lp-demo-text",
        children: "Mock data stored only in this browser — no real clients, payments or reviews.",
      }),
      n.jsx(qr, {
        label: "Demo controls",
        trigger: n.jsxs(n.Fragment, { children: ["Demo controls ", n.jsx(L, { name: "chevD", size: 14 })] }),
        triggerClass: "lp-demo-btn",
        panelClass: "lp-demo-panel",
        children: (u) =>
          n.jsxs("div", {
            className: "lp-demo-body",
            children: [
              e &&
                n.jsxs(n.Fragment, {
                  children: [
                    n.jsx("label", {
                      className: "lp-label",
                      htmlFor: "demo-vstatus",
                      children: "Verification status",
                    }),
                    n.jsxs("select", {
                      id: "demo-vstatus",
                      className: "lp-input lp-select-plain",
                      value: e.verification.status,
                      onChange: (d) => {
                        (t({ type: "DEMO_VERIFICATION", lawyerId: e.id, status: d.target.value }),
                          a({
                            tone: "info",
                            title: "Demo: verification status changed",
                            message: `Now “${Tl[d.target.value][1]}”.`,
                          }));
                      },
                      children: [
                        n.jsx("option", {
                          value: "incomplete",
                          children: "Not submitted (missing documents)",
                        }),
                        n.jsx("option", { value: "pending", children: "In review" }),
                        n.jsx("option", { value: "approved", children: "Approved" }),
                        n.jsx("option", { value: "rejected", children: "Rejected / action needed" }),
                      ],
                    }),
                    n.jsx(b, {
                      variant: "outline",
                      size: "sm",
                      icon: "clock",
                      onClick: () => {
                        (u(!1), s(), r("/login?reason=expired"));
                      },
                      children: "Simulate session expiry",
                    }),
                  ],
                }),
              n.jsx(b, {
                variant: "outline",
                size: "sm",
                icon: "users",
                onClick: () => {
                  (t({ type: "SIM_REQUEST", lawyerId: e.id }),
                    a({ tone: "info", title: "Demo: new consultation request simulated" }));
                },
                children: "Simulate new request",
              }),
              n.jsx(b, {
                variant: "outline",
                size: "sm",
                icon: "calendar",
                onClick: () => {
                  (t({ type: "SIM_CLIENT_CANCEL", lawyerId: e.id }),
                    a({
                      tone: "info",
                      title: "Demo: client cancellation simulated",
                      message: "Cancels your next upcoming consultation, if any.",
                    }));
                },
                children: "Simulate client cancellation",
              }),
              n.jsx(b, {
                variant: "outline",
                size: "sm",
                icon: "wallet",
                onClick: () => {
                  (t({ type: "PAYOUTS_MARK_PAID", lawyerId: e.id }),
                    a({ tone: "info", title: "Demo: processing payouts marked as paid" }));
                },
                children: "Mark payouts as paid",
              }),
              i.length > 0 &&
                n.jsx(b, {
                  variant: "outline",
                  size: "sm",
                  icon: "message",
                  onClick: () => {
                    const d = i[Math.floor(Math.random() * i.length)];
                    (t({ type: "MSG_RECEIVE", id: d.id, text: id[Math.floor(Math.random() * id.length)] }),
                      a({ tone: "info", title: "Demo: incoming message simulated" }));
                  },
                  children: "Simulate incoming message",
                }),
              n.jsx(b, {
                variant: "outline",
                size: "sm",
                icon: "refresh",
                onClick: () => {
                  (u(!1), c(!0));
                },
                children: "Reset demo data",
              }),
              n.jsx(P, {
                className: "lp-link",
                to: "/kit",
                onClick: () => u(!1),
                children: "Open component kit →",
              }),
            ],
          }),
      }),
      n.jsx(mt, {
        open: o,
        onClose: () => c(!1),
        title: "Reset demo data?",
        confirmLabel: "Reset",
        tone: "danger",
        onConfirm: () => {
          (c(!1),
            l(),
            r("/login"),
            a({
              tone: "info",
              title: "Demo data reset",
              message: "Sample data restored and you were signed out.",
            }));
        },
        children: n.jsx("p", {
          children:
            "This clears everything you changed in this browser — registered accounts, appointments you accepted or declined, uploads — and restores the original sample data. You will be signed out.",
        }),
      }),
    ],
  });
}
function Ly({ open: e, onClose: t, counts: s }) {
  const { lawyer: l, unreadTotal: i, notifs: r } = ne(),
    a = r.filter((d) => !d.read).length,
    { pathname: o } = Nt(),
    [c, u] = Tl[l.verification.status];
  return n.jsxs(n.Fragment, {
    children: [
      e && n.jsx("div", { className: "lp-scrim", onClick: t, "aria-hidden": "true" }),
      n.jsxs("aside", {
        className: `lp-side ${e ? "is-open" : ""}`,
        "aria-label": "Primary",
        children: [
          n.jsxs("div", {
            className: "lp-side-top",
            children: [
              n.jsx(P, {
                to: "/dashboard",
                className: "lp-side-logo",
                "aria-label": "LegalConnect Lawyer Portal — dashboard",
                children: n.jsx(er, {}),
              }),
              n.jsx("button", {
                type: "button",
                className: "lp-icon-btn lp-side-close",
                onClick: t,
                "aria-label": "Close navigation",
                children: n.jsx(L, { name: "x", size: 20 }),
              }),
            ],
          }),
          n.jsx("nav", {
            className: "lp-nav",
            children: am.map((d) =>
              n.jsxs(
                "div",
                {
                  className: "lp-nav-group",
                  children: [
                    n.jsx("p", { className: "lp-nav-gh", children: d.group }),
                    d.items.map((h) =>
                      n.jsxs(
                        Wx,
                        {
                          to: h.to,
                          className: ({ isActive: m }) => {
                            var S;
                            return `lp-nav-i ${m || ((S = h.also) != null && S.some((v) => o.startsWith(v))) ? "is-active" : ""}`;
                          },
                          onClick: t,
                          children: [
                            n.jsx(L, { name: h.icon, size: 18 }),
                            n.jsx("span", { className: "lp-nav-l", children: h.label }),
                            h.soon && n.jsx("span", { className: "lp-soon", children: h.soon }),
                            h.badge === "requests" &&
                              s.requests > 0 &&
                              n.jsx("span", {
                                className: "lp-count",
                                "aria-label": `${s.requests} pending requests`,
                                children: s.requests,
                              }),
                            h.badge === "messages" &&
                              i > 0 &&
                              n.jsx("span", {
                                className: "lp-count",
                                "aria-label": `${i} unread messages`,
                                children: i,
                              }),
                            h.badge === "notifs" &&
                              a > 0 &&
                              n.jsx("span", {
                                className: "lp-count",
                                "aria-label": `${a} unread notifications`,
                                children: a,
                              }),
                            h.badge === "verify" &&
                              l.verification.status !== "approved" &&
                              n.jsx("span", { className: `lp-dot is-${c}`, "aria-label": u }),
                          ],
                        },
                        h.to,
                      ),
                    ),
                  ],
                },
                d.group,
              ),
            ),
          }),
          n.jsxs("div", {
            className: "lp-side-foot",
            children: [
              n.jsx(H, { tone: c, dot: !0, children: u }),
              n.jsx("p", { children: "Need help? Support chat arrives in a later phase." }),
            ],
          }),
        ],
      }),
    ],
  });
}
function Uy() {
  const { notifs: e, lawyer: t, dispatch: s } = ne(),
    l = Me(),
    i = e.filter((r) => !r.read).length;
  return n.jsx(qr, {
    label: `Notifications, ${i} unread`,
    triggerClass: "lp-icon-btn lp-bell",
    trigger: n.jsxs(n.Fragment, {
      children: [
        n.jsx(L, { name: "bell", size: 19 }),
        i > 0 && n.jsx("span", { className: "lp-bell-n", "aria-hidden": "true", children: i }),
      ],
    }),
    panelClass: "lp-bell-panel",
    children: (r) =>
      n.jsxs("div", {
        children: [
          n.jsxs("div", {
            className: "lp-pop-h",
            children: [
              n.jsx("strong", { children: "Notifications" }),
              i > 0 &&
                n.jsx("button", {
                  type: "button",
                  className: "lp-link-btn",
                  onClick: () => s({ type: "NOTIF_READ_ALL", lawyerId: t.id }),
                  children: "Mark all as read",
                }),
            ],
          }),
          e.length === 0
            ? n.jsx("p", { className: "lp-pop-empty", children: "You’re all caught up." })
            : n.jsx("ul", {
                className: "lp-notes",
                children: e.slice(0, 6).map((a) =>
                  n.jsx(
                    "li",
                    {
                      children: n.jsxs("button", {
                        type: "button",
                        className: `lp-note ${a.read ? "" : "is-unread"}`,
                        onClick: () => {
                          (s({ type: "NOTIF_READ", id: a.id }), r(!1), l(a.href));
                        },
                        children: [
                          n.jsx("span", {
                            className: "lp-note-dot",
                            "aria-label": a.read ? "Read" : "Unread",
                          }),
                          n.jsxs("span", {
                            children: [
                              n.jsx("strong", { children: a.title }),
                              n.jsx("small", { children: a.body }),
                              n.jsx("em", { children: qt(a.at) }),
                            ],
                          }),
                        ],
                      }),
                    },
                    a.id,
                  ),
                ),
              }),
          n.jsxs(P, {
            to: "/notifications",
            className: "lp-pop-foot",
            onClick: () => r(!1),
            children: ["View all notifications ", n.jsx(L, { name: "arrowR", size: 14 })],
          }),
        ],
      }),
  });
}
function Ky() {
  const { lawyer: e, account: t, signOut: s } = ne(),
    l = Me(),
    i = xe(),
    [r, a] = w.useState(!1),
    [o, c] = Tl[e.verification.status];
  return n.jsxs(n.Fragment, {
    children: [
      n.jsx(qr, {
        label: e.name + " " + (e.primaryArea || "") + ", account menu",
        triggerClass: "lp-acct",
        trigger: n.jsxs(n.Fragment, {
          children: [
            n.jsx(lt, { name: e.name, src: e.avatar, size: 34 }),
            n.jsxs("span", {
              className: "lp-acct-n",
              children: [
                n.jsx("strong", { children: e.name }),
                " ",
                n.jsx("small", { children: e.primaryArea }),
              ],
            }),
            n.jsx(L, { name: "chevD", size: 15, className: "lp-acct-c" }),
          ],
        }),
        children: (u) =>
          n.jsxs("div", {
            className: "lp-acct-panel",
            children: [
              n.jsxs("div", {
                className: "lp-acct-id",
                children: [
                  n.jsx(lt, { name: e.name, src: e.avatar, size: 44 }),
                  n.jsxs("div", {
                    children: [n.jsx("strong", { children: e.name }), n.jsx("small", { children: t.email })],
                  }),
                ],
              }),
              n.jsx(H, { tone: o, dot: !0, children: c }),
              n.jsxs(P, {
                className: "lp-menu-i",
                to: "/verification",
                onClick: () => u(!1),
                children: [n.jsx(L, { name: "shieldCheck", size: 16 }), " Verification centre"],
              }),
              n.jsxs(P, {
                className: "lp-menu-i",
                to: "/profile",
                onClick: () => u(!1),
                children: [n.jsx(L, { name: "user", size: 16 }), " Profile"],
              }),
              n.jsxs(P, {
                className: "lp-menu-i",
                to: "/settings",
                onClick: () => u(!1),
                children: [n.jsx(L, { name: "settings", size: 16 }), " Settings"],
              }),
              n.jsxs("button", {
                type: "button",
                className: "lp-menu-i is-danger",
                onClick: () => {
                  (u(!1), a(!0));
                },
                children: [n.jsx(L, { name: "logout", size: 16 }), " Sign out"],
              }),
            ],
          }),
      }),
      n.jsx(mt, {
        open: r,
        onClose: () => a(!1),
        title: "Sign out?",
        confirmLabel: "Sign out",
        onConfirm: () => {
          (a(!1), s(), l("/login?reason=signedout"), i({ tone: "info", title: "Signed out" }));
        },
        children: n.jsx("p", {
          children: "You will need to sign in again to see your dashboard and consultation requests.",
        }),
      }),
    ],
  });
}
export function AppLayout() {
  const { lawyer: e, account: t, appts: s } = ne(),
    l = Nt(),
    [i, r] = w.useState(!1),
    a = w.useMemo(() => ({ requests: s.filter((c) => c.status === "requested").length }), [s]),
    o = My.find((c) => {
      var u;
      return (
        l.pathname === c.to ||
        l.pathname.startsWith(c.to + "/") ||
        ((u = c.also) == null ? void 0 : u.some((d) => l.pathname.startsWith(d)))
      );
    });
  return (
    w.useEffect(() => {
      var c;
      if ((r(!1), window.scrollTo(0, 0), lpBoot === location.hash)) return void (lpBoot = null); // initial page load: leave focus alone so the skip link is the first Tab stop
      ((lpBoot = null), (c = document.getElementById("lp-main")) == null || c.focus({ preventScroll: !0 }));
    }, [l.pathname]),
    useRouteEnter(l.pathname),
    w.useEffect(() => {
      document.title = `${(o == null ? void 0 : o.title) || "Lawyer Portal"} · LegalConnect Lawyer Portal (demo)`;
    }, [o]),
    w.useEffect(() => {
      if (!i) return;
      const c = (u) => u.key === "Escape" && r(!1),
        side = document.querySelector(".lp-side"),
        modal = side && getComputedStyle(side).position === "fixed",
        bg = modal ? [...document.querySelectorAll(".lp-skip,.lp-demo,.lp-col,.lp-toasts")] : [],
        rs = () => {
          side && getComputedStyle(side).position !== "fixed" && r(!1);
        };
      bg.forEach((x) => x.setAttribute("inert", ""));
      modal && (side.querySelector(".lp-side-close") || side).focus();
      return (
        document.addEventListener("keydown", c),
        window.addEventListener("resize", rs),
        () => {
          (document.removeEventListener("keydown", c),
            window.removeEventListener("resize", rs),
            bg.forEach((x) => x.removeAttribute("inert")),
            modal && side.contains(document.activeElement) && document.querySelector(".lp-burger")?.focus());
        }
      );
    }, [i]),
    n.jsxs("div", {
      className: "lp-shell",
      children: [
        n.jsx("a", {
          className: "lp-skip",
          href: "#lp-main",
          onClick: (e) => {
            e.preventDefault();
            const m = document.getElementById("lp-main");
            m && (m.focus(), m.scrollIntoView({ block: "start" }));
          },
          children: "Skip to main content",
        }),
        n.jsx(by, {}),
        n.jsxs("div", {
          className: "lp-frame",
          children: [
            n.jsx(Ly, { open: i, onClose: () => r(!1), counts: a }),
            n.jsxs("div", {
              className: "lp-col",
              children: [
                n.jsxs("header", {
                  className: "lp-top",
                  children: [
                    n.jsx("button", {
                      type: "button",
                      className: "lp-icon-btn lp-burger",
                      onClick: () => r(!0),
                      "aria-label": "Open navigation",
                      "aria-expanded": i,
                      children: n.jsx(L, { name: "menu", size: 21 }),
                    }),
                    n.jsx("p", {
                      className: "lp-top-t",
                      "aria-hidden": "true",
                      children: (o == null ? void 0 : o.title) || "Lawyer Portal",
                    }),
                    n.jsxs("div", { className: "lp-top-r", children: [n.jsx(Uy, {}), n.jsx(Ky, {})] }),
                  ],
                }),
                n.jsxs("main", {
                  id: "lp-main",
                  className: "lp-main",
                  tabIndex: -1,
                  children: [
                    !t.emailVerified &&
                      n.jsxs(O, {
                        tone: "warning",
                        title: "Verify your email address",
                        className: "lp-mb",
                        action: n.jsx(P, {
                          className: "lp-btn lp-btn-outline lp-btn-sm",
                          to: "/verify-email",
                          children: n.jsx("span", { children: "Verify now" }),
                        }),
                        children: [
                          "We sent a verification link to ",
                          t.email,
                          ". Some features stay limited until it is confirmed.",
                        ],
                      }),
                    n.jsx(Ux, {}),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );
}
export const qy = IMG["hero-bg.jpg"];
