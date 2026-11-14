import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../state/store.jsx";
import { Logo, Avatar } from "../ui/Misc.jsx";
import { Ic } from "../ui/Icons.jsx";
import { Menu, Drawer } from "../ui/Overlay.jsx";
import { USER_NAV, LAWYER_NAV, homeFor } from "../routes.js";

export default function DashLayout({ role }) {
  const { state, session, account, lawyer, actions } = useApp();
  const nav = role === "lawyer" ? LAWYER_NAV : USER_NAV;
  const [more, setMore] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate(); const { pathname } = useLocation();
  useEffect(() => { setMore(false); window.scrollTo(0, 0); }, [pathname]);
  const me = session.id;
  const unreadMsgs = state.conversations.reduce((a, c) => a + (role === "user" ? (c.userId === me ? c.ul || 0 : 0) : (c.lawyerId === me ? c.ll || 0 : 0)), 0);
  const unreadNotifs = state.notifications.filter((n) => n.to === me && !n.read).length;
  const pending = state.appointments.filter((a) => a.lawyerId === me && a.status === "pending").length;
  const badge = (k) => ({ msg: unreadMsgs, notif: unreadNotifs, pending }[k] || 0);
  const onSearch = (e) => { e.preventDefault(); navigate(role === "user" ? `/find-lawyers?q=${encodeURIComponent(q)}` : `/lawyer/clients?q=${encodeURIComponent(q)}`); };
  const profile = role === "user" ? "/user/profile" : "/lawyer/profile";
  const bottom = [nav[0], nav[1], nav.find((n) => n.badge === "msg"), nav.find((n) => n.badge === "notif")];
  return (
    <div className="app" data-theme={role}>
      <div className="dash">
        <aside className="dash-side" aria-label="Sidebar">
          <Logo light={role === "lawyer"} to={homeFor(role)} />
          <nav className="dash-nav" aria-label={role === "lawyer" ? "Lawyer dashboard" : "Client dashboard"}>
            {nav.map((n) => <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? "on" : "")}><Ic n={n.icon} size={19} />{n.label}{badge(n.badge) > 0 && <span className="nav-badge" aria-label={`${badge(n.badge)} new`}>{badge(n.badge)}</span>}</NavLink>)}
          </nav>
          <div className="foot">
            {role === "user" && <Link to="/find-lawyers"><Ic n="search" size={18} />Find a lawyer</Link>}
            <Link to="/"><Ic n="home" size={18} />Public site</Link>
            <button type="button" onClick={() => { actions.logout(); actions.toast("You have been signed out."); navigate("/"); }}><Ic n="logout" size={18} />Sign out</button>
          </div>
        </aside>
        <div className="dash-main">
          <header className="dash-top">
            <Logo to={homeFor(role)} className="dash-top-logo" />
            <form className="search" role="search" onSubmit={onSearch}>
              <div className="inp"><span className="inp-ic"><Ic n="search" size={17} /></span><input className="pl" value={q} onChange={(e) => setQ(e.target.value)} placeholder={role === "user" ? "Search lawyers, practice areas, cities…" : "Search clients…"} aria-label="Search" /></div>
            </form>
            <span className="sp" />
            <Link to={`/${role}/notifications`} className="icon-btn bell" aria-label={`Notifications${unreadNotifs ? `, ${unreadNotifs} unread` : ""}`}><Ic n="bell" size={20} />{unreadNotifs > 0 && <i>{unreadNotifs}</i>}</Link>
            <Menu label="Account menu" trigger={<span className="who"><Avatar name={account?.name || ""} src={account?.avatar || (role === "lawyer" ? lawyer?.src : "") || undefined} size={36} /><span>{account?.name}<small>{role === "lawyer" ? "Advocate" : "Client"}</small></span></span>}
              items={[{ label: "Profile", icon: "user", to: profile }, { label: "Public site", icon: "home", to: "/" }, { divider: true }, { label: "Sign out", icon: "logout", danger: true, onClick: () => { actions.logout(); navigate("/"); } }]} />
          </header>
          <div className="dash-content" key={pathname}><Outlet /></div>
        </div>
      </div>
      <nav className="dash-bottom" aria-label="Quick navigation">
        {bottom.map((n) => <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? "on" : "")}><Ic n={n.icon} size={21} />{n.label.split(" ")[0]}{badge(n.badge) > 0 && <span className="nav-badge">{badge(n.badge)}</span>}</NavLink>)}
        <button type="button" onClick={() => setMore(true)}><Ic n="more" size={21} />More</button>
      </nav>
      <Drawer open={more} onClose={() => setMore(false)} title="More">
        <nav className="mnav">
          {nav.filter((n) => !bottom.includes(n)).map((n) => <Link key={n.to} to={n.to}>{n.label}</Link>)}
          <Link to="/">Public site</Link>
          <button type="button" className="link-btn" style={{ textAlign: "left", padding: ".9rem .6rem", fontFamily: "Lora Variable,serif", fontSize: "1.3rem" }} onClick={() => { actions.logout(); navigate("/"); }}>Sign out</button>
        </nav>
      </Drawer>
    </div>
  );
}
