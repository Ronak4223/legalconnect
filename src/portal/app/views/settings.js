import w from "react";
import * as n from "react/jsx-runtime";
import { useNavigate as Me, Link as P, useSearchParams as Ks } from "react-router-dom";
import { Ac, Cc, Ke, Vl, ge, qt, wc } from "../lib/core.js";
import { Ce, Et, Ft, H, L, O, Q, W, Wt, b, mt, qs, rt, xe, z } from "../components/ui.js";
import { Yr, bc } from "../lib/domain.js";
import { lm, ne } from "../state/store.js";
import { Mt, So, bt } from "../components/section.js";
import { pd, ze } from "./notifications.js";

/* app/views/settings.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
export function SettingsView() {
  const [e, t] = Ks(),
    s = pd.some(([l]) => l === e.get("tab")) ? e.get("tab") : "account";
  return n.jsxs(n.Fragment, {
    children: [
      n.jsx(Ft, {
        eyebrow: "Account",
        title: "Settings",
        children:
          "Manage your account, security, notifications and privacy. Each control is labelled so you know what really works in this demo.",
      }),
      n.jsxs(Q, {
        className: "lp-listcard",
        children: [
          n.jsx(qs, {
            label: "Settings sections",
            value: s,
            onChange: (l) => t(l === "account" ? {} : { tab: l }, { replace: !0 }),
            tabs: pd.map(([l, i]) => ({ id: l, label: i })),
          }),
          n.jsxs("ul", {
            className: "lp-legend lp-legend-tags",
            "aria-label": "Control labels",
            children: [
              n.jsxs("li", { children: [n.jsx(ze, { k: "demo" }), " acts on this browser’s demo data"] }),
              n.jsxs("li", { children: [n.jsx(ze, { k: "ui" }), " stored, but nothing is sent"] }),
              n.jsxs("li", {
                children: [n.jsx(ze, { k: "backend" }), " needs a real server, so unavailable"],
              }),
            ],
          }),
        ],
      }),
      n.jsxs("div", {
        className: "lp-set",
        children: [
          s === "account" && n.jsx(xv, {}),
          s === "security" && n.jsx(yv, {}),
          s === "notifications" && n.jsx(vv, {}),
          s === "privacy" && n.jsx(jv, {}),
          s === "help" && n.jsx(Sv, {}),
        ],
      }),
    ],
  });
}
function xv() {
  const { lawyer: e, account: t, state: s, dispatch: l } = ne(),
    i = xe(),
    r = (c, u) => {
      (l({
        type: "LAWYER_PATCH",
        lawyerId: e.id,
        patch: c,
        activity: `You updated settings — ${u}`,
        href: "/settings",
      }),
        i({ title: "Settings saved", message: u }));
    },
    a = Mt(
      { email: t.email, phone: e.phone },
      (c) => {
        const u = { email: Vl(c.email), phone: wc(c.phone) };
        return (
          !u.email &&
            c.email.trim().toLowerCase() !== t.email.toLowerCase() &&
            s.accounts.some((d) => d.email.toLowerCase() === c.email.trim().toLowerCase()) &&
            (u.email = "Another demo account already uses this email."),
          Object.fromEntries(Object.entries(u).filter(([, d]) => d))
        );
      },
      (c) => {
        const u = c.email.trim().toLowerCase() !== t.email.toLowerCase();
        (u &&
          l({ type: "ACCOUNT_PATCH", accountId: t.id, patch: { email: c.email.trim(), emailVerified: !1 } }),
          l({
            type: "LAWYER_PATCH",
            lawyerId: e.id,
            patch: { email: c.email.trim(), phone: c.phone.replace(/\D/g, "") },
            activity: "You updated your contact details",
            href: "/settings",
          }),
          i({
            title: "Contact details saved",
            message: u ? "Please verify your new email address." : void 0,
          }));
      },
    ),
    o = Mt(
      { language: e.settings.language, commLang: e.settings.commLang },
      (c) => (c.commLang ? {} : { commLang: "Choose a language." }),
      (c) =>
        r(
          { settings: { ...e.settings, language: c.language, commLang: c.commLang } },
          "language preferences",
        ),
    );
  return n.jsxs(n.Fragment, {
    children: [
      n.jsxs(bt, {
        id: "set-contact",
        title: "Account details",
        sub: "The email you sign in with and your mobile number.",
        s: a,
        view: n.jsxs(n.Fragment, {
          children: [
            n.jsxs("dl", {
              className: "lp-dl",
              children: [
                n.jsxs("div", {
                  children: [
                    n.jsx("dt", { children: "Email" }),
                    n.jsxs("dd", {
                      children: [
                        t.email,
                        " ",
                        t.emailVerified
                          ? n.jsx(H, { tone: "success", dot: !0, children: "Verified" })
                          : n.jsx(H, { tone: "warning", dot: !0, children: "Not verified" }),
                      ],
                    }),
                  ],
                }),
                n.jsxs("div", {
                  children: [
                    n.jsx("dt", { children: "Mobile" }),
                    n.jsxs("dd", { children: ["+91 ", e.phone] }),
                  ],
                }),
                n.jsxs("div", {
                  children: [n.jsx("dt", { children: "Account type" }), n.jsx("dd", { children: "Lawyer" })],
                }),
              ],
            }),
            !t.emailVerified &&
              n.jsx(O, {
                tone: "warning",
                title: "Verify your email",
                className: "lp-mt",
                action: n.jsx(P, {
                  className: "lp-btn lp-btn-outline lp-btn-sm",
                  to: "/verify-email",
                  children: n.jsx("span", { children: "Verify now" }),
                }),
                children: "Your address isn’t verified yet.",
              }),
          ],
        }),
        children: [
          n.jsx(W, {
            id: "sc-email",
            type: "email",
            label: "Email address",
            required: !0,
            value: a.draft.email,
            onChange: (c) => a.set("email", c.target.value),
            error: a.err.email,
            hint: "Changing it marks the new address as unverified.",
          }),
          n.jsx(W, {
            id: "sc-phone",
            type: "tel",
            inputMode: "numeric",
            label: "Mobile number",
            prefix: "+91",
            required: !0,
            value: a.draft.phone,
            onChange: (c) => a.set("phone", c.target.value),
            error: a.err.phone,
          }),
        ],
      }),
      n.jsxs(bt, {
        id: "set-lang",
        title: "Language & region",
        sub: "Interface and communication preferences.",
        s: o,
        view: n.jsxs("dl", {
          className: "lp-dl",
          children: [
            n.jsxs("div", {
              children: [
                n.jsx("dt", { children: "Interface language" }),
                n.jsx("dd", { children: "English" }),
              ],
            }),
            n.jsxs("div", {
              children: [
                n.jsx("dt", { children: "Client communication" }),
                n.jsx("dd", { children: e.settings.commLang }),
              ],
            }),
            n.jsxs("div", {
              children: [
                n.jsx("dt", { children: "Time zone" }),
                n.jsx("dd", { children: "IST (Asia/Kolkata) · fixed in this demo" }),
              ],
            }),
            n.jsxs("div", {
              children: [
                n.jsx("dt", { children: "Currency" }),
                n.jsx("dd", { children: "Indian rupee (₹)" }),
              ],
            }),
          ],
        }),
        children: [
          n.jsxs("div", {
            className: "lp-field",
            children: [
              n.jsx("label", { className: "lp-label", htmlFor: "sl-ui", children: "Interface language" }),
              n.jsxs("div", {
                className: "lp-input-wrap",
                children: [
                  n.jsxs("select", {
                    id: "sl-ui",
                    className: "lp-input lp-select",
                    value: o.draft.language,
                    onChange: (c) => o.set("language", c.target.value),
                    children: [
                      n.jsx("option", { value: "en", children: "English" }),
                      n.jsx("option", { value: "hi", disabled: !0, children: "हिन्दी — not translated yet" }),
                      n.jsx("option", { value: "ta", disabled: !0, children: "தமிழ் — not translated yet" }),
                    ],
                  }),
                  n.jsx(L, { name: "chevD", size: 16, className: "lp-select-ic" }),
                ],
              }),
              n.jsxs("p", {
                className: "lp-hint",
                children: ["Only English is available in this prototype. ", n.jsx(ze, { k: "ui" })],
              }),
            ],
          }),
          n.jsx(Ce, {
            id: "sl-comm",
            label: "Preferred language for client communication",
            required: !0,
            options: bc,
            value: o.draft.commLang,
            onChange: (c) => o.set("commLang", c.target.value),
            error: o.err.commLang,
            hint: "Used for templates you may send later. Nothing is sent in this demo.",
          }),
        ],
      }),
    ],
  });
}
function yv() {
  const { lawyer: e, account: t, state: s, dispatch: l, signOut: i } = ne(),
    r = Me(),
    a = xe(),
    [o, c] = w.useState({ cur: "", next: "", conf: "" }),
    [u, d] = w.useState({}),
    [h, m] = w.useState(!1),
    [S, v] = w.useState(!1),
    [N, A] = w.useState(!1),
    f = e.settings.sessions,
    p = (k, E) =>
      l({
        type: "LAWYER_PATCH",
        lawyerId: e.id,
        patch: { settings: k },
        activity: E,
        href: "/settings?tab=security",
      }),
    y = (k) => {
      k.preventDefault();
      const E = {
        cur: o.cur
          ? lm(s, t.email, o.cur).ok
            ? ""
            : "That isn’t your current password."
          : "Enter your current password.",
        next: Cc(o.next),
        conf: Ac(o.conf, o.next),
      };
      (!E.cur &&
        !E.next &&
        o.next === o.cur &&
        (E.next = "Choose a password different from the current one."),
        d(E),
        !(E.cur || E.next || E.conf) &&
          (m(!0),
          setTimeout(() => {
            (l({ type: "PASSWORD_CHANGED", email: t.email }),
              p(e.settings, "You changed your password (demo)"),
              c({ cur: "", next: "", conf: "" }),
              m(!1),
              a({
                title: "Password changed (demo)",
                message: "Nothing is stored — any 8+ character password now signs this account in.",
              }));
          }, 600)));
    };
  return n.jsxs(n.Fragment, {
    children: [
      n.jsxs(Q, {
        as: "section",
        "aria-labelledby": "sec-pw",
        children: [
          n.jsx(z, {
            title: n.jsx("span", { id: "sec-pw", children: "Change password" }),
            sub: "Checks your current password against the demo rule.",
            action: n.jsx(ze, { k: "demo" }),
          }),
          n.jsxs("form", {
            className: "lp-form",
            noValidate: !0,
            onSubmit: y,
            children: [
              n.jsx(Wt, {
                id: "sp-cur",
                label: "Current password",
                required: !0,
                autoComplete: "current-password",
                value: o.cur,
                onChange: (k) => {
                  (c({ ...o, cur: k.target.value }), d({ ...u, cur: "" }));
                },
                error: u.cur,
                hint: t.demoSeed && !t.passwordChanged ? "Demo account password: Demo@1234" : void 0,
              }),
              n.jsx(Wt, {
                id: "sp-new",
                label: "New password",
                required: !0,
                autoComplete: "new-password",
                showMeter: !0,
                value: o.next,
                onChange: (k) => {
                  (c({ ...o, next: k.target.value }), d({ ...u, next: "" }));
                },
                error: u.next,
              }),
              n.jsx(Wt, {
                id: "sp-conf",
                label: "Confirm new password",
                required: !0,
                autoComplete: "new-password",
                value: o.conf,
                onChange: (k) => {
                  (c({ ...o, conf: k.target.value }), d({ ...u, conf: "" }));
                },
                error: u.conf,
              }),
              n.jsx("div", {
                className: "lp-actions",
                children: n.jsx(b, { type: "submit", loading: h, children: "Update password" }),
              }),
            ],
          }),
          n.jsx("p", {
            className: "lp-hint lp-mt",
            children:
              "A real product would hash and store this securely on a server and end your other sessions. This prototype never stores passwords.",
          }),
        ],
      }),
      n.jsxs(Q, {
        as: "section",
        "aria-labelledby": "sec-2fa",
        children: [
          n.jsx(z, {
            title: n.jsx("span", { id: "sec-2fa", children: "Two-factor authentication" }),
            sub: "An extra code when you sign in.",
            action: n.jsx(ze, { k: "backend" }),
          }),
          n.jsx(rt, {
            id: "sec-2fa-t",
            label: "Require a one-time code at sign-in",
            checked: !1,
            disabled: !0,
            onChange: () => {},
          }),
          n.jsx("p", {
            className: "lp-hint",
            children:
              "Unavailable: generating and verifying one-time codes needs a secure backend. The toggle is shown so you can see where it will live.",
          }),
          n.jsxs("div", {
            className: "lp-prefrow",
            children: [
              n.jsx(rt, {
                id: "sec-alert",
                label: "Alert me about new sign-ins",
                checked: e.settings.loginAlerts,
                onChange: (k) => {
                  (p({ ...e.settings, loginAlerts: k.target.checked }, "You changed sign-in alerts"),
                    a({ title: "Preference saved" }));
                },
              }),
              n.jsx(ze, { k: "ui" }),
            ],
          }),
          n.jsx("p", { className: "lp-hint", children: "Stored for later — no email is sent in this demo." }),
        ],
      }),
      n.jsxs(Q, {
        as: "section",
        "aria-labelledby": "sec-sess",
        children: [
          n.jsx(z, {
            title: n.jsx("span", { id: "sec-sess", children: "Sessions & sign-out" }),
            sub: "Where you’re signed in.",
            action: n.jsx(ze, { k: "ui" }),
          }),
          n.jsxs("ul", {
            className: "lp-sessions",
            children: [
              n.jsxs("li", {
                children: [
                  n.jsx("span", {
                    className: "lp-cr-ic",
                    children: n.jsx(L, { name: "shieldCheck", size: 18 }),
                  }),
                  n.jsxs("div", {
                    children: [
                      n.jsx("strong", { children: "This browser" }),
                      n.jsxs("small", { children: ["Current session · signed in with ", t.email] }),
                    ],
                  }),
                  n.jsx(H, { tone: "success", dot: !0, children: "This device" }),
                ],
              }),
              f.map((k) =>
                n.jsxs(
                  "li",
                  {
                    children: [
                      n.jsx("span", {
                        className: "lp-cr-ic",
                        children: n.jsx(L, { name: "user", size: 18 }),
                      }),
                      n.jsxs("div", {
                        children: [
                          n.jsx("strong", { children: k.device }),
                          n.jsxs("small", { children: [k.location, " · last active ", qt(k.lastActive)] }),
                        ],
                      }),
                      n.jsxs(b, {
                        size: "sm",
                        variant: "outline",
                        onClick: () => {
                          (p(
                            { ...e.settings, sessions: f.filter((E) => E.id !== k.id) },
                            `You signed out ${k.device}`,
                          ),
                            a({ tone: "info", title: "Session removed (simulated)" }));
                        },
                        children: [
                          "Sign out",
                          n.jsxs("span", { className: "lp-sr", children: [" ", k.device] }),
                        ],
                      }),
                    ],
                  },
                  k.id,
                ),
              ),
            ],
          }),
          f.length === 0 && n.jsx("p", { className: "lp-muted lp-mt-s", children: "No other sessions." }),
          n.jsx("p", {
            className: "lp-hint",
            children:
              "The other sessions are sample entries — signing them out only removes them from this list. Real remote sign-out needs a backend.",
          }),
          n.jsxs("div", {
            className: "lp-actions lp-mt",
            children: [
              n.jsx(b, {
                variant: "outline",
                disabled: f.length === 0,
                onClick: () => A(!0),
                children: "Sign out all other sessions",
              }),
              n.jsx(b, {
                variant: "danger",
                icon: "logout",
                onClick: () => v(!0),
                children: "Sign out of this device",
              }),
            ],
          }),
        ],
      }),
      n.jsx(mt, {
        open: N,
        onClose: () => A(!1),
        title: "Sign out other sessions?",
        confirmLabel: "Sign them out",
        onConfirm: () => {
          (p({ ...e.settings, sessions: [] }, "You signed out all other sessions"),
            A(!1),
            a({ tone: "info", title: "Other sessions removed (simulated)" }));
        },
        children: n.jsxs("p", {
          children: [
            "This removes the ",
            f.length,
            " sample session",
            f.length === 1 ? "" : "s",
            " from the list. You stay signed in here.",
          ],
        }),
      }),
      n.jsx(mt, {
        open: S,
        onClose: () => v(!1),
        title: "Sign out?",
        confirmLabel: "Sign out",
        onConfirm: () => {
          (v(!1), i(), r("/login?reason=signedout"));
        },
        children: n.jsx("p", { children: "You will need to sign in again to see your dashboard." }),
      }),
    ],
  });
}
function vv() {
  const { lawyer: e, dispatch: t } = ne(),
    s = xe(),
    l = Mt(
      e.settings.notify,
      () => ({}),
      (o) => {
        (t({
          type: "LAWYER_PATCH",
          lawyerId: e.id,
          patch: { settings: { ...e.settings, notify: o } },
          activity: "You updated notification preferences",
          href: "/settings?tab=notifications",
        }),
          s({ title: "Notification preferences saved" }));
      },
    ),
    i = l.editing ? l.draft : e.settings.notify,
    r = (o, c, u) => l.setDraft((d) => ({ ...d, [o]: { ...d[o], [c]: u } })),
    a = n.jsxs(n.Fragment, {
      children: [
        n.jsxs(O, {
          tone: "info",
          title: "What actually changes in this demo",
          children: [
            "Turning off ",
            n.jsx("strong", { children: "In-app" }),
            " stops those notifications from being created for you. ",
            n.jsx("strong", { children: "Email" }),
            " and ",
            n.jsx("strong", { children: "SMS" }),
            " are saved preferences only — this prototype sends nothing.",
          ],
        }),
        n.jsx("div", {
          className: "lp-matrix-wrap",
          tabIndex: 0,
          role: "region",
          "aria-label": "Notification preferences by event and channel (scrolls sideways on small screens)",
          children: n.jsxs("table", {
            className: "lp-matrix",
            children: [
              n.jsx("thead", {
                children: n.jsxs("tr", {
                  children: [
                    n.jsx("th", { scope: "col", children: "Event" }),
                    n.jsxs("th", { scope: "col", children: ["In-app ", n.jsx(ze, { k: "demo" })] }),
                    n.jsxs("th", { scope: "col", children: ["Email ", n.jsx(ze, { k: "ui" })] }),
                    n.jsxs("th", { scope: "col", children: ["SMS ", n.jsx(ze, { k: "ui" })] }),
                  ],
                }),
              }),
              n.jsx("tbody", {
                children: Yr.map(([o, c]) =>
                  n.jsxs(
                    "tr",
                    {
                      children: [
                        n.jsx("th", { scope: "row", children: c }),
                        ["inApp", "email", "sms"].map((u) =>
                          n.jsx(
                            "td",
                            {
                              children: n.jsxs("label", {
                                className: "lp-switch",
                                children: [
                                  n.jsx("input", {
                                    type: "checkbox",
                                    checked: !!i[o][u],
                                    disabled: !l.editing,
                                    onChange: (d) => r(o, u, d.target.checked),
                                    "aria-label": `${u === "inApp" ? "In-app" : u === "email" ? "Email" : "SMS"}: ${c}`,
                                  }),
                                  n.jsx("span", { className: "lp-switch-t", "aria-hidden": "true" }),
                                ],
                              }),
                            },
                            u,
                          ),
                        ),
                      ],
                    },
                    o,
                  ),
                ),
              }),
            ],
          }),
        }),
      ],
    });
  return n.jsx(bt, {
    id: "set-notify",
    title: "Notification preferences",
    sub: "Choose how you hear about each kind of event. Press Edit to change them.",
    s: l,
    view: a,
    children: a,
  });
}
function jv() {
  const e = ne(),
    { lawyer: t, account: s, dispatch: l, signOut: i } = e,
    r = Me(),
    a = xe(),
    [o, c] = w.useState(!1),
    [u, d] = w.useState(""),
    h = t.settings.privacy,
    m = Mt(
      h,
      () => ({}),
      (f) => {
        (l({
          type: "LAWYER_PATCH",
          lawyerId: t.id,
          patch: { settings: { ...t.settings, privacy: f } },
          activity: "You updated privacy preferences",
          href: "/settings?tab=privacy",
        }),
          a({ title: "Privacy preferences saved" }));
      },
    ),
    S = m.editing ? m.draft : h,
    v = [
      ["listed", "Show my profile in the public lawyer directory", "demo"],
      ["preBookingMessages", "Let clients message me before they book", "ui"],
      ["showCity", "Show my city on my public profile", "demo"],
      ["usage", "Share anonymous usage data to improve LegalConnect", "ui"],
    ],
    N = n.jsxs(n.Fragment, {
      children: [
        n.jsx("ul", {
          className: "lp-privrows",
          children: v.map(([f, p, y]) =>
            n.jsxs(
              "li",
              {
                children: [
                  n.jsx(rt, {
                    id: `pv-${f}`,
                    label: p,
                    checked: !!S[f],
                    disabled: !m.editing,
                    onChange: (k) => m.set(f, k.target.checked),
                  }),
                  n.jsx(ze, { k: y }),
                ],
              },
              f,
            ),
          ),
        }),
        n.jsx("p", {
          className: "lp-hint",
          children:
            "“Works in demo” items change how your profile preview behaves here. Others are saved preferences — there is no public directory or analytics in this prototype.",
        }),
      ],
    }),
    A = () => {
      const f = {
        exportedAt: new Date().toISOString(),
        note: "Fictional demo data exported from this browser.",
        account: { email: s.email, emailVerified: s.emailVerified },
        profile: t,
        appointments: e.appts,
        clients: e.clients,
        cases: e.cases,
        conversations: e.convs,
        payouts: e.payouts,
        notifications: e.notifs,
        activity: e.activity,
        supportRequests: e.tickets,
      };
      (So("legalconnect-demo-data.json", JSON.stringify(f, null, 2), "application/json"),
        a({
          tone: "info",
          title: "Data exported",
          message: "A JSON file of this demo account’s data was downloaded.",
        }));
    };
  return n.jsxs(n.Fragment, {
    children: [
      n.jsx(bt, {
        id: "set-privacy",
        title: "Privacy preferences",
        sub: "Control what is shown and shared. Press Edit to change them.",
        s: m,
        view: N,
        children: N,
      }),
      n.jsxs(Q, {
        as: "section",
        "aria-labelledby": "set-data",
        children: [
          n.jsx(z, {
            title: n.jsx("span", { id: "set-data", children: "Your data" }),
            sub: "Download everything this demo holds about you.",
            action: n.jsx(ze, { k: "demo" }),
          }),
          n.jsx("p", {
            className: "lp-muted",
            children:
              "Exports your profile, appointments, clients, cases, conversations, payouts, notifications and support requests as a JSON file. It is generated entirely in your browser.",
          }),
          n.jsx("div", {
            className: "lp-actions lp-mt-s",
            children: n.jsx(b, {
              variant: "outline",
              icon: "file",
              onClick: A,
              children: "Download my data (JSON)",
            }),
          }),
        ],
      }),
      n.jsxs(Q, {
        as: "section",
        "aria-labelledby": "set-del",
        className: "lp-danger",
        children: [
          n.jsx(z, {
            title: n.jsx("span", { id: "set-del", children: "Delete account" }),
            sub: "Remove this demo account and everything attached to it.",
            action: n.jsx(ze, { k: "demo" }),
          }),
          n.jsx("p", {
            className: "lp-muted",
            children:
              "This erases your profile, appointments, clients, cases, messages, payouts and notifications from this browser and signs you out. Use “Reset demo data” in the top bar to restore the sample data. A real deletion flow would also need a retention policy and a backend.",
          }),
          n.jsx("div", {
            className: "lp-actions lp-mt-s",
            children: n.jsx(b, {
              variant: "danger",
              icon: "trash",
              onClick: () => c(!0),
              children: "Delete my account…",
            }),
          }),
        ],
      }),
      n.jsxs(mt, {
        open: o,
        onClose: () => {
          (c(!1), d(""));
        },
        title: "Delete your account?",
        confirmLabel: "Delete account",
        tone: "danger",
        disabled: u !== "DELETE",
        onConfirm: () => {
          (l({ type: "ACCOUNT_DELETE", accountId: s.id }), i(), c(!1), d(""), r("/login?reason=deleted"));
        },
        children: [
          n.jsxs(O, {
            tone: "danger",
            title: "This can’t be undone (except by resetting the demo)",
            children: ["All data for ", s.email, " will be removed from this browser."],
          }),
          n.jsx(W, {
            id: "del-confirm",
            label: "Type DELETE to confirm",
            value: u,
            onChange: (f) => d(f.target.value),
            autoComplete: "off",
          }),
        ],
      }),
    ],
  });
}
const wv = [
  [
    "How long does verification take?",
    "In the real product, a reviewer checks your Bar details and documents, typically within 2–3 business days. In this demo nobody reviews anything — use Demo controls in the top bar to preview each status.",
  ],
  [
    "Why can’t I accept a request?",
    "Requests can be accepted only after your credentials are approved. Open the Verification centre to see what is missing.",
  ],
  [
    "When do I get paid?",
    "Illustratively, a payment becomes withdrawable 48 hours after you mark a consultation completed (minus a 10% platform fee). Payouts here are simulated — no money moves.",
  ],
  [
    "How do I stop clients booking certain times?",
    "Set your weekly hours and block dates in Availability. Conflicts with consultations you already have are flagged, never cancelled automatically.",
  ],
  [
    "Is my data safe in this prototype?",
    "No. It is stored unencrypted in this browser only, and all client data is fictional. Don’t enter real client or personal information.",
  ],
];
function Sv() {
  const { lawyer: e, account: t, tickets: s, dispatch: l } = ne(),
    i = xe(),
    [r, a] = w.useState({ category: "", message: "" }),
    [o, c] = w.useState({}),
    [u, d] = w.useState(!1),
    h = (m) => {
      m.preventDefault();
      const S = r.message.trim().length,
        v = {
          category: r.category ? "" : "Choose a topic.",
          message:
            S < 20
              ? `Describe the problem in at least 20 characters (you have ${S}).`
              : S > 1e3
                ? "Keep it to 1,000 characters or fewer."
                : "",
        };
      (c(v),
        !(v.category || v.message) &&
          (d(!0),
          setTimeout(() => {
            (l({
              type: "TICKET_ADD",
              ticket: {
                id: `TKT-${Math.floor(1e3 + Math.random() * 9e3)}`,
                lawyerId: e.id,
                subject: r.category,
                message: r.message.trim(),
                at: new Date().toISOString(),
                status: "Received (demo)",
              },
            }),
              a({ category: "", message: "" }),
              d(!1),
              i({
                title: "Support request recorded (demo)",
                message: "Nobody will read this — it only exists in your browser.",
              }));
          }, 600)));
    };
  return n.jsxs(n.Fragment, {
    children: [
      n.jsxs(Q, {
        as: "section",
        "aria-labelledby": "help-faq",
        children: [
          n.jsx(z, {
            title: n.jsx("span", { id: "help-faq", children: "Frequently asked questions" }),
            sub: "Demo help content",
          }),
          n.jsx("div", {
            className: "lp-faq",
            children: wv.map(([m, S]) =>
              n.jsxs(
                "details",
                { children: [n.jsx("summary", { children: m }), n.jsx("p", { children: S })] },
                m,
              ),
            ),
          }),
        ],
      }),
      n.jsxs(Q, {
        as: "section",
        "aria-labelledby": "help-contact",
        children: [
          n.jsx(z, {
            title: n.jsx("span", { id: "help-contact", children: "Contact support" }),
            sub: "Demo: a request is saved locally, not sent.",
            action: n.jsx(ze, { k: "demo" }),
          }),
          n.jsxs("form", {
            className: "lp-form",
            noValidate: !0,
            onSubmit: h,
            children: [
              n.jsx(W, {
                id: "hc-email",
                label: "Reply to",
                value: t.email,
                readOnly: !0,
                hint: "Taken from your account.",
              }),
              n.jsx(Ce, {
                id: "hc-cat",
                label: "Topic",
                required: !0,
                options: [
                  "Verification",
                  "Appointments & requests",
                  "Payments & payouts",
                  "Profile & availability",
                  "Account & security",
                  "Something else",
                ],
                value: r.category,
                onChange: (m) => {
                  (a({ ...r, category: m.target.value }), c({ ...o, category: "" }));
                },
                error: o.category,
              }),
              n.jsx(Et, {
                id: "hc-msg",
                label: "How can we help?",
                required: !0,
                rows: 5,
                value: r.message,
                onChange: (m) => {
                  (a({ ...r, message: m.target.value }), c({ ...o, message: "" }));
                },
                error: o.message,
                hint: `${r.message.trim().length}/1000 · don’t include real client information`,
              }),
              n.jsx("div", {
                className: "lp-actions",
                children: n.jsx(b, { type: "submit", loading: u, children: "Send request" }),
              }),
            ],
          }),
          n.jsx("h3", { className: "lp-h4", children: "Your recent requests" }),
          s.length === 0
            ? n.jsx("p", { className: "lp-muted", children: "No requests yet." })
            : n.jsx("ul", {
                className: "lp-blocked",
                children: s.slice(0, 5).map((m) =>
                  n.jsxs(
                    "li",
                    {
                      children: [
                        n.jsxs("div", {
                          children: [
                            n.jsxs("strong", { children: [m.subject, " · ", m.id] }),
                            n.jsxs("small", {
                              children: [
                                Ke(m.at),
                                ", ",
                                ge(m.at),
                                " · ",
                                m.message.length > 70 ? `${m.message.slice(0, 67)}…` : m.message,
                              ],
                            }),
                          ],
                        }),
                        n.jsx(H, { tone: "warning", children: m.status }),
                      ],
                    },
                    m.id,
                  ),
                ),
              }),
        ],
      }),
    ],
  });
}
export const pi = 6;
