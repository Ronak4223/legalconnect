import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useSite } from "../SiteContext.jsx";
import { AREAS } from "../data/areas.js";
import { ARTICLES } from "../data/articles.js";
import { PORTAL_REGISTER_URL } from "../portalUrl.js";

const NOTE = "mt-3 text-sm leading-relaxed text-[#0d2340]/80";
const META = "mt-1 text-xs text-[#0d2340]/70";

function LoginBody() {
  const [msg, setMsg] = useState("");
  return (<>
    <form className="mt-4 grid gap-3" onSubmit={(e) => { e.preventDefault(); setMsg("Client sign-in is not available in this demo yet. Lawyers can use the lawyer portal."); }}>
      <input className="dlg-in" required type="email" name="email" placeholder="Email" aria-label="Email" />
      <input className="dlg-in" required type="password" name="pw" placeholder="Password" aria-label="Password" />
      <button className="dlg-btn">Sign in</button>
    </form>
    <p className="mt-3 text-sm" role="status">{msg}</p>
  </>);
}
function JoinBody() {
  return (
    <form className="mt-4 grid gap-3" onSubmit={(e) => { e.preventDefault(); window.location.href = PORTAL_REGISTER_URL; }}>
      <input className="dlg-in" required name="name" placeholder="Full name" aria-label="Full name" />
      <input className="dlg-in" required type="email" name="email" placeholder="Work email" aria-label="Work email" />
      <input className="dlg-in" required name="bar" placeholder="Bar council enrolment no." aria-label="Bar council enrolment number" />
      <button className="dlg-btn">Request a profile</button>
    </form>
  );
}
function ProfileBody({ l }) {
  const [msg, setMsg] = useState("");
  return (<>
    <p className={META}>{l.a} {"·"} {l.y}+ years {"·"} {l.c}</p>
    <p className="mt-3 text-sm"><b className="text-[#c58a2b]">{"★"}</b> {l.r.toFixed(1)} client rating</p>
    <p className={NOTE}>{l.n} advises clients on {l.a.toLowerCase()} matters with a clear, practical approach.</p>
    <button type="button" className="dlg-btn mt-5" onClick={() => setMsg("Demo only: no request was sent. Connect this button to your booking flow.")}>Request a consultation</button>
    <p className="mt-3 text-sm" role="status">{msg}</p>
  </>);
}

/** Content for every dialog key. Returns [title, body]. */
function contentFor(act, dialog) {
  const { key, data } = dialog;
  if (ARTICLES[key]) { const a = ARTICLES[key]; return [a.title, <>
    <p className={META}>{a.meta}</p><p className={"mt-4 " + NOTE}>{a.body}</p>
    <button type="button" className="dlg-btn mt-5" onClick={() => act("chip", { n: a.area })}>{a.cta}</button></>]; }
  switch (key) {
    case "login": return ["Welcome back", <LoginBody />];
    case "join": return ["Join as a Lawyer", <JoinBody />];
    case "areas": return ["All practice areas", <>
      <p className="mt-3 text-sm text-[#0d2340]/70">Choose an area to start your search.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Family", "Criminal", "Corporate", "Property", "Employment", "Tax", "Immigration", "Intellectual Property", "Consumer", "Civil", "Banking", "Cyber"].map((n) => (
          <button key={n} type="button" className="dlg-chip" onClick={() => act("chip", { n: n + " Law" })}>{n} Law</button>))}
      </div></>];
    case "all": return ["Latest insights", <>
      <p className="mt-2 text-sm text-[#0d2340]/70">Choose an article to read.</p>
      <div className="mt-4 grid gap-2">{Object.entries(ARTICLES).reverse().map(([k, a]) => <button key={k} type="button" className="dlg-row" onClick={() => act("art", { k })}>{a.title}</button>)}</div></>];
    case "svc": return [data.n, <>
      <p className={NOTE}>{data.d}. Our verified {data.n.toLowerCase()} lawyers can review your situation and explain your options.</p>
      <button type="button" className="dlg-btn mt-5" onClick={() => act("flarea", { n: data.n })}>Find a {data.n.toLowerCase()} lawyer</button></>];
    case "prof": return [data.n, <ProfileBody l={data} />];
    case "social": return ["Social profiles", <p className={NOTE}>LegalConnect social profiles will be linked here once they exist.</p>];
    default: return ["", null];
  }
}

/** The single modal dialog. Native <dialog> (focus trap, Esc, top layer); Lenis is paused while it is open; content eases in with Motion. */
export default function Dialog() {
  const { dialog, closeDialog, act } = useSite();
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current; if (!d) return;
    if (dialog && !d.open) d.showModal();
    if (!dialog && d.open) d.close();
  }, [dialog]);
  const [title, body] = dialog ? contentFor(act, dialog) : ["", null];
  return (
    <dialog id="dlg" ref={ref} data-lenis-prevent className="m-auto w-[min(92vw,26rem)] rounded-2xl bg-[#f8f6f1] p-0 text-[#0d2340] shadow-2xl"
      onClose={closeDialog} onClick={(e) => { if (e.target === ref.current) closeDialog(); }}>
      {dialog && (
        <motion.div key={dialog.key} className="p-6" initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 320, damping: 28 }}>
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-serif text-2xl">{title}</h2>
            <button type="button" aria-label="Close" onClick={closeDialog} className="rounded-full border border-[#0d2340]/25 px-2.5 py-0.5 text-lg leading-none transition hover:bg-[#0d2340]/10">{"×"}</button>
          </div>
          <div>{body}</div>
        </motion.div>
      )}
    </dialog>
  );
}
