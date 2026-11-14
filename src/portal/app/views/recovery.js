import w from "react";
import * as n from "react/jsx-runtime";
import { useNavigate as Me, Link as P, useSearchParams as Ks } from "react-router-dom";
import { Ac, Cc, Vl } from "../lib/core.js";
import { L, O, W, Wt, b } from "../components/ui.js";
import { ne } from "../state/store.js";
import { AuthLayout } from "./login.js";

/* app/views/recovery.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
export function ga({ title: e, rows: t, onEdit: s }) {
  return n.jsxs("section", {
    className: "lp-review",
    children: [
      n.jsxs("header", {
        children: [
          n.jsx("h3", { children: e }),
          n.jsxs("button", {
            type: "button",
            className: "lp-link-btn",
            onClick: s,
            children: [
              n.jsx(L, { name: "edit", size: 14 }),
              " Edit",
              n.jsxs("span", { className: "lp-sr", children: [" ", e] }),
            ],
          }),
        ],
      }),
      n.jsx("dl", {
        children: t.map(([l, i]) =>
          n.jsxs("div", { children: [n.jsx("dt", { children: l }), n.jsx("dd", { children: i || "—" })] }, l),
        ),
      }),
    ],
  });
}
const cm = "demo-reset-token";
export function ForgotPasswordView() {
  const e = Me(),
    [t, s] = w.useState(""),
    [l, i] = w.useState(""),
    [r, a] = w.useState(!1),
    [o, c] = w.useState(!1),
    u = (d) => {
      d.preventDefault();
      const h = Vl(t);
      (i(h),
        !h &&
          (a(!0),
          setTimeout(() => {
            (a(!1), c(!0));
          }, 800)));
    };
  return o
    ? n.jsx(AuthLayout, {
        title: "Check your email",
        subtitle: "If an account exists for that address, a password reset link has been sent.",
        footer: n.jsx(P, { className: "lp-link", to: "/login", children: "← Back to sign in" }),
        children: n.jsxs("div", {
          className: "lp-done",
          children: [
            n.jsx("span", { className: "lp-done-ic", children: n.jsx(L, { name: "mail", size: 26 }) }),
            n.jsxs("p", {
              className: "lp-lede",
              children: [
                "We sent instructions to ",
                n.jsx("strong", { children: t.trim() }),
                ". The link expires in 30 minutes.",
              ],
            }),
            n.jsx(O, {
              tone: "info",
              title: "Demo: no email was sent",
              children:
                "Use the button below to open the reset page directly, as if you had clicked the link.",
            }),
            n.jsxs("div", {
              className: "lp-actions",
              children: [
                n.jsx(b, {
                  iconRight: "arrowR",
                  onClick: () => e(`/reset-password?token=${cm}&email=${encodeURIComponent(t.trim())}`),
                  children: "Open demo reset link",
                }),
                n.jsx(b, { variant: "ghost", onClick: () => c(!1), children: "Use a different email" }),
              ],
            }),
          ],
        }),
      })
    : n.jsx(AuthLayout, {
        title: "Forgot your password?",
        subtitle: "Enter the email you registered with and we’ll send a reset link.",
        footer: n.jsx(P, { className: "lp-link", to: "/login", children: "← Back to sign in" }),
        children: n.jsxs("form", {
          className: "lp-form",
          noValidate: !0,
          onSubmit: u,
          children: [
            n.jsx(W, {
              id: "fp-email",
              label: "Email address",
              type: "email",
              autoComplete: "email",
              required: !0,
              value: t,
              onChange: (d) => {
                (s(d.target.value), i(""));
              },
              error: l,
              placeholder: "name@firm.in",
            }),
            n.jsx(b, {
              type: "submit",
              size: "lg",
              loading: r,
              className: "lp-block",
              children: r ? "Sending…" : "Send reset link",
            }),
          ],
        }),
      });
}
export function ResetPasswordView() {
  const [e] = Ks(),
    t = Me(),
    { dispatch: s } = ne(),
    l = e.get("token") === cm,
    i = e.get("email") || "",
    [r, a] = w.useState({ password: "", confirm: "" }),
    [o, c] = w.useState({}),
    [u, d] = w.useState(!1);
  if (!l)
    return n.jsxs(AuthLayout, {
      title: "This link is invalid or has expired",
      subtitle: "Reset links work once and expire after 30 minutes.",
      footer: n.jsx(P, { className: "lp-link", to: "/login", children: "← Back to sign in" }),
      children: [
        n.jsx(O, {
          tone: "danger",
          title: "We couldn’t verify this reset link",
          children: "Request a new link and try again.",
        }),
        n.jsx("div", {
          className: "lp-actions",
          children: n.jsx(b, { onClick: () => t("/forgot-password"), children: "Request a new link" }),
        }),
      ],
    });
  const h = (m) => {
    m.preventDefault();
    const S = { password: Cc(r.password), confirm: Ac(r.confirm, r.password) };
    (c(S),
      !(S.password || S.confirm) &&
        (d(!0),
        setTimeout(() => {
          (i && s({ type: "PASSWORD_CHANGED", email: i }), d(!1), t("/login?reason=reset", { replace: !0 }));
        }, 800)));
  };
  return n.jsx(AuthLayout, {
    title: "Set a new password",
    subtitle: i ? `For ${i}` : "Choose a strong password you don’t use elsewhere.",
    footer: n.jsx(P, { className: "lp-link", to: "/login", children: "← Back to sign in" }),
    children: n.jsxs("form", {
      className: "lp-form",
      noValidate: !0,
      onSubmit: h,
      children: [
        n.jsx(Wt, {
          id: "rp-pw",
          label: "New password",
          required: !0,
          autoComplete: "new-password",
          showMeter: !0,
          value: r.password,
          onChange: (m) => {
            (a({ ...r, password: m.target.value }), c({ ...o, password: "" }));
          },
          error: o.password,
        }),
        n.jsx(Wt, {
          id: "rp-cf",
          label: "Confirm new password",
          required: !0,
          autoComplete: "new-password",
          value: r.confirm,
          onChange: (m) => {
            (a({ ...r, confirm: m.target.value }), c({ ...o, confirm: "" }));
          },
          error: o.confirm,
        }),
        n.jsx(b, {
          type: "submit",
          size: "lg",
          loading: u,
          className: "lp-block",
          children: u ? "Saving…" : "Update password",
        }),
      ],
    }),
  });
}
