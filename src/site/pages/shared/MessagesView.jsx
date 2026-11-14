import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useApp } from "../../state/store.jsx";
import { LawyerPhoto, Avatar, EmptyState } from "../../ui/Misc.jsx";
import { Ic } from "../../ui/Icons.jsx";
import { Button } from "../../ui/Button.jsx";
import { personName, lawyerById } from "../../state/selectors.js";
import { ago, clock } from "../../utils/format.js";

const dayLabel = (ts) => { const d = new Date(ts), t = new Date(); const diff = Math.round((new Date(t.getFullYear(), t.getMonth(), t.getDate()) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000); return diff === 0 ? "Today" : diff === 1 ? "Yesterday" : d.toLocaleDateString("en-IN", { day: "numeric", month: "long" }); };

export default function MessagesView({ role }) {
  const { state, session, actions, typing } = useApp();
  const [sp, setSp] = useSearchParams(); const sel = sp.get("c");
  const [q, setQ] = useState(""); const [text, setText] = useState(""); const box = useRef(null);
  const other = (c) => (role === "user" ? lawyerById(state, c.lawyerId) : { id: c.userId, name: personName(state, c.userId) });
  const convs = useMemo(() => state.conversations.filter((c) => (role === "user" ? c.userId === session.id : c.lawyerId === session.id)).sort((a, b) => (b.messages.at(-1)?.ts || 0) - (a.messages.at(-1)?.ts || 0)), [state.conversations, role, session.id]);
  const list = convs.filter((c) => !q || other(c)?.name.toLowerCase().includes(q.toLowerCase()));
  const cur = convs.find((c) => c.id === sel);
  useEffect(() => { if (!sel && convs[0] && window.matchMedia("(min-width: 901px)").matches) setSp({ c: convs[0].id }, { replace: true }); }, []); // eslint-disable-line
  useEffect(() => { if (!cur) return undefined; actions.setOpenConv(cur.id); actions.readConv(cur.id); return () => actions.setOpenConv(null); }, [cur?.id, cur?.messages.length]); // eslint-disable-line
  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight; }, [cur?.messages.length, cur && typing[cur.id]]);
  const send = (e) => { e?.preventDefault(); if (!text.trim() || !cur) return; actions.sendMessage(cur.id, text); setText(""); };
  const me = role;
  if (!convs.length) return <div className="panel"><EmptyState icon="message" title="No conversations yet" text={role === "user" ? "Message a lawyer from their profile and your conversation will appear here." : "When clients message you, conversations appear here."} action={role === "user" ? "Find a lawyer" : undefined} to={role === "user" ? "/find-lawyers" : undefined} /></div>;
  const o = cur && other(cur), unread = (c) => (role === "user" ? c.ul : c.ll) || 0;
  const Face = ({ x, size = 44 }) => (role === "user" && x?.im !== undefined || x?.src !== undefined ? <LawyerPhoto l={x} size={size} /> : <Avatar name={x?.name || ""} size={size} />);
  let lastDay = "";
  return (
    <div className={`chat ${cur ? "has-sel" : ""}`}>
      <div className="chat-l">
        <div className="s"><div className="inp"><span className="inp-ic"><Ic n="search" size={16} /></span><input className="pl" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search conversations" aria-label="Search conversations" style={{ borderRadius: 999, minHeight: 40 }} /></div></div>
        <div className="list" role="list">
          {list.map((c) => { const x = other(c), last = c.messages.at(-1); return (
            <button type="button" key={c.id} role="listitem" className={`conv ${cur?.id === c.id ? "on" : ""}`} onClick={() => setSp({ c: c.id }, { replace: true })}>
              <Face x={x} /><div className="m"><b>{x?.name}<em>{last ? ago(last.ts) : ""}</em></b><small>{last ? (last.from === me ? "You: " : "") + last.text : "Say hello"}</small></div>{unread(c) > 0 && <span className="unread" aria-label={`${unread(c)} unread`}>{unread(c)}</span>}
            </button>); })}
          {!list.length && <p className="muted" style={{ padding: "1rem", fontSize: ".86rem" }}>No matches.</p>}
        </div>
      </div>
      <div className="chat-t">
        {cur ? <>
          <div className="chat-th">
            <button type="button" className="icon-btn back-m" aria-label="Back to conversations" onClick={() => setSp({}, { replace: true })}><Ic n="arrowL" size={18} /></button>
            <Face x={o} size={42} /><div className="m"><b>{role === "user" ? `Adv. ${o.name}` : o.name}</b><small>{role === "user" ? `${o.area} · ${o.city}` : "Client"}</small></div>
            {role === "user" ? <Link to={`/lawyer/${o.id}`} className="btn btn-outline btn-sm">View profile</Link> : <Link to={`/lawyer/clients?c=${o.id}`} className="btn btn-outline btn-sm">View client</Link>}
          </div>
          <div className="msgs" ref={box} role="log" aria-live="polite" aria-label={`Conversation with ${o.name}`}>
            {cur.messages.length === 0 && <p className="muted" style={{ textAlign: "center", margin: "auto" }}>No messages yet. Introduce yourself and describe what you need.</p>}
            {cur.messages.map((m) => { const dl = dayLabel(m.ts), show = dl !== lastDay; lastDay = dl; return (
              <div key={m.id} style={{ display: "contents" }}>{show && <span className="day">{dl}</span>}<div className={`bub ${m.from === me ? "me" : ""}`}>{m.text}<small>{clock(m.ts)}</small></div></div>); })}
            {typing[cur.id] && <div className="bub" aria-label="Typing"><span className="typing"><i /><i /><i /></span></div>}
          </div>
          <form className="composer" onSubmit={send}>
            <textarea rows={1} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" aria-label="Message" onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
            <Button type="submit" icon="send" aria-label="Send" disabled={!text.trim()} className="">Send</Button>
          </form>
        </> : <div style={{ margin: "auto", textAlign: "center" }} className="muted"><Ic n="message" size={32} /><p>Select a conversation</p></div>}
      </div>
    </div>
  );
}
