import { Link } from "react-router-dom";
import { useSite } from "../SiteContext.jsx";

export default function Footer() {
  const { act } = useSite();
  return (
    <footer className="ft relative px-6 pb-10 pt-14 text-[#0d2340] md:px-14 md:pt-20" id="footer">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:pr-[26rem]">
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
          <span className="text-sm font-medium tracking-[.16em]">LEGALCONNECT</span>
        </a>
        <nav className="flex flex-wrap gap-x-7 gap-y-2 text-sm text-[#0d2340]/75" aria-label="Footer">
          <Link className="transition hover:text-[#0d2340]" to="/about">About</Link>
          <Link className="transition hover:text-[#0d2340]" to="/find-lawyers">Find Lawyers</Link>
          <button
            className="transition hover:text-[#0d2340]"
            type="button"
            onClick={() => act("legal", { k: "privacy" })}
          >
            Privacy
          </button>
          <button
            className="transition hover:text-[#0d2340]"
            type="button"
            onClick={() => act("legal", { k: "terms" })}
          >
            Terms
          </button>
          <Link className="transition hover:text-[#0d2340]" to="/contact">Contact</Link>
        </nav>
      </div>
      <div className="mt-8 flex items-center gap-2">
        <button
          className="grid h-8 w-8 place-items-center rounded-full border border-[#0d2340]/30 text-[11px] font-semibold transition hover:bg-[#0d2340] hover:text-white"
          type="button"
          aria-label="in — LinkedIn (coming soon)"
          onClick={() => act("legal", { k: "social" })}
        >
          in
        </button>{" "}
        <button
          className="grid h-8 w-8 place-items-center rounded-full border border-[#0d2340]/30 text-[11px] font-semibold transition hover:bg-[#0d2340] hover:text-white"
          type="button"
          aria-label="X (coming soon)"
          onClick={() => act("legal", { k: "social" })}
        >
          X
        </button>{" "}
        <button
          className="grid h-8 w-8 place-items-center rounded-full border border-[#0d2340]/30 text-[11px] font-semibold transition hover:bg-[#0d2340] hover:text-white"
          type="button"
          aria-label="Facebook (coming soon)"
          onClick={() => act("legal", { k: "social" })}
        >
          f
        </button>
      </div>
      <p className="mt-8 text-xs text-[#0d2340]/70">© 2026 LegalConnect. All rights reserved.</p>
    </footer>
  );
}
