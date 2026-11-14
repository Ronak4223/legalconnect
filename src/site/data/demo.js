import womanOffice from "@shared/assets/img/lawyer-woman-office.webp";
import manOffice from "@shared/assets/img/lawyer-man-office.webp";
import manDark from "@shared/assets/img/lawyer-man-dark.webp";
import { iso, addDays, hash } from "../utils/format.js";

/** Everything here is fictional demo content. */
export const AREAS = ["Family Law", "Criminal Law", "Civil Law", "Corporate Law", "Property Law", "Employment Law"];
export const CITIES = ["Delhi", "Mumbai", "Bengaluru", "Chennai", "Hyderabad", "Kolkata"];
export const LANGS = ["English", "Hindi", "Marathi", "Tamil", "Telugu", "Bengali", "Kannada"];
export const BAR_COUNCILS = ["Bar Council of Delhi", "Bar Council of Maharashtra & Goa", "Bar Council of Karnataka", "Bar Council of Tamil Nadu & Puducherry", "Bar Council of Telangana", "Bar Council of West Bengal", "Bar Council of Uttar Pradesh", "Punjab & Haryana Bar Council"];
export const QUALS = ["LL.B.", "LL.M.", "B.A. LL.B. (Hons)", "B.Com LL.B.", "Ph.D. (Law)", "Diploma in Cyber Law", "Certified Mediator"];
export const STAGES = ["Intake", "Documents", "Negotiation", "Hearing", "Resolution"];
export const DEMO_USER_ID = "u-ananya";
export const DEMO_LAWYER_ID = "aarav-mehta";
export const DEMO_PASSWORD = "Demo@1234";
export const FEE_BY_TYPE = { video: 1, phone: 0.8, "in-person": 1.5 };

