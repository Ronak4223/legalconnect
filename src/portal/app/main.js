import "../styles/index.css";
import w from "react";
import * as n from "react/jsx-runtime";
import { createRoot as Uh } from "react-dom/client";
import {
  useLocation as Nt,
  Navigate as jc,
  Route as me,
  Routes as Dx,
  HashRouter as Jx,
  Link as P,
} from "react-router-dom";
import { cy, le } from "./components/ui.js";
import { Iy, Kn, ne, nm } from "./state/store.js";
import { AppLayout } from "./components/shell.js";
import { LoginView } from "./views/login.js";
import { RegisterView } from "./views/register.js";
import { ForgotPasswordView, ResetPasswordView } from "./views/recovery.js";
import { VerifyEmailView } from "./views/verify-email.js";
import { DashboardView } from "./views/dashboard.js";
import { AppointmentsView } from "./views/appointments.js";
import { AppointmentDetailView } from "./views/appointment-detail.js";
import { VerificationView } from "./views/verification.js";
import { PaymentsView } from "./views/payments.js";
import { NotificationsView } from "./views/notifications.js";
import { SettingsView } from "./views/settings.js";
import { ClientsView } from "./views/clients.js";
import { ClientProfileView } from "./views/client-profile.js";
import { CaseDetailView } from "./views/case-detail.js";
import { MessagesView } from "./views/messages.js";
import { ProfileView } from "./views/profile.js";
import { AvailabilityView } from "./views/availability.js";
import { UiKitView } from "./views/kit.js";

/* app/main.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
/* Accessibility: after a failed submit inside a dialog, move focus to the first invalid field. */
document.addEventListener(
  "submit",
  (ev) => {
    const f = ev.target;
    if (!(f instanceof HTMLFormElement) || !f.closest("dialog")) return;
    setTimeout(() => {
      const bad = f.querySelector('[aria-invalid="true"]');
      bad && bad.focus();
    }, 60);
  },
  true,
);
function RequireAuth({ children: e }) {
  const { session: t, lawyer: s } = ne(),
    l = Nt();
  return !t || !s ? n.jsx(jc, { to: "/login", replace: !0, state: { from: l.pathname + l.search } }) : e;
}
function LoginRoute() {
  const { session: e, lawyer: t } = ne();
  return e && t ? n.jsx(jc, { to: "/dashboard", replace: !0 }) : n.jsx(LoginView, {});
}
function NotFoundView() {
  return n.jsx("div", {
    className: "lp-auth-main",
    style: { minHeight: "100vh" },
    children: n.jsx("div", {
      className: "lp-auth-card",
      children: n.jsx(le, {
        icon: "file",
        title: "Page not found",
        action: n.jsx(P, {
          className: "lp-btn lp-btn-primary lp-btn-md",
          to: "/dashboard",
          children: n.jsx("span", { children: "Go to dashboard" }),
        }),
        children: "That address doesn’t exist in the lawyer portal.",
      }),
    }),
  });
}
function App() {
  return n.jsx("div", {
    className: "lp-app",
    children: n.jsx(Iy, {
      children: n.jsx(cy, {
        children: n.jsx(Jx, {
          future: { v7_startTransition: !0, v7_relativeSplatPath: !0 },
          children: n.jsxs(Dx, {
            children: [
              n.jsx(me, { path: "/", element: n.jsx(jc, { to: "/dashboard", replace: !0 }) }),
              n.jsx(me, { path: "/login", element: n.jsx(LoginRoute, {}) }),
              n.jsx(me, { path: "/register", element: n.jsx(RegisterView, {}) }),
              n.jsx(me, { path: "/forgot-password", element: n.jsx(ForgotPasswordView, {}) }),
              n.jsx(me, { path: "/reset-password", element: n.jsx(ResetPasswordView, {}) }),
              n.jsx(me, { path: "/kit", element: n.jsx(UiKitView, {}) }),
              n.jsx(me, {
                path: "/verify-email",
                element: n.jsx(RequireAuth, { children: n.jsx(VerifyEmailView, {}) }),
              }),
              n.jsxs(me, {
                element: n.jsx(RequireAuth, { children: n.jsx(AppLayout, {}) }),
                children: [
                  n.jsx(me, { path: "/dashboard", element: n.jsx(DashboardView, {}) }),
                  n.jsx(me, { path: "/appointments", element: n.jsx(AppointmentsView, {}) }),
                  n.jsx(me, { path: "/appointments/:id", element: n.jsx(AppointmentDetailView, {}) }),
                  n.jsx(me, { path: "/verification", element: n.jsx(VerificationView, {}) }),
                  n.jsx(me, { path: "/clients", element: n.jsx(ClientsView, {}) }),
                  n.jsx(me, { path: "/clients/:id", element: n.jsx(ClientProfileView, {}) }),
                  n.jsx(me, { path: "/cases/:id", element: n.jsx(CaseDetailView, {}) }),
                  n.jsx(me, { path: "/messages", element: n.jsx(MessagesView, {}) }),
                  n.jsx(me, { path: "/messages/:id", element: n.jsx(MessagesView, {}) }),
                  n.jsx(me, { path: "/profile", element: n.jsx(ProfileView, {}) }),
                  n.jsx(me, { path: "/availability", element: n.jsx(AvailabilityView, {}) }),
                  n.jsx(me, { path: "/payments", element: n.jsx(PaymentsView, {}) }),
                  n.jsx(me, { path: "/notifications", element: n.jsx(NotificationsView, {}) }),
                  n.jsx(me, { path: "/settings", element: n.jsx(SettingsView, {}) }),
                ],
              }),
              n.jsx(me, { path: "*", element: n.jsx(NotFoundView, {}) }),
            ],
          }),
        }),
      }),
    }),
  });
}
class ErrorBoundary extends w.Component {
  constructor(p) {
    (super(p), (this.state = { e: null }));
  }
  static getDerivedStateFromError(e) {
    return { e };
  }
  componentDidCatch(e) {
    console.error("[LegalConnect portal]", e);
  }
  render() {
    if (!this.state.e) return this.props.children;
    const R = () => {
      for (const k of [nm, Kn])
        for (const st of [window.localStorage, window.sessionStorage])
          try {
            st.removeItem(k);
          } catch {}
      ((location.hash = "#/login"), location.reload());
    };
    return n.jsx("div", {
      className: "lp-app",
      children: n.jsx("main", {
        className: "lp-auth-main",
        style: { minHeight: "100vh", display: "grid", placeItems: "center", padding: "1.5rem" },
        children: n.jsxs("div", {
          className: "lp-auth-card",
          role: "alert",
          children: [
            n.jsx("h1", { className: "lp-auth-title", children: "Something went wrong" }),
            n.jsx("p", {
              children:
                "The portal hit an unexpected problem. This demo keeps its data only in this browser, so restoring the sample data usually fixes it.",
            }),
            n.jsxs("div", {
              style: { display: "flex", gap: ".6rem", flexWrap: "wrap", marginTop: "1rem" },
              children: [
                n.jsx("button", {
                  type: "button",
                  className: "lp-btn lp-btn-primary lp-btn-md",
                  onClick: () => location.reload(),
                  children: "Reload",
                }),
                n.jsx("button", {
                  type: "button",
                  className: "lp-btn lp-btn-outline lp-btn-md",
                  onClick: R,
                  children: "Restore sample data",
                }),
              ],
            }),
          ],
        }),
      }),
    });
  }
}
Uh(document.getElementById("root")).render(
  n.jsx(w.StrictMode, { children: n.jsx(ErrorBoundary, { children: n.jsx(App, {}) }) }),
);
