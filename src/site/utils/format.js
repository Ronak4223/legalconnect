const pad = (n) => String(n).padStart(2, "0");
export const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromIso = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
export const addDays = (n, base = new Date()) => { const d = new Date(base); d.setDate(d.getDate() + n); return d; };
export const money = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
export const dateLong = (s) => fromIso(s).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
export const dateShort = (s) => fromIso(s).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
export const monthYear = (d) => d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
export const time12 = (t) => { const [h, m] = t.split(":").map(Number); return `${((h + 11) % 12) + 1}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`; };
export const endTime = (t, mins = 45) => { const [h, m] = t.split(":").map(Number); const x = h * 60 + m + mins; return `${pad(Math.floor(x / 60) % 24)}:${pad(x % 60)}`; };
export const relDay = (s) => {
  const diff = Math.round((fromIso(s) - fromIso(iso(new Date()))) / 86400000);
  if (diff === 0) return "Today"; if (diff === 1) return "Tomorrow"; if (diff === -1) return "Yesterday";
  return dateLong(s);
};
export const ago = (ts) => {
  const s = Math.max(1, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return "just now"; if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`; if (s < 172800) return "Yesterday";
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};
export const clock = (ts) => new Date(ts).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
export const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
export const initials = (n = "") => n.split(/\s+/).filter(Boolean).slice(0, 2).map((x) => x[0].toUpperCase()).join("");
export const uid = (p = "id") => `${p}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;
export const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
export const pluralIn = plural;
/** Tiny non-cryptographic hash so demo passwords are not kept as plain text in localStorage. Demo only. */
export const hash = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return String(h >>> 0); };