const L = (id, name, area, city, exp, rating, reviews, fee, photo, extra) => ({
  id, name, area, areas: [area, ...(extra.also || [])], city, exp, rating, reviews, fee, ...photo,
  langs: extra.langs, quals: extra.quals, courts: extra.courts, barNo: extra.barNo, council: extra.council,
  tagline: extra.tagline, about: extra.about, verification: "verified", joined: extra.joined || "2021",
  schedule: [0, 1, 2, 3, 4, 5, 6].map((d) => ({ day: d, on: d >= 1 && d <= 5 || (d === 6 && extra.sat), from: "10:00", to: d === 6 ? "14:00" : "18:00" })),
});
export const SEED_LAWYERS = [
  L("aarav-mehta", "Aarav Mehta", "Corporate Law", "Delhi", 12, 4.8, 214, 2500, { im: "p1", sz: "300%", ps: "47% 20%" }, { also: ["Civil Law"], langs: ["English", "Hindi"], quals: ["LL.B. (Delhi University)", "LL.M. Corporate Law (NLU Delhi)"], courts: ["Delhi High Court", "NCLT New Delhi"], barNo: "D/2431/2013", council: "Bar Council of Delhi", tagline: "Shareholder agreements, M&A and boardroom disputes, explained plainly.", about: "Aarav advises founders and mid-sized companies on incorporation, shareholder agreements, mergers and corporate disputes. He believes a good contract is one both sides can read in a single sitting, and he prices consultations so small teams can afford real advice before problems begin.", sat: true }),
  L("priya-sharma", "Priya Sharma", "Family Law", "Mumbai", 9, 4.7, 187, 1800, { im: "q9", sz: "230%", ps: "50% 18%", hero: { src: womanOffice, sz: "auto 100%", ps: "54% 50%" } }, { langs: ["English", "Hindi", "Marathi"], quals: ["LL.B. (Mumbai University)", "Certified Mediator"], courts: ["Bombay High Court", "Family Courts, Bandra"], barNo: "MH/3318/2016", council: "Bar Council of Maharashtra & Goa", tagline: "Calm, discreet guidance through divorce, custody and maintenance.", about: "Priya has spent nine years in family courts and mediation rooms. She focuses on divorce, child custody, maintenance and domestic-relationship matters, and always explores settlement before litigation." }),
  L("rohit-verma", "Rohit Verma", "Criminal Law", "Delhi", 15, 4.6, 242, 3000, { im: "q8", sz: "480%", ps: "42% 20%", hero: { src: manOffice, sz: "auto 100%", ps: "42% 50%" } }, { langs: ["English", "Hindi"], quals: ["LL.B. (Delhi University)", "LL.M. Criminal Law"], courts: ["Supreme Court of India", "Delhi High Court", "Sessions Courts"], barNo: "D/1189/2011", council: "Bar Council of Delhi", tagline: "Bail, defence and appeals with fifteen years of courtroom experience.", about: "Rohit appears in trial courts, the High Court and the Supreme Court. He handles bail applications, white-collar defence and criminal appeals, and is known for preparing clients thoroughly for every hearing." }),
  L("sneha-kapoor", "Sneha Kapoor", "Property Law", "Bengaluru", 10, 4.5, 156, 2000, { im: "p4", sz: "470%", ps: "50% 18%" }, { also: ["Civil Law"], langs: ["English", "Hindi", "Kannada"], quals: ["B.A. LL.B. (Hons)", "Diploma in Real Estate Law"], courts: ["Karnataka High Court", "RERA Karnataka"], barNo: "KA/5521/2015", council: "Bar Council of Karnataka", tagline: "Title checks, RERA disputes and sale agreements that hold up.", about: "Sneha helps buyers, sellers and landlords with title verification, sale deeds, lease agreements and RERA complaints. Her due-diligence reports are written for non-lawyers." }),
  L("kabir-malhotra", "Kabir Malhotra", "Civil Law", "Mumbai", 11, 4.5, 133, 2200, { im: "p3", sz: "300%", ps: "46% 20%" }, { also: ["Criminal Law"], langs: ["English", "Hindi", "Marathi"], quals: ["LL.B. (Mumbai University)"], courts: ["Bombay High Court", "City Civil Court"], barNo: "MH/2207/2014", council: "Bar Council of Maharashtra & Goa", tagline: "Recovery suits, injunctions and tenancy disputes.", about: "Kabir handles civil litigation: money recovery, injunctions, tenancy and contract disputes, with a practical eye on cost and time." }),
  L("vikram-nair", "Vikram Nair", "Employment Law", "Hyderabad", 8, 4.4, 98, 1600, { im: "q7", sz: "220%", ps: "50% 20%", hero: { src: manDark, sz: "auto 100%", ps: "50% 50%" } }, { langs: ["English", "Hindi", "Telugu"], quals: ["LL.B. (Osmania University)", "LL.M. Labour Law"], courts: ["Telangana High Court", "Labour Courts"], barNo: "TS/1740/2017", council: "Bar Council of Telangana", tagline: "Wrongful termination, contracts and workplace rights.", about: "Vikram advises employees and employers on termination, severance, non-competes, POSH compliance and labour disputes." }),
  L("meera-kapoor", "Meera Kapoor", "Corporate Law", "Chennai", 10, 4.4, 121, 2400, { im: "p2", sz: "300%", ps: "49% 20%" }, { also: ["Family Law"], langs: ["English", "Tamil", "Hindi"], quals: ["B.Com LL.B.", "LL.M. Corporate & Securities"], courts: ["Madras High Court", "NCLT Chennai"], barNo: "TN/4410/2015", council: "Bar Council of Tamil Nadu & Puducherry", tagline: "Startup structuring, compliance and investor documents.", about: "Meera works with start-ups on structuring, funding documents and ongoing compliance, and with family businesses on succession planning." }),
];

