import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { buildSeed, practiceFor, DEMO_LAWYER_ID, FEE_BY_TYPE, STAGES } from "../data/demo.js";
import { uid, hash, iso, addDays, slug, dateLong, time12 } from "../utils/format.js";
import { personName, lawyerById } from "./selectors.js";

const KEY = "lc-demo-v2";
const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) { const s = JSON.parse(raw); if (s?.v === 2) return s; } } catch { /* ignore */ }
  return buildSeed();
}
const notify = (d, to, kind, title, body, link) => d.notifications.unshift({ id: uid("nt"), to, kind, title, body, ts: Date.now(), read: false, link });
const LAWYER_REPLIES = ["Thanks for the update — I’ll review this and revert shortly.", "Noted. Let’s go through it properly in our next consultation.", "Please share the relevant documents here and I’ll take a look today.", "That’s helpful context. I’ll factor it into the plan."];
const CLIENT_REPLIES = ["Thank you, Advocate. I’ll send that across today.", "Understood. Would tomorrow work for a quick call?", "Thanks — that helps a lot.", "Got it. I’ll share the documents by evening."];

export function AppProvider({ children }) {
  const [state, setState] = useState(load);
  const [toasts, setToasts] = useState([]);
  const [typing, setTyping] = useState({});
  const ref = useRef(state); ref.current = state;
  const openConv = useRef(null);

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage full or blocked */ } }, [state]);
  useEffect(() => { const on = (e) => { if (e.key === KEY && e.newValue) { try { setState(JSON.parse(e.newValue)); } catch { /* ignore */ } } }; window.addEventListener("storage", on); return () => window.removeEventListener("storage", on); }, []);

  const mutate = useCallback((fn) => setState((s) => { const d = structuredClone(s); fn(d); return d; }), []);
  const toast = useCallback((msg, type = "ok") => { const id = uid("t"); setToasts((t) => [...t, { id, msg, type }]); setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200); }, []);
  const dismissToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  // Simulated "other side": pending bookings with lawyers who are not the signed-in one confirm themselves after a few seconds.
  useEffect(() => {
    const t = setInterval(() => {
      const s = ref.current; const sessLawyer = s.session?.role === "lawyer" ? s.session.id : null, now = Date.now();
      if (!s.appointments.some((a) => a.status === "pending" && a.autoConfirmAt && a.autoConfirmAt <= now && a.lawyerId !== sessLawyer)) return;
      mutate((d) => d.appointments.forEach((a) => {
        if (a.status === "pending" && a.autoConfirmAt && a.autoConfirmAt <= now && a.lawyerId !== sessLawyer) {
          a.status = "confirmed"; delete a.autoConfirmAt;
          d.payments.filter((p) => p.apptId === a.id).forEach((p) => { p.status = "paid"; });
          notify(d, a.userId, "appointment", "Appointment confirmed", `${lawyerById(d, a.lawyerId)?.name} confirmed your consultation on ${dateLong(a.date)} at ${time12(a.time)}.`, "/user/appointments");
        }
      }));
    }, 2500);
    return () => clearInterval(t);
  }, [mutate]);

  const actions = useMemo(() => {
    const A = {};
    const sess = () => ref.current.session;
    A.toast = toast;
    A.setOpenConv = (id) => { openConv.current = id; };

    A.registerUser = ({ name, email, phone, password }) => {
      const s = ref.current, em = email.trim().toLowerCase();
      if (s.accounts.some((a) => a.role === "user" && a.email === em)) return { ok: false, error: "A client account with this email already exists. Try logging in." };
      const id = uid("u");
      mutate((d) => {
        d.accounts.push({ id, role: "user", email: em, pass: hash(password), name: name.trim(), phone, city: "", dob: "", gender: "", language: "English", address: "", about: "", created: Date.now() });
        d.settings[id] = { emailNotif: true, smsNotif: false, reminders: true, offers: false, language: "English", twoFactor: false };
        notify(d, id, "general", "Welcome to LegalConnect", "Your demo account is ready. Browse lawyers and book your first consultation.", "/find-lawyers");
        d.session = { role: "user", id };
      });
      return { ok: true };
    };
    A.registerLawyer = (f) => {
      const s = ref.current, em = f.email.trim().toLowerCase();
      if (s.accounts.some((a) => a.role === "lawyer" && a.email === em)) return { ok: false, error: "A lawyer account with this email already exists. Try logging in." };
      let id = slug(f.name) || "lawyer"; if (s.lawyers.some((l) => l.id === id)) id += "-" + Math.random().toString(36).slice(2, 5);
      const prac = practiceFor(id, new Date(), id);
      mutate((d) => {
        d.accounts.push({ id, role: "lawyer", email: em, pass: hash(f.password), name: f.name.trim(), phone: f.phone, created: Date.now() });
        d.lawyers.push({ id, name: f.name.trim(), area: f.areas[0], areas: f.areas, city: f.city, exp: Number(f.exp), rating: 0, reviews: 0, fee: Number(f.fee), ...(f.photo ? { src: f.photo, sz: "cover", ps: "center" } : { sz: "cover", ps: "center", src: "" }),
          langs: f.langs?.length ? f.langs : ["English"], quals: f.quals, courts: [f.council], barNo: f.barNo.toUpperCase(), council: f.council, tagline: f.bio.split(/[.!?]/)[0].slice(0, 90), about: f.bio, verification: "in_review", joined: String(new Date().getFullYear()),
          schedule: [0, 1, 2, 3, 4, 5, 6].map((x) => ({ day: x, on: x >= 1 && x <= 5, from: "10:00", to: "18:00" })), docs: f.docs || {} });
        d.reviews[id] = [];
        d.appointments.push(...prac.appts); d.cases.push(...prac.cases); d.conversations.push(...prac.convs); d.notifications.push(...prac.notifs.filter((n) => n.kind !== "general")); d.payments.push(...prac.pays);
        d.settings[id] = { emailNotif: true, smsNotif: true, reminders: true, offers: false, autoAccept: false, duration: 45, buffer: 10, twoFactor: false, language: "English" };
        notify(d, id, "general", "Verification in review", "We are checking your Bar Council enrolment and documents. This usually takes 1–2 working days. Sample clients and cases are loaded so you can explore.", "/lawyer/profile");
        d.session = { role: "lawyer", id };
      });
      return { ok: true, id };
    };
    A.login = (role, email, password) => {
      const a = ref.current.accounts.find((x) => x.role === role && x.email === email.trim().toLowerCase());
      if (!a || a.pass !== hash(password)) return { ok: false, error: "Email or password is incorrect. Use the demo account below, or register first." };
      mutate((d) => { d.session = { role, id: a.id }; });
      return { ok: true };
    };
    A.loginDemo = (role) => { mutate((d) => { d.session = { role, id: role === "user" ? "u-ananya" : DEMO_LAWYER_ID }; }); };
    A.logout = () => mutate((d) => { d.session = null; });
    A.requestReset = (email) => {
      const a = ref.current.accounts.find((x) => x.email === email.trim().toLowerCase());
      mutate((d) => { d.reset = a ? { email: a.email, role: a.role, code: "482913", at: Date.now() } : null; });
      return { ok: true, exists: !!a };
    };
    A.confirmReset = (email, code, pass) => {
      const r = ref.current.reset;
      if (!r || r.email !== email.trim().toLowerCase() || r.code !== code.trim()) return { ok: false, error: "That code is not valid. In this demo it is 482913." };
      mutate((d) => { const a = d.accounts.find((x) => x.email === r.email); if (a) a.pass = hash(pass); d.reset = null; });
      return { ok: true, role: r.role };
    };
    A.updateAccount = (patch) => mutate((d) => { const a = d.accounts.find((x) => x.id === d.session?.id); if (a) Object.assign(a, patch); });
    A.updateLawyer = (patch) => mutate((d) => { const l = d.lawyers.find((x) => x.id === d.session?.id); if (l) Object.assign(l, patch); });
    A.setSettings = (patch) => mutate((d) => { d.settings[d.session.id] = { ...(d.settings[d.session.id] || {}), ...patch }; });
    A.changePassword = (cur, next) => {
      const a = ref.current.accounts.find((x) => x.id === sess()?.id);
      if (!a || a.pass !== hash(cur)) return { ok: false, error: "Current password is incorrect." };
      mutate((d) => { d.accounts.find((x) => x.id === d.session.id).pass = hash(next); });
      return { ok: true };
    };
    A.toggleSave = (lawyerId) => mutate((d) => { const id = d.session?.id; if (!id) return; const l = d.saved[id] || []; d.saved[id] = l.includes(lawyerId) ? l.filter((x) => x !== lawyerId) : [...l, lawyerId]; });

    A.book = ({ lawyerId, type, date, time, topic, notes, method }) => {
      const s = ref.current, l = lawyerById(s, lawyerId), uidv = s.session.id;
      const fee = Math.round(l.fee * FEE_BY_TYPE[type]), id = uid("ap"), pid = uid("pm");
      const auto = lawyerId !== (s.session?.role === "lawyer" ? s.session.id : null) && lawyerId !== DEMO_LAWYER_ID;
      const appt = { id, userId: uidv, lawyerId, type, date, time, duration: 45, topic: topic || "General consultation", notes: notes || "", status: "pending", fee, createdAt: Date.now(), ...(auto ? { autoConfirmAt: Date.now() + 9000 } : {}) };
      mutate((d) => {
        d.appointments.push(appt);
        d.payments.push({ id: pid, apptId: id, userId: uidv, lawyerId, desc: `${{ video: "Video", phone: "Phone", "in-person": "In-person" }[type]} consultation — ${appt.topic}`, amount: fee, ts: Date.now(), status: "processing", method: method || "Card", invoice: `LC-INV-${new Date().getFullYear()}-${String(d.payments.length + 500).padStart(4, "0")}` });
        notify(d, lawyerId, "appointment", "New consultation request", `${personName(d, uidv)} requested a ${type} consultation on ${dateLong(date)} at ${time12(time)}.`, "/lawyer/appointments");
        notify(d, uidv, "appointment", "Request sent", `Your request to ${l.name} is awaiting confirmation.`, "/user/appointments");
      });
      return appt;
    };
    A.setAppt = (id, action, extra = {}) => mutate((d) => {
      const a = d.appointments.find((x) => x.id === id); if (!a) return;
      const role = d.session?.role, other = role === "lawyer" ? a.userId : a.lawyerId, who = role === "lawyer" ? lawyerById(d, a.lawyerId)?.name : personName(d, a.userId);
      const pay = (st) => d.payments.filter((p) => p.apptId === id).forEach((p) => { p.status = st; });
      const when = `${dateLong(a.date)} at ${time12(a.time)}`;
      if (action === "accept") { a.status = "confirmed"; delete a.autoConfirmAt; pay("paid"); notify(d, a.userId, "appointment", "Appointment confirmed", `${who} confirmed your consultation on ${when}.`, "/user/appointments"); }
      if (action === "reject") { a.status = "rejected"; a.reason = extra.reason || "Not available at that time"; pay("refunded"); notify(d, a.userId, "appointment", "Request declined", `${who} could not take the consultation on ${when}. Your payment will be refunded.`, "/user/appointments"); }
      if (action === "cancel") { a.status = "cancelled"; a.reason = extra.reason || "Cancelled"; delete a.autoConfirmAt; pay("refunded"); notify(d, other, "appointment", "Appointment cancelled", `${who} cancelled the consultation on ${when}.`, role === "lawyer" ? "/user/appointments" : "/lawyer/appointments"); }
      if (action === "complete") { a.status = "completed"; pay("paid"); notify(d, a.userId, "appointment", "Consultation completed", `How was your consultation with ${who}? You can leave a review.`, "/user/appointments"); }
      if (action === "reschedule") { a.date = extra.date; a.time = extra.time; a.status = role === "lawyer" ? "confirmed" : "pending"; delete a.autoConfirmAt; notify(d, other, "appointment", "Consultation rescheduled", `${who} moved the consultation to ${dateLong(a.date)} at ${time12(a.time)}.`, role === "lawyer" ? "/user/appointments" : "/lawyer/appointments"); }
    });
    A.addReview = (lawyerId, { rating, text }) => mutate((d) => {
      const l = d.lawyers.find((x) => x.id === lawyerId); if (!l) return;
      (d.reviews[lawyerId] ||= []).unshift({ id: uid("rv"), lawyerId, name: personName(d, d.session.id), rating, text, date: iso(new Date()) });
      l.rating = Math.round(((l.rating * l.reviews + rating) / (l.reviews + 1)) * 10) / 10; l.reviews += 1;
    });

    A.sendMessage = (convId, text) => {
      const s = ref.current, role = s.session.role, c = s.conversations.find((x) => x.id === convId); if (!c || !text.trim()) return;
      mutate((d) => {
        const cv = d.conversations.find((x) => x.id === convId);
        cv.messages.push({ id: uid("m"), from: role, text: text.trim(), ts: Date.now() });
        if (role === "user") cv.ll = (cv.ll || 0) + 1; else cv.ul = (cv.ul || 0) + 1;
        notify(d, role === "user" ? cv.lawyerId : cv.userId, "message", `Message from ${role === "user" ? personName(d, cv.userId) : lawyerById(d, cv.lawyerId)?.name}`, text.trim().slice(0, 90), role === "user" ? "/lawyer/messages" : "/user/messages");
      });
      setTyping((t) => ({ ...t, [convId]: true }));
      setTimeout(() => {
        setTyping((t) => ({ ...t, [convId]: false }));
        const pool = role === "user" ? LAWYER_REPLIES : CLIENT_REPLIES, reply = pool[Math.floor(Math.random() * pool.length)];
        mutate((d) => {
          const cv = d.conversations.find((x) => x.id === convId); if (!cv) return;
          cv.messages.push({ id: uid("m"), from: role === "user" ? "lawyer" : "user", text: reply, ts: Date.now() });
          const key = role === "user" ? "ul" : "ll"; if (openConv.current !== convId) cv[key] = (cv[key] || 0) + 1;
          if (openConv.current !== convId) notify(d, d.session?.id, "message", `Message from ${role === "user" ? lawyerById(d, cv.lawyerId)?.name : personName(d, cv.userId)}`, reply.slice(0, 90), role === "user" ? "/user/messages" : "/lawyer/messages");
        });
      }, 1800 + Math.random() * 1400);
    };
    A.readConv = (convId) => mutate((d) => { const c = d.conversations.find((x) => x.id === convId); if (c) { if (d.session?.role === "user") c.ul = 0; else c.ll = 0; } });
    A.openConversation = (otherId) => {
      const s = ref.current, role = s.session.role;
      const found = s.conversations.find((c) => (role === "user" ? c.userId === s.session.id && c.lawyerId === otherId : c.lawyerId === s.session.id && c.userId === otherId));
      if (found) return found.id;
      const id = uid("cv");
      mutate((d) => { d.conversations.push({ id, userId: role === "user" ? d.session.id : otherId, lawyerId: role === "user" ? otherId : d.session.id, ul: 0, ll: 0, messages: [] }); });
      return id;
    };
    A.markNotif = (id, read = true) => mutate((d) => { const n = d.notifications.find((x) => x.id === id); if (n) n.read = read; });
    A.markAllNotif = () => mutate((d) => d.notifications.forEach((n) => { if (n.to === d.session?.id) n.read = true; }));
    A.deleteNotif = (id) => mutate((d) => { d.notifications = d.notifications.filter((n) => n.id !== id); });

    A.setStage = (caseId, idx) => mutate((d) => {
      const c = d.cases.find((x) => x.id === caseId); if (!c) return;
      c.stage = idx; c.stageDates[idx] = iso(new Date()); c.status = idx >= STAGES.length - 1 ? "closed" : "active";
      notify(d, c.userId, "case", "Case update", `${c.title} moved to ${STAGES[idx]}.`, "/user/cases");
    });
    A.addNote = (caseId, text) => mutate((d) => { const c = d.cases.find((x) => x.id === caseId); if (c) c.notes.unshift({ id: uid("n"), by: d.session.role, text, date: iso(new Date()) }); });
    A.addDeadline = (caseId, label, date) => mutate((d) => { const c = d.cases.find((x) => x.id === caseId); if (c) { c.deadlines.push({ id: uid("dl"), label, date }); c.deadlines.sort((a, b) => a.date.localeCompare(b.date)); c.next = { label: c.deadlines[0].label, date: c.deadlines[0].date }; } });
    A.addDoc = (caseId, file) => mutate((d) => { const c = d.cases.find((x) => x.id === caseId); if (c) c.docs.push({ id: uid("d"), name: file.name, size: `${Math.max(1, Math.round(file.size / 1024))} KB`, by: d.session.role === "lawyer" ? "Lawyer" : "Client", date: iso(new Date()) }); });
    A.createCase = ({ clientId, title, category }) => {
      const id = uid("cs"), n = ref.current.cases.length + 301;
      mutate((d) => { d.cases.push({ id, number: `LC-${new Date().getFullYear()}-0${n}`, title, category, userId: clientId, lawyerId: d.session.id, status: "active", stage: 0, opened: iso(new Date()), stageDates: [iso(new Date()), null, null, null, null], summary: "New matter opened.", next: null, docs: [], notes: [], deadlines: [] }); notify(d, clientId, "case", "New case opened", `${title} has been opened by ${lawyerById(d, d.session.id)?.name}.`, "/user/cases"); });
      return id;
    };
    A.withdraw = (amount) => mutate((d) => { d.payouts.push({ id: uid("po"), lawyerId: d.session.id, amount, ts: Date.now(), status: "processing" }); });
    A.resetDemo = () => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } setState(buildSeed()); };
    return A;
  }, [mutate, toast]);

  const session = state.session;
  const account = session ? state.accounts.find((a) => a.id === session.id) || null : null;
  const lawyer = session?.role === "lawyer" ? state.lawyers.find((l) => l.id === session.id) || null : null;
  const value = useMemo(() => ({ state, session, account, lawyer, actions, toasts, dismissToast, typing }), [state, session, account, lawyer, actions, toasts, dismissToast, typing]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
