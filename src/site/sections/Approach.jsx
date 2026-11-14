import { useSite } from "../SiteContext.jsx";
import { GLYPHS } from "../components/glyphs.jsx";
import { PICK_AREAS } from "../data/areas.js";

export default function Approach() {
  const { pick, picked, pickedMsg, act } = useSite();
  return (
    <section
      className="ap relative isolate min-h-[34rem] overflow-hidden px-6 py-16 text-[#0d2340] md:min-h-[40rem] md:px-14 md:py-24"
      id="approach"
    >
      <div className="max-w-xl">
        <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-[#0d2340]/70">Our approach</p>
        <h2 className="mt-4 font-serif text-[clamp(2.2rem,4.6vw,4rem)] font-normal leading-[1.08] tracking-[-.01em]">
          Legal support
          <br />
          for every chapter
          <br />
          of your life.
        </h2>
        <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-[#0d2340]/70">
          From personal matters to business goals, we connect you with the right legal expertise — quickly, securely,
          and confidently.
        </p>
      </div>
      <div
        className="mt-10 grid max-w-3xl grid-cols-3 gap-y-5 sm:grid-cols-5"
        id="ap-list"
        role="group"
        aria-label="Practice areas"
      >
        {PICK_AREAS.map(([n, ic]) => (
          <button
            key={n}
            type="button"
            className="ap-i"
            aria-pressed={picked === n + " Law"}
            onClick={() => pick(n + " Law")}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {GLYPHS[ic]}
            </svg>
            <span>
              {n}
              <br />
              Law
            </span>
          </button>
        ))}
      </div>
      <p className="mt-4 min-h-[1.25rem] text-sm text-[#0d2340]/70" id="ap-out" role="status" aria-live="polite">
        {pickedMsg}
      </p>
      <button
        className="mt-3 inline-flex items-center gap-2 border-b border-[#0d2340]/30 pb-0.5 text-sm transition-all hover:gap-3 hover:border-[#0d2340]"
        type="button"
        onClick={() => act("areas")}
      >
        Explore All Areas <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}
