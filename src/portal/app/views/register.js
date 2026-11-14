import w from "react";
import * as n from "react/jsx-runtime";
import { useNavigate as Me, Link as P } from "react-router-dom";
import { Ac, Bh, Bt, Cc, Hh, Kr, Vl, Wh, wc } from "../lib/core.js";
import { Ce, H, L, Nc, O, W, Wt, b, rt, vs, xe } from "../components/ui.js";
import { Ll, Pe, bc, em, rr } from "../lib/domain.js";
import { ne } from "../state/store.js";
import { AuthLayout, Fy, om } from "./login.js";
import { ga } from "./recovery.js";

/* app/views/register.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
function rd(e, t, s) {
  const l = {};
  return (
    e === 0 &&
      ((l.fullName = Kr(t.fullName)),
      (l.email =
        Vl(t.email) ||
        (s.some((i) => i.email.toLowerCase() === t.email.trim().toLowerCase())
          ? "An account with this email already exists in this demo. Sign in instead."
          : "")),
      (l.phone = wc(t.phone)),
      (l.password = Cc(t.password)),
      (l.confirm = Ac(t.confirm, t.password))),
    e === 1 &&
      ((l.barNumber = Bh(t.barNumber)),
      (l.barCouncil = Bt(t.barCouncil, "State Bar Council")),
      (l.enrolYear = Wh(t.enrolYear)),
      (l.primaryArea = Bt(t.primaryArea, "Primary practice area")),
      (l.years = Hh(t.years, t.enrolYear)),
      (l.city = Bt(t.city, "City")),
      (l.languages = t.languages.length ? "" : "Select at least one language you can consult in.")),
    e === 2 &&
      ["identity", "bar_cert", "degree"].forEach((i) => {
        l[`doc_${i}`] = t.docs[i] ? "" : `${Pe[i].label} is required.`;
      }),
    e === 3 &&
      ((l.truthful = t.truthful ? "" : "Please confirm that the information is accurate."),
      (l.terms = t.terms ? "" : "You must accept the terms to create an account.")),
    Object.fromEntries(Object.entries(l).filter(([, i]) => i))
  );
}
function Qy({ step: e }) {
  return n.jsx("ol", {
    className: "lp-steps",
    "aria-label": "Registration progress",
    children: om.map((t, s) =>
      n.jsxs(
        "li",
        {
          className: s < e ? "is-done" : s === e ? "is-now" : "",
          "aria-current": s === e ? "step" : void 0,
          children: [
            n.jsx("span", {
              className: "lp-step-n",
              children: s < e ? n.jsx(L, { name: "check", size: 14 }) : s + 1,
            }),
            n.jsx("span", { className: "lp-step-l", children: t }),
          ],
        },
        t,
      ),
    ),
  });
}
export function RegisterView() {
  const { state: e, dispatch: t, signIn: s } = ne(),
    l = Me(),
    i = xe(),
    [r, a] = w.useState(0),
    [o, c] = w.useState(Fy),
    [u, d] = w.useState({}),
    [h, m] = w.useState(!1),
    [S, v] = w.useState(null),
    N = w.useRef(null);
  w.useEffect(() => {
    var j;
    (j = N.current) == null || j.focus({ preventScroll: !1 });
  }, [r, S]);
  const A = (j) => (R) => {
      const g = R.target.type === "checkbox" ? R.target.checked : R.target.value;
      (c((M) => ({ ...M, [j]: g })), u[j] && d((M) => ({ ...M, [j]: "" })));
    },
    f = (j, R) => {
      (c((g) => ({ ...g, [j]: R })), u[j] && d((g) => ({ ...g, [j]: "" })));
    },
    p = (j, R) => {
      (c((g) => ({ ...g, docs: { ...g.docs, [j]: R } })), d((g) => ({ ...g, [`doc_${j}`]: "" })));
    },
    y = () => {
      const j = rd(r, o, e.accounts);
      if ((d(j), Object.keys(j).length)) {
        const R = Object.keys(j)[0];
        setTimeout(() => {
          var g;
          return (g = document.querySelector(`[name="${R}"], #reg-${R}`)) == null ? void 0 : g.focus();
        }, 0);
        return;
      }
      a((R) => R + 1);
    },
    k = () => {
      (d({}), a((j) => Math.max(0, j - 1)));
    },
    E = (j) => {
      (d({}), a(j));
    },
    x = () => {
      const j = rd(3, o, e.accounts);
      (d(j),
        !Object.keys(j).length &&
          (m(!0),
          setTimeout(() => {
            const R = new Date().toISOString(),
              g = `lw_${Date.now().toString(36)}`,
              M = `acc_${Date.now().toString(36)}`,
              q = Object.entries(o.docs)
                .filter(([, Y]) => Y)
                .map(([Y, Z], te) => ({
                  id: `${g}_d${te}`,
                  kind: Y,
                  name: Z.name,
                  size: Z.size,
                  type: Z.type,
                  uploadedAt: R,
                  status: "in_review",
                  note: "",
                })),
              X = {
                id: M,
                lawyerId: g,
                email: o.email.trim(),
                emailVerified: !1,
                passwordChanged: !1,
                demoSeed: !1,
              },
              ue = {
                id: g,
                accountId: M,
                name: o.fullName.trim(),
                title: "Advocate",
                email: o.email.trim(),
                phone: o.phone.replace(/\D/g, ""),
                city: o.city,
                primaryArea: o.primaryArea,
                areas: [o.primaryArea, ...o.otherAreas],
                years: Number(o.years),
                languages: o.languages,
                avatar: null,
                timezone: "Asia/Kolkata",
                activeCases: 0,
                verification: {
                  status: "pending",
                  submittedAt: R,
                  reviewedAt: null,
                  reviewNote: "",
                  bar: { number: o.barNumber.trim(), council: o.barCouncil, year: String(o.enrolYear) },
                  docs: q,
                },
              };
            (t({ type: "REGISTER", account: X, lawyer: ue }),
              s(X, !0),
              m(!1),
              v({ email: X.email, name: ue.name }),
              i({ title: "Registration submitted", message: "Your details are in review (demo)." }));
          }, 1100)));
    };
  if (S)
    return n.jsx(AuthLayout, {
      title: "Registration submitted",
      subtitle: `Thank you, ${S.name.split(" ")[0]}. Your professional account has been created in this demo.`,
      children: n.jsxs("div", {
        ref: N,
        tabIndex: -1,
        className: "lp-done",
        children: [
          n.jsx("span", { className: "lp-done-ic", children: n.jsx(L, { name: "check", size: 28 }) }),
          n.jsxs("ol", {
            className: "lp-next",
            children: [
              n.jsxs("li", {
                children: [
                  n.jsx(H, { tone: "warning", dot: !0, children: "Next" }),
                  n.jsxs("div", {
                    children: [
                      n.jsx("strong", { children: "Verify your email" }),
                      n.jsxs("p", {
                        children: [
                          "A verification link would be sent to ",
                          S.email,
                          ". In this demo you can simulate clicking it.",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              n.jsxs("li", {
                children: [
                  n.jsx(H, { tone: "neutral", children: "Then" }),
                  n.jsxs("div", {
                    children: [
                      n.jsx("strong", { children: "Credential review" }),
                      n.jsx("p", {
                        children:
                          "Your bar details and documents show as “In review”. Real reviews take place only in the integrated product.",
                      }),
                    ],
                  }),
                ],
              }),
              n.jsxs("li", {
                children: [
                  n.jsx(H, { tone: "neutral", children: "After" }),
                  n.jsxs("div", {
                    children: [
                      n.jsx("strong", { children: "Start accepting consultations" }),
                      n.jsx("p", {
                        children: "Once approved you can accept requests and set your availability.",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          n.jsxs("div", {
            className: "lp-actions",
            children: [
              n.jsx(b, { iconRight: "arrowR", onClick: () => l("/verify-email"), children: "Verify email" }),
              n.jsx(b, { variant: "outline", onClick: () => l("/dashboard"), children: "Go to dashboard" }),
            ],
          }),
        ],
      }),
    });
  const C = Object.keys(u).length;
  return n.jsxs(AuthLayout, {
    wide: !0,
    title: "Create your professional account",
    subtitle: "Four short steps. You can go back and edit anything before submitting.",
    footer: n.jsxs(n.Fragment, {
      children: [
        "Already registered? ",
        n.jsx(P, { className: "lp-link", to: "/login", children: "Sign in" }),
      ],
    }),
    children: [
      n.jsx(Qy, { step: r }),
      n.jsx("div", {
        ref: N,
        tabIndex: -1,
        className: "lp-step-head",
        children: n.jsxs("h2", { className: "lp-h3", children: ["Step ", r + 1, " of 4 — ", om[r]] }),
      }),
      C > 0 &&
        n.jsx(O, {
          tone: "danger",
          title: `Please fix ${C} ${C === 1 ? "field" : "fields"} to continue`,
          className: "lp-mb",
        }),
      n.jsxs("form", {
        className: "lp-form",
        noValidate: !0,
        onSubmit: (j) => {
          (j.preventDefault(), r < 3 ? y() : x());
        },
        children: [
          r === 0 &&
            n.jsxs(n.Fragment, {
              children: [
                n.jsx(W, {
                  id: "reg-fullName",
                  name: "fullName",
                  label: "Full name",
                  required: !0,
                  autoComplete: "name",
                  value: o.fullName,
                  onChange: A("fullName"),
                  error: u.fullName,
                  placeholder: "As on your Bar Council certificate",
                }),
                n.jsx(W, {
                  id: "reg-email",
                  name: "email",
                  type: "email",
                  label: "Email address",
                  required: !0,
                  autoComplete: "email",
                  value: o.email,
                  onChange: A("email"),
                  error: u.email,
                  placeholder: "name@firm.in",
                }),
                n.jsx(W, {
                  id: "reg-phone",
                  name: "phone",
                  type: "tel",
                  inputMode: "numeric",
                  label: "Mobile number",
                  required: !0,
                  autoComplete: "tel-national",
                  prefix: "+91",
                  value: o.phone,
                  onChange: A("phone"),
                  error: u.phone,
                  placeholder: "98100 12345",
                }),
                n.jsx(Wt, {
                  id: "reg-password",
                  name: "password",
                  label: "Create password",
                  required: !0,
                  autoComplete: "new-password",
                  showMeter: !0,
                  value: o.password,
                  onChange: A("password"),
                  error: u.password,
                }),
                n.jsx(Wt, {
                  id: "reg-confirm",
                  name: "confirm",
                  label: "Confirm password",
                  required: !0,
                  autoComplete: "new-password",
                  value: o.confirm,
                  onChange: A("confirm"),
                  error: u.confirm,
                }),
              ],
            }),
          r === 1 &&
            n.jsxs(n.Fragment, {
              children: [
                n.jsxs("div", {
                  className: "lp-grid2",
                  children: [
                    n.jsx(W, {
                      id: "reg-barNumber",
                      name: "barNumber",
                      label: "Bar enrolment number",
                      required: !0,
                      value: o.barNumber,
                      onChange: A("barNumber"),
                      error: u.barNumber,
                      placeholder: "e.g. D/4821/2014",
                      hint: "Exactly as printed on your enrolment certificate.",
                    }),
                    n.jsx(Ce, {
                      id: "reg-barCouncil",
                      name: "barCouncil",
                      label: "State Bar Council",
                      required: !0,
                      options: em,
                      value: o.barCouncil,
                      onChange: A("barCouncil"),
                      error: u.barCouncil,
                    }),
                    n.jsx(W, {
                      id: "reg-enrolYear",
                      name: "enrolYear",
                      type: "number",
                      inputMode: "numeric",
                      label: "Year of enrolment",
                      required: !0,
                      value: o.enrolYear,
                      onChange: A("enrolYear"),
                      error: u.enrolYear,
                      placeholder: "2014",
                    }),
                    n.jsx(W, {
                      id: "reg-years",
                      name: "years",
                      type: "number",
                      inputMode: "numeric",
                      label: "Years of experience",
                      required: !0,
                      value: o.years,
                      onChange: A("years"),
                      error: u.years,
                      placeholder: "12",
                    }),
                    n.jsx(Ce, {
                      id: "reg-primaryArea",
                      name: "primaryArea",
                      label: "Primary practice area",
                      required: !0,
                      options: Ll,
                      value: o.primaryArea,
                      onChange: A("primaryArea"),
                      error: u.primaryArea,
                    }),
                    n.jsx(Ce, {
                      id: "reg-city",
                      name: "city",
                      label: "City of practice",
                      required: !0,
                      options: rr,
                      value: o.city,
                      onChange: A("city"),
                      error: u.city,
                    }),
                  ],
                }),
                n.jsx(vs, {
                  label: "Additional practice areas",
                  options: Ll.filter((j) => j !== o.primaryArea),
                  value: o.otherAreas,
                  onChange: (j) => f("otherAreas", j),
                  max: 3,
                  hint: "Optional — choose up to 3.",
                }),
                n.jsx(vs, {
                  label: "Consultation languages",
                  required: !0,
                  options: bc,
                  value: o.languages,
                  onChange: (j) => f("languages", j),
                  error: u.languages,
                }),
              ],
            }),
          r === 2 &&
            n.jsxs(n.Fragment, {
              children: [
                n.jsx(O, {
                  tone: "info",
                  title: "Your files stay on this device in the demo",
                  children:
                    "Nothing is uploaded to a server. Only the file name, size and type are kept so the verification screens can show them.",
                }),
                ["identity", "bar_cert", "degree", "photo"].map((j) =>
                  n.jsx(
                    Nc,
                    {
                      label: Pe[j].label,
                      hint: `${Pe[j].hint} · PDF, JPG or PNG up to 5 MB`,
                      required: Pe[j].required,
                      file: o.docs[j],
                      onSelect: (R) => p(j, R),
                      onRemove: () => p(j, null),
                      error: u[`doc_${j}`],
                    },
                    j,
                  ),
                ),
              ],
            }),
          r === 3 &&
            n.jsxs(n.Fragment, {
              children: [
                n.jsx(ga, {
                  title: "Personal",
                  onEdit: () => E(0),
                  rows: [
                    ["Name", o.fullName],
                    ["Email", o.email],
                    ["Mobile", `+91 ${o.phone}`],
                  ],
                }),
                n.jsx(ga, {
                  title: "Professional",
                  onEdit: () => E(1),
                  rows: [
                    ["Bar enrolment", `${o.barNumber} · ${o.barCouncil} · ${o.enrolYear}`],
                    ["Practice areas", [o.primaryArea, ...o.otherAreas].join(", ")],
                    ["Experience", `${o.years} years · ${o.city}`],
                    ["Languages", o.languages.join(", ")],
                  ],
                }),
                n.jsx(ga, {
                  title: "Documents",
                  onEdit: () => E(2),
                  rows: Object.entries(o.docs)
                    .filter(([, j]) => j)
                    .map(([j, R]) => [Pe[j].label, R.name]),
                }),
                n.jsx(rt, {
                  id: "reg-truthful",
                  name: "truthful",
                  label:
                    "I confirm that the information and documents I provided are accurate and belong to me.",
                  checked: o.truthful,
                  onChange: A("truthful"),
                  error: u.truthful,
                }),
                n.jsx(rt, {
                  id: "reg-terms",
                  name: "terms",
                  label:
                    "I agree to the LegalConnect Terms of Service and Privacy Policy. (Demo: these documents are not yet published.)",
                  checked: o.terms,
                  onChange: A("terms"),
                  error: u.terms,
                }),
              ],
            }),
          n.jsxs("div", {
            className: "lp-actions lp-actions-split",
            children: [
              r > 0
                ? n.jsx(b, { variant: "ghost", icon: "chevL", onClick: k, disabled: h, children: "Back" })
                : n.jsx("span", {}),
              r < 3
                ? n.jsx(b, { type: "submit", iconRight: "arrowR", children: "Continue" })
                : n.jsx(b, {
                    type: "submit",
                    loading: h,
                    children: h ? "Submitting…" : "Submit registration",
                  }),
            ],
          }),
        ],
      }),
    ],
  });
}
