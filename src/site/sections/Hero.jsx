import { Link } from "react-router-dom";
import HeroVideo from "../components/HeroVideo.jsx";
import { useRef } from "react";
import { useSite } from "../SiteContext.jsx";
import { useHeroIntro } from "../animation/useHeroIntro.js";

export default function Hero() {
  const { act, heroQuery, setHeroQuery, heroInputRef, heroMsg, heroState, onHeroSubmit, menuOpen, setMenuOpen } =
    useSite();
  const rootRef = useRef(null);
  useHeroIntro(rootRef);
  return (
    <div className="site-hero relative isolate flex flex-col overflow-hidden" id="top" ref={rootRef}>
      <HeroVideo />
      <div className="hero-veil absolute inset-0 -z-10" aria-hidden="true" />
      <header className="hero-header relative z-20 flex items-center justify-between px-6 py-6 md:px-14 md:py-8">
        <a className="flex items-center gap-2.5" href="#top" aria-label="LegalConnect home">
          <svg
            className="h-7 w-7"
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M16 4v22M9 27h14M6 8h20M6 8 2 18h8L6 8ZM26 8l-4 10h8L26 8ZM2 18a4 4 0 0 0 8 0M22 18a4 4 0 0 0 8 0" />
            <circle cx="16" cy="4" r="1.2" />
          </svg>{" "}
          <span className="text-[13px] font-medium tracking-[.16em] md:text-sm">LEGALCONNECT</span>
        </a>
        <div className="flex items-center gap-3 md:gap-10">
          <nav
            className={`absolute left-4 right-4 top-full mt-1 flex flex-col gap-4 rounded-2xl border border-white/15 bg-[#07142a]/95 p-5 text-sm backdrop-blur md:static md:mt-0 md:flex md:flex-row md:gap-9 md:border-0 md:bg-transparent md:p-0 md:text-[13px] md:backdrop-blur-none ${menuOpen ? "" : "hidden"}`.trim()}
            id="hero-menu"
            aria-label="Primary"
          >
            <Link className="nav-link text-white/80 transition hover:text-white" to="/find-lawyers" onClick={() => setMenuOpen(false)}>Find Lawyers</Link>{" "}
            <Link className="nav-link text-white/80 transition hover:text-white" to="/legal-services" onClick={() => setMenuOpen(false)}>Legal Services</Link>{" "}
            <Link className="nav-link text-white/80 transition hover:text-white" to="/about" onClick={() => setMenuOpen(false)}>How It Works</Link>{" "}
            <a
              className="nav-link text-white/80 transition hover:text-white"
              href="#insights"
              onClick={() => setMenuOpen(false)}
            >
              Insights
            </a>
          </nav>
          <Link className="nav-link hidden text-xs text-white/80 transition hover:text-white md:inline md:text-[13px]" to="/register/user">Register</Link>{" "}
          <button
            className="rounded-full border border-white/35 px-5 py-1.5 text-xs transition hover:border-white/70 hover:bg-white/10 md:text-[13px]"
            type="button"
            onClick={() => act("login")}
          >
            Login
          </button>{" "}
          <button
            className="md:hidden rounded-full border border-white/25 p-2"
            id="hero-burger"
            type="button"
            aria-label="Toggle menu"
            aria-controls="hero-menu"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </header>
      <div className="hero-content relative z-10 flex flex-1 flex-col justify-center px-6 py-8 md:px-14">
        <div className="hero-copy">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[.22em] text-[var(--muted)] md:text-xs">
            Trusted Legal Solutions
          </p>
          <h1 className="hero-title font-serif font-normal tracking-[-.015em]">
            <span>The right lawyer</span>
            <span>for your next</span>
            <span>chapter.</span>
          </h1>
          <p className="hero-description mt-6 max-w-[22rem] text-[15px] leading-relaxed text-[var(--muted)] md:text-base">
            Expert legal support for life's most important decisions.
          </p>
          <form
            className="hero-search mt-8 w-full max-w-[35rem]"
            id="hero-search"
            role="search"
            aria-label="Quick lawyer search"
            noValidate
            onSubmit={onHeroSubmit}
          >
            <div className="flex items-center rounded-full bg-[#f6f2ea]/95 p-1.5 pl-6 shadow-[0_12px_40px_rgba(0,0,0,.35)] transition focus-within:ring-2 focus-within:ring-[#9fe0d6]/70 md:p-2 md:pl-7">
              <label className="sr-only" htmlFor="hero-q">
                Search lawyers, practice areas or locations
              </label>{" "}
              <input
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-[#0a1a30] placeholder:text-[#0a1a30]/55 focus:outline-none md:text-[15px]"
                id="hero-q"
                type="search"
                autoComplete="off"
                placeholder="Search for lawyers, practice areas or locations..."
                ref={heroInputRef}
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
              />{" "}
              <button
                className="ml-2 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-white transition hover:scale-105 hover:bg-[var(--accent-hi)] md:h-12 md:w-12"
                type="submit"
                aria-label="Search"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="m16 16 4 4" />
                </svg>
              </button>
            </div>
            <p
              className="mt-3 min-h-[1.5rem] pl-6 text-sm text-[var(--muted)]"
              id="hero-out"
              role="status"
              aria-live="polite"
              data-state={heroState}
            >
              {heroMsg}
            </p>
          </form>
        </div>
      </div>
      <section className="hero-stats relative z-10 px-6 pb-8 pt-4 md:px-14 md:pb-10" aria-label="LegalConnect at a glance">
        <div className="grid max-w-3xl grid-cols-2 gap-y-6 md:grid-cols-4">
          <div className="hero-stat">
            <div className="font-serif text-3xl md:text-[2.5rem] md:leading-none">10K+</div>
            <div className="mt-1.5 text-xs text-[var(--muted)] md:text-[13px]">Verified Lawyers</div>
          </div>
          <div className="hero-stat">
            <div className="font-serif text-3xl md:text-[2.5rem] md:leading-none">50K+</div>
            <div className="mt-1.5 text-xs text-[var(--muted)] md:text-[13px]">Happy Clients</div>
          </div>
          <div className="hero-stat">
            <div className="font-serif text-3xl md:text-[2.5rem] md:leading-none">25+</div>
            <div className="mt-1.5 text-xs text-[var(--muted)] md:text-[13px]">Practice Areas</div>
          </div>
          <div className="hero-stat">
            <div className="font-serif text-3xl md:text-[2.5rem] md:leading-none">4.8/5</div>
            <div className="mt-1.5 text-xs text-[var(--muted)] md:text-[13px]">Avg. Rating</div>
          </div>
        </div>
      </section>
    </div>
  );
}
