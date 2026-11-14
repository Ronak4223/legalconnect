import w from "react";
import * as n from "react/jsx-runtime";
import { Gh, Oh, Sc, _u, ay, iy, xo } from "../lib/core.js";

/* app/components/ui.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
export function L({ name: e, size: t = 18, className: s = "", title: l }) {
  return n.jsxs("svg", {
    className: `lp-ic ${s}`,
    width: t,
    height: t,
    viewBox: e === "scale" ? "0 0 32 32" : "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: e === "scale" ? 1.5 : 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": l ? void 0 : "true",
    role: l ? "img" : void 0,
    "aria-label": l,
    children: [
      n.jsx("path", { d: _u[e] || _u.info }),
      e === "scale" && n.jsx("circle", { cx: "16", cy: "4", r: "1.2" }),
    ],
  });
}
export function er({ light: e = !1, compact: t = !1 }) {
  return n.jsxs("span", {
    className: `lp-logo ${e ? "is-light" : ""}`,
    children: [
      n.jsx(L, { name: "scale", size: 28 }),
      !t &&
        n.jsxs("span", {
          className: "lp-logo-word",
          children: ["LEGALCONNECT ", n.jsx("small", { children: "Lawyer Portal" })],
        }),
    ],
  });
}
export function lt({ name: e, src: t, size: s = 40 }) {
  const l = t === "aarav" ? ay : t;
  return n.jsx("span", {
    className: "lp-avatar",
    style: { width: s, height: s, fontSize: s * 0.38 },
    "aria-hidden": "true",
    children: l ? n.jsx("img", { src: l, alt: "" }) : iy(e),
  });
}
export function b({
  variant: e = "primary",
  size: t = "md",
  loading: s = !1,
  icon: l,
  iconRight: i,
  children: r,
  className: a = "",
  disabled: o,
  ...c
}) {
  return n.jsxs("button", {
    type: "button",
    className: `lp-btn lp-btn-${e} lp-btn-${t} ${a}`,
    disabled: o || s,
    "aria-busy": s || void 0,
    ...c,
    children: [
      s
        ? n.jsx("span", { className: "lp-spin", "aria-hidden": "true" })
        : l && n.jsx(L, { name: l, size: 16 }),
      n.jsx("span", { children: r }),
      i && !s && n.jsx(L, { name: i, size: 16 }),
    ],
  });
}
function Dr({ id: e, label: t, hint: s, error: l, required: i, children: r, className: a = "" }) {
  return n.jsxs("div", {
    className: `lp-field ${l ? "has-error" : ""} ${a}`,
    children: [
      t &&
        n.jsxs("label", {
          htmlFor: e,
          className: "lp-label",
          children: [t, i && n.jsx("span", { className: "lp-req", "aria-hidden": "true", children: " *" })],
        }),
      r,
      s && !l && n.jsx("p", { id: `${e}-hint`, className: "lp-hint", children: s }),
      l &&
        n.jsxs("p", {
          id: `${e}-err`,
          className: "lp-err",
          role: "alert",
          children: [n.jsx(L, { name: "alert", size: 14 }), " ", l],
        }),
    ],
  });
}
const Fl = (e, t, s) => ({
  "aria-invalid": t ? !0 : void 0,
  "aria-describedby": t ? `${e}-err` : s ? `${e}-hint` : void 0,
});
export function W({ label: e, error: t, hint: s, required: l, className: i, prefix: r, ...a }) {
  const o = w.useId(),
    c = a.id || o;
  return n.jsx(Dr, {
    id: c,
    label: e,
    hint: s,
    error: t,
    required: l,
    className: i,
    children: n.jsxs("div", {
      className: "lp-input-wrap",
      children: [
        r && n.jsx("span", { className: "lp-input-prefix", children: r }),
        n.jsx("input", { id: c, className: "lp-input", "aria-required": l || void 0, ...Fl(c, t, s), ...a }),
      ],
    }),
  });
}
export function Wt({ label: e, error: t, hint: s, required: l, className: i, showMeter: r, value: a, ...o }) {
  const c = w.useId(),
    u = o.id || c,
    [d, h] = w.useState(!1);
  return n.jsxs(Dr, {
    id: u,
    label: e,
    hint: s,
    error: t,
    required: l,
    className: i,
    children: [
      n.jsxs("div", {
        className: "lp-input-wrap",
        children: [
          n.jsx("input", {
            id: u,
            className: "lp-input has-suffix",
            type: d ? "text" : "password",
            value: a,
            ...Fl(u, t, s),
            ...o,
          }),
          n.jsx("button", {
            type: "button",
            className: "lp-input-suffix",
            onClick: () => h((m) => !m),
            "aria-label": d ? "Hide password" : "Show password",
            "aria-pressed": d,
            children: n.jsx(L, { name: d ? "eyeOff" : "eye", size: 17 }),
          }),
        ],
      }),
      r && n.jsx(oy, { value: a }),
    ],
  });
}
function oy({ value: e = "" }) {
  const t = Gh(e),
    s = t <= 1 ? "weak" : t < 4 ? "fair" : "strong";
  return n.jsxs("div", {
    className: "lp-meter",
    "aria-live": "polite",
    children: [
      n.jsx("div", {
        className: `lp-meter-bar is-${s}`,
        role: "img",
        "aria-label": `Password strength: ${e ? s : "empty"}`,
        children: [0, 1, 2, 3].map((l) => n.jsx("i", { className: l < t ? "on" : "" }, l)),
      }),
      n.jsx("ul", {
        className: "lp-rules",
        children: Sc.map(([l, i]) =>
          n.jsxs(
            "li",
            {
              className: i(e) ? "ok" : "",
              children: [n.jsx(L, { name: i(e) ? "check" : "x", size: 12 }), " ", l],
            },
            l,
          ),
        ),
      }),
    ],
  });
}
export function Ce({
  label: e,
  error: t,
  hint: s,
  required: l,
  className: i,
  options: r,
  placeholder: a = "Select…",
  ...o
}) {
  const c = w.useId(),
    u = o.id || c;
  return n.jsx(Dr, {
    id: u,
    label: e,
    hint: s,
    error: t,
    required: l,
    className: i,
    children: n.jsxs("div", {
      className: "lp-input-wrap",
      children: [
        n.jsxs("select", {
          id: u,
          className: "lp-input lp-select",
          ...Fl(u, t, s),
          ...o,
          children: [
            n.jsx("option", { value: "", children: a }),
            r.map((d) =>
              typeof d == "string"
                ? n.jsx("option", { value: d, children: d }, d)
                : n.jsx("option", { value: d.value, children: d.label }, d.value),
            ),
          ],
        }),
        n.jsx(L, { name: "chevD", size: 16, className: "lp-select-ic" }),
      ],
    }),
  });
}
export function Et({ label: e, error: t, hint: s, required: l, className: i, ...r }) {
  const a = w.useId(),
    o = r.id || a;
  return n.jsx(Dr, {
    id: o,
    label: e,
    hint: s,
    error: t,
    required: l,
    className: i,
    children: n.jsx("textarea", { id: o, className: "lp-input lp-textarea", ...Fl(o, t, s), ...r }),
  });
}
export function rt({ label: e, error: t, id: s, children: l, ...i }) {
  const r = w.useId(),
    a = s || r;
  return n.jsxs("div", {
    className: `lp-check-wrap ${t ? "has-error" : ""}`,
    children: [
      n.jsxs("label", {
        className: "lp-check",
        htmlFor: a,
        children: [
          n.jsx("input", { id: a, type: "checkbox", ...Fl(a, t), ...i }),
          n.jsx("span", {
            className: "lp-check-box",
            "aria-hidden": "true",
            children: n.jsx(L, { name: "check", size: 12 }),
          }),
          n.jsx("span", { children: e || l }),
        ],
      }),
      t &&
        n.jsxs("p", {
          id: `${a}-err`,
          className: "lp-err",
          role: "alert",
          children: [n.jsx(L, { name: "alert", size: 14 }), " ", t],
        }),
    ],
  });
}
export function vs({ label: e, options: t, value: s, onChange: l, max: i, error: r, required: a, hint: o }) {
  const c = w.useId(),
    u = (d) => {
      s.includes(d) ? l(s.filter((h) => h !== d)) : (!i || s.length < i) && l([...s, d]);
    };
  return n.jsxs("fieldset", {
    className: `lp-field lp-chipset ${r ? "has-error" : ""}`,
    "aria-describedby": r ? `${c}-err` : void 0,
    children: [
      n.jsxs("legend", {
        className: "lp-label",
        children: [e, a && n.jsx("span", { className: "lp-req", "aria-hidden": "true", children: " *" })],
      }),
      n.jsx("div", {
        className: "lp-chips",
        children: t.map((d) =>
          n.jsxs(
            "button",
            {
              type: "button",
              className: `lp-chip ${s.includes(d) ? "is-on" : ""}`,
              "aria-pressed": s.includes(d),
              onClick: () => u(d),
              children: [s.includes(d) && n.jsx(L, { name: "check", size: 13 }), d],
            },
            d,
          ),
        ),
      }),
      o && !r && n.jsx("p", { className: "lp-hint", children: o }),
      r &&
        n.jsxs("p", {
          id: `${c}-err`,
          className: "lp-err",
          role: "alert",
          children: [n.jsx(L, { name: "alert", size: 14 }), " ", r],
        }),
    ],
  });
}
export function H({ tone: e = "neutral", dot: t = !1, children: s, className: l = "" }) {
  return n.jsxs("span", {
    className: `lp-badge lp-badge-${e} ${l}`,
    children: [t && n.jsx("i", { className: "lp-badge-dot", "aria-hidden": "true" }), s],
  });
}
export function Q({ as: e = "section", className: t = "", children: s, ...l }) {
  return n.jsx(e, { className: `lp-card ${t}`, ...l, children: s });
}
export function z({ title: e, action: t, sub: s, level: l = 2 }) {
  const i = `h${l}`;
  return n.jsxs("header", {
    className: "lp-card-h",
    children: [
      n.jsxs("div", {
        children: [
          n.jsx(i, { className: "lp-card-t", children: e }),
          s && n.jsx("p", { className: "lp-card-sub", children: s }),
        ],
      }),
      t,
    ],
  });
}
export function Lt({ label: e, value: t, hint: s, icon: l, tone: i = "teal", onClick: r, href: a }) {
  const o = n.jsxs(n.Fragment, {
    children: [
      n.jsx("span", { className: `lp-stat-ic is-${i}`, children: n.jsx(L, { name: l, size: 18 }) }),
      n.jsxs("span", {
        className: "lp-stat-body",
        children: [
          n.jsx("span", { className: "lp-stat-label", children: e }),
          n.jsx("span", { className: "lp-stat-value", children: t }),
          s && n.jsx("span", { className: "lp-stat-hint", children: s }),
        ],
      }),
    ],
  });
  return r || a
    ? n.jsx("button", { type: "button", className: "lp-stat is-link", onClick: r, children: o })
    : n.jsx("div", { className: "lp-stat", children: o });
}
export function O({ tone: e = "info", title: t, children: s, action: l, className: i = "" }) {
  const r = { info: "info", success: "check", warning: "alert", danger: "alert" }[e];
  return n.jsxs("div", {
    className: `lp-alert lp-alert-${e} ${i}`,
    role: e === "danger" || e === "warning" ? "alert" : "status",
    children: [
      n.jsx(L, { name: r, size: 18, className: "lp-alert-ic" }),
      n.jsxs("div", {
        className: "lp-alert-body",
        children: [t && n.jsx("strong", { children: t }), s && n.jsx("div", { children: s })],
      }),
      l,
    ],
  });
}
export function le({ icon: e = "file", title: t, children: s, action: l, level: i = 3 }) {
  const r = `h${i}`;
  return n.jsxs("div", {
    className: "lp-empty",
    children: [
      n.jsx("span", { className: "lp-empty-ic", children: n.jsx(L, { name: e, size: 26 }) }),
      n.jsx(r, { children: t }),
      s && n.jsx("p", { children: s }),
      l,
    ],
  });
}
export function Ec({ lines: e = 3, height: t = 14 }) {
  return n.jsx("div", {
    className: "lp-skel",
    role: "status",
    "aria-label": "Loading",
    children: Array.from({ length: e }, (s, l) =>
      n.jsx("i", { style: { height: t, width: `${100 - (l % 3) * 14}%` } }, l),
    ),
  });
}
export function Ft({ eyebrow: e, title: t, children: s, actions: l }) {
  return n.jsxs("header", {
    className: "lp-page-h",
    children: [
      n.jsxs("div", {
        children: [
          e && n.jsx("p", { className: "lp-eyebrow", children: e }),
          n.jsx("h1", { className: "lp-h1", children: t }),
          s && n.jsx("p", { className: "lp-lede", children: s }),
        ],
      }),
      l && n.jsx("div", { className: "lp-page-actions", children: l }),
    ],
  });
}
export function qs({ tabs: e, value: t, onChange: s, label: l = "Sections" }) {
  const i = w.useId(),
    r = (a) => {
      var u;
      const o = e.findIndex((d) => d.id === t),
        c =
          a.key === "ArrowRight"
            ? (o + 1) % e.length
            : a.key === "ArrowLeft"
              ? (o - 1 + e.length) % e.length
              : a.key === "Home"
                ? 0
                : a.key === "End"
                  ? e.length - 1
                  : -1;
      c >= 0 &&
        (a.preventDefault(),
        s(e[c].id),
        (u = document.getElementById(`${i}-${e[c].id}`)) == null || u.focus());
    };
  return n.jsx("div", {
    className: "lp-tabs",
    role: "tablist",
    "aria-label": l,
    onKeyDown: r,
    children: e.map((a) =>
      n.jsxs(
        "button",
        {
          id: `${i}-${a.id}`,
          type: "button",
          role: "tab",
          "aria-selected": t === a.id,
          tabIndex: t === a.id ? 0 : -1,
          className: `lp-tab ${t === a.id ? "is-on" : ""}`,
          onClick: () => s(a.id),
          children: [
            a.label,
            a.count != null && n.jsx("span", { className: "lp-tab-count", children: a.count }),
          ],
        },
        a.id,
      ),
    ),
  });
}
export function Ql({ page: e, pages: t, onChange: s, total: l, perPage: i }) {
  if (t <= 1) return null;
  const r = (e - 1) * i + 1,
    a = Math.min(e * i, l);
  return n.jsxs("nav", {
    className: "lp-pager",
    "aria-label": "Pagination",
    children: [
      n.jsxs("span", { className: "lp-pager-info", children: ["Showing ", r, "–", a, " of ", l] }),
      n.jsxs("div", {
        className: "lp-pager-btns",
        children: [
          n.jsx("button", {
            type: "button",
            className: "lp-pg",
            onClick: () => s(e - 1),
            disabled: e <= 1,
            "aria-label": "Previous page",
            children: n.jsx(L, { name: "chevL", size: 15 }),
          }),
          Array.from({ length: t }, (o, c) => c + 1).map((o) =>
            n.jsx(
              "button",
              {
                type: "button",
                className: "lp-pg",
                "aria-current": o === e ? "page" : void 0,
                "aria-label": `Page ${o}`,
                onClick: () => s(o),
                children: o,
              },
              o,
            ),
          ),
          n.jsx("button", {
            type: "button",
            className: "lp-pg",
            onClick: () => s(e + 1),
            disabled: e >= t,
            "aria-label": "Next page",
            children: n.jsx(L, { name: "chevR", size: 15 }),
          }),
        ],
      }),
    ],
  });
}
export function qr({
  trigger: e,
  label: t,
  triggerClass: s = "",
  align: l = "right",
  children: i,
  panelClass: r = "",
}) {
  const [a, o] = w.useState(!1),
    c = w.useRef(null),
    u = w.useRef(null),
    d = w.useId(),
    h = w.useCallback((m = !0) => {
      var S;
      (o(!1), m && ((S = u.current) == null || S.focus()));
    }, []);
  return (
    w.useEffect(() => {
      if (!a) return;
      const m = (v) => {
          c.current && !c.current.contains(v.target) && o(!1);
        },
        S = (v) => {
          v.key === "Escape" && h();
        };
      return (
        document.addEventListener("mousedown", m),
        document.addEventListener("keydown", S),
        () => {
          (document.removeEventListener("mousedown", m), document.removeEventListener("keydown", S));
        }
      );
    }, [a, h]),
    n.jsxs("div", {
      className: "lp-pop",
      ref: c,
      children: [
        n.jsx("button", {
          ref: u,
          type: "button",
          className: s,
          "aria-haspopup": "dialog",
          "aria-expanded": a,
          "aria-controls": a ? d : void 0,
          "aria-label": t,
          onClick: () => o((m) => !m),
          children: e,
        }),
        a &&
          n.jsx("div", {
            id: d,
            role: "dialog",
            "aria-label": t,
            className: `lp-pop-panel is-${l} ${r}`,
            children: typeof i == "function" ? i(h) : i,
          }),
      ],
    })
  );
}
export function Yt({ open: e, onClose: t, title: s, children: l, footer: i, size: r = "md", labelledby: a }) {
  const o = w.useRef(null),
    c = w.useId();
  return (
    w.useEffect(() => {
      const u = o.current;
      u && (e && !u.open && u.showModal(), !e && u.open && u.close());
    }, [e]),
    n.jsx("dialog", {
      ref: o,
      className: `lp-modal lp-modal-${r}`,
      "aria-labelledby": a || c,
      onCancel: (u) => {
        (u.preventDefault(), t == null || t());
      },
      onClick: (u) => {
        u.target === o.current && (t == null || t());
      },
      children:
        e &&
        n.jsxs("div", {
          className: "lp-modal-in",
          children: [
            n.jsxs("header", {
              className: "lp-modal-h",
              children: [
                n.jsx("h2", { id: c, className: "lp-modal-t", children: s }),
                n.jsx("button", {
                  type: "button",
                  className: "lp-icon-btn",
                  onClick: t,
                  "aria-label": "Close dialog",
                  children: n.jsx(L, { name: "x", size: 18 }),
                }),
              ],
            }),
            n.jsx("div", { className: "lp-modal-b", children: l }),
            i && n.jsx("footer", { className: "lp-modal-f", children: i }),
          ],
        }),
    })
  );
}
export function mt({
  open: e,
  onClose: t,
  onConfirm: s,
  title: l,
  children: i,
  confirmLabel: r = "Confirm",
  cancelLabel: a = "Cancel",
  tone: o = "primary",
  loading: c = !1,
  disabled: u = !1,
}) {
  return n.jsx(Yt, {
    open: e,
    onClose: t,
    title: l,
    size: "sm",
    footer: n.jsxs(n.Fragment, {
      children: [
        n.jsx(b, { variant: "ghost", onClick: t, children: a }),
        n.jsx(b, { variant: o, onClick: s, loading: c, disabled: u, children: r }),
      ],
    }),
    children: i,
  });
}
export const Zh = w.createContext(() => {}),
  xe = () => w.useContext(Zh);
export function cy({ children: e }) {
  const [t, s] = w.useState([]),
    l = w.useCallback((i) => {
      const r = Math.random().toString(36).slice(2);
      (s((a) => [...a, { id: r, tone: "success", ...i }]),
        setTimeout(() => s((a) => a.filter((o) => o.id !== r)), i.duration || 5e3));
    }, []);
  return n.jsxs(Zh.Provider, {
    value: l,
    children: [
      e,
      n.jsx("div", {
        className: "lp-toasts",
        "aria-live": "polite",
        "aria-atomic": "false",
        children: t.map((i) =>
          n.jsxs(
            "div",
            {
              className: `lp-toast is-${i.tone}`,
              role: "status",
              children: [
                n.jsx(L, {
                  name: i.tone === "danger" ? "alert" : i.tone === "info" ? "info" : "check",
                  size: 18,
                }),
                n.jsxs("div", {
                  children: [
                    n.jsx("strong", { children: i.title }),
                    i.message && n.jsx("p", { children: i.message }),
                  ],
                }),
                n.jsx("button", {
                  type: "button",
                  className: "lp-icon-btn",
                  "aria-label": "Dismiss notification",
                  onClick: () => s((r) => r.filter((a) => a.id !== i.id)),
                  children: n.jsx(L, { name: "x", size: 15 }),
                }),
              ],
            },
            i.id,
          ),
        ),
      }),
    ],
  });
}
export function Nc({
  label: e,
  hint: t,
  required: s,
  file: l,
  onSelect: i,
  onRemove: r,
  error: a,
  status: o,
  note: c,
}) {
  const u = w.useId(),
    [d, h] = w.useState(!1),
    [m, S] = w.useState(""),
    v = (A) => {
      if (!A) return;
      const f = Oh(A);
      (S(f), f || i({ name: A.name, size: A.size, type: A.type, file: A }));
    },
    N = m || a;
  return n.jsxs("div", {
    className: `lp-field ${N ? "has-error" : ""}`,
    children: [
      n.jsxs("span", {
        className: "lp-label",
        id: `${u}-l`,
        children: [
          e,
          s
            ? n.jsx("span", { className: "lp-req", "aria-hidden": "true", children: " *" })
            : n.jsx("span", { className: "lp-opt", children: " (optional)" }),
        ],
      }),
      l
        ? n.jsxs("div", {
            className: "lp-file",
            children: [
              n.jsx("span", { className: "lp-file-ic", children: n.jsx(L, { name: "file", size: 20 }) }),
              n.jsxs("span", {
                className: "lp-file-meta",
                children: [
                  n.jsx("strong", { children: l.name }),
                  n.jsxs("small", { children: [xo(l.size), " · ", l.type.split("/")[1].toUpperCase()] }),
                ],
              }),
              o,
              r &&
                n.jsx("button", {
                  type: "button",
                  className: "lp-icon-btn",
                  onClick: () => {
                    (S(""), r());
                  },
                  "aria-label": `Remove ${e}`,
                  children: n.jsx(L, { name: "trash", size: 16 }),
                }),
            ],
          })
        : n.jsxs("label", {
            className: `lp-drop ${d ? "is-over" : ""}`,
            htmlFor: u,
            onDragOver: (A) => {
              (A.preventDefault(), h(!0));
            },
            onDragLeave: () => h(!1),
            onDrop: (A) => {
              var f;
              (A.preventDefault(), h(!1), v((f = A.dataTransfer.files) == null ? void 0 : f[0]));
            },
            children: [
              n.jsx(L, { name: "upload", size: 22 }),
              n.jsxs("span", {
                children: [n.jsx("strong", { children: "Choose a file" }), " or drag it here"],
              }),
              n.jsx("small", { children: t || "PDF, JPG or PNG · up to 5 MB" }),
              n.jsx("input", {
                id: u,
                type: "file",
                className: "lp-sr",
                accept: ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png",
                "aria-labelledby": `${u}-l`,
                "aria-describedby": N ? `${u}-err` : void 0,
                onChange: (A) => {
                  var f;
                  (v((f = A.target.files) == null ? void 0 : f[0]), (A.target.value = ""));
                },
              }),
            ],
          }),
      c && n.jsx("p", { className: "lp-hint", children: c }),
      N &&
        n.jsxs("p", {
          id: `${u}-err`,
          className: "lp-err",
          role: "alert",
          children: [n.jsx(L, { name: "alert", size: 14 }), " ", N],
        }),
    ],
  });
}
