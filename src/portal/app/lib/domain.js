import { Ie, ol } from "./core.js";

/* app/lib/domain.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
export const _n = [
    ["mon", "Monday"],
    ["tue", "Tuesday"],
    ["wed", "Wednesday"],
    ["thu", "Thursday"],
    ["fri", "Friday"],
    ["sat", "Saturday"],
    ["sun", "Sunday"],
  ],
  uy = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
  ut = (e) => {
    const [t, s] = e.split(":").map(Number);
    return t * 60 + s;
  },
  js = (e) => `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`,
  tr = (e) => {
    const [t, s] = e.split(":").map(Number);
    return `${((t + 11) % 12) + 1}:${String(s).padStart(2, "0")} ${t < 12 ? "AM" : "PM"}`;
  },
  ed = Array.from({ length: 33 }, (e, t) => js(6 * 60 + t * 30)).map((e) => ({ value: e, label: tr(e) })),
  nr = (e, t) => new Date(`${e}T${t}:00+05:30`).toISOString(),
  sr = (e) => uy[new Date(`${e}T12:00:00+05:30`).getUTCDay()],
  dy = (e, t) => Ie(new Date(new Date(`${e}T12:00:00+05:30`).getTime() + t * 864e5).toISOString()),
  Xh = (e = Date.now()) => Ie(new Date(e).toISOString()),
  cn = (e, t = { weekday: "short", day: "numeric", month: "short" }) =>
    new Intl.DateTimeFormat("en-IN", { ...t, timeZone: "Asia/Kolkata" }).format(
      new Date(`${e}T12:00:00+05:30`),
    ),
  Xs = {
    weekly: {
      mon: [
        { s: "09:00", e: "13:00" },
        { s: "14:00", e: "19:00" },
      ],
      tue: [
        { s: "09:00", e: "13:00" },
        { s: "14:00", e: "19:00" },
      ],
      wed: [
        { s: "09:00", e: "13:00" },
        { s: "14:00", e: "19:00" },
      ],
      thu: [
        { s: "09:00", e: "13:00" },
        { s: "14:00", e: "19:00" },
      ],
      fri: [
        { s: "09:00", e: "13:00" },
        { s: "14:00", e: "19:00" },
      ],
      sat: [{ s: "10:00", e: "13:00" }],
      sun: [],
    },
    duration: 45,
    buffer: 10,
    minNoticeH: 12,
    windowDays: 30,
    blocked: [],
  };
export function py(e, t) {
  const s = [...e].sort((l, i) => ut(l.s) - ut(i.s));
  for (let l = 0; l < s.length; l++) {
    if (ut(s[l].e) <= ut(s[l].s)) return "End time must be after the start time.";
    if (ut(s[l].e) - ut(s[l].s) < t)
      return `Each block must be at least ${t} minutes (your consultation length).`;
    if (l > 0 && ut(s[l].s) < ut(s[l - 1].e)) return "Time blocks overlap. Adjust or merge them.";
  }
  return "";
}
export function kc(e, t) {
  return e.blocked.find((s) => t >= s.from && t <= s.to) || null;
}
export const lr = (e) =>
  e.length
    ? e.map((t) => `${tr(t.s).replace(":00", "")}–${tr(t.e).replace(":00", "")}`).join(", ")
    : "Closed";
export function hy(e, t, s, l = Date.now()) {
  const i = [];
  if (kc(t, e)) return i;
  const r = t.weekly[sr(e)] || [],
    a = t.duration + t.buffer;
  return (
    r.forEach((o) => {
      for (let c = ut(o.s); c + t.duration <= ut(o.e); c += a) {
        const u = nr(e, js(c)),
          d = nr(e, js(c + t.duration)),
          h = new Date(u).getTime(),
          m = new Date(d).getTime(),
          S = (N) =>
            s.find(
              (A) =>
                A.status === N &&
                new Date(A.startsAt).getTime() < m + t.buffer * 6e4 &&
                new Date(A.startsAt).getTime() + A.durationMin * 6e4 + t.buffer * 6e4 > h,
            );
        let v = "available";
        (S("scheduled")
          ? (v = "booked")
          : S("requested")
            ? (v = "pending")
            : h < l + t.minNoticeH * 36e5
              ? (v = "notice")
              : e > dy(Xh(l), t.windowDays) && (v = "window"),
          i.push({
            start: u,
            end: d,
            hhmm: js(c),
            status: v,
            appt: S("scheduled") || S("requested") || null,
          }));
      }
    }),
    i
  );
}
export function my(e, t) {
  const s = new Date(Date.UTC(e, t, 1)),
    l = (s.getUTCDay() + 6) % 7,
    i = new Date(Date.UTC(e, t + 1, 0)).getUTCDate(),
    r = [];
  for (let o = 0; o < l; o++) {
    const c = new Date(Date.UTC(e, t, 1 - (l - o)));
    r.push({ key: c.toISOString().slice(0, 10), inMonth: !1 });
  }
  for (let o = 1; o <= i; o++)
    r.push({ key: new Date(Date.UTC(e, t, o)).toISOString().slice(0, 10), inMonth: !0 });
  for (; r.length % 7;) {
    const o = new Date(Date.UTC(e, t, i + (r.length - l - i) + 1));
    r.push({ key: o.toISOString().slice(0, 10), inMonth: !1 });
  }
  const a = [];
  for (let o = 0; o < r.length; o += 7) a.push(r.slice(o, o + 7));
  return a;
}
export function Ic(e, t, s) {
  const l = Ie(t),
    i = [],
    r = kc(e, l);
  r && i.push(`falls on a blocked date${r.reason ? ` (${r.reason})` : ""}`);
  const a = e.weekly[sr(l)] || [];
  if (!r)
    if (a.length === 0) i.push(`is on a day you marked as closed (${cn(l, { weekday: "long" })})`);
    else {
      const o = new Date(t).getTime(),
        c = o + s * 6e4;
      a.some((d) => o >= new Date(nr(l, d.s)).getTime() && c <= new Date(nr(l, d.e)).getTime()) ||
        i.push(`is outside your hours for ${cn(l, { weekday: "long" })} (${lr(a)})`);
    }
  return i;
}
export function fy(e, t, s = Date.now(), l = 60) {
  const i = s + l * 864e5;
  return t
    .filter(
      (r) =>
        r.status === "scheduled" &&
        new Date(r.startsAt).getTime() + r.durationMin * 6e4 > s &&
        new Date(r.startsAt).getTime() < i,
    )
    .map((r) => ({ appt: r, issues: Ic(e, r.startsAt, r.durationMin) }))
    .filter((r) => r.issues.length);
}
export const gy = [
    ["Asia/Kolkata", "India (IST)"],
    ["Asia/Dubai", "Dubai (GST)"],
    ["Asia/Singapore", "Singapore (SGT)"],
    ["Europe/London", "London (GMT/BST)"],
    ["America/New_York", "New York (ET)"],
    ["America/Los_Angeles", "Los Angeles (PT)"],
    ["Australia/Sydney", "Sydney (AET)"],
  ],
  td = (e, t) =>
    new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: !0,
      timeZone: t,
      timeZoneName: "short",
    })
      .format(new Date(e))
      .replace(/\s?(am|pm)/i, (s) => " " + s.trim().toUpperCase()),
  Dt = 0.1,
  ir = 48,
  pn = 1e3,
  Rc = (e) => Math.round(e * (1 - Dt)),
  Mc = [41500, 56250, 49e3, 63500, 58e3];
function xy(e) {
  const t = [...(e.events || [])].reverse().find((s) => /completed/i.test(s.text));
  return t ? t.at : new Date(new Date(e.startsAt).getTime() + e.durationMin * 6e4).toISOString();
}
const yy = (e) => (e.events && e.events.length ? e.events[e.events.length - 1].at : e.startsAt);
export function $h(e, t, s = Date.now()) {
  const l = [];
  (e.forEach((d) => {
    if (d.status === "completed") {
      const h = xy(d),
        m = Rc(d.feeInr),
        S = new Date(new Date(h).getTime() + ir * 36e5).toISOString();
      l.push({
        id: `pay_${d.id}`,
        type: "payment",
        at: h,
        apptId: d.id,
        client: d.client.name,
        matter: d.matter,
        consultType: d.type,
        gross: d.feeInr,
        fee: d.feeInr - m,
        net: m,
        clearsAt: S,
        status: s >= new Date(S).getTime() ? "available" : "pending",
      });
    } else
      d.status === "cancelled" &&
        (d.events || []).some((h) => /accepted/i.test(h.text)) &&
        l.push({
          id: `ref_${d.id}`,
          type: "refund",
          at: yy(d),
          apptId: d.id,
          client: d.client.name,
          matter: d.matter,
          gross: d.feeInr,
          fee: 0,
          net: 0,
          status: "refunded",
        });
  }),
    t.forEach((d) =>
      l.push({
        id: d.id,
        type: "payout",
        at: d.requestedAt,
        amount: d.amount,
        ref: d.ref,
        status: d.status,
        historic: !!d.historic,
        paidAt: d.paidAt,
        method: d.methodLabel,
      }),
    ),
    l.sort((d, h) => new Date(h.at) - new Date(d.at)));
  const i = l.filter((d) => d.type === "payment"),
    r = i.filter((d) => d.status === "available").reduce((d, h) => d + h.net, 0),
    a = i.filter((d) => d.status === "pending").reduce((d, h) => d + h.net, 0),
    o = t.filter((d) => !d.historic && d.status !== "failed").reduce((d, h) => d + h.amount, 0),
    c = ol(new Date(s).toISOString()),
    u = i.filter((d) => ol(d.at) === c);
  return {
    rows: l,
    summary: {
      available: Math.max(0, r - o),
      pending: a,
      paidOut: t.filter((d) => d.status === "paid").reduce((d, h) => d + h.amount, 0),
      inFlight: t.filter((d) => d.status === "processing").reduce((d, h) => d + h.amount, 0),
      monthNet: u.reduce((d, h) => d + h.net, 0),
      monthGross: u.reduce((d, h) => d + h.gross, 0),
      monthFees: u.reduce((d, h) => d + h.fee, 0),
      monthCount: u.length,
      lifetimeNet: i.reduce((d, h) => d + h.net, 0),
    },
  };
}
export function cl(e) {
  return `RC-${new Date(e.at).getUTCFullYear()}-${e.apptId.replace(/\D/g, "").padStart(5, "0")}`;
}
export const Yr = [
    ["request", "New consultation requests"],
    ["appointment", "Appointments: reminders, reschedules, cancellations"],
    ["message", "Messages"],
    ["verify", "Verification updates"],
    ["payment", "Payments and payouts"],
    ["profile", "Profile and document actions"],
  ],
  _h = () => ({
    notify: Object.fromEntries(Yr.map(([e]) => [e, { inApp: !0, email: e !== "message", sms: !1 }])),
    privacy: { listed: !0, preBookingMessages: !0, showCity: !0, usage: !0 },
    language: "en",
    commLang: "English",
    loginAlerts: !0,
    sessions: [],
  }),
  vy = (e) => {
    const t = _h();
    return {
      ...t,
      ...(e || {}),
      notify: { ...t.notify, ...((e && e.notify) || {}) },
      privacy: { ...t.privacy, ...((e && e.privacy) || {}) },
    };
  },
  Ll = ["Family Law", "Criminal Law", "Civil Law", "Corporate Law", "Employment Law", "Property Law"],
  em = [
    "Bar Council of Delhi",
    "Bar Council of Maharashtra & Goa",
    "Bar Council of Karnataka",
    "Bar Council of Tamil Nadu & Puducherry",
    "Bar Council of Telangana",
    "Bar Council of Punjab & Haryana",
    "Bar Council of Uttar Pradesh",
    "Bar Council of West Bengal",
    "Bar Council of Gujarat",
    "Bar Council of Kerala",
    "Bar Council of Rajasthan",
    "Bar Council of Madhya Pradesh",
  ],
  bc = [
    "English",
    "Hindi",
    "Punjabi",
    "Marathi",
    "Gujarati",
    "Tamil",
    "Telugu",
    "Bengali",
    "Kannada",
    "Malayalam",
    "Urdu",
  ],
  rr = [
    "Delhi",
    "Mumbai",
    "Bengaluru",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Chandigarh",
    "Gurugram",
    "Ahmedabad",
  ],
  Pe = {
    identity: { label: "Government ID", hint: "Aadhaar, PAN, passport or driving licence", required: !0 },
    bar_cert: {
      label: "Bar Council enrolment certificate",
      hint: "Certificate issued by your State Bar Council",
      required: !0,
    },
    degree: { label: "Law degree certificate", hint: "LL.B. / B.A. LL.B. or equivalent", required: !0 },
    photo: { label: "Professional photo", hint: "Optional — clear, front-facing headshot", required: !1 },
  },
  ar = "aarav.mehta@example.com",
  yo = "Demo@1234",
  He = "lw_demo_aarav",
  tm = [
    ["Neha Bansal", "Gurugram"],
    ["Rahul Khanna", "Delhi"],
    ["Ishita Rao", "Bengaluru"],
    ["Sameer Joshi", "Pune"],
    ["Tanvi Deshmukh", "Mumbai"],
    ["Imran Qureshi", "Hyderabad"],
    ["Kavya Menon", "Chennai"],
    ["Dev Arora", "Delhi"],
    ["Anita Kulkarni", "Pune"],
    ["Harsh Vardhan", "Jaipur"],
    ["Pooja Chawla", "Delhi"],
    ["Manish Gupta", "Noida"],
    ["Farah Siddiqui", "Mumbai"],
    ["Gaurav Sethi", "Chandigarh"],
  ],
  nd = (e) => {
    const [t, s] = tm[e],
      l = t.toLowerCase().replace(/\s+/g, ".");
    return {
      name: t,
      city: s,
      email: `${l}@example.com`,
      phone: `+91 98${String(1e7 + e * 137531).slice(0, 8)}`,
    };
  },
  ii = (e) => `cl_${e + 1}`;
