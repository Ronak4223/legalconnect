import w from "react";
import * as n from "react/jsx-runtime";
import { Link as P } from "react-router-dom";
import { Ie, ge, kn, nt } from "../lib/core.js";
import { Ce, Ft, H, L, O, Q, W, b, le, rt, xe, z } from "../components/ui.js";
import { Ic, Xh, _n, cn, ed, fy, gy, hy, js, kc, lr, my, py, sr, td, tr, ut } from "../lib/domain.js";
import { Qt, ne } from "../state/store.js";
import { Lv, bv, mi, vd } from "./profile.js";

/* app/views/availability.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
export function AvailabilityView() {
  const { lawyer: e, appts: t, dispatch: s } = ne(),
    l = xe(),
    i = Qt(6e4),
    r = e.availability,
    [a, o] = w.useState(() => mi(r)),
    c = JSON.stringify(a) !== JSON.stringify(r),
    u = Xh(i),
    [d, h] = w.useState(() => {
      const [I, F] = u.split("-").map(Number);
      return { y: I, m: F - 1 };
    }),
    [m, S] = w.useState(u),
    [v, N] = w.useState("Asia/Kolkata"),
    [A, f] = w.useState({}),
    [p, y] = w.useState({ from: "", to: "", reason: "" }),
    [k, E] = w.useState({}),
    x = w.useMemo(() => t.filter((I) => I.status === "scheduled" || I.status === "requested"), [t]),
    C = w.useMemo(() => fy(a, t, i), [a, t, i]),
    j = w.useMemo(() => new Set(C.map((I) => Ie(I.appt.startsAt))), [C]),
    R = w.useMemo(() => {
      const I = {};
      return (
        x.forEach((F) => {
          const G = Ie(F.startsAt);
          (I[G] = I[G] || []).push(F);
        }),
        I
      );
    }, [x]),
    g = _n.filter(([I]) => a.weekly[I].length > 0).length,
    M = (I) => {
      o((F) => {
        const G = mi(F);
        return (I(G), G);
      });
    },
    q = (I, F, G, oe) => {
      (M((re) => {
        re.weekly[I][F][G] = oe;
      }),
        f((re) => ({ ...re, [I]: "" })));
    },
    X = (I, F) => {
      (M((G) => {
        G.weekly[I] = F ? [{ s: "09:00", e: "17:00" }] : [];
      }),
        f((G) => ({ ...G, [I]: "" })));
    },
    ue = (I) =>
      M((F) => {
        const G = F.weekly[I][F.weekly[I].length - 1],
          oe = ut(G.e);
        F.weekly[I].push({ s: js(Math.min(oe + 30, 21 * 60)), e: js(Math.min(oe + 30 + 180, 22 * 60)) });
      }),
    Y = () => {
      (M((I) => {
        ["tue", "wed", "thu", "fri"].forEach((F) => {
          I.weekly[F] = mi(I.weekly.mon);
        });
      }),
        f({}),
        l({ tone: "info", title: "Monday’s hours copied to Tue–Fri", message: "Remember to save." }));
    },
    Z = (I) => {
      I.preventDefault();
      const F = {
        from: p.from ? (p.from < u ? "Pick today or a later date." : "") : "Pick a start date.",
        to: p.to && p.to < p.from ? "The end date can’t be before the start date." : "",
      };
      if ((E(F), F.from || F.to)) return;
      const G = {
          id: `bl_${Date.now().toString(36)}`,
          from: p.from,
          to: p.to || p.from,
          reason: p.reason.trim(),
        },
        oe = x.filter(
          (re) => re.status === "scheduled" && Ie(re.startsAt) >= G.from && Ie(re.startsAt) <= G.to,
        ).length;
      (M((re) => {
        re.blocked = [...re.blocked, G].sort((Ae, Ys) => Ae.from.localeCompare(Ys.from));
      }),
        y({ from: "", to: "", reason: "" }),
        l({
          tone: oe ? "danger" : "info",
          title: oe
            ? `${oe} scheduled consultation${oe === 1 ? "" : "s"} fall on these dates`
            : "Blocked dates added",
          message: oe ? "See the Conflicts panel. Remember to save." : "Remember to save.",
        }));
    },
    te = () => {
      var F;
      const I = {};
      if (
        (_n.forEach(([G]) => {
          const oe = py(a.weekly[G], a.duration);
          oe && (I[G] = oe);
        }),
        f(I),
        Object.keys(I).length)
      ) {
        (l({
          tone: "danger",
          title: "Fix the highlighted days first",
          message: "Some time blocks are invalid.",
        }),
          (F = document.querySelector(".lp-week .has-error-day")) == null ||
            F.scrollIntoView({ block: "center" }));
        return;
      }
      (s({
        type: "LAWYER_PATCH",
        lawyerId: e.id,
        patch: { availability: a },
        activity: "You updated your availability",
        href: "/availability",
      }),
        l({
          title: "Availability saved",
          message: C.length
            ? `${C.length} existing consultation${C.length === 1 ? "" : "s"} still conflict.`
            : "Your calendar is up to date.",
        }));
    },
    D = () => {
      (o(mi(r)),
        f({}),
        y({ from: "", to: "", reason: "" }),
        E({}),
        l({ tone: "info", title: "Changes discarded" }));
    },
    T = my(d.y, d.m),
    B = (I) =>
      h(({ y: F, m: G }) => {
        const oe = new Date(Date.UTC(F, G + I, 1));
        return { y: oe.getUTCFullYear(), m: oe.getUTCMonth() };
      }),
    ae = () => {
      const [I, F] = u.split("-").map(Number);
      (h({ y: I, m: F - 1 }), S(u));
    },
    $ = (I) => {
      const F = a.weekly[sr(I)],
        G = kc(a, I),
        oe = R[I] || [];
      return { ranges: F, b: G, list: oe, past: I < u, closed: !G && F.length === 0 };
    },
    K = hy(m, a, t, i),
    _ = $(m),
    Xn = (R[m] || []).slice().sort((I, F) => new Date(I.startsAt) - new Date(F.startsAt));
  return n.jsxs(n.Fragment, {
    children: [
      n.jsx(Ft, {
        eyebrow: "Account",
        title: "Availability",
        actions:
          C.length > 0
            ? n.jsxs(H, {
                tone: "danger",
                dot: !0,
                children: [C.length, " schedule ", C.length === 1 ? "conflict" : "conflicts"],
              })
            : n.jsx(H, { tone: "success", dot: !0, children: "No conflicts" }),
        children:
          "Set when clients can book you. Calendar and slots below preview your changes before you save. Times are in IST (Asia/Kolkata, UTC+5:30).",
      }),
      n.jsxs("div", {
        className: `lp-savebar ${c ? "is-dirty" : ""}`,
        role: "region",
        "aria-label": "Save changes",
        children: [
          n.jsx("span", {
            "aria-live": "polite",
            children: c
              ? n.jsxs(n.Fragment, {
                  children: [n.jsx(L, { name: "alert", size: 16 }), " You have unsaved changes"],
                })
              : n.jsxs(n.Fragment, {
                  children: [n.jsx(L, { name: "check", size: 16 }), " All changes saved"],
                }),
          }),
          n.jsxs("div", {
            className: "lp-actions",
            children: [
              n.jsx(b, { variant: "ghost", size: "sm", onClick: D, disabled: !c, children: "Discard" }),
              n.jsx(b, { size: "sm", onClick: te, disabled: !c, children: "Save changes" }),
            ],
          }),
        ],
      }),
      g === 0 &&
        n.jsx(O, {
          tone: "warning",
          title: "You have no open days",
          className: "lp-mb",
          children: "Clients can’t book you until at least one day has hours.",
        }),
      n.jsxs("div", {
        className: "lp-agrid",
        children: [
          n.jsxs("div", {
            className: "lp-amain",
            children: [
              n.jsxs(Q, {
                as: "section",
                "aria-labelledby": "av-week",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "av-week", children: "Weekly hours" }),
                    sub: "Add up to three blocks per day, for example a morning and an afternoon session.",
                    action: n.jsx(b, {
                      size: "sm",
                      variant: "outline",
                      icon: "refresh",
                      onClick: Y,
                      disabled: a.weekly.mon.length === 0,
                      children: "Copy Monday to Tue–Fri",
                    }),
                  }),
                  n.jsx("ul", {
                    className: "lp-week",
                    children: _n.map(([I, F]) => {
                      const G = a.weekly[I];
                      return n.jsxs(
                        "li",
                        {
                          className: A[I] ? "has-error-day" : "",
                          children: [
                            n.jsx("div", {
                              className: "lp-week-h",
                              children: n.jsx(rt, {
                                id: `wk-${I}`,
                                label: F,
                                checked: G.length > 0,
                                onChange: (oe) => X(I, oe.target.checked),
                              }),
                            }),
                            n.jsxs("div", {
                              className: "lp-week-r",
                              children: [
                                G.length === 0
                                  ? n.jsx("span", { className: "lp-muted", children: "Closed" })
                                  : G.map((oe, re) =>
                                      n.jsxs(
                                        "div",
                                        {
                                          className: "lp-range",
                                          children: [
                                            n.jsx("select", {
                                              className: "lp-input lp-select-plain",
                                              "aria-label": `${F} block ${re + 1} start`,
                                              value: oe.s,
                                              onChange: (Ae) => q(I, re, "s", Ae.target.value),
                                              children: ed.map((Ae) =>
                                                n.jsx(
                                                  "option",
                                                  { value: Ae.value, children: Ae.label },
                                                  Ae.value,
                                                ),
                                              ),
                                            }),
                                            n.jsx("span", { "aria-hidden": "true", children: "to" }),
                                            n.jsx("select", {
                                              className: "lp-input lp-select-plain",
                                              "aria-label": `${F} block ${re + 1} end`,
                                              value: oe.e,
                                              onChange: (Ae) => q(I, re, "e", Ae.target.value),
                                              children: ed.map((Ae) =>
                                                n.jsx(
                                                  "option",
                                                  { value: Ae.value, children: Ae.label },
                                                  Ae.value,
                                                ),
                                              ),
                                            }),
                                            n.jsx("button", {
                                              type: "button",
                                              className: "lp-icon-btn",
                                              "aria-label": `Remove ${F} block ${re + 1}`,
                                              onClick: () =>
                                                M((Ae) => {
                                                  Ae.weekly[I].splice(re, 1);
                                                }),
                                              children: n.jsx(L, { name: "trash", size: 16 }),
                                            }),
                                          ],
                                        },
                                        re,
                                      ),
                                    ),
                                G.length > 0 &&
                                  G.length < 3 &&
                                  ut(G[G.length - 1].e) < 21 * 60 &&
                                  n.jsxs(b, {
                                    size: "sm",
                                    variant: "ghost",
                                    icon: "plus",
                                    onClick: () => ue(I),
                                    children: [
                                      "Add block",
                                      n.jsxs("span", { className: "lp-sr", children: [" to ", F] }),
                                    ],
                                  }),
                                A[I] &&
                                  n.jsxs("p", {
                                    className: "lp-err",
                                    role: "alert",
                                    children: [n.jsx(L, { name: "alert", size: 14 }), " ", A[I]],
                                  }),
                              ],
                            }),
                          ],
                        },
                        I,
                      );
                    }),
                  }),
                ],
              }),
              n.jsxs(Q, {
                as: "section",
                "aria-labelledby": "av-cal",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "av-cal", children: "Calendar" }),
                    sub: "Select a day to see its bookable slots.",
                    action: n.jsxs("div", {
                      className: "lp-calnav",
                      children: [
                        n.jsx("button", {
                          type: "button",
                          className: "lp-icon-btn",
                          "aria-label": "Previous month",
                          onClick: () => B(-1),
                          children: n.jsx(L, { name: "chevL", size: 18 }),
                        }),
                        n.jsxs("strong", { "aria-live": "polite", children: [bv[d.m], " ", d.y] }),
                        n.jsx("button", {
                          type: "button",
                          className: "lp-icon-btn",
                          "aria-label": "Next month",
                          onClick: () => B(1),
                          children: n.jsx(L, { name: "chevR", size: 18 }),
                        }),
                        n.jsx(b, { size: "sm", variant: "outline", onClick: ae, children: "Today" }),
                      ],
                    }),
                  }),
                  n.jsxs("table", {
                    className: "lp-cal",
                    children: [
                      n.jsx("thead", {
                        children: n.jsx("tr", {
                          children: vd.map((I) =>
                            n.jsxs(
                              "th",
                              {
                                scope: "col",
                                children: [
                                  n.jsx("span", { "aria-hidden": "true", children: I }),
                                  n.jsx("span", { className: "lp-sr", children: _n[vd.indexOf(I)][1] }),
                                ],
                              },
                              I,
                            ),
                          ),
                        }),
                      }),
                      n.jsx("tbody", {
                        children: T.map((I, F) =>
                          n.jsx(
                            "tr",
                            {
                              children: I.map(({ key: G, inMonth: oe }) => {
                                const re = $(G),
                                  Ae = re.list.length,
                                  Ys = j.has(G),
                                  Pr = re.b ? "blocked" : re.closed ? "closed" : "open";
                                return n.jsx(
                                  "td",
                                  {
                                    children: n.jsxs("button", {
                                      type: "button",
                                      className: `lp-day-c is-${Pr} ${oe ? "" : "is-out"} ${re.past ? "is-past" : ""} ${G === u ? "is-today" : ""} ${G === m ? "is-sel" : ""} ${Ys ? "has-conflict" : ""}`,
                                      "aria-pressed": G === m,
                                      "aria-label": `${cn(G, { weekday: "long", day: "numeric", month: "long" })}: ${re.b ? `blocked${re.b.reason ? `, ${re.b.reason}` : ""}` : re.closed ? "closed" : lr(re.ranges)}${Ae ? `, ${Ae} consultation${Ae === 1 ? "" : "s"}` : ""}${Ys ? ", schedule conflict" : ""}`,
                                      onClick: () => {
                                        if ((S(G), !oe)) {
                                          const [pm, hm] = G.split("-").map(Number);
                                          h({ y: pm, m: hm - 1 });
                                        }
                                      },
                                      children: [
                                        n.jsx("span", {
                                          className: "lp-day-n",
                                          children: Number(G.slice(8)),
                                        }),
                                        Ae > 0 &&
                                          n.jsx("span", {
                                            className: "lp-day-badge",
                                            "aria-hidden": "true",
                                            children: Ae,
                                          }),
                                        Pr === "blocked" &&
                                          n.jsx("span", {
                                            className: "lp-day-tag",
                                            "aria-hidden": "true",
                                            children: "Blocked",
                                          }),
                                        Pr === "closed" &&
                                          oe &&
                                          n.jsx("span", {
                                            className: "lp-day-tag",
                                            "aria-hidden": "true",
                                            children: "Off",
                                          }),
                                        Ys &&
                                          n.jsx("span", {
                                            className: "lp-day-warn",
                                            "aria-hidden": "true",
                                            children: "!",
                                          }),
                                      ],
                                    }),
                                  },
                                  G,
                                );
                              }),
                            },
                            F,
                          ),
                        ),
                      }),
                    ],
                  }),
                  n.jsxs("ul", {
                    className: "lp-legend",
                    "aria-label": "Calendar legend",
                    children: [
                      n.jsxs("li", { children: [n.jsx("i", { className: "is-open" }), " Open"] }),
                      n.jsxs("li", { children: [n.jsx("i", { className: "is-blocked" }), " Blocked"] }),
                      n.jsxs("li", { children: [n.jsx("i", { className: "is-closed" }), " Closed"] }),
                      n.jsxs("li", { children: [n.jsx("i", { className: "is-count" }), " Consultations"] }),
                      n.jsxs("li", { children: [n.jsx("i", { className: "is-warn" }), " Conflict"] }),
                    ],
                  }),
                ],
              }),
              n.jsxs(Q, {
                as: "section",
                "aria-labelledby": "av-day",
                "aria-live": "polite",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", {
                      id: "av-day",
                      children: cn(m, { weekday: "long", day: "numeric", month: "long" }),
                    }),
                    sub: _.b
                      ? `Blocked${_.b.reason ? ` — ${_.b.reason}` : ""}`
                      : _.closed
                        ? "Closed"
                        : `Open ${lr(_.ranges)}`,
                    action: n.jsxs("label", {
                      className: "lp-sel",
                      children: [
                        n.jsx("span", { className: "lp-sr", children: "Show times in a client’s time zone" }),
                        n.jsx("select", {
                          className: "lp-input lp-select-plain",
                          value: v,
                          onChange: (I) => N(I.target.value),
                          children: gy.map(([I, F]) =>
                            n.jsx(
                              "option",
                              { value: I, children: v === I && I !== "Asia/Kolkata" ? `Client: ${F}` : F },
                              I,
                            ),
                          ),
                        }),
                      ],
                    }),
                  }),
                  _.b
                    ? n.jsxs(le, {
                        icon: "calendar",
                        title: "This date is blocked",
                        level: 3,
                        children: ["No slots are offered", _.b.reason ? ` (${_.b.reason})` : "", "."],
                      })
                    : _.closed
                      ? n.jsxs(le, {
                          icon: "clock",
                          title: "You’re closed this day",
                          level: 3,
                          children: [
                            "Turn on ",
                            _n.find(([I]) => I === sr(m))[1],
                            " in Weekly hours to offer slots.",
                          ],
                        })
                      : K.length === 0
                        ? n.jsxs(le, {
                            icon: "clock",
                            title: "No slots fit",
                            level: 3,
                            children: [
                              "Your blocks are shorter than a ",
                              a.duration,
                              "-minute consultation.",
                            ],
                          })
                        : n.jsx("ul", {
                            className: "lp-slots",
                            children: K.map((I) =>
                              n.jsxs(
                                "li",
                                {
                                  className: `is-${I.status}`,
                                  children: [
                                    n.jsx("strong", { children: tr(I.hhmm) }),
                                    v !== "Asia/Kolkata" && n.jsx("small", { children: td(I.start, v) }),
                                    n.jsxs("span", {
                                      children: [
                                        Lv[I.status],
                                        I.appt ? ` · ${I.appt.client.name.split(" ")[0]}` : "",
                                      ],
                                    }),
                                  ],
                                },
                                I.start,
                              ),
                            ),
                          }),
                  Xn.length > 0 &&
                    n.jsxs(n.Fragment, {
                      children: [
                        n.jsx("h3", { className: "lp-h4", children: "Consultations this day" }),
                        n.jsx("ul", {
                          className: "lp-list",
                          children: Xn.map((I) => {
                            const F = Ic(a, I.startsAt, I.durationMin);
                            return n.jsxs(
                              "li",
                              {
                                className: "lp-cr is-flat",
                                children: [
                                  n.jsx("span", {
                                    className: "lp-cr-ic",
                                    children: n.jsx(L, { name: "calendar", size: 16 }),
                                  }),
                                  n.jsxs("div", {
                                    className: "lp-cr-main",
                                    children: [
                                      n.jsx(P, {
                                        to: `/appointments/${I.id}`,
                                        className: "lp-ar-t",
                                        children: I.client.name,
                                      }),
                                      n.jsxs("p", {
                                        children: [
                                          ge(I.startsAt),
                                          " ",
                                          nt,
                                          " · ",
                                          I.durationMin,
                                          " min · ",
                                          kn[I.type],
                                          v !== "Asia/Kolkata" ? ` · ${td(I.startsAt, v)}` : "",
                                        ],
                                      }),
                                      F.length > 0 &&
                                        I.status === "scheduled" &&
                                        n.jsxs("p", {
                                          className: "lp-warn-t",
                                          children: [
                                            n.jsx(L, { name: "alert", size: 13 }),
                                            " This consultation ",
                                            F[0],
                                            ".",
                                          ],
                                        }),
                                    ],
                                  }),
                                  n.jsx("div", {
                                    className: "lp-cr-side",
                                    children: n.jsx(H, {
                                      tone: I.status === "scheduled" ? "info" : "warning",
                                      children: I.status === "scheduled" ? "Scheduled" : "Request",
                                    }),
                                  }),
                                ],
                              },
                              I.id,
                            );
                          }),
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
              n.jsxs(Q, {
                as: "section",
                "aria-labelledby": "av-set",
                children: [
                  n.jsx(z, { title: n.jsx("span", { id: "av-set", children: "Consultation settings" }) }),
                  n.jsxs("div", {
                    className: "lp-form",
                    children: [
                      n.jsx(Ce, {
                        id: "as-dur",
                        label: "Consultation length",
                        options: [30, 45, 60].map((I) => ({ value: String(I), label: `${I} minutes` })),
                        value: String(a.duration),
                        onChange: (I) => {
                          (M((F) => {
                            F.duration = Number(I.target.value);
                          }),
                            f({}));
                        },
                      }),
                      n.jsx(Ce, {
                        id: "as-buf",
                        label: "Buffer between consultations",
                        options: [0, 10, 15, 30].map((I) => ({
                          value: String(I),
                          label: I ? `${I} minutes` : "No buffer",
                        })),
                        value: String(a.buffer),
                        onChange: (I) =>
                          M((F) => {
                            F.buffer = Number(I.target.value);
                          }),
                      }),
                      n.jsx(Ce, {
                        id: "as-not",
                        label: "Minimum notice",
                        options: [1, 2, 6, 12, 24, 48].map((I) => ({
                          value: String(I),
                          label: `${I} hour${I === 1 ? "" : "s"}`,
                        })),
                        value: String(a.minNoticeH),
                        onChange: (I) =>
                          M((F) => {
                            F.minNoticeH = Number(I.target.value);
                          }),
                        hint: "Clients can’t book slots sooner than this.",
                      }),
                      n.jsx(Ce, {
                        id: "as-win",
                        label: "Booking window",
                        options: [7, 14, 30, 60, 90].map((I) => ({
                          value: String(I),
                          label: `${I} days ahead`,
                        })),
                        value: String(a.windowDays),
                        onChange: (I) =>
                          M((F) => {
                            F.windowDays = Number(I.target.value);
                          }),
                      }),
                      n.jsxs("div", {
                        className: "lp-tzbox",
                        children: [
                          n.jsx(L, { name: "clock", size: 16 }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("strong", { children: "Time zone: IST (Asia/Kolkata)" }),
                              n.jsx("small", {
                                children:
                                  "Fixed in this demo. Use the selector above the day’s slots to see how a client elsewhere would see them.",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              n.jsxs(Q, {
                as: "section",
                "aria-labelledby": "av-bl",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "av-bl", children: "Blocked dates" }),
                    sub: "Holidays, court days or leave.",
                  }),
                  a.blocked.length === 0
                    ? n.jsx("p", { className: "lp-muted", children: "No blocked dates." })
                    : n.jsx("ul", {
                        className: "lp-blocked",
                        children: a.blocked.map((I) =>
                          n.jsxs(
                            "li",
                            {
                              children: [
                                n.jsxs("div", {
                                  children: [
                                    n.jsx("strong", {
                                      children: I.from === I.to ? cn(I.from) : `${cn(I.from)} – ${cn(I.to)}`,
                                    }),
                                    I.reason && n.jsx("small", { children: I.reason }),
                                  ],
                                }),
                                n.jsx("button", {
                                  type: "button",
                                  className: "lp-icon-btn",
                                  "aria-label": `Remove blocked dates ${I.from} to ${I.to}`,
                                  onClick: () =>
                                    M((F) => {
                                      F.blocked = F.blocked.filter((G) => G.id !== I.id);
                                    }),
                                  children: n.jsx(L, { name: "trash", size: 16 }),
                                }),
                              ],
                            },
                            I.id,
                          ),
                        ),
                      }),
                  n.jsxs("form", {
                    className: "lp-form lp-mt",
                    noValidate: !0,
                    onSubmit: Z,
                    children: [
                      n.jsxs("div", {
                        className: "lp-grid2",
                        children: [
                          n.jsx(W, {
                            id: "bl-f",
                            type: "date",
                            label: "From",
                            min: u,
                            value: p.from,
                            onChange: (I) => {
                              (y({ ...p, from: I.target.value }), E({ ...k, from: "" }));
                            },
                            error: k.from,
                          }),
                          n.jsx(W, {
                            id: "bl-t",
                            type: "date",
                            label: "To (optional)",
                            min: p.from || u,
                            value: p.to,
                            onChange: (I) => {
                              (y({ ...p, to: I.target.value }), E({ ...k, to: "" }));
                            },
                            error: k.to,
                          }),
                        ],
                      }),
                      n.jsx(W, {
                        id: "bl-r",
                        label: "Reason (optional)",
                        value: p.reason,
                        onChange: (I) => y({ ...p, reason: I.target.value }),
                        placeholder: "e.g. Court vacation",
                      }),
                      n.jsx(b, { type: "submit", variant: "outline", icon: "plus", children: "Block dates" }),
                    ],
                  }),
                ],
              }),
              n.jsxs(Q, {
                as: "section",
                "aria-labelledby": "av-con",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "av-con", children: "Schedule conflicts" }),
                    sub: "Scheduled consultations that don’t fit these settings (next 60 days).",
                  }),
                  C.length === 0
                    ? n.jsxs("p", {
                        className: "lp-ok-t",
                        children: [
                          n.jsx(L, { name: "check", size: 15 }),
                          " Every scheduled consultation fits your availability.",
                        ],
                      })
                    : n.jsx("ul", {
                        className: "lp-conflicts",
                        children: C.map(({ appt: I, issues: F }) =>
                          n.jsxs(
                            "li",
                            {
                              children: [
                                n.jsx(P, {
                                  to: `/appointments/${I.id}`,
                                  className: "lp-ar-t",
                                  children: I.client.name,
                                }),
                                n.jsxs("small", {
                                  children: [cn(Ie(I.startsAt)), ", ", ge(I.startsAt), " ", nt],
                                }),
                                n.jsxs("span", { children: ["This consultation ", F[0], "."] }),
                              ],
                            },
                            I.id,
                          ),
                        ),
                      }),
                  n.jsx("p", {
                    className: "lp-hint",
                    children:
                      "Conflicts don’t cancel anything. Reschedule or keep them from the appointment page.",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
export const ln = ({ title: e, children: t }) =>
  n.jsxs(Q, {
    as: "section",
    children: [n.jsx(z, { title: e }), n.jsx("div", { className: "lp-kit-body", children: t })],
  });
