import { iso, fromIso } from "../utils/format.js";

export const personName = (s, id) => s.accounts.find((a) => a.id === id)?.name || s.clients.find((c) => c.id === id)?.name || "Client";
export const personById = (s, id) => s.accounts.find((a) => a.id === id) || s.clients.find((c) => c.id === id) || null;
export const lawyerById = (s, id) => s.lawyers.find((l) => l.id === id) || null;
export const apptStamp = (a) => fromIso(a.date).getTime() + Number(a.time.slice(0, 2)) * 3600000 + Number(a.time.slice(3)) * 60000;
const NET = 0.9; // platform keeps 10% (demo)

export function lawyerMoney(s, lawyerId, now = new Date()) {
  const mine = s.payments.filter((p) => p.lawyerId === lawyerId);
  const paid = mine.filter((p) => p.status === "paid"), pending = mine.filter((p) => p.status === "processing");
  const labels = [];
  for (let m = 11; m >= 0; m--) { const d = new Date(now.getFullYear(), now.getMonth() - m, 1); labels.push({ y: d.getFullYear(), m: d.getMonth(), label: d.toLocaleDateString("en-IN", { month: "short" }), value: 0 }); }
  paid.forEach((p) => { const d = new Date(p.ts), b = labels.find((x) => x.y === d.getFullYear() && x.m === d.getMonth()); if (b) b.value += Math.round(p.amount * NET); });
  const total = paid.reduce((a, p) => a + Math.round(p.amount * NET), 0);
  const paidOut = s.payouts.filter((x) => x.lawyerId === lawyerId).reduce((a, x) => a + x.amount, 0);
  const frac = Math.max(0.15, now.getDate() / new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()); // how much of this month has passed
  const pace = labels[10].value ? Math.round(((labels[11].value / frac - labels[10].value) / labels[10].value) * 100) : 0;
  return { pace, monthly: labels, total, thisMonth: labels[11].value, lastMonth: labels[10].value, pending: pending.reduce((a, p) => a + Math.round(p.amount * NET), 0), pendingCount: pending.length, paidOut, available: Math.max(0, total - paidOut), gross: paid.reduce((a, p) => a + p.amount, 0), count: paid.length };
}
export function clientsOf(s, lawyerId) {
  const ids = new Set([...s.appointments.filter((a) => a.lawyerId === lawyerId).map((a) => a.userId), ...s.cases.filter((c) => c.lawyerId === lawyerId).map((c) => c.userId), ...s.conversations.filter((c) => c.lawyerId === lawyerId).map((c) => c.userId)]);
  return [...ids].map((id) => personById(s, id)).filter(Boolean);
}
export const nextAppt = (list) => list.filter((a) => ["confirmed", "pending"].includes(a.status) && apptStamp(a) > Date.now() - 3600000).sort((a, b) => apptStamp(a) - apptStamp(b));
export const today = () => iso(new Date());
