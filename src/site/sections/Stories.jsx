import { useState } from "react";
import { useSite } from "../SiteContext.jsx";
import { STORIES } from "../data/stories.js";

export default function Stories() {
  const { act: siteAct } = useSite();
  const [i, setI] = useState(0);
  const [fade, setFade] = useState(false);
  const s = STORIES[i];
  const go = (d) => {
    setFade(true);
    setTimeout(() => {
      setI((v) => (v + d + STORIES.length) % STORIES.length);
      setFade(false);
    }, 300);
  };
  const act = (n, p) => (n === "go" ? go(+p.d) : siteAct(n, p));
  return (
    <section
      className="st relative flex min-h-[32rem] items-center overflow-hidden px-6 py-16 text-white md:min-h-[40rem] md:px-14"
      id="stories"
      aria-label="Client stories"
    >
      <div className="max-w-md transition-opacity duration-300" id="st-c" style={{ opacity: fade ? 0 : 1 }}>
        <h2 className="font-serif text-[clamp(2.4rem,5vw,4.25rem)] font-normal leading-[1.06]">
          Real people.
          <br />
          Real stories.
        </h2>
        <blockquote className="mt-6 max-w-sm border-l border-white/40 pl-4">
          <p
            className="font-serif text-lg leading-relaxed text-white/90 md:text-xl"
            id="st-q"
          >{`“${s.q}”`}</p>
        </blockquote>
        <div className="mt-6 flex items-center gap-3">
          <span
            className="grid h-11 w-11 place-items-center rounded-full border border-white/50 bg-white/15 text-sm font-medium backdrop-blur"
            id="st-av"
            aria-hidden="true"
          >
            {s.n
              .split(" ")
              .map((w) => w[0])
              .join("")}
          </span>
          <div>
            <p className="text-sm font-semibold" id="st-n">
              {s.n}
            </p>
            <p className="text-xs text-white/75" id="st-s">
              {s.s}
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 right-6 flex gap-2 md:bottom-10 md:right-14">
        <button
          className="grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-black/25 backdrop-blur transition hover:bg-white/20"
          type="button"
          aria-label="Previous story"
          onClick={() => act("go", { d: "-1" })}
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
          className="grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-black/25 backdrop-blur transition hover:bg-white/20"
          type="button"
          aria-label="Next story"
          onClick={() => act("go", { d: "1" })}
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
    </section>
  );
}
