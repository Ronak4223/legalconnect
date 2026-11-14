import { useState, useEffect } from "react";
import { useSite } from "../SiteContext.jsx";
import { CASES } from "../data/stories.js";

export default function Cases() {
  const { act: siteAct } = useSite();
  const [ci, setCi] = useState(0);
  const [fade, setFade] = useState(false);
  const [playing, setPlaying] = useState(false);
  const c = CASES[ci];
  const goC = (i) => {
    setFade(true);
    setTimeout(() => {
      setCi((i + CASES.length) % CASES.length);
      setFade(false);
    }, 250);
  };
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setCi((v) => (v + 1) % CASES.length), 6000);
    return () => clearInterval(t);
  }, [playing]);
  const act = (n, d) => (n === "rgo" ? goC(ci + +d.d) : n === "rplay" ? setPlaying((p) => !p) : siteAct(n, d));
  return (
    <section className="bg-[#efece6] px-4 py-16 text-[#0d2340] md:px-10 md:py-24" id="cases">
      <div className="mx-auto grid max-w-[80rem] gap-5 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <article
          className="rc relative min-h-[32rem] overflow-hidden rounded-2xl text-white transition-opacity duration-300 md:min-h-[40rem]"
          id="rc"
          aria-live="polite"
          data-tone={c.tone}
          style={{ backgroundImage: `var(--${c.img})`, backgroundPosition: c.pos, opacity: fade ? 0 : 1 }}
        >
          <div className="rc-shade absolute inset-0" />
          <h2 className="rc-h absolute left-6 top-6 z-10 font-serif text-[clamp(1.9rem,3.6vw,3.25rem)] font-normal uppercase leading-[1.1] text-[#0d2340] md:left-10 md:top-10">
            Real cases.
            <br />
            Real people.
          </h2>
          <div className="absolute bottom-6 left-6 right-6 z-10 max-w-sm md:bottom-10 md:left-10">
            <span className="font-serif text-5xl leading-none text-white/70" aria-hidden="true">
              “
            </span>
            <p className="-mt-2 font-serif text-xl leading-snug md:text-2xl" id="rc-q">
              {c.q}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <span
                className="h-10 w-10 rounded-full border border-white/60"
                id="rc-av"
                style={{ backgroundImage: `var(--${c.img})`, backgroundSize: "320%", backgroundPosition: c.av }}
              />
              <div>
                <p className="text-sm font-semibold" id="rc-n">
                  {c.n}
                </p>
                <p className="text-xs text-white/75" id="rc-r">
                  {c.r}
                </p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2 md:bottom-10 md:right-10">
            <button className="rc-b" type="button" aria-label="Previous story" onClick={() => act("rgo", { d: "-1" })}>
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="m14 6-6 6 6 6" />
              </svg>
            </button>{" "}
            <button
              className="rc-b"
              type="button"
              aria-label="Autoplay stories"
              onClick={() => act("rplay")}
              aria-pressed={playing}
            >
              <svg className="ic-pause h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
              </svg>
              <svg className="ic-play h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            </button>{" "}
            <button className="rc-b" type="button" aria-label="Next story" onClick={() => act("rgo", { d: "1" })}>
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="m10 6 6 6-6 6" />
              </svg>
            </button>
          </div>
        </article>
        <div className="grid content-start gap-5 sm:grid-cols-2 lg:grid-cols-1" id="rc-side">
          {CASES.map((s, i) =>
            i === ci ? null : (
              <button key={s.n} type="button" className="rs" onClick={() => goC(i)}>
                <span className="rs-t" style={{ backgroundImage: `var(--${s.img})`, backgroundPosition: s.pos }} />
                <span className="rs-q">{"“" + s.q + "”"}</span>
                <span className="rs-w">
                  <span className="rs-a" style={{ backgroundImage: `var(--${s.img})`, backgroundPosition: s.av }} />
                  <span>
                    <b>{s.n}</b>
                    <br />
                    {s.r}
                  </span>
                </span>
              </button>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
