import w from "react";
import * as n from "react/jsx-runtime";
import { Link as P } from "react-router-dom";
import { IMG } from "../00-assets.js";
import { Bh, Bt, Gn, Wh } from "../lib/core.js";
import { Ce, Ft, H, L, Nc, O, Q, W, b, mt, xe, z } from "../components/ui.js";
import { Pe, em } from "../lib/domain.js";
import { cr, ne, rm } from "../state/store.js";
import { od } from "./appointment-detail.js";

/* app/views/verification.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
function lv(e, t) {
  const s = (o) => e.docs.find((c) => c.kind === o),
    l = (o) => {
      var c;
      return ((c = s(o)) == null ? void 0 : c.status) || "missing";
    },
    i = (o) => (e.status === "approved" ? "verified" : e.status === "pending" ? "in_review" : o),
    r = cr(e)
      ? e.status === "rejected"
        ? l("bar_cert") === "rejected"
          ? "rejected"
          : "verified"
        : i("uploaded")
      : "missing",
    a = t.areas.length > 0 && t.years >= 0;
  return [
    {
      id: "identity",
      label: "Identity verification",
      detail: "Government-issued photo ID",
      status: l("identity"),
      href: "#vc-docs",
    },
    {
      id: "bar",
      label: "Bar registration details",
      detail: "Enrolment number, State Bar Council, year",
      status: r,
      href: "#vc-bar",
    },
    {
      id: "degree",
      label: "Professional credentials",
      detail: "Law degree certificate",
      status: l("degree"),
      href: "#vc-docs",
    },
    {
      id: "practice",
      label: "Practice areas & experience",
      detail: `${t.areas.join(", ")} · ${t.years} yrs`,
      status: a ? i("uploaded") : "missing",
      href: "#vc-practice",
    },
    {
      id: "docs",
      label: "Required documents uploaded",
      detail: "ID, bar certificate and degree",
      status: rm(e).length
        ? "missing"
        : e.status === "approved"
          ? "verified"
          : e.status === "pending"
            ? "in_review"
            : e.docs.some((o) => o.status === "rejected")
              ? "rejected"
              : "uploaded",
      href: "#vc-docs",
    },
  ];
}
export function VerificationView() {
  const { lawyer: e, dispatch: t } = ne(),
    s = xe(),
    l = e.verification,
    i = l.status,
    r = i === "incomplete" || i === "rejected",
    a = lv(l, e),
    o = a.filter(
      (A) => A.status === "verified" || A.status === "in_review" || A.status === "uploaded",
    ).length,
    c = rm(l),
    u = l.docs.filter((A) => A.status === "rejected"),
    d = r && c.length === 0 && cr(l) && u.length === 0,
    [h, m] = w.useState(!1),
    [S, v] = w.useState(!1),
    N = () => {
      (v(!0),
        setTimeout(() => {
          (t({ type: "VERIFICATION_SUBMIT", lawyerId: e.id }),
            v(!1),
            m(!1),
            s({
              title: "Submitted for review",
              message: "Status is now “In review” (demo — no one will actually review it).",
            }));
        }, 700));
    };
  return n.jsxs(n.Fragment, {
    children: [
      n.jsx(Ft, {
        eyebrow: "Account",
        title: "Verification centre",
        children:
          "Confirm your identity and Bar registration so clients can trust your profile and you can accept consultations.",
      }),
      n.jsxs(O, {
        tone: "info",
        title: "Demo: nothing here is reviewed by a person",
        className: "lp-mb",
        children: [
          "Sample credentials are fictional and are not verified real lawyers. Use ",
          n.jsx("strong", { children: "Demo controls → Verification status" }),
          " in the top bar to preview each state.",
        ],
      }),
      n.jsx(rv, { status: i, ver: l, progress: `${o} of ${a.length}` }),
      n.jsxs("div", {
        className: "lp-vgrid",
        children: [
          n.jsxs("div", {
            className: "lp-vmain",
            children: [
              n.jsxs(Q, {
                as: "section",
                "aria-labelledby": "vc-check-h",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "vc-check-h", children: "Checklist" }),
                    sub: "Every item must be complete before you can submit.",
                  }),
                  n.jsx("ul", {
                    className: "lp-checklist",
                    children: a.map((A) => {
                      const [f, p] = od[A.status];
                      return n.jsxs(
                        "li",
                        {
                          children: [
                            n.jsx("span", {
                              className: `lp-ck is-${f}`,
                              children: n.jsx(L, {
                                name: A.status === "missing" || A.status === "rejected" ? "alert" : "check",
                                size: 15,
                              }),
                            }),
                            n.jsxs("div", {
                              children: [
                                n.jsx("strong", { children: A.label }),
                                n.jsx("small", { children: A.detail }),
                              ],
                            }),
                            n.jsx(H, { tone: f, children: p }),
                          ],
                        },
                        A.id,
                      );
                    }),
                  }),
                ],
              }),
              n.jsx(ov, { ver: l, editable: r, lawyerId: e.id }),
              n.jsxs(Q, {
                as: "section",
                id: "vc-docs",
                "aria-labelledby": "vc-docs-h",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "vc-docs-h", children: "Documents" }),
                    sub: "PDF, JPG or PNG up to 5 MB each. Files stay on this device in the demo.",
                  }),
                  n.jsx("div", {
                    className: "lp-docs",
                    children: Object.keys(Pe).map((A) => {
                      const f = l.docs.find((E) => E.kind === A),
                        p =
                          r &&
                          (!f || i === "incomplete" || f.status === "rejected" || f.status === "uploaded"),
                        [y, k] = f ? od[f.status] : ["danger", "Missing"];
                      return n.jsxs(
                        "div",
                        {
                          className: "lp-doc",
                          children: [
                            (f || !r) && !p
                              ? n.jsxs("div", {
                                  className: "lp-field",
                                  children: [
                                    n.jsxs("span", {
                                      className: "lp-label",
                                      children: [
                                        Pe[A].label,
                                        Pe[A].required
                                          ? n.jsx("span", { className: "lp-req", children: " *" })
                                          : n.jsx("span", { className: "lp-opt", children: " (optional)" }),
                                      ],
                                    }),
                                    f
                                      ? n.jsxs("div", {
                                          className: "lp-file",
                                          children: [
                                            n.jsx("span", {
                                              className: "lp-file-ic",
                                              children: n.jsx(L, { name: "file", size: 20 }),
                                            }),
                                            n.jsxs("span", {
                                              className: "lp-file-meta",
                                              children: [
                                                n.jsx("strong", { children: f.name }),
                                                n.jsxs("small", {
                                                  children: ["Uploaded ", Gn(f.uploadedAt)],
                                                }),
                                              ],
                                            }),
                                            n.jsx(H, { tone: y, children: k }),
                                          ],
                                        })
                                      : n.jsxs("p", {
                                          className: "lp-muted lp-notprov",
                                          children: [
                                            "Not provided. Documents are locked while your verification is ",
                                            i === "pending" ? "in review" : "approved",
                                            ".",
                                          ],
                                        }),
                                  ],
                                })
                              : n.jsx(Nc, {
                                  label: Pe[A].label,
                                  hint: `${Pe[A].hint} · PDF, JPG or PNG up to 5 MB`,
                                  required: Pe[A].required,
                                  file: f ? { name: f.name, size: f.size, type: f.type } : null,
                                  status: f && n.jsx(H, { tone: y, children: k }),
                                  onSelect: (E) => {
                                    (t({
                                      type: "DOC_ADD",
                                      lawyerId: e.id,
                                      doc: {
                                        id: `d_${Date.now().toString(36)}`,
                                        kind: A,
                                        name: E.name,
                                        size: E.size,
                                        type: E.type,
                                        uploadedAt: new Date().toISOString(),
                                        status: "uploaded",
                                        note: "",
                                      },
                                    }),
                                      s({ title: "Document added", message: E.name }));
                                  },
                                  onRemove:
                                    f && p
                                      ? () => {
                                          (t({ type: "DOC_REMOVE", lawyerId: e.id, docId: f.id }),
                                            s({ tone: "info", title: "Document removed" }));
                                        }
                                      : void 0,
                                }),
                            (f == null ? void 0 : f.status) === "rejected" &&
                              n.jsx(O, {
                                tone: "danger",
                                title: "Rejected",
                                className: "lp-mt-s",
                                children: f.note,
                              }),
                          ],
                        },
                        A,
                      );
                    }),
                  }),
                ],
              }),
              n.jsxs(Q, {
                as: "section",
                id: "vc-practice",
                "aria-labelledby": "vc-pr-h",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "vc-pr-h", children: "Practice areas & experience" }),
                    action: n.jsx(P, {
                      className: "lp-btn lp-btn-outline lp-btn-sm",
                      to: "/profile",
                      children: n.jsx("span", { children: "Edit in Profile" }),
                    }),
                  }),
                  n.jsxs("dl", {
                    className: "lp-dl",
                    children: [
                      n.jsxs("div", {
                        children: [
                          n.jsx("dt", { children: "Practice areas" }),
                          n.jsx("dd", { children: e.areas.join(", ") }),
                        ],
                      }),
                      n.jsxs("div", {
                        children: [
                          n.jsx("dt", { children: "Experience" }),
                          n.jsxs("dd", { children: [e.years, " years"] }),
                        ],
                      }),
                      n.jsxs("div", {
                        children: [
                          n.jsx("dt", { children: "Languages" }),
                          n.jsx("dd", { children: e.languages.join(", ") }),
                        ],
                      }),
                      n.jsxs("div", {
                        children: [n.jsx("dt", { children: "City" }), n.jsx("dd", { children: e.city })],
                      }),
                    ],
                  }),
                ],
              }),
              n.jsxs(Q, {
                as: "section",
                "aria-labelledby": "vc-gallery-h",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", {
                      id: "vc-gallery-h",
                      children: "What clients see once you’re verified",
                    }),
                    sub: "Illustrations of LegalConnect verification materials. Sample content, not real credentials.",
                  }),
                  n.jsx("ul", {
                    className: "lp-vgallery",
                    children: [
                      ["trust-1.jpg", "LegalConnect verified lawyer certificate", "Verified certificate"],
                      ["trust-2.jpg", "LegalConnect lawyer ID badge", "Digital ID badge"],
                      ["trust-3.jpg", "Stack of LegalConnect lawyer profile cards", "Profile card in search"],
                      ["trust-4.jpg", "Gold LegalConnect seal on marble", "Verified seal"],
                    ].map(([file, alt, caption]) =>
                      n.jsxs(
                        "li",
                        {
                          children: [
                            n.jsx("img", { src: IMG[file], alt, loading: "lazy", width: 509, height: 467 }),
                            n.jsx("span", { children: caption }),
                          ],
                        },
                        file,
                      ),
                    ),
                  }),
                ],
              }),
            ],
          }),
          n.jsx("aside", {
            className: "lp-vside",
            "aria-label": "Next steps",
            children: n.jsxs(Q, {
              as: "section",
              className: "lp-sticky",
              "aria-labelledby": "vc-next-h",
              children: [
                n.jsx(z, { title: n.jsx("span", { id: "vc-next-h", children: "What happens next" }) }),
                n.jsx(av, { status: i, missing: c, barOk: cr(l), rejected: u }),
                r &&
                  n.jsxs(n.Fragment, {
                    children: [
                      n.jsx(b, {
                        className: "lp-block lp-mt",
                        size: "lg",
                        disabled: !d,
                        onClick: () => m(!0),
                        children: i === "rejected" ? "Resubmit for review" : "Submit for review",
                      }),
                      !d &&
                        n.jsx("p", {
                          className: "lp-hint lp-mt-s",
                          children: "Complete every missing item to enable submission.",
                        }),
                    ],
                  }),
              ],
            }),
          }),
        ],
      }),
      n.jsx(mt, {
        open: h,
        onClose: () => m(!1),
        onConfirm: N,
        loading: S,
        title: "Submit for review?",
        confirmLabel: "Submit",
        children: n.jsx("p", {
          children:
            "Your documents and Bar details will be locked while they are in review. In the real product this typically takes 2–3 business days; here the status simply changes to “In review”.",
        }),
      }),
    ],
  });
}
function rv({ status: e, ver: t, progress: s }) {
  const l = {
    approved: [
      "success",
      "You are verified (demo)",
      `Approved on ${t.reviewedAt ? Gn(t.reviewedAt) : "—"}. You can accept consultation requests.`,
    ],
    pending: [
      "warning",
      "Your credentials are in review",
      `Submitted ${t.submittedAt ? Gn(t.submittedAt) : ""}. Typical turnaround is 2–3 business days. You will be notified when there is an update.`,
    ],
    rejected: [
      "danger",
      "Action needed — a document was not accepted",
      t.reviewNote || "Replace the highlighted document and resubmit.",
    ],
    incomplete: [
      "neutral",
      "Verification not submitted yet",
      "Complete the checklist below and submit it to start the review. Consultation requests are paused until you are verified.",
    ],
  }[e];
  return n.jsxs(Q, {
    as: "section",
    className: `lp-vstatus is-${l[0]}`,
    "aria-label": "Verification status",
    children: [
      n.jsx("span", {
        className: `lp-vstatus-ic is-${l[0]}`,
        children: n.jsx(L, {
          name:
            e === "approved"
              ? "shieldCheck"
              : e === "rejected"
                ? "alert"
                : e === "pending"
                  ? "clock"
                  : "shield",
          size: 26,
        }),
      }),
      n.jsxs("div", {
        children: [
          n.jsx(H, {
            tone: l[0],
            dot: !0,
            children: {
              approved: "Approved",
              pending: "In review",
              rejected: "Rejected",
              incomplete: "Not submitted",
            }[e],
          }),
          n.jsx("h2", { className: "lp-h3", children: l[1] }),
          n.jsx("p", { children: l[2] }),
        ],
      }),
      n.jsxs("div", {
        className: "lp-vstatus-p",
        children: [n.jsx("strong", { children: s }), n.jsx("small", { children: "checklist items ready" })],
      }),
    ],
  });
}
function av({ status: e, missing: t, barOk: s, rejected: l }) {
  if (e === "approved")
    return n.jsxs("ul", {
      className: "lp-next-list",
      children: [
        n.jsxs("li", { children: [n.jsx(L, { name: "check", size: 16 }), " No action needed."] }),
        n.jsxs("li", {
          children: [
            n.jsx(L, { name: "info", size: 16 }),
            " Keep your documents current. Document changes after approval will require contacting support (arrives with Settings, Phase 5).",
          ],
        }),
      ],
    });
  if (e === "pending")
    return n.jsxs("ul", {
      className: "lp-next-list",
      children: [
        n.jsxs("li", {
          children: [
            n.jsx(L, { name: "clock", size: 16 }),
            " No action needed — your submission is locked while it is reviewed.",
          ],
        }),
        n.jsxs("li", {
          children: [
            n.jsx(L, { name: "bell", size: 16 }),
            " You will get a notification when the review finishes.",
          ],
        }),
      ],
    });
  const i = [];
  return (
    l.forEach((r) => i.push(`Replace “${Pe[r.kind].label}”: ${r.note}`)),
    t.forEach((r) => i.push(`Upload your ${Pe[r].label.toLowerCase()}.`)),
    s || i.push("Complete your Bar registration details."),
    i.length
      ? n.jsx("ul", {
          className: "lp-next-list",
          children: i.map((r) =>
            n.jsxs("li", { children: [n.jsx(L, { name: "alert", size: 16 }), " ", r] }, r),
          ),
        })
      : n.jsx("ul", {
          className: "lp-next-list",
          children: n.jsxs("li", {
            children: [
              n.jsx(L, { name: "check", size: 16 }),
              " Everything is ready. Submit for review when you are happy with the details.",
            ],
          }),
        })
  );
}
function ov({ ver: e, editable: t, lawyerId: s }) {
  const { dispatch: l } = ne(),
    i = xe(),
    [r, a] = w.useState(!1),
    [o, c] = w.useState(e.bar),
    [u, d] = w.useState({}),
    h = () => {
      (c(e.bar), d({}), a(!0));
    },
    m = (v) => {
      v.preventDefault();
      const N = { number: Bh(o.number), council: Bt(o.council, "State Bar Council"), year: Wh(o.year) };
      (d(N),
        !Object.values(N).some(Boolean) &&
          (l({
            type: "BAR_UPDATE",
            lawyerId: s,
            bar: { number: o.number.trim(), council: o.council, year: String(o.year) },
          }),
          a(!1),
          i({ title: "Bar details saved" })));
    },
    S = !cr(e);
  return n.jsxs(Q, {
    as: "section",
    id: "vc-bar",
    "aria-labelledby": "vc-bar-h",
    children: [
      n.jsx(z, {
        title: n.jsx("span", { id: "vc-bar-h", children: "Bar registration details" }),
        sub: "Must match your enrolment certificate exactly.",
        action:
          t && !r
            ? n.jsx(b, {
                variant: "outline",
                size: "sm",
                icon: "edit",
                onClick: h,
                children: S ? "Add details" : "Edit",
              })
            : null,
      }),
      r
        ? n.jsxs("form", {
            className: "lp-form",
            noValidate: !0,
            onSubmit: m,
            children: [
              n.jsxs("div", {
                className: "lp-grid2",
                children: [
                  n.jsx(W, {
                    id: "bar-n",
                    label: "Bar enrolment number",
                    required: !0,
                    value: o.number,
                    onChange: (v) => {
                      (c({ ...o, number: v.target.value }), d({ ...u, number: "" }));
                    },
                    error: u.number,
                    placeholder: "e.g. D/4821/2014",
                  }),
                  n.jsx(Ce, {
                    id: "bar-c",
                    label: "State Bar Council",
                    required: !0,
                    options: em,
                    value: o.council,
                    onChange: (v) => {
                      (c({ ...o, council: v.target.value }), d({ ...u, council: "" }));
                    },
                    error: u.council,
                  }),
                  n.jsx(W, {
                    id: "bar-y",
                    type: "number",
                    label: "Year of enrolment",
                    required: !0,
                    value: o.year,
                    onChange: (v) => {
                      (c({ ...o, year: v.target.value }), d({ ...u, year: "" }));
                    },
                    error: u.year,
                  }),
                ],
              }),
              n.jsxs("div", {
                className: "lp-actions",
                children: [
                  n.jsx(b, { type: "submit", children: "Save details" }),
                  n.jsx(b, { variant: "ghost", onClick: () => a(!1), children: "Cancel" }),
                ],
              }),
            ],
          })
        : S
          ? n.jsx("p", { className: "lp-muted", children: "No Bar details on file yet." })
          : n.jsxs("dl", {
              className: "lp-dl",
              children: [
                n.jsxs("div", {
                  children: [
                    n.jsx("dt", { children: "Enrolment number" }),
                    n.jsx("dd", { children: e.bar.number }),
                  ],
                }),
                n.jsxs("div", {
                  children: [
                    n.jsx("dt", { children: "State Bar Council" }),
                    n.jsx("dd", { children: e.bar.council }),
                  ],
                }),
                n.jsxs("div", {
                  children: [
                    n.jsx("dt", { children: "Year of enrolment" }),
                    n.jsx("dd", { children: e.bar.year }),
                  ],
                }),
              ],
            }),
    ],
  });
}
