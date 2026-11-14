import { Link } from "react-router-dom";
import { slug } from "../utils/format.js";
import { useState } from "react";
import { useSite } from "../SiteContext.jsx";
import { PEOPLE } from "../data/people.js";

export default function People() {
  const { act: siteAct } = useSite();
  const [cur, setCur] = useState(0);
  const [fade, setFade] = useState(false);
  const [bio, setBio] = useState(false);
  const p = PEOPLE[cur];
  const num = (i) => ("0" + (i + 1)).slice(-2);
  const show = (i) => {
    setFade(true);
    setTimeout(() => {
      setCur((i + PEOPLE.length) % PEOPLE.length);
      setBio(false);
      setFade(false);
    }, 250);
  };
  const act = (n, d) => (n === "pgo" ? show(cur + +d.d) : n === "profile" ? setBio((b) => !b) : siteAct(n, d));
  return (
    <section className="bg-[#f4f1ea] px-6 py-20 text-[#0d2340] md:px-14 md:py-28" id="people">
      <h2 className="font-serif text-[clamp(1.9rem,3.6vw,3.25rem)] font-normal uppercase leading-[1.12]">
        Meet the people
        <br />
        behind the practice.
      </h2>
      <div className="mt-10 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <article
          className="pf relative min-h-[27rem] overflow-hidden rounded-xl text-white transition-opacity duration-300 md:min-h-[34rem]"
          id="pf"
          aria-live="polite"
          style={{ backgroundImage: `var(--p${cur + 1})`, backgroundPosition: p.pos, opacity: fade ? 0 : 1 }}
        >
          <div className="pf-shade absolute inset-0" />
          <span className="absolute left-6 top-6 text-xs tracking-[.2em] text-white/85" id="pf-n">
            {num(cur) + " / 0" + PEOPLE.length}
          </span>
          <div className="absolute bottom-6 left-6 right-6 md:bottom-9 md:left-9">
            <h3 className="font-serif text-4xl font-normal md:text-5xl" id="pf-name">
              {p.name}
            </h3>
            <p className="mt-2 text-sm text-white/90" id="pf-area">
              {p.area}
            </p>
            <p className="mt-1 text-sm text-white/90" id="pf-exp">
              {p.exp}
            </p>
            <p
              className={`mt-3 max-w-sm text-sm leading-relaxed text-white/85 ${bio ? "" : "hidden"}`.trim()}
              id="pf-bio"
            >
              {p.bio}
            </p>
            <button className="pill mt-5" type="button" onClick={() => act("profile")} aria-expanded={bio}>
              View Profile <span aria-hidden="true">→</span>
            </button>
            {bio && <Link className="ml-4 mt-5 inline-block text-sm text-white/90 underline underline-offset-4" to={`/lawyer/${slug(p.name)}`}>Open full profile page</Link>}
          </div>
        </article>
        <div className="flex items-center justify-between gap-4 md:flex-col md:justify-center md:gap-6">
          <div className="flex items-end gap-3" id="pp-strip" role="group" aria-label="Other lawyers">
            {PEOPLE.map((q, i) =>
              i === cur ? null : (
                <button key={q.name} type="button" className="pp-b" onClick={() => show(i)}>
                  <span>{num(i)}</span>
                  <span className="sr-only">
                    Show {q.name}, {q.area}
                  </span>
                  <span className="pp-t" style={{ backgroundImage: `var(--p${i + 1})`, backgroundPosition: q.pos }} />
                </button>
              ),
            )}
          </div>
          <div className="flex gap-2">
            <button
              className="grid h-9 w-9 place-items-center rounded-full border border-[#0d2340]/30 transition hover:bg-[#0d2340] hover:text-white"
              type="button"
              aria-label="Previous lawyer"
              onClick={() => act("pgo", { d: "-1" })}
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
                <path d="m14 6-6 6 6 6" />
              </svg>
            </button>{" "}
            <button
              className="grid h-9 w-9 place-items-center rounded-full border border-[#0d2340]/30 transition hover:bg-[#0d2340] hover:text-white"
              type="button"
              aria-label="Next lawyer"
              onClick={() => act("pgo", { d: "1" })}
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
                <path d="m10 6 6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
