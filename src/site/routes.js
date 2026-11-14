export const USER_NAV = [
  { to: "/user/dashboard", label: "Dashboard", icon: "grid" },
  { to: "/user/appointments", label: "Appointments", icon: "calendar" },
  { to: "/user/cases", label: "My cases", icon: "briefcase" },
  { to: "/user/messages", label: "Messages", icon: "message", badge: "msg" },
  { to: "/user/notifications", label: "Notifications", icon: "bell", badge: "notif" },
  { to: "/user/payments", label: "Payments", icon: "wallet" },
  { to: "/user/profile", label: "Profile & settings", icon: "user" },
];
export const LAWYER_NAV = [
  { to: "/lawyer/dashboard", label: "Dashboard", icon: "grid" },
  { to: "/lawyer/appointments", label: "Appointments", icon: "calendar", badge: "pending" },
  { to: "/lawyer/clients", label: "Clients", icon: "users" },
  { to: "/lawyer/cases", label: "Cases", icon: "briefcase" },
  { to: "/lawyer/messages", label: "Messages", icon: "message", badge: "msg" },
  { to: "/lawyer/earnings", label: "Earnings", icon: "chart" },
  { to: "/lawyer/profile", label: "My profile", icon: "id" },
  { to: "/lawyer/notifications", label: "Notifications", icon: "bell", badge: "notif" },
  { to: "/lawyer/settings", label: "Settings", icon: "sliders" },
];
export const PUBLIC_NAV = [
  { to: "/find-lawyers", label: "Find lawyers" },
  { to: "/legal-services", label: "Legal services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Help & contact" },
];
const LAWYER_DASH = new Set(["dashboard", "profile", "appointments", "clients", "cases", "messages", "earnings", "notifications", "settings"]);
/** Which "area" of the product a path belongs to. The curtain transition plays between areas; moving around inside a dashboard is instant. */
export function zoneOf(path) {
  if (path.startsWith("/user")) return "user";
  const m = path.match(/^\/lawyer\/([^/]+)/);
  if (m && LAWYER_DASH.has(m[1])) return "lawyer";
  if (/^\/(login|register|forgot-password)/.test(path)) return "auth";
  return "public";
}
export const homeFor = (role) => (role === "lawyer" ? "/lawyer/dashboard" : "/user/dashboard");
