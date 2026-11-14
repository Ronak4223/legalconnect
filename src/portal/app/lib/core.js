import { PORTRAIT_AVATAR } from "../00-assets.js";

/* app/lib/core.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
export const Zn = "Asia/Kolkata",
  nt = "IST",
  Xx = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: Zn }),
  $x = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: Zn,
  }),
  _x = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: !0, timeZone: Zn }),
  ey = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: Zn }),
  ty = new Intl.DateTimeFormat("en-IN", { month: "short", timeZone: Zn }),
  ny = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: !1, timeZone: Zn }),
  sy = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: Zn }),
  ly = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }),
  J = (e) => ly.format(Math.round(e || 0)),
  Ie = (e) => ey.format(new Date(e)),
  ge = (e) => _x.format(new Date(e)).replace(/\s?(am|pm)/i, (t) => " " + t.trim().toUpperCase()),
  Ke = (e) => Xx.format(new Date(e)),
  Gn = (e) => sy.format(new Date(e)),
  Ds = (e) => $x.format(new Date(e)),
  go = (e) => ty.format(new Date(e)),
  ol = (e) => Ie(e).slice(0, 7);
export function Bn(e, t = Date.now()) {
  const s = Ie(e);
  return s === Ie(new Date(t).toISOString())
    ? "Today"
    : s === Ie(new Date(t + 864e5).toISOString())
      ? "Tomorrow"
      : s === Ie(new Date(t - 864e5).toISOString())
        ? "Yesterday"
        : Ke(e);
}
export const Lr = (e, t) => `${Bn(e, t)}, ${ge(e)} ${nt}`;
export function qt(e, t = Date.now()) {
  const s = new Date(e).getTime() - t,
    l = Math.abs(s),
    i = Math.round(l / 6e4),
    r = Math.round(l / 36e5),
    a = Math.round(l / 864e5),
    o = i < 60 ? `${Math.max(i, 1)} min` : r < 48 ? `${r} h` : `${a} d`;
  return s >= 0 ? `in ${o}` : `${o} ago`;
}
export const iy = (e = "") =>
    e
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((t) => t[0].toUpperCase())
      .join(""),
  xo = (e) =>
    e < 1024 ? `${e} B` : e < 1048576 ? `${Math.round(e / 1024)} KB` : `${(e / 1048576).toFixed(1)} MB`,
  ry = (e = Date.now()) => {
    const t = Number(ny.format(new Date(e)));
    return t < 12 ? "Good morning" : t < 17 ? "Good afternoon" : "Good evening";
  },
  bl = { video: "Video consultation", phone: "Phone consultation", in_person: "In-person consultation" },
  kn = { video: "Video", phone: "Phone", in_person: "In person" };
export function Ur(e, t, s, l = 0) {
  const i = new Date(e + 198e5),
    r = Date.UTC(i.getUTCFullYear(), i.getUTCMonth(), i.getUTCDate() + t, s, l) - 198e5;
  return new Date(r).toISOString();
}
export const Bt = (e, t = "This field") => (String(e ?? "").trim() ? "" : `${t} is required.`),
  Vl = (e) =>
    String(e || "").trim()
      ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim())
        ? ""
        : "Enter a valid email address, e.g. name@firm.in."
      : "Email is required.",
  Kr = (e) => {
    const t = String(e || "").trim();
    return t
      ? t.length < 3
        ? "Enter your full name (at least 3 characters)."
        : /^[\p{L}][\p{L}\p{M}\s.'’-]+$/u.test(t)
          ? ""
          : "Names can include letters, spaces, dots, hyphens and apostrophes only."
      : "Full name is required.";
  },
  wc = (e) => {
    const t = String(e || "").replace(/[\s-]/g, "");
    return t
      ? /^[6-9]\d{9}$/.test(t)
        ? ""
        : "Enter a 10-digit Indian mobile number starting with 6–9."
      : "Mobile number is required.";
  },
  Sc = [
    ["At least 8 characters", (e) => e.length >= 8],
    ["An uppercase and a lowercase letter", (e) => /[a-z]/.test(e) && /[A-Z]/.test(e)],
    ["A number", (e) => /\d/.test(e)],
    ["A symbol (e.g. ! @ # $)", (e) => /[^A-Za-z0-9]/.test(e)],
  ],
  Gh = (e = "") => Sc.filter(([, t]) => t(e)).length,
  Cc = (e) =>
    e
      ? Gh(e) === Sc.length
        ? ""
        : "Password does not meet all the requirements below."
      : "Password is required.",
  Ac = (e, t) => (e ? (e === t ? "" : "Passwords do not match.") : "Confirm your password."),
  Bh = (e) => {
    const t = String(e || "").trim();
    return t
      ? t.length < 5 || !/\d/.test(t) || !/^[A-Za-z0-9/\-.\s]+$/.test(t)
        ? "Enter your enrolment number as printed on your certificate, e.g. D/4821/2014."
        : ""
      : "Bar enrolment number is required.";
  },
  Wh = (e, t = new Date()) => {
    const s = Number(e);
    return e
      ? !Number.isInteger(s) || s < 1950 || s > t.getFullYear()
        ? `Enter a year between 1950 and ${t.getFullYear()}.`
        : ""
      : "Enrolment year is required.";
  },
  Hh = (e, t, s = new Date()) => {
    if (e === "" || e == null) return "Years of experience is required.";
    const l = Number(e);
    if (!Number.isInteger(l) || l < 0 || l > 70) return "Enter a whole number between 0 and 70.";
    const i = t ? s.getFullYear() - Number(t) + 1 : 70;
    return l > i ? `Experience can't exceed ${i} years since your ${t} enrolment.` : "";
  },
  $u = { types: ["application/pdf", "image/jpeg", "image/png"], maxBytes: 5 * 1024 * 1024 },
  Oh = (e) =>
    e
      ? $u.types.includes(e.type)
        ? e.size > $u.maxBytes
          ? "File is larger than 5 MB."
          : e.size === 0
            ? "This file is empty."
            : ""
        : "Unsupported file type. Upload a PDF, JPG or PNG."
      : "",
  ay = PORTRAIT_AVATAR,
  _u = {
    grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
    calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
    users:
      "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.5a3 3 0 0 1 0 5.5M18 14.5c1.8.7 3 2.5 3 5.5",
    message: "M4 5h16v11H9l-5 4z",
    shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
    shieldCheck: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5",
    user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7",
    clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M12 7v5l3 2",
    wallet: "M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l2-3h12M16 14h2",
    bell: "M6 16v-5a6 6 0 1 1 12 0v5l2 2H4zM10 21h4",
    settings: "M4 7h10M18 7h2M4 17h2M10 17h10M14 5v4M6 15v4",
    search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14M20 20l-4-4",
    check: "m5 12 4.5 4.5L19 7",
    x: "M6 6l12 12M18 6 6 18",
    chevR: "m9 6 6 6-6 6",
    chevL: "m15 6-6 6 6 6",
    chevD: "m6 9 6 6 6-6",
    video: "M3 7h11v10H3zM14 11l7-4v10l-7-4",
    phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2",
    pin: "M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5",
    upload: "M12 16V4M7 9l5-5 5 5M4 16v4h16v-4",
    file: "M6 3h8l4 4v14H6zM14 3v5h4M9 13h6M9 17h6",
    alert: "M12 4 2.5 20h19zM12 10v4.5M12 17.5v.5",
    info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M12 11v5M12 8v.5",
    lock: "M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",
    mail: "M3 6h18v12H3zM3 7l9 7 9-7",
    eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
    eyeOff:
      "M3 3l18 18M10.6 6.2A9.6 9.6 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3.2 3.7M6.6 7.6A16.5 16.5 0 0 0 2 12s4 7 10 7c1.6 0 3-.4 4.3-1M9.9 9.9a3 3 0 0 0 4.2 4.2",
    menu: "M4 7h16M4 12h16M4 17h16",
    logout: "M10 4H5v16h5M15 8l4 4-4 4M19 12H9",
    plus: "M12 5v14M5 12h14",
    briefcase: "M3 8h18v11H3zM9 8V5h6v3M3 13h18",
    refresh: "M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5",
    arrowR: "M5 12h14M13 6l6 6-6 6",
    help: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17v.5",
    trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
    rupee: "M7 5h10M7 9h10M7 5c5 0 7 1.5 7 4s-2 4-7 4l7 6",
    chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
    edit: "M4 20l1-4L16 5l3 3L8 19zM14 7l3 3",
    scale:
      "M16 4v22M9 27h14M6 8h20M6 8 2 18h8L6 8ZM26 8l-4 10h8L26 8ZM2 18a4 4 0 0 0 8 0M22 18a4 4 0 0 0 8 0",
  };