export const DEMO_CLIENTS = [
  { id: "c-rahul", name: "Rahul Verma", email: "rahul.verma@example.com", phone: "98101 22345", city: "Delhi", since: "Jan 2026" },
  { id: "c-sameer", name: "Sameer Kapoor", email: "sameer.kapoor@example.com", phone: "98730 55120", city: "Gurugram", since: "Feb 2026" },
  { id: "c-neha", name: "Neha Bansal", email: "neha.bansal@example.com", phone: "99100 87654", city: "Noida", since: "Mar 2026" },
  { id: "c-imran", name: "Imran Qureshi", email: "imran.q@example.com", phone: "97110 34412", city: "Delhi", since: "Apr 2026" },
  { id: "c-tanvi", name: "Tanvi Joshi", email: "tanvi.joshi@example.com", phone: "98180 66231", city: "Faridabad", since: "May 2026" },
];
const REVIEW_NAMES = ["Rahul Verma", "Sameer Kapoor", "Neha Bansal", "Imran Qureshi", "Tanvi Joshi", "Ananya Desai", "Kunal Shah", "Divya Menon", "Farhan Ali", "Pooja Reddy"];
const REVIEW_TEXT = [
  "Explained everything in plain language and never made me feel rushed. I knew exactly what to expect from the process.",
  "Prepared, punctual and honest about the risks. The written summary after the call was genuinely useful.",
  "Replied to my follow-up questions the same day. Fees were exactly as quoted — no surprises.",
  "I was anxious about my case and came away with a clear plan and next steps. Highly recommended.",
  "Professional and calm. Spotted a problem in my documents that two others had missed.",
  "Very responsive on messages and gave practical advice rather than legal jargon.",
];
function reviewsFor(l, now) {
  return Array.from({ length: 6 }, (_, i) => ({
    id: `rv-${l.id}-${i}`, lawyerId: l.id, name: REVIEW_NAMES[(i * 3 + l.exp) % REVIEW_NAMES.length],
    rating: i === 5 ? 4 : i % 4 === 3 ? 4 : 5, text: REVIEW_TEXT[(i + l.exp) % REVIEW_TEXT.length], date: iso(addDays(-(9 + i * 23), now)),
  }));
}
function rng(seed) { let a = seed; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/** Sample practice data for a lawyer account (used for the demo lawyer and for newly registered lawyers). */
export function practiceFor(lawyerId, now = new Date(), tag = lawyerId) {
  const D = (n) => iso(addDays(n, now)), ts = (n, h = 10) => now.getTime() + n * 86400000 + (h - 12) * 3600000;
  const id = (s) => `${s}-${tag}`;
  const appts = [
    { id: id("ap1"), userId: "c-rahul", lawyerId, type: "video", date: D(0), time: "16:00", topic: "Founders’ agreement — vesting terms", status: "confirmed", fee: 2500 },
    { id: id("ap2"), userId: "c-sameer", lawyerId, type: "phone", date: D(1), time: "11:30", topic: "Notice received from a supplier", status: "confirmed", fee: 2000 },
    { id: id("ap3"), userId: "c-neha", lawyerId, type: "video", date: D(2), time: "15:00", topic: "Review of shareholder agreement", status: "pending", fee: 2500 },
    { id: id("ap4"), userId: "c-imran", lawyerId, type: "in-person", date: D(3), time: "12:00", topic: "Trademark objection reply", status: "pending", fee: 3750 },
    { id: id("ap5"), userId: "c-tanvi", lawyerId, type: "video", date: D(5), time: "10:30", topic: "LLP conversion — first discussion", status: "pending", fee: 2500 },
    { id: id("ap6"), userId: "c-rahul", lawyerId, type: "video", date: D(-6), time: "14:00", topic: "Term sheet walkthrough", status: "completed", fee: 2500 },
    { id: id("ap7"), userId: "c-sameer", lawyerId, type: "phone", date: D(-12), time: "10:00", topic: "Vendor contract clauses", status: "completed", fee: 2000 },
    { id: id("ap8"), userId: "c-imran", lawyerId, type: "video", date: D(-18), time: "17:00", topic: "NDA review", status: "cancelled", fee: 2500, reason: "Client rescheduled to another lawyer" },
  ].map((a) => ({ duration: 45, notes: "", createdAt: ts(-3), ...a }));
  const cases = [
    { id: id("cs1"), number: "LC-2026-0201", title: "Founder exit & buy-out", category: "Corporate Law", userId: "c-rahul", lawyerId, status: "active", stage: 2, summary: "Negotiating the buy-out price and vesting acceleration for a departing co-founder.", next: { label: "Draft settlement terms to client", date: D(4) } },
    { id: id("cs2"), number: "LC-2026-0188", title: "Supplier contract dispute", category: "Civil Law", userId: "c-sameer", lawyerId, status: "active", stage: 1, summary: "Supplier alleges breach of delivery schedule; reply to legal notice in preparation.", next: { label: "File reply to notice", date: D(6) } },
    { id: id("cs3"), number: "LC-2026-0164", title: "Trademark objection", category: "Corporate Law", userId: "c-imran", lawyerId, status: "active", stage: 3, summary: "Examination report objection under Section 11; hearing scheduled before the Registrar.", next: { label: "Registrar hearing", date: D(9) } },
    { id: id("cs4"), number: "LC-2025-0977", title: "Employment agreement review", category: "Employment Law", userId: "c-tanvi", lawyerId, status: "closed", stage: 4, summary: "Review and renegotiation of executive employment agreement. Concluded.", next: null },
  ].map((c, i) => ({
    opened: D(-40 + i * 9), stageDates: Array.from({ length: 5 }, (_, k) => (k <= c.stage ? D(-38 + i * 9 + k * 7) : null)),
    docs: [{ id: `${c.id}-d1`, name: "Engagement letter.pdf", size: "212 KB", by: "Lawyer", date: D(-30 + i) }, { id: `${c.id}-d2`, name: "Client documents.zip", size: "3.4 MB", by: "Client", date: D(-26 + i) }],
    notes: [{ id: `${c.id}-n1`, by: "lawyer", text: "Initial assessment done. Key risks noted; client briefed on options and costs.", date: D(-20 + i) }],
    deadlines: c.next ? [{ id: `${c.id}-dl1`, label: c.next.label, date: c.next.date }] : [], ...c,
  }));
  const convs = [
    { id: id("cv1"), userId: "c-rahul", lawyerId, ul: 1, ll: 1, messages: [
      { id: "m1", from: "user", text: "Hi, I’ve uploaded the revised vesting schedule. Could you check clause 4?", ts: ts(0, 9) },
      { id: "m2", from: "lawyer", text: "Thanks Rahul — I’ll review tonight and we can discuss on today’s call.", ts: ts(0, 9.5) },
      { id: "m3", from: "user", text: "Perfect. See you at 4.", ts: ts(0, 10) }] },
    { id: id("cv2"), userId: "c-sameer", lawyerId, ul: 0, ll: 0, messages: [
      { id: "m1", from: "lawyer", text: "Sameer, please send the supplier’s notice and your delivery records ahead of tomorrow’s call.", ts: ts(-1, 15) },
      { id: "m2", from: "user", text: "Sent them by email just now.", ts: ts(-1, 16) }] },
    { id: id("cv3"), userId: "c-neha", lawyerId, ul: 0, ll: 1, messages: [{ id: "m1", from: "user", text: "Hello Advocate, I’ve requested a consultation about my shareholder agreement. Looking forward to it.", ts: ts(-1, 11) }] },
  ];
  const notifs = [
    { id: id("nt1"), to: lawyerId, kind: "appointment", title: "New consultation request", body: "Neha Bansal requested a video consultation on " + D(2) + " at 3:00 PM.", ts: ts(-1, 11), read: false, link: "/lawyer/appointments" },
    { id: id("nt2"), to: lawyerId, kind: "appointment", title: "New consultation request", body: "Imran Qureshi requested an in-person meeting.", ts: ts(-1, 9), read: false, link: "/lawyer/appointments" },
    { id: id("nt3"), to: lawyerId, kind: "message", title: "Message from Rahul Verma", body: "Perfect. See you at 4.", ts: ts(0, 10), read: false, link: "/lawyer/messages" },
    { id: id("nt4"), to: lawyerId, kind: "payment", title: "Payment received", body: "₹2,250 credited for Term sheet walkthrough.", ts: ts(-6, 15), read: true, link: "/lawyer/earnings" },
    { id: id("nt5"), to: lawyerId, kind: "general", title: "Profile verified", body: "Your Bar Council enrolment has been verified. You now show the Verified badge.", ts: ts(-30), read: true, link: "/lawyer/profile" },
  ];
  const r = rng(hash(lawyerId).length * 977 + 11), clients = ["c-rahul", "c-sameer", "c-neha", "c-imran", "c-tanvi"];
  const pays = [];
  for (let m = 11; m >= 0; m--) {
    const n = 5 + Math.floor(r() * 7) + (11 - m) % 4;
    for (let k = 0; k < n; k++) {
      const when = new Date(now.getFullYear(), now.getMonth() - m, 1 + Math.floor(r() * 26), 11 + Math.floor(r() * 6));
      if (when > now) continue;
      const amount = [2500, 2000, 3750, 2500, 1250][Math.floor(r() * 5)];
      pays.push({ id: `${id("pm")}-${m}-${k}`, userId: clients[Math.floor(r() * clients.length)], lawyerId, desc: "Consultation fee", amount, ts: when.getTime(), status: "paid", method: "Card", invoice: `LC-INV-${when.getFullYear()}-${String(pays.length + 1).padStart(4, "0")}` });
    }
  }
  pays.push({ id: id("pm-p1"), apptId: id("ap3"), userId: "c-neha", lawyerId, desc: "Consultation fee (held until the call)", amount: 2500, ts: ts(-1, 11), status: "processing", method: "UPI", invoice: "LC-INV-2026-0900" });
  pays.push({ id: id("pm-p2"), apptId: id("ap4"), userId: "c-imran", lawyerId, desc: "Consultation fee (held until the call)", amount: 3750, ts: ts(-1, 9), status: "processing", method: "Card", invoice: "LC-INV-2026-0901" });
  return { appts, cases, convs, notifs, pays };
}

export function buildSeed(now = new Date()) {
  const D = (n) => iso(addDays(n, now)), ts = (n, h = 10) => now.getTime() + n * 86400000 + (h - 12) * 3600000;
  const lawyers = SEED_LAWYERS.map((l) => ({ ...l }));
  const demo = practiceFor(DEMO_LAWYER_ID, now, "aarav");
  const ua = DEMO_USER_ID;
  const mine = [
    { id: "ap-u1", userId: ua, lawyerId: "priya-sharma", type: "video", date: D(1), time: "10:00", topic: "Child custody arrangement — advice", status: "confirmed", fee: 1800 },
    { id: "ap-u2", userId: ua, lawyerId: DEMO_LAWYER_ID, type: "video", date: D(4), time: "14:30", topic: "Shareholder agreement review", status: "confirmed", fee: 2500 },
    { id: "ap-u3", userId: ua, lawyerId: "sneha-kapoor", type: "phone", date: D(6), time: "11:00", topic: "Rental agreement clauses", status: "pending", fee: 1600 },
    { id: "ap-u4", userId: ua, lawyerId: "priya-sharma", type: "video", date: D(-9), time: "15:00", topic: "Initial family-law consultation", status: "completed", fee: 1800 },
    { id: "ap-u5", userId: ua, lawyerId: "kabir-malhotra", type: "in-person", date: D(-20), time: "12:00", topic: "Tenancy deposit recovery", status: "completed", fee: 3300 },
    { id: "ap-u6", userId: ua, lawyerId: "vikram-nair", type: "phone", date: D(-3), time: "17:00", topic: "Notice-period question", status: "cancelled", fee: 1280, reason: "Resolved with employer directly" },
  ].map((a) => ({ duration: 45, notes: "", createdAt: ts(-4), ...a }));
  const stageDates = (n, start) => Array.from({ length: 5 }, (_, k) => (k <= n ? D(start + k * 8) : null));
  const cases = [
    { id: "cs-u1", number: "LC-2026-0142", title: "Shareholder agreement dispute", category: "Corporate Law", userId: ua, lawyerId: DEMO_LAWYER_ID, status: "active", stage: 2, opened: D(-34), stageDates: stageDates(2, -34), summary: "Disagreement over exit terms in a three-founder shareholder agreement. Negotiation is under way ahead of a possible mediation.", next: { label: "Mediation session", date: D(11) },
      docs: [{ id: "d1", name: "Shareholder agreement.pdf", size: "1.2 MB", by: "Client", date: D(-33) }, { id: "d2", name: "Email correspondence.zip", size: "5.8 MB", by: "Client", date: D(-30) }, { id: "d3", name: "Legal opinion draft.docx", size: "148 KB", by: "Lawyer", date: D(-12) }],
      notes: [{ id: "n1", by: "lawyer", text: "Clause 9.2 (drag-along) is the key issue. I recommend we propose a revised valuation formula before mediation.", date: D(-12) }, { id: "n2", by: "lawyer", text: "Other side has agreed in principle to mediation. Please keep Friday afternoon free.", date: D(-3) }],
      deadlines: [{ id: "dl1", label: "Mediation session", date: D(11) }, { id: "dl2", label: "Submit revised valuation memo", date: D(5) }] },
    { id: "cs-u2", number: "LC-2026-0098", title: "Child custody arrangement", category: "Family Law", userId: ua, lawyerId: "priya-sharma", status: "active", stage: 1, opened: D(-15), stageDates: stageDates(1, -15), summary: "Drafting a parenting plan for mutual consent; no court filing required at this stage.", next: { label: "Share signed parenting plan", date: D(8) },
      docs: [{ id: "d4", name: "Parenting plan draft.docx", size: "96 KB", by: "Lawyer", date: D(-5) }], notes: [{ id: "n3", by: "lawyer", text: "Draft plan shared. Please mark any changes you would like on the schedule section.", date: D(-5) }],
      deadlines: [{ id: "dl3", label: "Share signed parenting plan", date: D(8) }] },
    { id: "cs-u3", number: "LC-2025-0731", title: "Tenancy deposit recovery", category: "Civil Law", userId: ua, lawyerId: "kabir-malhotra", status: "closed", stage: 4, opened: D(-75), stageDates: stageDates(4, -75), summary: "Deposit recovered in full after a legal notice. Case closed.", next: null,
      docs: [{ id: "d5", name: "Legal notice.pdf", size: "310 KB", by: "Lawyer", date: D(-60) }], notes: [{ id: "n4", by: "lawyer", text: "Landlord refunded the deposit with interest. Closing the matter.", date: D(-22) }], deadlines: [] },
  ];
  const convs = [
    { id: "cv-u1", userId: ua, lawyerId: DEMO_LAWYER_ID, ul: 1, ll: 0, messages: [
      { id: "m1", from: "lawyer", text: "Hello Ananya, I’ve reviewed the agreement you sent. Clause 9.2 needs attention — let’s cover it on Thursday.", ts: ts(-2, 17) },
      { id: "m2", from: "user", text: "Thank you, Advocate. Should I bring the earlier email trail as well?", ts: ts(-2, 18) },
      { id: "m3", from: "lawyer", text: "Yes please. And a short timeline of the key events, if you can.", ts: ts(-1, 10) }] },
    { id: "cv-u2", userId: ua, lawyerId: "priya-sharma", ul: 0, ll: 0, messages: [
      { id: "m1", from: "lawyer", text: "Draft parenting plan attached. Mark up anything that doesn’t feel right.", ts: ts(-5, 12) },
      { id: "m2", from: "user", text: "Looks thoughtful. I’ll go through it tonight.", ts: ts(-5, 13) }] },
    { id: "cv-u3", userId: ua, lawyerId: "sneha-kapoor", ul: 0, ll: 0, messages: [{ id: "m1", from: "user", text: "Hello, I’ve booked a call about my rental agreement. Is there anything I should prepare?", ts: ts(-1, 14) }] },
  ];
  const notifs = [
    { id: "nt-u1", to: ua, kind: "appointment", title: "Appointment confirmed", body: "Priya Sharma confirmed your video consultation tomorrow at 10:00 AM.", ts: ts(-1, 16), read: false, link: "/user/appointments" },
    { id: "nt-u2", to: ua, kind: "message", title: "New message from Aarav Mehta", body: "Yes please. And a short timeline of the key events, if you can.", ts: ts(-1, 10), read: false, link: "/user/messages" },
    { id: "nt-u3", to: ua, kind: "case", title: "Case update", body: "Shareholder agreement dispute moved to Negotiation.", ts: ts(-4, 12), read: false, link: "/user/cases" },
    { id: "nt-u4", to: ua, kind: "payment", title: "Payment successful", body: "₹1,800 paid for Initial family-law consultation.", ts: ts(-9, 13), read: true, link: "/user/payments" },
    { id: "nt-u5", to: ua, kind: "general", title: "Welcome to LegalConnect", body: "Complete your profile so lawyers can prepare before your first call.", ts: ts(-40), read: true, link: "/user/profile" },
  ];
  const upays = [
    { id: "pm-u1", apptId: "ap-u2", userId: ua, lawyerId: DEMO_LAWYER_ID, desc: "Video consultation — Shareholder agreement review", amount: 2500, ts: ts(-3, 12), status: "paid", method: "Visa •••• 4821", invoice: "LC-INV-2026-0412" },
    { id: "pm-u2", apptId: "ap-u1", userId: ua, lawyerId: "priya-sharma", desc: "Video consultation — Child custody arrangement", amount: 1800, ts: ts(-3, 13), status: "paid", method: "Visa •••• 4821", invoice: "LC-INV-2026-0413" },
    { id: "pm-u3", apptId: "ap-u3", userId: ua, lawyerId: "sneha-kapoor", desc: "Phone consultation — Rental agreement clauses", amount: 1600, ts: ts(-1, 14), status: "processing", method: "UPI", invoice: "LC-INV-2026-0455" },
    { id: "pm-u4", apptId: "ap-u4", userId: ua, lawyerId: "priya-sharma", desc: "Initial family-law consultation", amount: 1800, ts: ts(-9, 13), status: "paid", method: "UPI", invoice: "LC-INV-2026-0388" },
    { id: "pm-u5", apptId: "ap-u5", userId: ua, lawyerId: "kabir-malhotra", desc: "In-person consultation — Tenancy deposit recovery", amount: 3300, ts: ts(-20, 11), status: "paid", method: "Visa •••• 4821", invoice: "LC-INV-2026-0301" },
    { id: "pm-u6", apptId: "ap-u6", userId: ua, lawyerId: "vikram-nair", desc: "Phone consultation — cancelled, refunded", amount: 1280, ts: ts(-4, 16), status: "refunded", method: "UPI", invoice: "LC-INV-2026-0370" },
  ];
  const accounts = [
    { id: ua, role: "user", email: "ananya.desai@example.com", pass: hash(DEMO_PASSWORD), name: "Ananya Desai", phone: "98200 11234", city: "Mumbai", dob: "1992-06-14", gender: "Female", language: "English", address: "Bandra West, Mumbai", about: "Co-founder of a design studio. Looking for practical advice on agreements and a family matter.", created: ts(-120), demo: true },
    { id: DEMO_LAWYER_ID, role: "lawyer", email: "aarav.mehta@example.com", pass: hash(DEMO_PASSWORD), name: "Aarav Mehta", phone: "98110 45678", created: ts(-400), demo: true },
  ];
  return {
    v: 2, seeded: now.getTime(), session: null, accounts, lawyers,
    clients: DEMO_CLIENTS, appointments: [...mine, ...demo.appts], cases: [...cases, ...demo.cases], conversations: [...convs, ...demo.convs],
    notifications: [...notifs, ...demo.notifs], payments: [...upays, ...demo.pays], payouts: [{ id: "po-1", lawyerId: DEMO_LAWYER_ID, amount: 18000, ts: ts(-21), status: "paid" }],
    reviews: Object.fromEntries(lawyers.map((l) => [l.id, reviewsFor(l, now)])), saved: { [ua]: ["priya-sharma", "meera-kapoor", "sneha-kapoor"] },
    settings: { [ua]: { emailNotif: true, smsNotif: true, reminders: true, offers: false, language: "English", twoFactor: false }, [DEMO_LAWYER_ID]: { emailNotif: true, smsNotif: true, reminders: true, offers: false, autoAccept: false, duration: 45, buffer: 10, twoFactor: true, language: "English" } },
  };
}
export { practiceFor as buildPractice };
