import w from "react";
import * as n from "react/jsx-runtime";
import { Link as P } from "react-router-dom";
import { Bn, Ds, Ie, J, Ke, bl, ge, kn, nt } from "../lib/core.js";
import { Ce, Et, H, L, O, W, Yt, b, lt, rt, xe } from "./ui.js";
import { Ic } from "../lib/domain.js";
import { ne } from "../state/store.js";
import { Fr, Qr, ad, dr, vo } from "../views/verify-email.js";

/* app/components/appointment-dialogs.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
export function jo({ a: e, now: t, canAccept: s = !0, onAction: l, showActions: i = !0, compact: r = !1 }) {
  return n.jsxs("li", {
    className: `lp-ar ${r ? "is-compact" : ""}`,
    children: [
      n.jsxs("div", {
        className: "lp-ar-when",
        "aria-label": `${Bn(e.startsAt, t)} at ${ge(e.startsAt)}`,
        children: [
          n.jsx("strong", { children: Bn(e.startsAt, t) }),
          n.jsx("span", { children: ge(e.startsAt) }),
          n.jsxs("small", { children: [nt, " · ", e.durationMin, " min"] }),
        ],
      }),
      n.jsx(lt, { name: e.client.name, size: 40 }),
      n.jsxs("div", {
        className: "lp-ar-main",
        children: [
          n.jsx(P, { to: `/appointments/${e.id}`, className: "lp-ar-t", children: e.client.name }),
          n.jsx("p", { children: e.matter }),
          n.jsxs("div", {
            className: "lp-ar-meta",
            children: [
              n.jsxs("span", {
                className: "lp-ar-type",
                children: [n.jsx(L, { name: Fr(e.type), size: 14 }), " ", kn[e.type]],
              }),
              n.jsx("span", { children: J(e.feeInr) }),
              n.jsx(Qr, { a: e, now: t }),
            ],
          }),
        ],
      }),
      i &&
        e.status === "requested" &&
        n.jsxs("div", {
          className: "lp-ar-act",
          children: [
            n.jsx(b, {
              size: "sm",
              icon: "check",
              onClick: () => l("accept", e),
              disabled: !s,
              title: s ? void 0 : "Complete verification to accept requests",
              children: "Accept",
            }),
            n.jsx(b, { size: "sm", variant: "outline", onClick: () => l("decline", e), children: "Decline" }),
          ],
        }),
    ],
  });
}
const Wy = [
    "Outside my practice area",
    "Not available at that time",
    "Conflict of interest",
    "Not enough information provided",
    "Other",
  ],
  Hy = [
    "I am unwell / emergency",
    "Scheduling conflict",
    "Client unreachable",
    "Conflict of interest",
    "Other",
  ],
  Oy = Array.from({ length: 21 }, (e, t) => {
    const s = 540 + t * 30;
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  }),
  Zy = (e) => {
    const [t, s] = e.split(":").map(Number);
    return `${((t + 11) % 12) + 1}:${String(s).padStart(2, "0")} ${t < 12 ? "AM" : "PM"}`;
  };
function ai({ a: e }) {
  return n.jsxs("dl", {
    className: "lp-sum",
    children: [
      n.jsxs("div", {
        children: [n.jsx("dt", { children: "Client" }), n.jsx("dd", { children: e.client.name })],
      }),
      n.jsxs("div", { children: [n.jsx("dt", { children: "Matter" }), n.jsx("dd", { children: e.matter })] }),
      n.jsxs("div", {
        children: [
          n.jsx("dt", { children: "When" }),
          n.jsxs("dd", {
            children: [Ds(e.startsAt), ", ", ge(e.startsAt), " ", nt, " (", e.durationMin, " min)"],
          }),
        ],
      }),
      n.jsxs("div", { children: [n.jsx("dt", { children: "Type" }), n.jsx("dd", { children: bl[e.type] })] }),
      n.jsxs("div", {
        children: [
          n.jsx("dt", { children: "Fee" }),
          n.jsxs("dd", {
            children: [
              J(e.feeInr),
              " ",
              n.jsxs("small", { children: ["(", J(dr(e)), " after 10% platform fee — illustrative)"] }),
            ],
          }),
        ],
      }),
    ],
  });
}
function Xy({ dlg: e, close: t, onDone: s }) {
  const { lawyer: l, appts: i, dispatch: r } = ne(),
    a = xe(),
    [o, c] = w.useState(!1),
    [u, d] = w.useState({ reason: "", note: "", date: "", time: "", ack: !1, anyway: !1 }),
    [h, m] = w.useState({}),
    S = e == null ? void 0 : e.kind,
    v = e ? i.find((g) => g.id === e.appt.id) || e.appt : null,
    N = (g) => (M) => {
      (d((q) => ({ ...q, [g]: M.target.type === "checkbox" ? M.target.checked : M.target.value })),
        m((q) => ({ ...q, [g]: "" })));
    },
    A = w.useMemo(
      () => (u.date && u.time ? new Date(`${u.date}T${u.time}:00+05:30`).toISOString() : null),
      [u.date, u.time],
    ),
    f = w.useMemo(
      () => (v ? (S === "accept" ? ad(v, i) : S === "reschedule" && A ? ad(v, i, A) : []) : []),
      [v, i, S, A],
    ),
    p = (g, M) => {
      (c(!0),
        setTimeout(() => {
          (g(),
            c(!1),
            t(),
            d({ reason: "", note: "", date: "", time: "", ack: !1, anyway: !1 }),
            m({}),
            a(M),
            s == null || s(S, v));
        }, 450));
    },
    y = () => {
      (t(), m({}), d({ reason: "", note: "", date: "", time: "", ack: !1, anyway: !1 }));
    };
  if (!e) return n.jsx(Yt, { open: !1, onClose: t, title: "" });
  const k = l.verification.status === "approved",
    E = (g) => {
      const M = g ? Ic(l.availability, g, v.durationMin) : [];
      return (
        M.length > 0 &&
        n.jsxs(O, {
          tone: "info",
          title: "Outside your availability",
          className: "lp-mt-s",
          children: ["This consultation ", M[0], ". You can still continue — this is only a reminder."],
        })
      );
    },
    x =
      f.length > 0 &&
      n.jsxs(O, {
        tone: "warning",
        title: "This overlaps another consultation",
        className: "lp-mt-s",
        children: [
          f
            .map(
              (g) =>
                `${g.client.name}, ${Ke(g.startsAt)} ${ge(g.startsAt)}–${ge(new Date(vo(g)).toISOString())}`,
            )
            .join("; "),
          ".",
          n.jsx("div", {
            className: "lp-mt-s",
            children: n.jsx(rt, {
              id: "ack-conflict",
              label: "I understand and want to continue anyway",
              checked: u.anyway,
              onChange: N("anyway"),
            }),
          }),
        ],
      });
  let C = "",
    j = null,
    R = null;
  if (
    (S === "accept" &&
      ((C = "Accept this consultation?"),
      (j = n.jsxs(n.Fragment, {
        children: [
          n.jsx(ai, { a: v }),
          !k &&
            n.jsxs(O, {
              tone: "danger",
              title: "Verification required",
              className: "lp-mt-s",
              children: [
                "You can accept requests once your credentials are approved. ",
                n.jsx(P, {
                  to: "/verification",
                  className: "lp-link",
                  onClick: y,
                  children: "Go to verification",
                }),
              ],
            }),
          x,
          E(v.startsAt),
          n.jsx("p", {
            className: "lp-hint lp-mt-s",
            children:
              "The client will be notified and the consultation will appear under Upcoming. (Demo: no notification is actually sent.)",
          }),
        ],
      })),
      (R = n.jsxs(n.Fragment, {
        children: [
          n.jsx(b, { variant: "ghost", onClick: y, children: "Not now" }),
          n.jsx(b, {
            loading: o,
            disabled: !k || (f.length > 0 && !u.anyway),
            onClick: () =>
              p(() => r({ type: "APPT_ACCEPT", id: v.id }), {
                title: "Consultation accepted",
                message: `${v.client.name} · ${Bn(v.startsAt)} ${ge(v.startsAt)}`,
              }),
            children: "Accept consultation",
          }),
        ],
      }))),
    S === "decline" &&
      ((C = "Decline this request?"),
      (j = n.jsxs(n.Fragment, {
        children: [
          n.jsx(ai, { a: v }),
          n.jsx(Ce, {
            id: "dec-reason",
            label: "Reason (shared with the client)",
            required: !0,
            options: Wy,
            value: u.reason,
            onChange: N("reason"),
            error: h.reason,
          }),
          n.jsx(Et, {
            id: "dec-note",
            label: u.reason === "Other" ? "Please explain" : "Message (optional)",
            required: u.reason === "Other",
            rows: 3,
            value: u.note,
            onChange: N("note"),
            error: h.note,
            placeholder: "Suggest an alternative if helpful.",
          }),
        ],
      })),
      (R = n.jsxs(n.Fragment, {
        children: [
          n.jsx(b, { variant: "ghost", onClick: y, children: "Keep request" }),
          n.jsx(b, {
            variant: "danger",
            loading: o,
            onClick: () => {
              const g = {
                reason: u.reason ? "" : "Choose a reason.",
                note: u.reason === "Other" && !u.note.trim() ? "Please add a short explanation." : "",
              };
              (m(g),
                !(g.reason || g.note) &&
                  p(
                    () =>
                      r({
                        type: "APPT_DECLINE",
                        id: v.id,
                        reason:
                          u.reason === "Other"
                            ? u.note.trim()
                            : u.reason + (u.note.trim() ? ` — ${u.note.trim()}` : ""),
                      }),
                    { tone: "info", title: "Request declined", message: v.client.name },
                  ));
            },
            children: "Decline request",
          }),
        ],
      }))),
    S === "reschedule")
  ) {
    const g = Ie(new Date().toISOString());
    ((C = "Reschedule consultation"),
      (j = n.jsxs(n.Fragment, {
        children: [
          n.jsxs("p", {
            className: "lp-muted",
            children: [
              "Currently ",
              Ds(v.startsAt),
              ", ",
              ge(v.startsAt),
              " ",
              nt,
              " with ",
              v.client.name,
              ".",
            ],
          }),
          n.jsxs("div", {
            className: "lp-grid2 lp-mt-s",
            children: [
              n.jsx(W, {
                id: "rs-date",
                type: "date",
                label: "New date",
                required: !0,
                min: g,
                value: u.date,
                onChange: N("date"),
                error: h.date,
              }),
              n.jsx(Ce, {
                id: "rs-time",
                label: `New time (${nt})`,
                required: !0,
                options: Oy.map((M) => ({ value: M, label: Zy(M) })),
                value: u.time,
                onChange: N("time"),
                error: h.time,
              }),
            ],
          }),
          x,
          E(A),
          n.jsx(Et, {
            id: "rs-reason",
            label: "Reason (optional)",
            rows: 2,
            value: u.note,
            onChange: N("note"),
            placeholder: "Shared with the client.",
          }),
          n.jsxs("p", {
            className: "lp-hint",
            children: [
              "Times are in ",
              nt,
              " (UTC+5:30). In the real product the client confirms the new time; here it updates immediately.",
            ],
          }),
        ],
      })),
      (R = n.jsxs(n.Fragment, {
        children: [
          n.jsx(b, { variant: "ghost", onClick: y, children: "Cancel" }),
          n.jsx(b, {
            loading: o,
            disabled: f.length > 0 && !u.anyway,
            onClick: () => {
              const M = {
                date: u.date ? (u.date < g ? "Pick today or a future date." : "") : "Choose a date.",
                time: u.time ? "" : "Choose a time.",
              };
              (!M.date &&
                !M.time &&
                new Date(A).getTime() <= Date.now() &&
                (M.time = "That time has already passed."),
                !M.date &&
                  !M.time &&
                  A === v.startsAt &&
                  (M.time = "That is the current time. Pick a different slot."),
                m(M),
                !(M.date || M.time) &&
                  p(() => r({ type: "APPT_RESCHEDULE", id: v.id, startsAt: A, reason: u.note.trim() }), {
                    title: "Consultation rescheduled",
                    message: `${Ke(A)}, ${ge(A)} ${nt}`,
                  }));
            },
            children: "Confirm new time",
          }),
        ],
      })));
  }
  return (
    S === "cancel" &&
      ((C = "Cancel this consultation?"),
      (j = n.jsxs(n.Fragment, {
        children: [
          n.jsx(ai, { a: v }),
          n.jsx(O, {
            tone: "warning",
            title: "This affects the client",
            className: "lp-mt-s",
            children:
              "They will be notified and refunded according to the platform policy. Frequent cancellations may affect your profile. (Demo: nothing is sent or refunded.)",
          }),
          n.jsx(Ce, {
            id: "cn-reason",
            label: "Reason",
            required: !0,
            options: Hy,
            value: u.reason,
            onChange: N("reason"),
            error: h.reason,
          }),
          n.jsx(rt, {
            id: "cn-ack",
            label: "I understand the client will be notified of this cancellation.",
            checked: u.ack,
            onChange: N("ack"),
            error: h.ack,
          }),
        ],
      })),
      (R = n.jsxs(n.Fragment, {
        children: [
          n.jsx(b, { variant: "ghost", onClick: y, children: "Keep consultation" }),
          n.jsx(b, {
            variant: "danger",
            loading: o,
            onClick: () => {
              const g = {
                reason: u.reason ? "" : "Choose a reason.",
                ack: u.ack ? "" : "Please confirm to continue.",
              };
              (m(g),
                !(g.reason || g.ack) &&
                  p(() => r({ type: "APPT_CANCEL", id: v.id, reason: u.reason }), {
                    tone: "info",
                    title: "Consultation cancelled",
                    message: v.client.name,
                  }));
            },
            children: "Cancel consultation",
          }),
        ],
      }))),
    S === "complete" &&
      ((C = "Mark as completed?"),
      (j = n.jsxs(n.Fragment, {
        children: [
          n.jsx(ai, { a: v }),
          n.jsxs("p", {
            className: "lp-hint lp-mt-s",
            children: [
              "This moves the consultation to Completed and adds ",
              J(dr(v)),
              " (illustrative, after platform fee) to this month’s earnings.",
            ],
          }),
        ],
      })),
      (R = n.jsxs(n.Fragment, {
        children: [
          n.jsx(b, { variant: "ghost", onClick: y, children: "Not yet" }),
          n.jsx(b, {
            loading: o,
            onClick: () =>
              p(() => r({ type: "APPT_COMPLETE", id: v.id }), {
                title: "Marked as completed",
                message: `${J(dr(v))} added to earnings (demo)`,
              }),
            children: "Mark completed",
          }),
        ],
      }))),
    n.jsx(Yt, { open: !!e, onClose: y, title: C, footer: R, children: j })
  );
}
export function Lc(e) {
  const [t, s] = w.useState(null);
  return {
    open: (l, i) => s({ kind: l, appt: i }),
    node: n.jsx(Xy, { dlg: t, close: () => s(null), onDone: e }),
  };
}
export const $s = {
    active: ["info", "Active"],
    awaiting_client: ["warning", "Awaiting client"],
    on_hold: ["neutral", "On hold"],
    closed: ["success", "Closed"],
  },
  Uc = ({ status: e }) => {
    const [t, s] = $s[e];
    return n.jsx(H, { tone: t, dot: !0, children: s });
  };
