import w from "react";
import * as n from "react/jsx-runtime";
import { useLocation as Nt, useNavigate as Me, Link as P, useSearchParams as Ks } from "react-router-dom";
import { Vl } from "../lib/core.js";
import { L, O, W, Wt, b, er, rt, xe } from "../components/ui.js";
import { ar, yo } from "../lib/domain.js";
import { lm, ne } from "../state/store.js";
import { qy } from "../components/shell.js";

/* app/views/login.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
export function AuthLayout({ title: e, subtitle: t, children: s, footer: l, wide: i = !1 }) {
  return n.jsxs("div", {
    className: "lp-auth",
    children: [
      n.jsxs("aside", {
        className: "lp-auth-art",
        style: { backgroundImage: `url(${qy})` },
        "aria-label": "LegalConnect for lawyers",
        children: [
          n.jsx("div", { className: "lp-auth-veil" }),
          n.jsxs("div", {
            className: "lp-auth-art-in",
            children: [
              n.jsx(er, { light: !0 }),
              n.jsxs("div", {
                children: [
                  n.jsx("p", { className: "lp-eyebrow is-light", children: "For legal professionals" }),
                  n.jsx("h2", {
                    className: "lp-auth-h",
                    children: "Join a trusted community of legal professionals.",
                  }),
                  n.jsxs("ul", {
                    className: "lp-auth-list",
                    children: [
                      n.jsxs("li", {
                        children: [
                          n.jsx(L, { name: "users", size: 18 }),
                          " Meet clients who need your expertise",
                        ],
                      }),
                      n.jsxs("li", {
                        children: [
                          n.jsx(L, { name: "shieldCheck", size: 18 }),
                          " Build a verified professional reputation",
                        ],
                      }),
                      n.jsxs("li", {
                        children: [
                          n.jsx(L, { name: "briefcase", size: 18 }),
                          " Manage consultations and your practice in one place",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      n.jsxs("main", {
        className: "lp-auth-main",
        id: "lp-main",
        tabIndex: -1,
        children: [
          n.jsx("div", { className: "lp-auth-mobile-logo", children: n.jsx(er, {}) }),
          n.jsxs("div", {
            className: `lp-auth-card ${i ? "is-wide" : ""}`,
            children: [
              n.jsx("h1", { className: "lp-auth-title", children: e }),
              t && n.jsx("p", { className: "lp-lede", children: t }),
              s,
            ],
          }),
          l && n.jsx("div", { className: "lp-auth-foot", children: l }),
          n.jsxs("p", {
            className: "lp-auth-demo",
            children: [
              n.jsx("strong", { children: "Demo:" }),
              " this is a frontend prototype. No real accounts, emails or verification exist, and nothing is sent to a server.",
            ],
          }),
        ],
      }),
    ],
  });
}
const Yy = {
  expired: [
    "warning",
    "Your session expired",
    "For your security you were signed out. Please sign in again.",
  ],
  signedout: ["info", "You have been signed out", "Sign in again whenever you are ready."],
  reset: ["success", "Password updated", "Your password was changed (demo). Sign in to continue."],
  registered: ["success", "Registration submitted", "Sign in to continue."],
  deleted: ["info", "Account deleted", "Your demo account and its data were removed from this browser."],
};
export function LoginView() {
  const { state: e, signIn: t, resetAll: s } = ne(),
    l = Me(),
    i = Nt(),
    r = xe(),
    [a] = Ks(),
    [o, c] = w.useState({ email: "", password: "", remember: !0 }),
    [u, d] = w.useState({}),
    [h, m] = w.useState(""),
    [S, v] = w.useState(!1),
    N = w.useRef(null),
    A = Yy[a.get("reason")];
  w.useEffect(() => {
    var y;
    h && ((y = N.current) == null || y.focus());
  }, [h]);
  const f = (y) => (k) => {
      const E = k.target.type === "checkbox" ? k.target.checked : k.target.value;
      (c((x) => ({ ...x, [y]: E })), d((x) => ({ ...x, [y]: "" })), m(""));
    },
    p = (y) => {
      var E;
      y.preventDefault();
      const k = { email: Vl(o.email), password: o.password ? "" : "Password is required." };
      if ((d(k), k.email || k.password)) {
        (E = document.querySelector(k.email ? "#login-email" : "#login-password")) == null || E.focus();
        return;
      }
      (v(!0),
        m(""),
        setTimeout(() => {
          var C;
          const x = lm(e, o.email, o.password);
          if ((v(!1), !x.ok)) {
            m("We couldn’t sign you in. Check your email and password and try again.");
            return;
          }
          (t(x.account, o.remember),
            r({ title: "Signed in", message: "Welcome back." }),
            l(((C = i.state) == null ? void 0 : C.from) || "/dashboard", { replace: !0 }));
        }, 650));
    };
  return n.jsxs(AuthLayout, {
    title: "Welcome back",
    subtitle: "Sign in to manage your consultations, clients and verification.",
    footer: n.jsxs(n.Fragment, {
      children: [
        "New to LegalConnect? ",
        n.jsx(P, { className: "lp-link", to: "/register", children: "Create a lawyer account" }),
      ],
    }),
    children: [
      A && n.jsx(O, { tone: A[0], title: A[1], className: "lp-mb", children: A[2] }),
      h &&
        n.jsx("div", {
          ref: N,
          tabIndex: -1,
          className: "lp-focus-alert",
          children: n.jsx(O, { tone: "danger", title: "Sign-in failed", className: "lp-mb", children: h }),
        }),
      n.jsxs("form", {
        onSubmit: p,
        noValidate: !0,
        className: "lp-form",
        children: [
          n.jsx(W, {
            id: "login-email",
            label: "Email address",
            type: "email",
            autoComplete: "username",
            required: !0,
            value: o.email,
            onChange: f("email"),
            error: u.email,
            placeholder: "name@firm.in",
          }),
          n.jsx(Wt, {
            id: "login-password",
            label: "Password",
            autoComplete: "current-password",
            required: !0,
            value: o.password,
            onChange: f("password"),
            error: u.password,
          }),
          n.jsxs("div", {
            className: "lp-row-between",
            children: [
              n.jsx(rt, {
                label: "Keep me signed in on this device",
                checked: o.remember,
                onChange: f("remember"),
              }),
              n.jsx(P, { className: "lp-link", to: "/forgot-password", children: "Forgot password?" }),
            ],
          }),
          n.jsx(b, {
            type: "submit",
            size: "lg",
            loading: S,
            className: "lp-block",
            children: S ? "Signing in…" : "Sign in",
          }),
        ],
      }),
      n.jsxs("div", {
        className: "lp-demo-cred",
        children: [
          n.jsxs("div", {
            children: [
              n.jsx("strong", { children: "Demo account" }),
              n.jsx("span", { children: ar }),
              n.jsx("span", { children: yo }),
            ],
          }),
          n.jsx(b, {
            variant: "outline",
            size: "sm",
            onClick: () => {
              (c((y) => ({ ...y, email: ar, password: yo })), d({}), m(""));
            },
            children: "Fill credentials",
          }),
        ],
      }),
      n.jsx("p", {
        className: "lp-hint lp-mt",
        children:
          "Accounts you register in this demo accept any password of 8+ characters, because passwords are never stored.",
      }),
      n.jsxs("p", {
        className: "lp-hint",
        children: [
          n.jsx("button", {
            type: "button",
            className: "lp-link-btn",
            onClick: () => {
              (s(),
                r({
                  tone: "info",
                  title: "Sample data restored",
                  message: "The demo account and its data are back.",
                }));
            },
            children: "Restore sample data",
          }),
          " — resets everything in this browser, including accounts you registered or deleted.",
        ],
      }),
    ],
  });
}
export const om = ["Personal", "Professional", "Documents", "Review"],
  Fy = {
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    barNumber: "",
    barCouncil: "",
    enrolYear: "",
    primaryArea: "",
    otherAreas: [],
    years: "",
    city: "",
    languages: [],
    docs: { identity: null, bar_cert: null, degree: null, photo: null },
    truthful: !1,
    terms: !1,
  };
