import { useSite } from "../SiteContext.jsx";

export default function Insights() {
  const { act } = useSite();
  return (
    <section
      className="ins relative z-10 flex min-h-[30rem] flex-col justify-between gap-10 px-6 py-16 text-white md:min-h-[36rem] md:flex-row md:items-center md:px-14"
      id="insights"
    >
      <div className="max-w-md">
        <h2 className="font-serif text-[clamp(2.1rem,4.2vw,3.5rem)] font-normal leading-[1.1]">
          Legal insights
          <br />
          for a stronger tomorrow.
        </h2>
        <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/75">
          Articles, news and expert advice to help you make informed decisions.
        </p>
        <button className="pill mt-7" type="button" onClick={() => act("insights")}>
          Explore Insights <span aria-hidden="true">→</span>
        </button>
      </div>
      <button
        className="lc-float flex w-full max-w-[22rem] items-center gap-4 self-end rounded-xl bg-[#f8f6f1]/95 p-3 text-left text-[#0d2340] shadow-[0_24px_60px_rgba(0,0,0,.45)] transition duration-500 hover:-translate-y-1 md:absolute md:bottom-0 md:right-14 md:translate-y-1/3 md:hover:translate-y-[calc(33.333%-4px)]"
        id="ins-card"
        type="button"
        onClick={() => act("article")}
      >
        <span className="thumb h-20 w-24 shrink-0 rounded-lg" role="img" aria-label="Sunlit marble columns" />{" "}
        <span>
          <span className="block font-serif text-[17px] leading-snug">Understanding Divorce Laws in India</span>
          <span className="mt-1.5 block text-xs text-[#0d2340]/70">Family Law · 5 min read</span>
        </span>
      </button>
    </section>
  );
}
