import w from "react";
import * as n from "react/jsx-runtime";
import { useParams as Mr, Link as P } from "react-router-dom";
import { Ds, J, Ke, bl, ge, nt, qt } from "../lib/core.js";
import { Et, L, O, Q, Yt, b, le, lt, xe, z } from "../components/ui.js";
import { Dt } from "../lib/domain.js";
import { Qt, ne } from "../state/store.js";
import { Fr, Qr, dr } from "./verify-email.js";
import { Lc } from "../components/appointment-dialogs.js";

/* app/views/appointment-detail.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
export function AppointmentDetailView() {
  const { id: e } = Mr(),
    { appts: t, lawyer: s, dispatch: l } = ne(),
    i = Qt(15e3),
    r = xe(),
    a = t.find((E) => E.id === e),
    o = Lc(),
    [c, u] = w.useState(!1),
    [d, h] = w.useState((a == null ? void 0 : a.notes) || ""),
    [m, S] = w.useState(!0);
  if (
    (w.useEffect(() => {
      (h((a == null ? void 0 : a.notes) || ""), S(!0));
    }, [a == null ? void 0 : a.id]),
    !a)
  )
    return n.jsx(Q, {
      children: n.jsx(le, {
        icon: "file",
        title: "Appointment not found",
        action: n.jsx(P, {
          className: "lp-btn lp-btn-primary lp-btn-md",
          to: "/appointments",
          children: n.jsx("span", { children: "Back to appointments" }),
        }),
        children: "This appointment doesn’t exist or isn’t assigned to you.",
      }),
    });
  const v = new Date(a.startsAt).getTime(),
    N = v + a.durationMin * 6e4,
    A = s.verification.status === "approved",
    f = a.status === "scheduled" && i >= v - 15 * 6e4 && i <= N + 15 * 6e4,
    p = i >= v - 15 * 6e4,
    y = a.status !== "requested" && a.status !== "declined",
    k = () => {
      (l({ type: "APPT_NOTES", id: a.id, notes: d }),
        S(!0),
        r({ title: "Notes saved", message: "Stored in this browser only (demo)." }));
    };
  return n.jsxs(n.Fragment, {
    children: [
      n.jsxs(P, {
        to: "/appointments",
        className: "lp-back",
        children: [n.jsx(L, { name: "chevL", size: 16 }), " All appointments"],
      }),
      n.jsxs("header", {
        className: "lp-page-h lp-detail-h",
        children: [
          n.jsxs("div", {
            className: "lp-detail-id",
            children: [
              n.jsx(lt, { name: a.client.name, size: 56 }),
              n.jsxs("div", {
                children: [
                  n.jsx("p", { className: "lp-eyebrow", children: a.id.toUpperCase().replace("_", "-") }),
                  n.jsx("h1", { className: "lp-h1", children: a.client.name }),
                  n.jsx("div", { className: "lp-ar-meta", children: n.jsx(Qr, { a, now: i }) }),
                ],
              }),
            ],
          }),
          n.jsxs("div", {
            className: "lp-page-actions",
            children: [
              a.status === "requested" &&
                n.jsxs(n.Fragment, {
                  children: [
                    n.jsx(b, {
                      icon: "check",
                      onClick: () => o.open("accept", a),
                      disabled: !A,
                      title: A ? void 0 : "Complete verification to accept requests",
                      children: "Accept",
                    }),
                    n.jsx(b, {
                      variant: "outline",
                      onClick: () => o.open("decline", a),
                      children: "Decline",
                    }),
                  ],
                }),
              a.status === "scheduled" &&
                n.jsxs(n.Fragment, {
                  children: [
                    n.jsx(b, {
                      icon: a.type === "video" ? "video" : a.type === "phone" ? "phone" : "pin",
                      onClick: () => u(!0),
                      disabled: !f,
                      children:
                        a.type === "video"
                          ? "Join consultation"
                          : a.type === "phone"
                            ? "Call client"
                            : "Check in",
                    }),
                    n.jsx(b, {
                      variant: "outline",
                      icon: "clock",
                      onClick: () => o.open("reschedule", a),
                      children: "Reschedule",
                    }),
                    n.jsx(b, {
                      variant: "outline",
                      icon: "check",
                      onClick: () => o.open("complete", a),
                      disabled: !p,
                      title: p ? void 0 : "Available once the consultation is about to start",
                      children: "Mark completed",
                    }),
                    n.jsx(b, { variant: "ghost", onClick: () => o.open("cancel", a), children: "Cancel" }),
                  ],
                }),
            ],
          }),
        ],
      }),
      a.status === "scheduled" &&
        !f &&
        n.jsx(O, {
          tone: "info",
          className: "lp-mb",
          title: i < v ? `Starts ${qt(a.startsAt, i)}` : "This consultation window has closed",
          children:
            i < v
              ? "Joining opens 15 minutes before the scheduled start."
              : "If it took place, mark it as completed so earnings and history are updated.",
        }),
      a.status === "scheduled" &&
        f &&
        n.jsx(O, {
          tone: "success",
          className: "lp-mb",
          title: i >= v ? "This consultation is in progress" : "Joining is now open",
          children: "Use the button above to join. In this demo no real call is started.",
        }),
      a.status === "requested" &&
        a.expiresAt &&
        n.jsxs(O, {
          tone: "warning",
          className: "lp-mb",
          title: `Respond ${qt(a.expiresAt, i)}`,
          children: [
            "If you don’t respond by ",
            Ke(a.expiresAt),
            ", ",
            ge(a.expiresAt),
            " ",
            nt,
            ", the request expires and the client is notified.",
          ],
        }),
      n.jsxs("div", {
        className: "lp-vgrid",
        children: [
          n.jsxs("div", {
            className: "lp-vmain",
            children: [
              n.jsxs(Q, {
                "aria-labelledby": "ad-c",
                children: [
                  n.jsx(z, { title: n.jsx("span", { id: "ad-c", children: "Consultation" }) }),
                  n.jsxs("dl", {
                    className: "lp-dl",
                    children: [
                      n.jsxs("div", {
                        children: [n.jsx("dt", { children: "Matter" }), n.jsx("dd", { children: a.matter })],
                      }),
                      n.jsxs("div", {
                        children: [
                          n.jsx("dt", { children: "Practice area" }),
                          n.jsx("dd", { children: a.area }),
                        ],
                      }),
                      n.jsxs("div", {
                        children: [
                          n.jsx("dt", { children: "Type" }),
                          n.jsx("dd", {
                            children: n.jsxs("span", {
                              className: "lp-ar-type",
                              children: [n.jsx(L, { name: Fr(a.type), size: 15 }), " ", bl[a.type]],
                            }),
                          }),
                        ],
                      }),
                      n.jsxs("div", {
                        children: [
                          n.jsx("dt", { children: "Date" }),
                          n.jsx("dd", { children: Ds(a.startsAt) }),
                        ],
                      }),
                      n.jsxs("div", {
                        children: [
                          n.jsx("dt", { children: "Time" }),
                          n.jsxs("dd", {
                            children: [
                              ge(a.startsAt),
                              " – ",
                              ge(new Date(N).toISOString()),
                              " ",
                              nt,
                              " ",
                              n.jsxs("small", { children: ["(", a.durationMin, " min)"] }),
                            ],
                          }),
                        ],
                      }),
                      a.type === "in_person" &&
                        n.jsxs("div", {
                          children: [
                            n.jsx("dt", { children: "Location" }),
                            n.jsx("dd", { children: a.location || "—" }),
                          ],
                        }),
                      a.status === "cancelled" &&
                        n.jsxs("div", {
                          children: [
                            n.jsx("dt", { children: "Cancellation" }),
                            n.jsx("dd", { children: a.cancelReason }),
                          ],
                        }),
                      a.status === "declined" &&
                        n.jsxs("div", {
                          children: [
                            n.jsx("dt", { children: "Declined because" }),
                            n.jsx("dd", { children: a.declineReason }),
                          ],
                        }),
                    ],
                  }),
                  n.jsx("h3", { className: "lp-h4", children: "What the client told us" }),
                  n.jsx("p", { className: "lp-quote", children: a.summary }),
                ],
              }),
              n.jsxs(Q, {
                "aria-labelledby": "ad-n",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "ad-n", children: "Private notes" }),
                    sub: "Only you can see these. Demo: saved in this browser, not secure case storage.",
                  }),
                  n.jsx(Et, {
                    id: "ad-notes",
                    label: "Notes",
                    rows: 5,
                    value: d,
                    onChange: (E) => {
                      (h(E.target.value), S(!1));
                    },
                    placeholder: "Key facts, advice given, follow-ups…",
                  }),
                  n.jsxs("div", {
                    className: "lp-actions",
                    children: [
                      n.jsx(b, { size: "sm", onClick: k, disabled: m, children: "Save notes" }),
                      !m && n.jsx("span", { className: "lp-hint", children: "Unsaved changes" }),
                    ],
                  }),
                ],
              }),
              n.jsxs(Q, {
                "aria-labelledby": "ad-h",
                children: [
                  n.jsx(z, { title: n.jsx("span", { id: "ad-h", children: "History" }) }),
                  n.jsx("ol", {
                    className: "lp-timeline",
                    children: [...a.events]
                      .sort((E, x) => new Date(x.at) - new Date(E.at))
                      .map((E, x) =>
                        n.jsxs(
                          "li",
                          {
                            children: [
                              n.jsx("span", { className: `lp-tl-dot is-${E.by}` }),
                              n.jsxs("div", {
                                children: [
                                  n.jsx("p", { children: E.text }),
                                  n.jsxs("small", {
                                    children: [
                                      Ke(E.at),
                                      ", ",
                                      ge(E.at),
                                      " ",
                                      nt,
                                      " · ",
                                      E.by === "lawyer" ? "You" : E.by === "client" ? "Client" : "System",
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          },
                          x,
                        ),
                      ),
                  }),
                ],
              }),
            ],
          }),
          n.jsxs("aside", {
            className: "lp-vside",
            children: [
              n.jsxs(Q, {
                "aria-labelledby": "ad-cl",
                children: [
                  n.jsx(z, { title: n.jsx("span", { id: "ad-cl", children: "Client" }) }),
                  n.jsxs("dl", {
                    className: "lp-dl is-stack",
                    children: [
                      n.jsxs("div", {
                        children: [
                          n.jsx("dt", { children: "Name" }),
                          n.jsx("dd", { children: a.client.name }),
                        ],
                      }),
                      n.jsxs("div", {
                        children: [
                          n.jsx("dt", { children: "City" }),
                          n.jsx("dd", { children: a.client.city }),
                        ],
                      }),
                      n.jsxs("div", {
                        children: [
                          n.jsx("dt", { children: "Email" }),
                          n.jsx("dd", { children: y ? a.client.email : "Shared after you accept" }),
                        ],
                      }),
                      n.jsxs("div", {
                        children: [
                          n.jsx("dt", { children: "Phone" }),
                          n.jsx("dd", { children: y ? a.client.phone : "Shared after you accept" }),
                        ],
                      }),
                    ],
                  }),
                  n.jsx("p", {
                    className: "lp-hint",
                    children:
                      "Fictional client. Treat real client data as confidential; this demo is not secure case management.",
                  }),
                ],
              }),
              n.jsxs(Q, {
                "aria-labelledby": "ad-f",
                children: [
                  n.jsx(z, {
                    title: n.jsx("span", { id: "ad-f", children: "Fee" }),
                    sub: "Illustrative figures",
                  }),
                  n.jsxs("dl", {
                    className: "lp-dl is-stack",
                    children: [
                      n.jsxs("div", {
                        children: [
                          n.jsx("dt", { children: "Consultation fee" }),
                          n.jsx("dd", { children: J(a.feeInr) }),
                        ],
                      }),
                      n.jsxs("div", {
                        children: [
                          n.jsxs("dt", { children: ["Platform fee (", Dt * 100, "%)"] }),
                          n.jsxs("dd", { children: ["− ", J(a.feeInr * Dt)] }),
                        ],
                      }),
                      n.jsxs("div", {
                        className: "is-total",
                        children: [
                          n.jsx("dt", { children: "You receive" }),
                          n.jsx("dd", { children: J(dr(a)) }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      n.jsxs(Yt, {
        open: c,
        onClose: () => u(!1),
        title:
          a.type === "video" ? "Join video consultation" : a.type === "phone" ? "Call client" : "Check in",
        size: "sm",
        footer: n.jsx(b, { onClick: () => u(!1), children: "Close" }),
        children: [
          n.jsx(O, {
            tone: "info",
            title: "Demo: no real session is started",
            children: "The integrated product would open the secure consultation room here.",
          }),
          n.jsx("p", {
            className: "lp-mt-s",
            children:
              a.type === "video"
                ? `Video room for ${a.client.name} — ${ge(a.startsAt)} ${nt}.`
                : a.type === "phone"
                  ? `Client number (fictional): ${a.client.phone}`
                  : `Meet at: ${a.location}`,
          }),
        ],
      }),
      o.node,
    ],
  });
}
export const od = {
  verified: ["success", "Verified"],
  in_review: ["warning", "In review"],
  uploaded: ["info", "Ready to submit"],
  missing: ["danger", "Missing"],
  rejected: ["danger", "Needs attention"],
};
