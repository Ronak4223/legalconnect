import { useSite } from "../SiteContext.jsx";

export default function Library() {
  const { act } = useSite();
  return (
    <section className="li relative overflow-hidden px-6 py-16 md:px-14 md:py-20" id="library">
      <div className="mx-auto grid max-w-[80rem] items-end gap-10 md:min-h-[calc(100vh-10rem)] md:grid-cols-[minmax(0,1fr)_22rem] md:gap-16">
        <div className="lc-float w-full max-w-sm rounded-2xl border border-white/50 bg-[#f2f6f7]/85 p-6 text-[#0d2340] shadow-2xl backdrop-blur-md md:mb-6 md:ml-[8%]">
          <h2 className="font-serif text-3xl font-normal">Legal Insights</h2>
          <p className="mt-2 text-sm text-[#0d2340]/70">Knowledge. Guidance. Better Decisions.</p>
          <button
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0f3f4d] px-5 py-2.5 text-sm text-white transition-all hover:gap-3 hover:bg-[#15566a]"
            type="button"
            onClick={() => act("art", { k: "all" })}
          >
            Explore All Articles <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="self-center text-white">
          <p className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[.22em] text-white/85">
            <svg
              className="h-5 w-5"
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M16 4v22M9 27h14M6 8h20M6 8 2 18h8L6 8ZM26 8l-4 10h8L26 8ZM2 18a4 4 0 0 0 8 0M22 18a4 4 0 0 0 8 0" />
            </svg>
            Latest Insights
          </p>
          <div className="grid gap-3">
            <button className="lc-a" type="button" onClick={() => act("art", { k: "emp" })}>
              <span className="lc-t">Legal update</span>
              <span className="lc-h">Key Changes in Employment Law for 2025</span>
              <span className="lc-m">Employment Law · 5 min read</span>
            </button>{" "}
            <button className="lc-a" type="button" onClick={() => act("art", { k: "prop" })}>
              <span className="lc-t">Buyer’s guide</span>
              <span className="lc-h">What to Know Before Buying Property in India</span>
              <span className="lc-m">Property Law · 5 min read</span>
            </button>
          </div>
          <button
            className="mt-5 ml-auto flex items-center gap-2 text-sm text-white/90 transition-all hover:gap-3"
            type="button"
            onClick={() => act("art", { k: "all" })}
          >
            View all <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
