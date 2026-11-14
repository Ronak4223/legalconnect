import w from "react";
import * as n from "react/jsx-runtime";
import { useNavigate as Me, useParams as Mr, Link as P } from "react-router-dom";
import { Bn, Ie, Oh, ge, xo } from "../lib/core.js";
import { Ft, L, O, b, le, lt, qs } from "../components/ui.js";
import { Qt, dl, ne, ws } from "../state/store.js";
import { Bs, Nv } from "./case-detail.js";

/* app/views/messages.js — recovered from the minified build; helper identifiers are still short (routed views and core types were renamed). */
export function MessagesView() {
  const { id: e } = Mr(),
    { convs: t, clients: s } = ne(),
    l = Qt(3e4),
    [i, r] = w.useState(""),
    [a, o] = w.useState("all"),
    c = w.useMemo(() => Object.fromEntries(s.map((S) => [S.id, S])), [s]),
    u = w.useMemo(
      () =>
        [...t].sort((S, v) => {
          var N, A;
          return (
            new Date(((N = ws(v)) == null ? void 0 : N.at) || 0) -
            new Date(((A = ws(S)) == null ? void 0 : A.at) || 0)
          );
        }),
      [t],
    ),
    d = w.useMemo(() => {
      const S = i.trim().toLowerCase();
      return u.filter((v) => {
        var N;
        return (
          (a === "all" || dl(v) > 0) &&
          (!S ||
            (((N = c[v.clientId]) == null ? void 0 : N.name) || "").toLowerCase().includes(S) ||
            v.messages.some((A) => A.text.toLowerCase().includes(S)))
        );
      });
    }, [u, i, a, c]),
    h = t.filter((S) => dl(S) > 0).length,
    m = t.find((S) => S.id === e);
  return n.jsxs(n.Fragment, {
    children: [
      n.jsx("div", {
        className: m ? "lp-hide-sm" : "",
        children: n.jsx(Ft, {
          eyebrow: "Practice",
          title: "Messages",
          children:
            "Conversations with your clients. This is a mock inbox: nothing you send here is delivered to anyone.",
        }),
      }),
      e &&
        !m &&
        n.jsx(O, {
          tone: "warning",
          title: "Conversation not found",
          className: "lp-mb",
          children: "It may not exist or isn’t in your inbox. Pick another conversation from the list.",
        }),
      n.jsxs("div", {
        className: `lp-msg ${m ? "has-active" : ""}`,
        children: [
          n.jsxs("section", {
            className: "lp-msg-list",
            "aria-label": "Conversations",
            children: [
              n.jsxs("div", {
                className: "lp-msg-tools",
                children: [
                  n.jsxs("div", {
                    className: "lp-search",
                    children: [
                      n.jsx(L, { name: "search", size: 16 }),
                      n.jsx("input", {
                        type: "search",
                        "aria-label": "Search conversations by client or message",
                        placeholder: "Search conversations",
                        value: i,
                        onChange: (S) => r(S.target.value),
                      }),
                    ],
                  }),
                  n.jsx(qs, {
                    label: "Conversation filter",
                    value: a,
                    onChange: o,
                    tabs: [
                      { id: "all", label: "All", count: t.length },
                      { id: "unread", label: "Unread", count: h },
                    ],
                  }),
                ],
              }),
              t.length === 0
                ? n.jsx(le, {
                    level: 2,
                    icon: "message",
                    title: "No conversations yet",
                    action: n.jsx(P, {
                      className: "lp-btn lp-btn-outline lp-btn-sm",
                      to: "/clients",
                      children: n.jsx("span", { children: "Go to clients" }),
                    }),
                    children: "Start a conversation from a client’s profile.",
                  })
                : d.length === 0
                  ? n.jsx(le, {
                      level: 2,
                      icon: "search",
                      title: a === "unread" && !i ? "You’re all caught up" : "No conversations match",
                      children:
                        a === "unread" && !i
                          ? "There are no unread messages."
                          : "Try a different name or word.",
                    })
                  : n.jsx("ul", {
                      className: "lp-convs",
                      children: d.map((S) => {
                        var f;
                        const v = c[S.clientId],
                          N = ws(S),
                          A = dl(S);
                        return n.jsx(
                          "li",
                          {
                            children: n.jsxs(P, {
                              to: `/messages/${S.id}`,
                              className: `lp-conv ${A ? "is-unread" : ""} ${S.id === e ? "is-active" : ""}`,
                              "aria-current": S.id === e ? "page" : void 0,
                              children: [
                                n.jsx(lt, { name: (v == null ? void 0 : v.name) || "?", size: 44 }),
                                n.jsxs("span", {
                                  className: "lp-conv-main",
                                  children: [
                                    n.jsxs("span", {
                                      className: "lp-conv-top",
                                      children: [
                                        n.jsx("strong", {
                                          children: (v == null ? void 0 : v.name) || "Unknown client",
                                        }),
                                        n.jsx("time", {
                                          dateTime: N == null ? void 0 : N.at,
                                          children: N ? Nv(N.at, l) : "",
                                        }),
                                      ],
                                    }),
                                    n.jsx("span", {
                                      className: "lp-conv-prev",
                                      children: N
                                        ? `${N.from === "lawyer" ? "You: " : ""}${N.text || ((f = N.attachments) != null && f.length ? `📎 ${N.attachments[0].name}` : "")}`
                                        : "No messages yet",
                                    }),
                                  ],
                                }),
                                A > 0 &&
                                  n.jsx("span", {
                                    className: "lp-conv-n",
                                    "aria-label": `${A} unread`,
                                    children: A,
                                  }),
                              ],
                            }),
                          },
                          S.id,
                        );
                      }),
                    }),
            ],
          }),
          n.jsx("section", {
            className: "lp-msg-chat",
            "aria-label": "Conversation",
            children: m
              ? n.jsx(kv, { conv: m, client: c[m.clientId], now: l }, m.id)
              : n.jsx(le, {
                  level: 2,
                  icon: "message",
                  title: "Select a conversation",
                  children:
                    "Choose a client on the left to read and reply. Unread conversations are highlighted.",
                }),
          }),
        ],
      }),
    ],
  });
}
function kv({ conv: e, client: t, now: s }) {
  var E, x, C;
  const { dispatch: l } = ne(),
    i = Me(),
    r = w.useRef(e.lastReadAt),
    a = w.useRef(null),
    o = w.useRef(null),
    c = w.useRef(null),
    [u, d] = w.useState(""),
    [h, m] = w.useState([]),
    [S, v] = w.useState(""),
    N = (E = [...e.messages].reverse().find((j) => j.from === "client")) == null ? void 0 : E.at;
  (w.useEffect(() => {
    dl(e) > 0 && l({ type: "CONV_READ", id: e.id });
  }, [e.id, N]),
    w.useEffect(() => {
      const j = a.current;
      j && (j.scrollTop = j.scrollHeight);
    }, [e.messages.length]));
  const A = (x = e.messages.find((j) => j.from === "client" && j.at > r.current)) == null ? void 0 : x.id,
    f = (C = [...e.messages].reverse().find((j) => j.from === "lawyer")) == null ? void 0 : C.id,
    p = [];
  e.messages.forEach((j) => {
    const R = Ie(j.at),
      g = p[p.length - 1];
    g && g.k === R ? g.items.push(j) : p.push({ k: R, at: j.at, items: [j] });
  });
  const y = (j) => {
      const R = j == null ? void 0 : j[0];
      if (!R) return;
      const g = Oh(R);
      if (g) return v(g);
      if (h.length >= 3) return v("You can attach up to 3 files per message.");
      (v(""), m((M) => [...M, { name: R.name, size: R.size, type: R.type }]));
    },
    k = () => {
      var R;
      const j = u.trim();
      if (!(!j && h.length === 0)) {
        if (u.length > Bs) return v(`Messages are limited to ${Bs} characters.`);
        (l({ type: "MSG_SEND", id: e.id, text: j, attachments: h }),
          d(""),
          m([]),
          v(""),
          (R = o.current) == null || R.focus());
      }
    };
  return n.jsxs("div", {
    className: "lp-chat",
    children: [
      n.jsxs("header", {
        className: "lp-chat-h",
        children: [
          n.jsx(P, {
            to: "/messages",
            className: "lp-icon-btn lp-chat-back",
            "aria-label": "Back to conversations",
            children: n.jsx(L, { name: "chevL", size: 20 }),
          }),
          n.jsx(lt, { name: (t == null ? void 0 : t.name) || "?", size: 40 }),
          n.jsxs("div", {
            className: "lp-chat-id",
            children: [
              n.jsx("strong", {
                children: t
                  ? n.jsx(P, { to: `/clients/${t.id}`, className: "lp-link-plain", children: t.name })
                  : "Unknown client",
              }),
              n.jsx("small", { children: t ? `${t.city} · mock conversation` : "mock conversation" }),
            ],
          }),
          n.jsx(b, {
            variant: "ghost",
            size: "sm",
            onClick: () => {
              (l({ type: "CONV_UNREAD", id: e.id }), i("/messages"));
            },
            disabled: !N,
            children: "Mark unread",
          }),
        ],
      }),
      n.jsxs("p", {
        className: "lp-chat-mock",
        children: [
          n.jsx(L, { name: "info", size: 14 }),
          " Mock messaging — messages stay in this browser and are not delivered. Don’t enter real client information.",
        ],
      }),
      n.jsxs("div", {
        className: "lp-chat-log",
        ref: a,
        role: "log",
        "aria-label": `Messages with ${(t == null ? void 0 : t.name) || "client"}`,
        tabIndex: 0,
        children: [
          e.messages.length === 0 &&
            n.jsxs("div", {
              className: "lp-chat-empty",
              children: [
                n.jsx(L, { name: "message", size: 22 }),
                n.jsx("p", { children: "No messages yet. Say hello below." }),
              ],
            }),
          p.map((j) =>
            n.jsxs(
              "div",
              {
                className: "lp-day",
                children: [
                  n.jsx("p", { className: "lp-day-l", children: n.jsx("span", { children: Bn(j.at, s) }) }),
                  j.items.map((R) => {
                    var g;
                    return n.jsxs(
                      "div",
                      {
                        children: [
                          R.id === A &&
                            n.jsx("p", {
                              className: "lp-newdiv",
                              role: "separator",
                              children: n.jsx("span", { children: "New messages" }),
                            }),
                          n.jsxs("div", {
                            className: `lp-bub ${R.from === "lawyer" ? "is-me" : ""}`,
                            children: [
                              R.text && n.jsx("p", { children: R.text }),
                              (g = R.attachments) == null
                                ? void 0
                                : g.map((M, q) =>
                                    n.jsxs(
                                      "span",
                                      {
                                        className: "lp-att",
                                        children: [
                                          n.jsx(L, { name: "file", size: 15 }),
                                          n.jsx("span", { children: M.name }),
                                          n.jsx("small", { children: xo(M.size) }),
                                        ],
                                      },
                                      q,
                                    ),
                                  ),
                              n.jsxs("time", {
                                dateTime: R.at,
                                children: [ge(R.at), R.id === f ? " · sent (demo)" : ""],
                              }),
                            ],
                          }),
                        ],
                      },
                      R.id,
                    );
                  }),
                ],
              },
              j.k,
            ),
          ),
        ],
      }),
      n.jsxs("form", {
        className: "lp-composer",
        onSubmit: (j) => {
          (j.preventDefault(), k());
        },
        children: [
          h.length > 0 &&
            n.jsx("ul", {
              className: "lp-atts",
              children: h.map((j, R) =>
                n.jsxs(
                  "li",
                  {
                    children: [
                      n.jsx(L, { name: "file", size: 14 }),
                      n.jsx("span", { children: j.name }),
                      n.jsx("small", { children: xo(j.size) }),
                      n.jsx("button", {
                        type: "button",
                        className: "lp-icon-btn",
                        "aria-label": `Remove attachment ${j.name}`,
                        onClick: () => m(h.filter((g, M) => M !== R)),
                        children: n.jsx(L, { name: "x", size: 14 }),
                      }),
                    ],
                  },
                  R,
                ),
              ),
            }),
          S &&
            n.jsxs("p", {
              className: "lp-err",
              role: "alert",
              children: [n.jsx(L, { name: "alert", size: 14 }), " ", S],
            }),
          n.jsxs("div", {
            className: "lp-composer-row",
            children: [
              n.jsx("input", {
                ref: c,
                type: "file",
                className: "lp-sr",
                tabIndex: -1,
                accept: ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png",
                "aria-label": "Attach a file",
                onChange: (j) => {
                  (y(j.target.files), (j.target.value = ""));
                },
              }),
              n.jsx("button", {
                type: "button",
                className: "lp-icon-btn",
                "aria-label": "Attach a file (PDF, JPG or PNG up to 5 MB)",
                onClick: () => {
                  var j;
                  return (j = c.current) == null ? void 0 : j.click();
                },
                children: n.jsx(L, { name: "upload", size: 19 }),
              }),
              n.jsx("textarea", {
                ref: o,
                className: "lp-input lp-textarea lp-compose",
                rows: 1,
                "aria-label": "Write a message",
                placeholder: "Write a message…",
                value: u,
                maxLength: Bs + 200,
                onChange: (j) => {
                  (d(j.target.value), v(""));
                },
                onKeyDown: (j) => {
                  j.key === "Enter" && !j.shiftKey && (j.preventDefault(), k());
                },
              }),
              n.jsx(b, {
                type: "submit",
                icon: "arrowR",
                disabled: !u.trim() && h.length === 0,
                "aria-label": "Send message",
                children: "Send",
              }),
            ],
          }),
          n.jsxs("p", {
            className: "lp-hint lp-compose-hint",
            children: [
              n.jsx("span", { children: "Enter to send · Shift+Enter for a new line" }),
              n.jsxs("span", { className: u.length > Bs ? "is-over" : "", children: [u.length, "/", Bs] }),
            ],
          }),
        ],
      }),
    ],
  });
}
export const Iv = ["Advocate", "Senior Advocate", "Partner", "Counsel", "Legal Consultant"],
  xd = { video: "video", phone: "phone", in_person: "pin" },
  hi = 500,
  yd = 5e4;
export async function Rv(e) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(e.type))
    throw new Error("Use a JPG, PNG or WebP image.");
  if (e.size > 2 * 1024 * 1024) throw new Error("The image is larger than 2 MB.");
  const t = URL.createObjectURL(e);
  try {
    const s = await new Promise((r, a) => {
      const o = new Image();
      ((o.onload = () => r(o)),
        (o.onerror = () => a(new Error("That file could not be read as an image."))),
        (o.src = t));
    });
    if (s.width < 200 || s.height < 200)
      throw new Error("The image is too small. Use at least 200 × 200 pixels.");
    const l = Math.min(s.width, s.height),
      i = document.createElement("canvas");
    return (
      (i.width = i.height = 256),
      i.getContext("2d").drawImage(s, (s.width - l) / 2, (s.height - l) / 2, l, l, 0, 0, 256, 256),
      i.toDataURL("image/jpeg", 0.82)
    );
  } finally {
    URL.revokeObjectURL(t);
  }
}
