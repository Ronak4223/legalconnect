import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useApp } from "../state/store.jsx";
import { Logo, Avatar } from "../ui/Misc.jsx";
import { Button } from "../ui/Button.jsx";
import { Menu, Drawer } from "../ui/Overlay.jsx";
import { Ic } from "../ui/Icons.jsx";
import { PUBLIC_NAV, homeFor } from "../routes.js";

export function PublicHeader() {
  const { session, account, actions } = useApp();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  return (
    <header className="pub-h">
      <div className="wrap in">
        <Logo />
        <nav className="pub-nav" aria-label="Main">
          {PUBLIC_NAV.map((n) => <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? "on" : "")}>{n.label}</NavLink>)}
        </nav>
        <div className="pub-act">
          {session && account ? (
            <>
              <Button to={homeFor(session.role)} variant="soft" size="sm" icon="grid" className="hide-m">Dashboard</Button>
              <Menu label="Account" trigger={<Avatar name={account.name} size={38} />} items={[{ label: "Dashboard", icon: "grid", to: homeFor(session.role) }, { label: "Sign out", icon: "logout", danger: true, onClick: () => { actions.logout(); actions.toast("You have been signed out."); } }]} />
            </>
          ) : (
            <>
              <Menu className="hide-m" label="Log in" trigger={<span className="btn btn-ghost btn-sm">Log in <Ic n="chevD" size={14} /></span>} items={[{ label: "I’m a client", icon: "user", to: "/login/user" }, { label: "I’m a lawyer", icon: "scale", to: "/login/lawyer" }]} />
              <Button to="/register/user" size="sm" className="hide-m">Get started</Button>
            </>
          )}
          <button type="button" className="icon-btn pub-burger" aria-label="Open menu" onClick={() => setOpen(true)}><Ic n="menu" /></button>
        </div>
      </div>
      <Drawer open={open} onClose={() => setOpen(false)} title="Menu">
        <nav className="mnav" aria-label="Mobile">
          {PUBLIC_NAV.map((n) => <Link key={n.to} to={n.to}>{n.label}</Link>)}
          {session ? <Link to={homeFor(session.role)}>My dashboard</Link> : <><Link to="/login/user">Client log in</Link><Link to="/login/lawyer">Lawyer log in</Link><Link to="/register/user">Create client account</Link><Link to="/register/lawyer">Join as a lawyer</Link></>}
        </nav>
      </Drawer>
    </header>
  );
}
export function PublicFooter() {
  return (
    <footer className="pub-f">
      <div className="wrap">
        <div className="g">
          <div><Logo light /><p style={{ maxWidth: "34ch", fontSize: ".9rem", lineHeight: 1.7, marginTop: "1rem" }}>Verified lawyers, clear fees and a calm way to get legal help — for every chapter of your life.</p></div>
          <div><h4>Platform</h4><ul><li><Link to="/find-lawyers">Find lawyers</Link></li><li><Link to="/legal-services">Legal services</Link></li><li><Link to="/about">About</Link></li><li><Link to="/contact">Help & contact</Link></li></ul></div>
          <div><h4>Clients</h4><ul><li><Link to="/register/user">Create account</Link></li><li><Link to="/login/user">Client log in</Link></li><li><Link to="/forgot-password">Reset password</Link></li></ul></div>
          <div><h4>Lawyers</h4><ul><li><Link to="/register/lawyer">Join LegalConnect</Link></li><li><Link to="/login/lawyer">Lawyer log in</Link></li><li><Link to="/privacy">Privacy</Link></li><li><Link to="/terms">Terms</Link></li></ul></div>
        </div>
        <div className="b"><span>© 2026 LegalConnect. A frontend demonstration — all lawyers, cases and payments are fictional.</span><span>Not legal advice.</span></div>
      </div>
    </footer>
  );
}
export default function PublicLayout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className="app" data-theme="user">
      <a href="#main" className="sr-only" style={{ position: "absolute" }}>Skip to content</a>
      <PublicHeader />
      <main id="main" key={pathname} className="page-in"><Outlet /></main>
      <PublicFooter />
    </div>
  );
}
