import w from "react";
import * as n from "react/jsx-runtime";
import { J, Ur, kn } from "../lib/core.js";
import { He, Pe, Rc, Xs, vy, yo } from "../lib/domain.js";
import { seedState } from "../data/seed.js";

/* app/state/store.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
export const nm = "lp_demo_state_v2",
  jy = "lp_demo_state_v1",
  Kn = "lp_demo_session_v1",
  or = (e, t) => {
    try {
      return JSON.parse(e.getItem(t));
    } catch {
      return null;
    }
  },
  sd = (e, t, s) => {
    try {
      e.setItem(t, JSON.stringify(s));
    } catch {}
  },
  ri = (e, t) => {
    try {
      e.removeItem(t);
    } catch {}
  };
function wy(e) {
  const t = seedState(),
    s = Object.fromEntries(t.clients.map((l) => [l.name, l.id]));
  return {
    ...t,
    accounts: e.accounts,
    lawyers: e.lawyers,
    activity: e.activity,
    notifications: e.notifications,
    appointments: e.appointments.map((l) => {
      var i;
      return { ...l, clientId: l.clientId || s[(i = l.client) == null ? void 0 : i.name] || null };
    }),
  };
}
function ld(e) {
  const t = seedState();
  return {
    ...e,
    activity: (e.activity || []).map((s) => ({ lawyerId: He, ...s })),
    notifications: (e.notifications || []).map((s) => ({ lawyerId: He, ...s })),
    payouts: e.payouts || t.payouts,
    tickets: e.tickets || [],
  };
}
function lpOk(e) {
  try {
    const T = (x) => typeof x == "string",
      D = (x) => T(x) && !isNaN(Date.parse(x)),
      L = Object.values(e.lawyers);
    return (
      L.length > 0 &&
      L.every((l) => l && T(l.id) && T(l.name) && l.verification && T(l.verification.status)) &&
      Array.isArray(e.accounts) &&
      e.appointments.every((a) => a && T(a.id) && a.client && T(a.client.name) && D(a.startsAt)) &&
      e.cases.every((c) => c && T(c.id) && T(c.title)) &&
      (e.clients || []).every((c) => c && T(c.id) && T(c.name)) &&
      (e.notifications || []).every((q) => q && T(q.id) && D(q.at)) &&
      Array.isArray(e.conversations) &&
      e.conversations.every(
        (c) => c && T(c.id) && Array.isArray(c.messages) && c.messages.every((m) => m && D(m.at)),
      )
    );
  } catch {
    return !1;
  }
}
function loadState() {
  const e = or(window.localStorage, nm);
  if (e && e.v === 2 && Array.isArray(e.appointments) && Array.isArray(e.cases) && e.lawyers) {
    if (lpOk(e)) return ld(e);
    console.warn("[LegalConnect portal] Stored demo data failed validation; restored sample data.");
    return seedState();
  }
  const t = or(window.localStorage, jy);
  return t && t.v === 1 && Array.isArray(t.appointments) && t.lawyers && t.accounts ? ld(wy(t)) : seedState();
}
function Cy() {
  const e = or(window.sessionStorage, Kn) || or(window.localStorage, Kn);
  return e && e.accountId ? e : null;
}
const pe = () => new Date().toISOString();
function sm(e) {
  return (
    e && {
      ...e,
      title: e.title || "Advocate",
      headline: e.headline || "",
      bio: e.bio || "",
      avatarData: e.avatarData || null,
      avatar: e.avatarData || e.avatar || null,
      qualifications: e.qualifications || [],
      consult: e.consult || {
        video: { on: !0, fee: 2500 },
        phone: { on: !1, fee: 2e3 },
        in_person: { on: !1, fee: 4e3 },
      },
      office: e.office || { address: "", city: e.city || "", serviceCities: [] },
      payout: e.payout || null,
      settings: vy(e.settings),
      availability: e.availability
        ? {
            ...Xs,
            ...e.availability,
            weekly: { ...Xs.weekly, ...e.availability.weekly },
            blocked: e.availability.blocked || [],
          }
        : { ...Xs, weekly: { ...Xs.weekly }, blocked: [] },
    }
  );
}
let Ay = 0;
const ul = (e) => `${e}_${Date.now().toString(36)}${(Ay++).toString(36)}`;
function Ey(e, t) {
  const s = e.docs.filter((i) => t !== "incomplete" || i.kind !== "degree"),
    l = (i, r) =>
      t === "approved"
        ? { ...i, status: "verified", note: "" }
        : t === "pending"
          ? { ...i, status: "in_review", note: "" }
          : t === "rejected"
            ? i.kind === "bar_cert"
              ? {
                  ...i,
                  status: "rejected",
                  note: "The scan is cropped and the enrolment number is not legible. Upload a full, clear copy.",
                }
              : { ...i, status: "verified", note: "" }
            : { ...i, status: "uploaded", note: "" };
  return {
    ...e,
    status: t,
    docs: s.map(l),
    reviewedAt: t === "approved" || t === "rejected" ? pe() : null,
    reviewNote:
      t === "rejected"
        ? "One document could not be accepted. See the details below and upload a replacement."
        : "",
    submittedAt: t === "incomplete" ? null : e.submittedAt || pe(),
  };
}
const rn = (e, t, s, l) => ({ ...e, [t]: e[t].map((i) => (i.id === s ? l(i) : i)) }),
  nn = (e, t, s) => rn(e, "cases", t, s);
function bn(e, t, s) {
  return { ...e, appointments: e.appointments.map((l) => (l.id === t ? s(l) : l)) };
}
function We(e, t, s, l, i) {
  return {
    ...e,
    activity: [{ id: ul("ac"), lawyerId: i, at: pe(), kind: t, text: s, href: l }, ...e.activity].slice(
      0,
      80,
    ),
  };
}
function sn(e, t, s) {
  var i, r, a;
  const l =
    (a = (r = (i = e.lawyers[t]) == null ? void 0 : i.settings) == null ? void 0 : r.notify) == null
      ? void 0
      : a[s.kind];
  return l && l.inApp === !1
    ? e
    : {
        ...e,
        notifications: [{ id: ul("n"), lawyerId: t, at: pe(), read: !1, ...s }, ...e.notifications].slice(
          0,
          120,
        ),
      };
}
const Ny = {
  approved: "Approved",
  pending: "In review",
  rejected: "Needs attention",
  incomplete: "Not submitted",
};
function ky(e, t) {
  var s;
  switch (t.type) {
    case "RESET":
      return seedState();
    case "REGISTER": {
      const { account: l, lawyer: i } = t;
      return { ...e, accounts: [...e.accounts, l], lawyers: { ...e.lawyers, [i.id]: i } };
    }
    case "VERIFY_EMAIL":
      return {
        ...e,
        accounts: e.accounts.map((l) => (l.id === t.accountId ? { ...l, emailVerified: !0 } : l)),
      };
    case "PASSWORD_CHANGED":
      return {
        ...e,
        accounts: e.accounts.map((l) =>
          l.email.toLowerCase() === t.email.toLowerCase() ? { ...l, passwordChanged: !0 } : l,
        ),
      };
    case "BAR_UPDATE":
      return {
        ...e,
        lawyers: {
          ...e.lawyers,
          [t.lawyerId]: {
            ...e.lawyers[t.lawyerId],
            verification: { ...e.lawyers[t.lawyerId].verification, bar: t.bar },
          },
        },
      };
    case "DOC_ADD": {
      const l = e.lawyers[t.lawyerId],
        i = l.verification,
        r = [...i.docs.filter((o) => o.kind !== t.doc.kind), t.doc],
        a = { ...e, lawyers: { ...e.lawyers, [l.id]: { ...l, verification: { ...i, docs: r } } } };
      return sn(a, l.id, {
        kind: "profile",
        title: "Document added",
        body: `${t.doc.name} was added to your verification.`,
        href: "/verification",
      });
    }
    case "DOC_REMOVE": {
      const l = e.lawyers[t.lawyerId],
        i = l.verification;
      return {
        ...e,
        lawyers: {
          ...e.lawyers,
          [l.id]: { ...l, verification: { ...i, docs: i.docs.filter((r) => r.id !== t.docId) } },
        },
      };
    }
    case "VERIFICATION_SUBMIT": {
      const l = e.lawyers[t.lawyerId],
        i = l.verification,
        r = {
          ...i,
          status: "pending",
          submittedAt: pe(),
          reviewedAt: null,
          reviewNote: "",
          docs: i.docs.map((a) => (a.status === "uploaded" ? { ...a, status: "in_review" } : a)),
        };
      return We(
        { ...e, lawyers: { ...e.lawyers, [l.id]: { ...l, verification: r } } },
        "verify",
        "You submitted your credentials for review (demo)",
        "/verification",
        l.id,
      );
    }
    case "DEMO_VERIFICATION": {
      const l = e.lawyers[t.lawyerId],
        i = { ...e, lawyers: { ...e.lawyers, [l.id]: { ...l, verification: Ey(l.verification, t.status) } } };
      return sn(i, l.id, {
        kind: "verify",
        title: "Verification status updated",
        body: `Your verification is now: ${Ny[t.status]} (demo).`,
        href: "/verification",
      });
    }
    case "APPT_ACCEPT": {
      const l = e.appointments.find((r) => r.id === t.id),
        i = bn(e, t.id, (r) => ({
          ...r,
          status: "scheduled",
          expiresAt: null,
          events: [...r.events, { at: pe(), text: "You accepted the request", by: "lawyer" }],
        }));
      return We(
        i,
        "appointment",
        `You accepted ${l.client.name}’s ${kn[l.type].toLowerCase()} consultation`,
        `/appointments/${t.id}`,
        l.lawyerId,
      );
    }
    case "APPT_DECLINE": {
      const l = e.appointments.find((r) => r.id === t.id),
        i = bn(e, t.id, (r) => ({
          ...r,
          status: "declined",
          expiresAt: null,
          declineReason: t.reason,
          events: [
            ...r.events,
            { at: pe(), text: `You declined the request${t.reason ? ` — ${t.reason}` : ""}`, by: "lawyer" },
          ],
        }));
      return We(
        i,
        "appointment",
        `You declined a request from ${l.client.name}`,
        "/appointments?tab=history",
        l.lawyerId,
      );
    }
    case "APPT_RESCHEDULE": {
      const l = e.appointments.find((r) => r.id === t.id),
        i = bn(e, t.id, (r) => ({
          ...r,
          startsAt: t.startsAt,
          events: [
            ...r.events,
            {
              at: pe(),
              text: `You rescheduled this consultation${t.reason ? ` — ${t.reason}` : ""}. Client notified (demo).`,
              by: "lawyer",
            },
          ],
        }));
      return We(
        i,
        "appointment",
        `You rescheduled ${l.client.name}’s consultation`,
        `/appointments/${t.id}`,
        l.lawyerId,
      );
    }
    case "APPT_CANCEL": {
      const l = e.appointments.find((r) => r.id === t.id),
        i = bn(e, t.id, (r) => ({
          ...r,
          status: "cancelled",
          cancelReason: t.reason,
          events: [
            ...r.events,
            {
              at: pe(),
              text: `You cancelled this consultation — ${t.reason}. Client notified and refund handled per policy (demo).`,
              by: "lawyer",
            },
          ],
        }));
      return We(
        i,
        "appointment",
        `You cancelled ${l.client.name}’s consultation`,
        "/appointments?tab=history",
        l.lawyerId,
      );
    }
    case "APPT_COMPLETE": {
      const l = e.appointments.find((a) => a.id === t.id),
        i = bn(e, t.id, (a) => ({
          ...a,
          status: "completed",
          events: [...a.events, { at: pe(), text: "Consultation marked as completed", by: "lawyer" }],
        })),
        r = We(
          i,
          "payment",
          `${l.client.name}’s consultation completed — earnings updated`,
          `/appointments/${t.id}`,
          l.lawyerId,
        );
      return sn(r, l.lawyerId, {
        kind: "payment",
        title: "Payment recorded",
        body: `${J(Rc(l.feeInr))} net from ${l.client.name} — clears 48 h after completion (demo).`,
        href: "/payments",
      });
    }
    case "SIM_REQUEST": {
      const l = sm(e.lawyers[t.lawyerId]);
      if (!l) return e;
      const i = [
          ["Arjun Malhotra", "Delhi"],
          ["Sana Qadri", "Mumbai"],
          ["Vikram Pillai", "Bengaluru"],
          ["Lakshmi Iyer", "Chennai"],
          ["Rohan Bedi", "Chandigarh"],
        ],
        r = [
          "Contract review",
          "Partnership dispute — first advice",
          "Company compliance question",
          "Employment agreement query",
        ],
        a = e.appointments.length,
        [o, c] = i[a % i.length],
        u = a % 2 ? "phone" : "video",
        d = {
          id: `ap_${Date.now().toString(36)}${a}`,
          lawyerId: l.id,
          clientId: null,
          client: {
            name: o,
            city: c,
            email: `${o.toLowerCase().replace(/\s+/g, ".")}@example.com`,
            phone: "+91 98000 00000",
          },
          area: l.primaryArea,
          matter: r[a % r.length],
          summary: "Sample request created from Demo controls (fictional).",
          type: u,
          startsAt: Ur(Date.now(), 3 + (a % 4), 12, 0),
          durationMin: 30,
          feeInr: ((s = l.consult[u]) == null ? void 0 : s.fee) || 2500,
          status: "requested",
          requestedAt: pe(),
          expiresAt: new Date(Date.now() + 2 * 864e5).toISOString(),
          location: "",
          notes: "",
          cancelReason: "",
          declineReason: "",
          events: [{ at: pe(), text: "Client requested this consultation", by: "client" }],
        },
        h = sn({ ...e, appointments: [d, ...e.appointments] }, l.id, {
          kind: "request",
          title: "New consultation request",
          body: `${o} · ${d.matter}`,
          href: `/appointments/${d.id}`,
        });
      return We(h, "request", `New consultation request from ${o}`, "/appointments?tab=requests", l.id);
    }
    case "SIM_CLIENT_CANCEL": {
      const l = e.appointments
        .filter(
          (a) =>
            a.lawyerId === t.lawyerId &&
            a.status === "scheduled" &&
            new Date(a.startsAt).getTime() > Date.now(),
        )
        .sort((a, o) => new Date(a.startsAt) - new Date(o.startsAt))[0];
      if (!l) return e;
      const i = bn(e, l.id, (a) => ({
          ...a,
          status: "cancelled",
          cancelReason: "Client cancelled (simulated)",
          events: [
            ...a.events,
            { at: pe(), text: "Client cancelled this consultation (simulated)", by: "client" },
          ],
        })),
        r = sn(i, l.lawyerId, {
          kind: "appointment",
          title: "Consultation cancelled by client",
          body: `${l.client.name} cancelled their ${kn[l.type].toLowerCase()} consultation (simulated).`,
          href: `/appointments/${l.id}`,
        });
      return We(
        r,
        "appointment",
        `${l.client.name} cancelled a consultation`,
        "/appointments?tab=history",
        l.lawyerId,
      );
    }
    case "APPT_NOTES":
      return bn(e, t.id, (l) => ({ ...l, notes: t.notes }));
    case "LAWYER_PATCH": {
      const l = e.lawyers[t.lawyerId];
      if (!l) return e;
      const i = { ...e, lawyers: { ...e.lawyers, [l.id]: { ...l, ...t.patch } } };
      return t.activity ? We(i, "verify", t.activity, t.href || "/profile", l.id) : i;
    }
    case "CLIENT_ADD":
      return We(
        { ...e, clients: [t.client, ...e.clients] },
        "request",
        `You added client ${t.client.name}`,
        `/clients/${t.client.id}`,
        t.client.lawyerId,
      );
    case "CLIENT_NOTES":
      return rn(e, "clients", t.id, (l) => ({ ...l, notes: t.notes }));
    case "CASE_ADD":
      return We(
        { ...e, cases: [t.case, ...e.cases] },
        "appointment",
        `You opened the case “${t.case.title}”`,
        `/cases/${t.case.id}`,
        t.case.lawyerId,
      );
    case "CASE_STATUS":
      return nn(e, t.id, (l) => ({
        ...l,
        status: t.status,
        events: [...l.events, { at: pe(), text: `Status changed to ${t.label}` }],
      }));
    case "CASE_NOTE_ADD":
      return nn(e, t.id, (l) => ({
        ...l,
        notes: [{ id: ul("nt"), at: pe(), text: t.text }, ...l.notes],
        events: [...l.events, { at: pe(), text: "Note added" }],
      }));
    case "CASE_NOTE_DEL":
      return nn(e, t.id, (l) => ({ ...l, notes: l.notes.filter((i) => i.id !== t.noteId) }));
    case "DEADLINE_ADD":
      return nn(e, t.id, (l) => ({
        ...l,
        deadlines: [...l.deadlines, t.deadline],
        events: [...l.events, { at: pe(), text: `Deadline added: ${t.deadline.title}` }],
      }));
    case "DEADLINE_TOGGLE":
      return nn(e, t.id, (l) => {
        var i, r;
        return {
          ...l,
          deadlines: l.deadlines.map((a) => (a.id === t.did ? { ...a, done: !a.done } : a)),
          events: [
            ...l.events,
            {
              at: pe(),
              text: `Deadline ${(i = l.deadlines.find((a) => a.id === t.did)) != null && i.done ? "reopened" : "completed"}: ${(r = l.deadlines.find((a) => a.id === t.did)) == null ? void 0 : r.title}`,
            },
          ],
        };
      });
    case "DEADLINE_DEL":
      return nn(e, t.id, (l) => ({ ...l, deadlines: l.deadlines.filter((i) => i.id !== t.did) }));
    case "CASE_DOC_ADD":
      return nn(e, t.id, (l) => ({
        ...l,
        docs: [t.doc, ...l.docs],
        events: [...l.events, { at: pe(), text: `Document reference added: ${t.doc.name}` }],
      }));
    case "CASE_DOC_DEL":
      return nn(e, t.id, (l) => ({ ...l, docs: l.docs.filter((i) => i.id !== t.docId) }));
    case "CONV_ENSURE":
      return e.conversations.some((l) => l.id === t.conv.id)
        ? e
        : { ...e, conversations: [t.conv, ...e.conversations] };
    case "CONV_READ":
      return rn(e, "conversations", t.id, (l) => ({ ...l, lastReadAt: pe() }));
    case "CONV_UNREAD":
      return rn(e, "conversations", t.id, (l) => {
        const i = [...l.messages].reverse().find((r) => r.from === "client");
        return i ? { ...l, lastReadAt: new Date(new Date(i.at).getTime() - 1).toISOString() } : l;
      });
    case "MSG_SEND":
      return rn(e, "conversations", t.id, (l) => ({
        ...l,
        lastReadAt: pe(),
        messages: [
          ...l.messages,
          { id: ul("m"), from: "lawyer", at: pe(), text: t.text, attachments: t.attachments || [] },
        ],
      }));
    case "MSG_RECEIVE": {
      const l = e.conversations.find((o) => o.id === t.id);
      if (!l) return e;
      const i = e.clients.find((o) => o.id === l.clientId),
        r = rn(e, "conversations", t.id, (o) => ({
          ...o,
          messages: [...o.messages, { id: ul("m"), from: "client", at: pe(), text: t.text, attachments: [] }],
        })),
        a = sn(r, l.lawyerId, {
          kind: "message",
          title: "New message",
          body: `${(i == null ? void 0 : i.name) || "Client"}: ${t.text.slice(0, 60)}`,
          href: `/messages/${t.id}`,
        });
      return We(
        a,
        "message",
        `${(i == null ? void 0 : i.name) || "A client"} sent you a message`,
        `/messages/${t.id}`,
        l.lawyerId,
      );
    }
    case "NOTIF_READ":
      return rn(e, "notifications", t.id, (l) => ({ ...l, read: !0 }));
    case "NOTIF_UNREAD":
      return rn(e, "notifications", t.id, (l) => ({ ...l, read: !1 }));
    case "NOTIF_DELETE":
      return { ...e, notifications: e.notifications.filter((l) => l.id !== t.id) };
    case "NOTIF_READ_ALL":
      return {
        ...e,
        notifications: e.notifications.map((l) => (l.lawyerId === t.lawyerId ? { ...l, read: !0 } : l)),
      };
    case "NOTIF_CLEAR_READ":
      return { ...e, notifications: e.notifications.filter((l) => !(l.lawyerId === t.lawyerId && l.read)) };
    case "PAYOUT_REQUEST": {
      const l = { ...e, payouts: [t.payout, ...e.payouts] },
        i = sn(l, t.payout.lawyerId, {
          kind: "payment",
          title: "Payout requested",
          body: `${J(t.payout.amount)} to ${t.payout.methodLabel} — processing (demo, no money moves).`,
          href: "/payments",
        });
      return We(
        i,
        "payment",
        `You requested a payout of ${J(t.payout.amount)} (demo)`,
        "/payments",
        t.payout.lawyerId,
      );
    }
    case "PAYOUTS_MARK_PAID": {
      const l = e.payouts.filter((r) => r.lawyerId === t.lawyerId && r.status === "processing").length;
      if (!l) return e;
      const i = {
        ...e,
        payouts: e.payouts.map((r) =>
          r.lawyerId === t.lawyerId && r.status === "processing" ? { ...r, status: "paid", paidAt: pe() } : r,
        ),
      };
      return sn(i, t.lawyerId, {
        kind: "payment",
        title: "Payout marked as paid",
        body: `${l} payout${l === 1 ? "" : "s"} moved to Paid (demo simulation).`,
        href: "/payments",
      });
    }
    case "ACCOUNT_PATCH":
      return { ...e, accounts: e.accounts.map((l) => (l.id === t.accountId ? { ...l, ...t.patch } : l)) };
    case "TICKET_ADD":
      return We(
        { ...e, tickets: [t.ticket, ...e.tickets] },
        "info",
        `You contacted support: ${t.ticket.subject}`,
        "/settings?tab=help",
        t.ticket.lawyerId,
      );
    case "ACCOUNT_DELETE": {
      const l = e.accounts.find((c) => c.id === t.accountId);
      if (!l) return e;
      const i = l.lawyerId,
        r = (c) => c.lawyerId !== i,
        { [i]: a, ...o } = e.lawyers;
      return {
        ...e,
        accounts: e.accounts.filter((c) => c.id !== t.accountId),
        lawyers: o,
        appointments: e.appointments.filter(r),
        clients: e.clients.filter(r),
        cases: e.cases.filter(r),
        conversations: e.conversations.filter(r),
        notifications: e.notifications.filter(r),
        activity: e.activity.filter(r),
        payouts: e.payouts.filter(r),
        tickets: e.tickets.filter(r),
      };
    }
    default:
      return e;
  }
}
export function lm(e, t, s) {
  const l = e.accounts.find((i) => i.email.toLowerCase() === String(t).trim().toLowerCase());
  return l
    ? l.demoSeed && !l.passwordChanged
      ? s === yo
        ? { ok: !0, account: l }
        : { ok: !1 }
      : s.length >= 8
        ? { ok: !0, account: l }
        : { ok: !1 }
    : { ok: !1 };
}
const im = w.createContext(null);
export function Iy({ children: e }) {
  const [t, s] = w.useReducer(ky, void 0, loadState),
    [l, i] = w.useState(Cy);
  w.useEffect(() => {
    sd(window.localStorage, nm, t);
  }, [t]);
  const r = w.useCallback((E, x) => {
      const C = { accountId: E.id, remember: !!x, at: pe() };
      (ri(window.sessionStorage, Kn),
        ri(window.localStorage, Kn),
        sd(x ? window.localStorage : window.sessionStorage, Kn, C),
        i(C));
    }, []),
    a = w.useCallback(() => {
      (ri(window.sessionStorage, Kn), ri(window.localStorage, Kn), i(null));
    }, []),
    o = w.useCallback(() => {
      (a(), s({ type: "RESET" }));
    }, [a]),
    c = (l && t.accounts.find((E) => E.id === l.accountId)) || null,
    u = (c && t.lawyers[c.lawyerId]) || null,
    d = w.useMemo(() => sm(u), [u]),
    h = w.useMemo(() => (d ? t.appointments.filter((E) => E.lawyerId === d.id) : []), [t.appointments, d]),
    m = w.useMemo(() => (d ? t.clients.filter((E) => E.lawyerId === d.id) : []), [t.clients, d]),
    S = w.useMemo(() => (d ? t.cases.filter((E) => E.lawyerId === d.id) : []), [t.cases, d]),
    v = w.useMemo(() => (d ? t.conversations.filter((E) => E.lawyerId === d.id) : []), [t.conversations, d]),
    N = w.useMemo(() => v.reduce((E, x) => E + dl(x), 0), [v]),
    A = w.useMemo(() => (d ? t.notifications.filter((E) => E.lawyerId === d.id) : []), [t.notifications, d]),
    f = w.useMemo(() => (d ? t.activity.filter((E) => E.lawyerId === d.id) : []), [t.activity, d]),
    p = w.useMemo(() => (d ? t.payouts.filter((E) => E.lawyerId === d.id) : []), [t.payouts, d]),
    y = w.useMemo(() => (d ? t.tickets.filter((E) => E.lawyerId === d.id) : []), [t.tickets, d]),
    k = w.useMemo(
      () => ({
        state: t,
        dispatch: s,
        session: l,
        account: c,
        lawyer: d,
        appts: h,
        clients: m,
        cases: S,
        convs: v,
        unreadTotal: N,
        notifs: A,
        activity: f,
        payouts: p,
        tickets: y,
        signIn: r,
        signOut: a,
        resetAll: o,
      }),
      [t, l, c, d, h, m, S, v, N, A, f, p, y, r, a, o],
    );
  return n.jsx(im.Provider, { value: k, children: e });
}
export const ne = () => w.useContext(im);
export function Qt(e = 6e4) {
  const [t, s] = w.useState(Date.now());
  return (
    w.useEffect(() => {
      const l = setInterval(() => s(Date.now()), e);
      return () => clearInterval(l);
    }, [e]),
    t
  );
}
const Ry = Object.entries(Pe)
  .filter(([, e]) => e.required)
  .map(([e]) => e);
export function rm(e) {
  return Ry.filter((t) => !e.docs.some((s) => s.kind === t));
}
export const cr = (e) => !!(e.bar.number && e.bar.council && e.bar.year),
  dl = (e) => e.messages.filter((t) => t.from === "client" && t.at > e.lastReadAt).length,
  ws = (e) => e.messages[e.messages.length - 1] || null,
  ki = (e) => e.status !== "closed",
  ur = (e) => e.deadlines.filter((t) => !t.done).sort((t, s) => new Date(t.due) - new Date(s.due))[0] || null,
  am = [
    {
      group: "Practice",
      items: [
        { to: "/dashboard", label: "Dashboard", icon: "grid", title: "Dashboard" },
        {
          to: "/appointments",
          label: "Appointments",
          icon: "calendar",
          title: "Appointments",
          badge: "requests",
        },
        {
          to: "/clients",
          label: "Clients & cases",
          icon: "users",
          title: "Clients & cases",
          also: ["/cases"],
        },
        { to: "/messages", label: "Messages", icon: "message", title: "Messages", badge: "messages" },
      ],
    },
    {
      group: "Account",
      items: [
        {
          to: "/verification",
          label: "Verification",
          icon: "shieldCheck",
          title: "Verification",
          badge: "verify",
        },
        { to: "/profile", label: "Profile", icon: "user", title: "Profile" },
        { to: "/availability", label: "Availability", icon: "clock", title: "Availability" },
        { to: "/payments", label: "Payments", icon: "wallet", title: "Payments & billing" },
        {
          to: "/notifications",
          label: "Notifications",
          icon: "bell",
          title: "Notifications",
          badge: "notifs",
        },
        { to: "/settings", label: "Settings", icon: "settings", title: "Settings" },
      ],
    },
  ],
  My = am.flatMap((e) => e.items),
  id = [
    "Thanks for the update — could you share the latest draft?",
    "Is Thursday still fine for our call?",
    "I have attached the documents you asked for (demo).",
    "One more question about the timeline.",
  ],
  Tl = {
    approved: ["success", "Verified (demo)"],
    pending: ["warning", "In review"],
    rejected: ["danger", "Action needed"],
    incomplete: ["neutral", "Not submitted"],
  };
