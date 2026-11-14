import w from "react";
import * as n from "react/jsx-runtime";
import { Link as P } from "react-router-dom";
import { Bt, Gn, Hh, J, Kr, bl, kn } from "../lib/core.js";
import { Ce, Et, Ft, H, L, Q, W, b, lt, rt, vs, xe, z } from "../components/ui.js";
import { Dt, Ll, Pe, _n, bc, lr, rr } from "../lib/domain.js";
import { Tl, ne } from "../state/store.js";
import { Mt, bt } from "../components/section.js";
import { Iv, Rv, hi, xd, yd } from "./messages.js";

/* app/views/profile.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
export function ProfileView() {
  const { lawyer: e, dispatch: t } = ne(),
    s = xe(),
    l = e.verification,
    i = e.avatarData || e.avatar,
    r = (x, C) => {
      (t({ type: "LAWYER_PATCH", lawyerId: e.id, patch: x, activity: `You updated your profile — ${C}` }),
        s({ title: "Profile updated", message: C }));
    },
    [a, o] = w.useState(""),
    c = w.useRef(null),
    u = Mt(
      { name: e.name, title: e.title, headline: e.headline, photo: i },
      (x) =>
        Object.fromEntries(
          Object.entries({
            name: Kr(x.name),
            title: Bt(x.title, "Professional title"),
            headline: x.headline.length > 80 ? "Keep the headline to 80 characters or fewer." : "",
          }).filter(([, C]) => C),
        ),
      (x) =>
        r(
          {
            name: x.name.trim(),
            title: x.title,
            headline: x.headline.trim(),
            ...(x.photo === i ? {} : x.photo === "aarav" ? {} : { avatarData: x.photo, avatar: null }),
          },
          "name, title and photo",
        ),
    ),
    d = async (x) => {
      if (x)
        try {
          const C = await Rv(x);
          (u.set("photo", C), o(""));
        } catch (C) {
          o(C.message);
        }
    },
    h = Mt(
      { bio: e.bio },
      (x) => {
        const C = x.bio.trim().length;
        return C < 50
          ? { bio: `Write at least 50 characters (you have ${C}).` }
          : C > 800
            ? { bio: "Keep the biography to 800 characters or fewer." }
            : {};
      },
      (x) => r({ bio: x.bio.trim() }, "biography"),
    ),
    m = Mt(
      {
        primaryArea: e.primaryArea,
        otherAreas: e.areas.filter((x) => x !== e.primaryArea),
        years: String(e.years),
        languages: e.languages,
        quals: e.qualifications,
      },
      (x) => {
        const C = {
          primaryArea: Bt(x.primaryArea, "Primary practice area"),
          years: Hh(x.years, l.bar.year),
          languages: x.languages.length ? "" : "Select at least one language.",
        };
        return (
          x.quals.length === 0 && (C.quals = "Add at least one qualification."),
          x.quals.forEach((j, R) => {
            (j.degree.trim().length < 2 && (C[`q${R}d`] = "Enter the degree."),
              j.institution.trim().length < 2 && (C[`q${R}i`] = "Enter the institution."));
            const g = Number(j.year);
            (!Number.isInteger(g) || g < 1950 || g > new Date().getFullYear()) &&
              (C[`q${R}y`] = `Year between 1950 and ${new Date().getFullYear()}.`);
          }),
          Object.fromEntries(Object.entries(C).filter(([, j]) => j))
        );
      },
      (x) =>
        r(
          {
            primaryArea: x.primaryArea,
            areas: [x.primaryArea, ...x.otherAreas.filter((C) => C !== x.primaryArea)],
            years: Number(x.years),
            languages: x.languages,
            qualifications: x.quals.map((C) => ({
              ...C,
              degree: C.degree.trim(),
              institution: C.institution.trim(),
            })),
          },
          "practice areas, experience and qualifications",
        ),
    ),
    S = (x, C, j) => {
      (m.setDraft((R) => ({ ...R, quals: R.quals.map((g, M) => (M === x ? { ...g, [C]: j } : g)) })),
        m.setErr((R) => ({ ...R, [`q${x}${C[0]}`]: "", quals: "" })));
    },
    v = Mt(
      Object.fromEntries(Object.entries(e.consult).map(([x, C]) => [x, { on: C.on, fee: String(C.fee) }])),
      (x) => {
        const C = {};
        return (
          Object.values(x).some((j) => j.on) || (C.types = "Offer at least one consultation type."),
          Object.entries(x).forEach(([j, R]) => {
            if (R.on) {
              const g = Number(R.fee);
              (!Number.isInteger(g) || g < hi || g > yd) &&
                (C[`fee_${j}`] = `Enter a whole-rupee fee between ${J(hi)} and ${J(yd)}.`);
            }
          }),
          C
        );
      },
      (x) =>
        r(
          {
            consult: Object.fromEntries(
              Object.entries(x).map(([C, j]) => [C, { on: j.on, fee: Number(j.fee) }]),
            ),
          },
          "consultation types and fees",
        ),
    ),
    N = (x, C, j) => {
      (v.setDraft((R) => ({ ...R, [x]: { ...R[x], [C]: j } })),
        v.setErr((R) => ({ ...R, [`fee_${x}`]: "", types: "" })));
    },
    A = Mt(
      { address: e.office.address, city: e.office.city, serviceCities: e.office.serviceCities },
      (x) =>
        Object.fromEntries(
          Object.entries({
            city: Bt(x.city, "City"),
            address:
              e.consult.in_person.on && x.address.trim().length < 10
                ? "In-person consultations need an office address (at least 10 characters)."
                : "",
          }).filter(([, C]) => C),
        ),
      (x) =>
        r(
          {
            city: x.city,
            office: { address: x.address.trim(), city: x.city, serviceCities: x.serviceCities },
          },
          "office and service location",
        ),
    ),
    f = e.availability,
    p = w.useMemo(
      () => [
        ["Profile photo", !!i, "prof-ident"],
        ["Biography (50+ characters)", e.bio.trim().length >= 50, "prof-about"],
        ["At least one qualification", e.qualifications.length > 0, "prof-exp"],
        [
          "A consultation type with a fee",
          Object.values(e.consult).some((x) => x.on && x.fee >= hi),
          "prof-cons",
        ],
        [
          "Office location",
          !!e.office.city && (!e.consult.in_person.on || !!e.office.address.trim()),
          "prof-loc",
        ],
        ["Weekly availability set", Object.values(f.weekly).some((x) => x.length), null],
        ["Credentials verified", l.status === "approved", null],
      ],
      [e, i, f, l.status],
    ),
    y = Math.round((p.filter((x) => x[1]).length / p.length) * 100),
    [k, E] = Tl[l.status];
  return n.jsxs(n.Fragment, {
    children: [
      n.jsx(Ft, {
        eyebrow: "Account",
        title: "Profile",
        children:
          "Edit each section separately. Saved changes appear immediately in the preview, your top bar and your dashboard.",
      }),
      n.jsxs("div", {
        className: "lp-vgrid",
        children: [
          n.jsxs("div", {
            className: "lp-vmain",
            children: [
              n.jsxs(bt, {
                id: "prof-ident",
                title: "Photo & identity",
                s: u,
                view: n.jsxs("div", {
                  className: "lp-ident",
                  children: [
                    n.jsx(lt, { name: e.name, src: i, size: 84 }),
                    n.jsxs("div", {
                      children: [
                        n.jsx("h3", { className: "lp-h3", children: e.name }),
                        n.jsx("p", { children: e.title }),
                        e.headline
                          ? n.jsx("p", { className: "lp-muted", children: e.headline })
                          : n.jsx("p", { className: "lp-muted", children: "No headline yet." }),
                      ],
                    }),
                  ],
                }),
                children: [
                  n.jsxs("div", {
                    className: "lp-photo",
                    children: [
                      n.jsx(lt, { name: u.draft.name || e.name, src: u.draft.photo, size: 84 }),
                      n.jsxs("div", {
                        className: "lp-photo-a",
                        children: [
                          n.jsx("input", {
                            ref: c,
                            type: "file",
                            className: "lp-sr",
                            accept: "image/jpeg,image/png,image/webp",
                            "aria-label": "Choose a profile photo",
                            onChange: (x) => {
                              var C;
                              (d((C = x.target.files) == null ? void 0 : C[0]), (x.target.value = ""));
                            },
                          }),
                          n.jsx(b, {
                            variant: "outline",
                            size: "sm",
                            icon: "upload",
                            onClick: () => {
                              var x;
                              return (x = c.current) == null ? void 0 : x.click();
                            },
                            children: u.draft.photo ? "Change photo" : "Upload photo",
                          }),
                          u.draft.photo &&
                            n.jsx(b, {
                              variant: "ghost",
                              size: "sm",
                              icon: "trash",
                              onClick: () => {
                                (u.set("photo", null), o(""));
                              },
                              children: "Remove",
                            }),
                          n.jsx("p", {
                            className: "lp-hint",
                            children:
                              "JPG, PNG or WebP, at least 200×200 px, up to 2 MB. It is cropped to a square and resized in your browser; nothing is uploaded.",
                          }),
                          a &&
                            n.jsxs("p", {
                              className: "lp-err",
                              role: "alert",
                              children: [n.jsx(L, { name: "alert", size: 14 }), " ", a],
                            }),
                        ],
                      }),
                    ],
                  }),
                  n.jsx(W, {
                    id: "pi-name",
                    label: "Full name",
                    required: !0,
                    value: u.draft.name,
                    onChange: (x) => u.set("name", x.target.value),
                    error: u.err.name,
                  }),
                  n.jsx(Ce, {
                    id: "pi-title",
                    label: "Professional title",
                    required: !0,
                    options: Iv,
                    value: u.draft.title,
                    onChange: (x) => u.set("title", x.target.value),
                    error: u.err.title,
                  }),
                  n.jsx(W, {
                    id: "pi-head",
                    label: "Headline (optional)",
                    value: u.draft.headline,
                    onChange: (x) => u.set("headline", x.target.value),
                    error: u.err.headline,
                    hint: `${u.draft.headline.length}/80 · a one-line summary of your practice`,
                  }),
                ],
              }),
              n.jsx(bt, {
                id: "prof-about",
                title: "About you",
                sub: "Shown on your public profile.",
                s: h,
                view: e.bio
                  ? n.jsx("p", { className: "lp-bio", children: e.bio })
                  : n.jsx("p", {
                      className: "lp-muted",
                      children: "No biography yet. A short, clear biography helps clients choose you.",
                    }),
                children: n.jsx(Et, {
                  id: "pa-bio",
                  label: "Biography",
                  required: !0,
                  rows: 6,
                  value: h.draft.bio,
                  onChange: (x) => h.set("bio", x.target.value),
                  error: h.err.bio,
                  hint: `${h.draft.bio.trim().length}/800 · avoid guarantees of outcomes and superlatives`,
                }),
              }),
              n.jsxs(bt, {
                id: "prof-exp",
                title: "Practice, experience & qualifications",
                s: m,
                view: n.jsxs("dl", {
                  className: "lp-dl",
                  children: [
                    n.jsxs("div", {
                      children: [
                        n.jsx("dt", { children: "Practice areas" }),
                        n.jsxs("dd", {
                          children: [
                            e.areas.join(", "),
                            " ",
                            n.jsxs("small", { children: ["(primary: ", e.primaryArea, ")"] }),
                          ],
                        }),
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
                      className: "lp-span",
                      children: [
                        n.jsx("dt", { children: "Qualifications" }),
                        n.jsx("dd", {
                          children: e.qualifications.length
                            ? n.jsx("ul", {
                                className: "lp-quals",
                                children: e.qualifications.map((x) =>
                                  n.jsxs(
                                    "li",
                                    {
                                      children: [
                                        n.jsx("strong", { children: x.degree }),
                                        ", ",
                                        x.institution,
                                        " ",
                                        n.jsxs("small", { children: ["(", x.year, ")"] }),
                                      ],
                                    },
                                    x.id,
                                  ),
                                ),
                              })
                            : n.jsx("span", { className: "lp-muted", children: "None added yet." }),
                        }),
                      ],
                    }),
                  ],
                }),
                children: [
                  n.jsxs("div", {
                    className: "lp-grid2",
                    children: [
                      n.jsx(Ce, {
                        id: "pe-area",
                        label: "Primary practice area",
                        required: !0,
                        options: Ll,
                        value: m.draft.primaryArea,
                        onChange: (x) => m.set("primaryArea", x.target.value),
                        error: m.err.primaryArea,
                      }),
                      n.jsx(W, {
                        id: "pe-years",
                        type: "number",
                        inputMode: "numeric",
                        label: "Years of experience",
                        required: !0,
                        value: m.draft.years,
                        onChange: (x) => m.set("years", x.target.value),
                        error: m.err.years,
                        hint: `Bar enrolment: ${l.bar.year || "not set"}`,
                      }),
                    ],
                  }),
                  n.jsx(vs, {
                    label: "Additional practice areas",
                    options: Ll.filter((x) => x !== m.draft.primaryArea),
                    value: m.draft.otherAreas,
                    onChange: (x) => m.set("otherAreas", x),
                    max: 3,
                    hint: "Up to 3.",
                  }),
                  n.jsx(vs, {
                    label: "Consultation languages",
                    required: !0,
                    options: bc,
                    value: m.draft.languages,
                    onChange: (x) => m.set("languages", x),
                    error: m.err.languages,
                  }),
                  n.jsxs("fieldset", {
                    className: "lp-fieldset",
                    children: [
                      n.jsxs("legend", {
                        className: "lp-label",
                        children: [
                          "Qualifications ",
                          n.jsx("span", { className: "lp-req", "aria-hidden": "true", children: "*" }),
                        ],
                      }),
                      n.jsx("div", {
                        className: "lp-qedit",
                        children: m.draft.quals.map((x, C) =>
                          n.jsxs(
                            "div",
                            {
                              className: "lp-qrow",
                              children: [
                                n.jsx(W, {
                                  id: `pq-d-${C}`,
                                  label: "Degree",
                                  value: x.degree,
                                  onChange: (j) => S(C, "degree", j.target.value),
                                  error: m.err[`q${C}d`],
                                  placeholder: "LL.B.",
                                }),
                                n.jsx(W, {
                                  id: `pq-i-${C}`,
                                  label: "Institution",
                                  value: x.institution,
                                  onChange: (j) => S(C, "institution", j.target.value),
                                  error: m.err[`q${C}i`],
                                }),
                                n.jsx(W, {
                                  id: `pq-y-${C}`,
                                  type: "number",
                                  inputMode: "numeric",
                                  label: "Year",
                                  value: x.year,
                                  onChange: (j) => S(C, "year", j.target.value),
                                  error: m.err[`q${C}y`],
                                }),
                                n.jsx("button", {
                                  type: "button",
                                  className: "lp-icon-btn lp-qdel",
                                  "aria-label": `Remove qualification ${C + 1}`,
                                  onClick: () =>
                                    m.setDraft((j) => ({ ...j, quals: j.quals.filter((R, g) => g !== C) })),
                                  children: n.jsx(L, { name: "trash", size: 16 }),
                                }),
                              ],
                            },
                            x.id,
                          ),
                        ),
                      }),
                      m.err.quals &&
                        n.jsxs("p", {
                          className: "lp-err",
                          role: "alert",
                          children: [n.jsx(L, { name: "alert", size: 14 }), " ", m.err.quals],
                        }),
                      n.jsx(b, {
                        variant: "outline",
                        size: "sm",
                        icon: "plus",
                        onClick: () =>
                          m.setDraft((x) => ({
                            ...x,
                            quals: [
                              ...x.quals,
                              { id: `q_${Date.now().toString(36)}`, degree: "", institution: "", year: "" },
                            ],
                          })),
                        children: "Add qualification",
                      }),
                    ],
                  }),
                ],
              }),
              n.jsxs(bt, {
                id: "prof-cons",
                title: "Consultation types & fees",
                sub: `Fees are per consultation. Platform fee ${Dt * 100}% (illustrative).`,
                s: v,
                view: n.jsx("ul", {
                  className: "lp-list",
                  children: Object.entries(e.consult).map(([x, C]) =>
                    n.jsxs(
                      "li",
                      {
                        className: "lp-cr is-flat",
                        children: [
                          n.jsx("span", {
                            className: "lp-cr-ic",
                            children: n.jsx(L, { name: xd[x], size: 18 }),
                          }),
                          n.jsxs("div", {
                            className: "lp-cr-main",
                            children: [
                              n.jsx("strong", { children: bl[x] }),
                              n.jsx("p", {
                                children: C.on
                                  ? `${J(C.fee)} · you receive ${J(C.fee * (1 - Dt))}`
                                  : "Not offered",
                              }),
                            ],
                          }),
                          n.jsx("div", {
                            className: "lp-cr-side",
                            children: C.on
                              ? n.jsx(H, { tone: "success", children: "Offered" })
                              : n.jsx(H, { children: "Off" }),
                          }),
                        ],
                      },
                      x,
                    ),
                  ),
                }),
                children: [
                  v.err.types &&
                    n.jsxs("p", {
                      className: "lp-err",
                      role: "alert",
                      children: [n.jsx(L, { name: "alert", size: 14 }), " ", v.err.types],
                    }),
                  n.jsx("div", {
                    className: "lp-feerows",
                    children: Object.keys(v.draft).map((x) =>
                      n.jsxs(
                        "div",
                        {
                          className: "lp-feerow",
                          children: [
                            n.jsx(rt, {
                              id: `pc-on-${x}`,
                              label: bl[x],
                              checked: v.draft[x].on,
                              onChange: (C) => N(x, "on", C.target.checked),
                            }),
                            n.jsx(W, {
                              id: `pc-fee-${x}`,
                              type: "number",
                              inputMode: "numeric",
                              label: `Fee for ${kn[x].toLowerCase()} (₹)`,
                              prefix: "₹",
                              disabled: !v.draft[x].on,
                              value: v.draft[x].fee,
                              onChange: (C) => N(x, "fee", C.target.value),
                              error: v.err[`fee_${x}`],
                              hint:
                                v.draft[x].on && Number(v.draft[x].fee) >= hi
                                  ? `You receive ${J(Number(v.draft[x].fee) * (1 - Dt))} after the illustrative fee`
                                  : void 0,
                            }),
                          ],
                        },
                        x,
                      ),
                    ),
                  }),
                ],
              }),
              n.jsxs(bt, {
                id: "prof-loc",
                title: "Office & service location",
                s: A,
                view: n.jsxs("dl", {
                  className: "lp-dl",
                  children: [
                    n.jsxs("div", {
                      children: [
                        n.jsx("dt", { children: "City" }),
                        n.jsx("dd", { children: e.office.city || "—" }),
                      ],
                    }),
                    n.jsxs("div", {
                      children: [
                        n.jsx("dt", { children: "Also serves" }),
                        n.jsx("dd", {
                          children: e.office.serviceCities.length ? e.office.serviceCities.join(", ") : "—",
                        }),
                      ],
                    }),
                    n.jsxs("div", {
                      className: "lp-span",
                      children: [
                        n.jsx("dt", { children: "Office address" }),
                        n.jsx("dd", { children: e.office.address || "—" }),
                      ],
                    }),
                  ],
                }),
                children: [
                  n.jsx(Ce, {
                    id: "pl-city",
                    label: "Primary city",
                    required: !0,
                    options: rr,
                    value: A.draft.city,
                    onChange: (x) => A.set("city", x.target.value),
                    error: A.err.city,
                  }),
                  n.jsx(Et, {
                    id: "pl-addr",
                    label: `Office address${e.consult.in_person.on ? "" : " (optional)"}`,
                    required: e.consult.in_person.on,
                    rows: 3,
                    value: A.draft.address,
                    onChange: (x) => A.set("address", x.target.value),
                    error: A.err.address,
                  }),
                  n.jsx(vs, {
                    label: "Other cities you serve",
                    options: rr.filter((x) => x !== A.draft.city),
                    value: A.draft.serviceCities,
                    onChange: (x) => A.set("serviceCities", x),
                    max: 4,
                    hint: "Optional — up to 4.",
                  }),
                ],
              }),
              n.jsxs(Q, {
                as: "section",
                "aria-labelledby": "prof-bar-h",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "prof-bar-h", children: "Bar registration & documents" }),
                    sub: "Managed in the Verification centre so changes are re-checked.",
                    action: n.jsx(P, {
                      className: "lp-btn lp-btn-outline lp-btn-sm",
                      to: "/verification",
                      children: n.jsx("span", { children: "Open verification" }),
                    }),
                  }),
                  n.jsxs("dl", {
                    className: "lp-dl",
                    children: [
                      n.jsxs("div", {
                        children: [
                          n.jsx("dt", { children: "Enrolment number" }),
                          n.jsx("dd", { children: l.bar.number || "—" }),
                        ],
                      }),
                      n.jsxs("div", {
                        children: [
                          n.jsx("dt", { children: "State Bar Council" }),
                          n.jsx("dd", { children: l.bar.council || "—" }),
                        ],
                      }),
                      n.jsxs("div", {
                        children: [
                          n.jsx("dt", { children: "Enrolment year" }),
                          n.jsx("dd", { children: l.bar.year || "—" }),
                        ],
                      }),
                    ],
                  }),
                  n.jsx("ul", {
                    className: "lp-docsum",
                    children: Object.entries(Pe).map(([x, C]) => {
                      const j = l.docs.find((R) => R.kind === x);
                      return n.jsxs(
                        "li",
                        {
                          children: [
                            n.jsx(L, { name: "file", size: 16 }),
                            n.jsx("span", { children: C.label }),
                            j
                              ? n.jsxs(H, {
                                  tone:
                                    j.status === "verified"
                                      ? "success"
                                      : j.status === "rejected"
                                        ? "danger"
                                        : "warning",
                                  children: [
                                    j.status === "verified"
                                      ? "Verified"
                                      : j.status === "rejected"
                                        ? "Needs attention"
                                        : j.status === "in_review"
                                          ? "In review"
                                          : "Uploaded",
                                    " · ",
                                    Gn(j.uploadedAt),
                                  ],
                                })
                              : n.jsx(H, {
                                  tone: C.required ? "danger" : "neutral",
                                  children: C.required ? "Missing" : "Not provided",
                                }),
                          ],
                        },
                        x,
                      );
                    }),
                  }),
                ],
              }),
              n.jsxs(Q, {
                as: "section",
                "aria-labelledby": "prof-av-h",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "prof-av-h", children: "Availability" }),
                    sub: "Weekly hours, blocked dates and consultation length.",
                    action: n.jsx(P, {
                      className: "lp-btn lp-btn-outline lp-btn-sm",
                      to: "/availability",
                      children: n.jsx("span", { children: "Manage availability" }),
                    }),
                  }),
                  n.jsx("ul", {
                    className: "lp-hoursum",
                    children: _n.map(([x, C]) =>
                      n.jsxs(
                        "li",
                        {
                          children: [
                            n.jsx("span", { children: C.slice(0, 3) }),
                            n.jsx("strong", { children: lr(f.weekly[x]) }),
                          ],
                        },
                        x,
                      ),
                    ),
                  }),
                  n.jsxs("p", {
                    className: "lp-hint",
                    children: [f.duration, "-minute consultations with a ", f.buffer, "-minute buffer · IST"],
                  }),
                ],
              }),
            ],
          }),
          n.jsxs("aside", {
            className: "lp-vside",
            children: [
              n.jsxs(Q, {
                as: "section",
                "aria-labelledby": "prof-comp-h",
                className: "lp-sticky",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "prof-comp-h", children: "Profile completeness" }),
                    sub: `${y}% complete`,
                  }),
                  n.jsx("div", {
                    className: "lp-prog",
                    role: "progressbar",
                    "aria-valuenow": y,
                    "aria-valuemin": 0,
                    "aria-valuemax": 100,
                    "aria-label": "Profile completeness",
                    children: n.jsx("i", { style: { width: `${y}%` } }),
                  }),
                  n.jsx("ul", {
                    className: "lp-compl",
                    children: p.map(([x, C, j]) =>
                      n.jsxs(
                        "li",
                        {
                          className: C ? "is-ok" : "",
                          children: [
                            n.jsx(L, { name: C ? "check" : "alert", size: 15 }),
                            C || !j
                              ? n.jsx("span", { children: x })
                              : n.jsx("a", { href: `#${j}`, children: x }),
                          ],
                        },
                        x,
                      ),
                    ),
                  }),
                ],
              }),
              n.jsxs(Q, {
                as: "section",
                "aria-labelledby": "prof-prev-h",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "prof-prev-h", children: "How clients will see you" }),
                    sub: "Preview of your saved profile",
                  }),
                  n.jsxs("div", {
                    className: "lp-prev",
                    children: [
                      n.jsxs("div", {
                        className: "lp-prev-top",
                        children: [
                          n.jsx(lt, { name: e.name, src: i, size: 64 }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("strong", { children: e.name }),
                              n.jsxs("span", {
                                children: [
                                  e.title,
                                  e.settings.privacy.showCity ? ` · ${e.office.city || e.city}` : "",
                                ],
                              }),
                              n.jsx(H, {
                                tone: k,
                                dot: !0,
                                children: l.status === "approved" ? "Verified (demo)" : E,
                              }),
                              !e.settings.privacy.listed &&
                                n.jsx(H, { tone: "warning", children: "Hidden from directory" }),
                            ],
                          }),
                        ],
                      }),
                      e.headline && n.jsx("p", { className: "lp-prev-head", children: e.headline }),
                      n.jsx("div", {
                        className: "lp-prev-tags",
                        children: e.areas.map((x) => n.jsx(H, { tone: "info", children: x }, x)),
                      }),
                      n.jsxs("p", {
                        className: "lp-prev-meta",
                        children: [e.years, " years · ", e.languages.join(", ")],
                      }),
                      e.bio &&
                        n.jsx("p", {
                          className: "lp-prev-bio",
                          children: e.bio.length > 160 ? `${e.bio.slice(0, 157)}…` : e.bio,
                        }),
                      n.jsx("div", {
                        className: "lp-prev-cons",
                        children: Object.entries(e.consult)
                          .filter(([, x]) => x.on)
                          .map(([x, C]) =>
                            n.jsxs(
                              "span",
                              {
                                children: [n.jsx(L, { name: xd[x], size: 14 }), " ", kn[x], " · ", J(C.fee)],
                              },
                              x,
                            ),
                          ),
                      }),
                    ],
                  }),
                  n.jsx("p", {
                    className: "lp-hint",
                    children:
                      "Preview only — the public lawyer profile page isn’t built yet (see the public-site checklist). Ratings and rankings are intentionally not shown.",
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
export const mi = (e) => JSON.parse(JSON.stringify(e)),
  bv = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  Lv = {
    available: "Available",
    booked: "Booked",
    pending: "Request pending",
    notice: "Too soon / past",
    window: "Beyond booking window",
  },
  vd = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
