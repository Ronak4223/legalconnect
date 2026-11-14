import w from "react";
import * as n from "react/jsx-runtime";
import { Link as P } from "react-router-dom";
import {
  Ce,
  Ec,
  Et,
  Ft,
  H,
  L,
  Lt,
  Nc,
  O,
  Ql,
  W,
  Wt,
  Yt,
  b,
  er,
  le,
  lt,
  mt,
  qr,
  qs,
  rt,
  vs,
  xe,
} from "../components/ui.js";
import { ln } from "./availability.js";

/* app/views/kit.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
export function UiKitView() {
  const e = xe(),
    [t, s] = w.useState("a"),
    [l, i] = w.useState(2),
    [r, a] = w.useState(!1),
    [o, c] = w.useState(!1),
    [u, d] = w.useState(""),
    [h, m] = w.useState(["Hindi"]),
    [S, v] = w.useState(null),
    [N, A] = w.useState(!0);
  return n.jsxs("main", {
    className: "lp-kit",
    id: "lp-main",
    children: [
      n.jsxs("div", {
        className: "lp-kit-top",
        children: [
          n.jsx(er, {}),
          n.jsx(P, { className: "lp-link", to: "/login", children: "← Back to portal" }),
        ],
      }),
      n.jsxs(Ft, {
        eyebrow: "Design system",
        title: "Component kit",
        children: [
          "Every reusable component in the lawyer portal, driven by the shared ",
          n.jsx("code", { children: "--lc-*" }),
          " tokens taken from the public site. Internal reference page — not part of the product UI.",
        ],
      }),
      n.jsxs("div", {
        className: "lp-kit-grid",
        children: [
          n.jsx(ln, {
            title: "Buttons",
            children: n.jsxs("div", {
              className: "lp-wrap",
              children: [
                n.jsx(b, { children: "Primary" }),
                n.jsx(b, { variant: "secondary", children: "Secondary" }),
                n.jsx(b, { variant: "outline", children: "Outline" }),
                n.jsx(b, { variant: "ghost", children: "Ghost" }),
                n.jsx(b, { variant: "danger", children: "Danger" }),
                n.jsx(b, { loading: !0, children: "Loading" }),
                n.jsx(b, { disabled: !0, children: "Disabled" }),
                n.jsx(b, { icon: "plus", size: "sm", children: "Small" }),
                n.jsx(b, { size: "lg", iconRight: "arrowR", children: "Large" }),
              ],
            }),
          }),
          n.jsxs(ln, {
            title: "Inputs & validation",
            children: [
              n.jsx(W, {
                label: "Email address",
                required: !0,
                placeholder: "name@firm.in",
                hint: "We never share your email.",
              }),
              n.jsx(W, {
                label: "With error",
                required: !0,
                defaultValue: "not-an-email",
                error: "Enter a valid email address, e.g. name@firm.in.",
              }),
              n.jsx(Wt, {
                label: "Password with meter",
                showMeter: !0,
                value: u,
                onChange: (f) => d(f.target.value),
              }),
              n.jsx(Ce, { label: "Select", options: ["Family Law", "Corporate Law"], defaultValue: "" }),
              n.jsx(Et, { label: "Textarea", rows: 3, placeholder: "Notes…" }),
              n.jsx(rt, { label: "Checkbox", checked: N, onChange: (f) => A(f.target.checked) }),
              n.jsx(vs, {
                label: "Chips (multi-select)",
                options: ["English", "Hindi", "Punjabi", "Tamil"],
                value: h,
                onChange: m,
              }),
            ],
          }),
          n.jsxs(ln, {
            title: "Status badges & stat cards",
            children: [
              n.jsxs("div", {
                className: "lp-wrap",
                children: [
                  n.jsx(H, { tone: "success", dot: !0, children: "Verified" }),
                  n.jsx(H, { tone: "warning", dot: !0, children: "In review" }),
                  n.jsx(H, { tone: "danger", dot: !0, children: "Needs attention" }),
                  n.jsx(H, { tone: "info", children: "Scheduled" }),
                  n.jsx(H, { children: "Neutral" }),
                ],
              }),
              n.jsxs("div", {
                className: "lp-stats lp-stats-2",
                children: [
                  n.jsx(Lt, {
                    icon: "calendar",
                    label: "Upcoming",
                    value: "4",
                    hint: "Next: Today, 6:00 PM",
                  }),
                  n.jsx(Lt, {
                    icon: "rupee",
                    label: "Earnings",
                    value: "₹58,000",
                    tone: "success",
                    hint: "Illustrative",
                  }),
                ],
              }),
            ],
          }),
          n.jsxs(ln, {
            title: "Alerts",
            children: [
              n.jsx(O, { tone: "info", title: "Info", children: "Neutral guidance for the user." }),
              n.jsx(O, { tone: "success", title: "Success", children: "Something worked." }),
              n.jsx(O, { tone: "warning", title: "Warning", children: "Check this before continuing." }),
              n.jsx(O, { tone: "danger", title: "Error", children: "Something went wrong." }),
            ],
          }),
          n.jsxs(ln, {
            title: "Tabs & pagination",
            children: [
              n.jsx(qs, {
                tabs: [
                  { id: "a", label: "Requests", count: 3 },
                  { id: "b", label: "Upcoming", count: 4 },
                  { id: "c", label: "History" },
                ],
                value: t,
                onChange: s,
              }),
              n.jsx(Ql, { page: l, pages: 4, total: 18, perPage: 5, onChange: i }),
            ],
          }),
          n.jsx(ln, {
            title: "Dialogs, popover, toasts",
            children: n.jsxs("div", {
              className: "lp-wrap",
              children: [
                n.jsx(b, { variant: "outline", onClick: () => a(!0), children: "Open modal" }),
                n.jsx(b, { variant: "outline", onClick: () => c(!0), children: "Confirm dialog" }),
                n.jsx(qr, {
                  label: "Example popover",
                  triggerClass: "lp-btn lp-btn-outline lp-btn-md",
                  trigger: n.jsxs(n.Fragment, {
                    children: [n.jsx("span", { children: "Popover" }), n.jsx(L, { name: "chevD", size: 15 })],
                  }),
                  children: n.jsx("div", {
                    className: "lp-pad",
                    children: n.jsx("p", { children: "Closes on Esc or outside click." }),
                  }),
                }),
                n.jsx(b, {
                  variant: "outline",
                  onClick: () => e({ title: "Saved", message: "Your changes were saved." }),
                  children: "Success toast",
                }),
                n.jsx(b, {
                  variant: "outline",
                  onClick: () => e({ tone: "danger", title: "Couldn’t save", message: "Try again." }),
                  children: "Error toast",
                }),
              ],
            }),
          }),
          n.jsxs(ln, {
            title: "Empty, loading and error states",
            children: [
              n.jsx(le, {
                icon: "calendar",
                title: "Nothing scheduled",
                children: "Accepted consultations show up here.",
              }),
              n.jsx(Ec, { lines: 3 }),
              n.jsx(O, {
                tone: "danger",
                title: "We couldn’t load this",
                action: n.jsx(b, { size: "sm", variant: "outline", icon: "refresh", children: "Retry" }),
                children: "Check your connection and try again.",
              }),
            ],
          }),
          n.jsxs(ln, {
            title: "File upload",
            children: [
              n.jsx(Nc, {
                label: "Government ID",
                required: !0,
                file: S,
                onSelect: v,
                onRemove: () => v(null),
              }),
              n.jsxs("div", {
                className: "lp-wrap",
                children: [
                  n.jsx(lt, { name: "Aarav Mehta", size: 40 }),
                  n.jsx(lt, { name: "Neha Bansal", size: 32 }),
                ],
              }),
            ],
          }),
        ],
      }),
      n.jsx(Yt, {
        open: r,
        onClose: () => a(!1),
        title: "Example modal",
        footer: n.jsx(b, { onClick: () => a(!1), children: "Done" }),
        children: n.jsx("p", {
          children: "Native <dialog>: focus is trapped, Esc closes, and focus returns to the trigger.",
        }),
      }),
      n.jsx(mt, {
        open: o,
        onClose: () => c(!1),
        onConfirm: () => {
          (c(!1), e({ tone: "info", title: "Confirmed" }));
        },
        title: "Are you sure?",
        tone: "danger",
        confirmLabel: "Yes, continue",
        children: n.jsx("p", { children: "Use for actions with real consequences." }),
      }),
    ],
  });
}
