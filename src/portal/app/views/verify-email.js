import w from "react";
import * as n from "react/jsx-runtime";
import { useNavigate as Me, Link as P } from "react-router-dom";
import { qt } from "../lib/core.js";
import { H, L, O, b, xe } from "../components/ui.js";
import { Rc } from "../lib/domain.js";
import { ne } from "../state/store.js";
import { AuthLayout } from "./login.js";

/* app/views/verify-email.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
export function VerifyEmailView() {
  const { account: e, dispatch: t } = ne(),
    s = Me(),
    l = xe(),
    [i, r] = w.useState(0),
    [a, o] = w.useState(1);
  return (
    w.useEffect(() => {
      if (i <= 0) return;
      const c = setTimeout(() => r((u) => u - 1), 1e3);
      return () => clearTimeout(c);
    }, [i]),
    w.useEffect(() => {
      r(30);
    }, []),
    e.emailVerified
      ? n.jsx(AuthLayout, {
          title: "Email verified",
          subtitle: `${e.email} is confirmed.`,
          children: n.jsxs("div", {
            className: "lp-done",
            children: [
              n.jsx("span", { className: "lp-done-ic", children: n.jsx(L, { name: "check", size: 28 }) }),
              n.jsx(O, {
                tone: "success",
                title: "You’re all set",
                children: "Your email address is verified. You can continue to your dashboard.",
              }),
              n.jsx("div", {
                className: "lp-actions",
                children: n.jsx(b, {
                  iconRight: "arrowR",
                  onClick: () => s("/dashboard"),
                  children: "Go to dashboard",
                }),
              }),
            ],
          }),
        })
      : n.jsx(AuthLayout, {
          title: "Verify your email",
          subtitle: "Confirm your address so we can reach you about consultations and your verification.",
          footer: n.jsx(P, { className: "lp-link", to: "/dashboard", children: "Skip for now" }),
          children: n.jsxs("div", {
            className: "lp-done",
            children: [
              n.jsx("span", { className: "lp-done-ic", children: n.jsx(L, { name: "mail", size: 26 }) }),
              n.jsxs("p", {
                className: "lp-lede",
                children: [
                  "A verification link was sent to ",
                  n.jsx("strong", { children: e.email }),
                  ".",
                  a > 1 && ` (Sent ${a} times.)`,
                ],
              }),
              n.jsx(O, {
                tone: "info",
                title: "Demo: no email was sent",
                children: "Use “Simulate clicking the link” to mark this address as verified.",
              }),
              n.jsxs("div", {
                className: "lp-actions",
                children: [
                  n.jsx(b, {
                    iconRight: "arrowR",
                    onClick: () => {
                      (t({ type: "VERIFY_EMAIL", accountId: e.id }),
                        l({ title: "Email verified", message: e.email }));
                    },
                    children: "Simulate clicking the link",
                  }),
                  n.jsx(b, {
                    variant: "outline",
                    disabled: i > 0,
                    onClick: () => {
                      (o((c) => c + 1),
                        r(30),
                        l({ tone: "info", title: "Verification email “sent” (demo)" }));
                    },
                    children: i > 0 ? `Resend in ${i}s` : "Resend email",
                  }),
                ],
              }),
            ],
          }),
        })
  );
}
export const dr = (e) => Rc(e.feeInr),
  Gy = {
    requested: ["warning", "Pending your response"],
    scheduled: ["info", "Scheduled"],
    completed: ["success", "Completed"],
    cancelled: ["neutral", "Cancelled"],
    declined: ["neutral", "Declined"],
  },
  By = { video: "video", phone: "phone", in_person: "pin" },
  Fr = (e) => By[e],
  vo = (e, t = e.startsAt) => new Date(t).getTime() + e.durationMin * 6e4;
export function ad(e, t, s = e.startsAt) {
  const l = new Date(s).getTime(),
    i = vo(e, s);
  return t.filter(
    (r) => r.id !== e.id && r.status === "scheduled" && new Date(r.startsAt).getTime() < i && vo(r) > l,
  );
}
export const um = (e, t) =>
  e.status === "requested" && e.expiresAt && new Date(e.expiresAt).getTime() - t < 24 * 36e5;
export function Qr({ a: e, now: t }) {
  const [s, l] = Gy[e.status];
  return n.jsxs(n.Fragment, {
    children: [
      n.jsx(H, { tone: s, dot: !0, children: l }),
      um(e, t) && n.jsxs(H, { tone: "danger", children: ["Expires ", qt(e.expiresAt, t)] }),
    ],
  });
}
