import { useState, useRef } from "react";
import { useSite } from "../SiteContext.jsx";
import Icon from "../components/Icon.jsx";
import { DirFilters } from "../components/directory.jsx";
import { AREAS, DIR_ICONS } from "../data/areas.js";

export default function FindLawyer() {
  const { act, submitDirSearch } = useSite();
  const inputRef = useRef(null);
  const [msg, setMsg] = useState("");
  return (
    <section className="text-[#0d2340]" id="find-lawyer">
      <div className="fl-top px-6 pb-14 pt-16 md:px-14 md:pb-20 md:pt-24">
        <div className="max-w-xl">
          <p className="ey">Find lawyers</p>
          <h2 className="hd">
            Find the right lawyer
            <br />
            for your needs.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#0d2340]/70">
            Search by practice area, location, or name to find the right legal expert for your case.
          </p>
          <form
            className="fl-s"
            id="fl-form"
            role="search"
            aria-label="Find a lawyer"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const m = submitDirSearch(inputRef.current.value);
              setMsg(m);
              if (m) inputRef.current.focus();
            }}
          >
            <Icon name="srch" tag="span" className="text-[#0d2340]/55" />{" "}
            <label className="sr-only" htmlFor="fl-q">
              Search lawyers
            </label>{" "}
            <input
              id="fl-q"
              type="search"
              autoComplete="off"
              placeholder="Search for name, practice area or location..."
              ref={inputRef}
              onChange={() => setMsg("")}
            />{" "}
            <Icon name="chev" tag="button" type="submit" aria-label="Search lawyers" />
          </form>
          <p className="mt-2 min-h-[1.25rem] pl-5 text-sm text-[#9a3b2b]" id="fl-out" role="status" aria-live="polite">
            {msg}
          </p>
          <div className="fl-f">
            <DirFilters />
          </div>
        </div>
        <div className="mt-10 max-w-3xl">
          <h3 className="font-serif text-xl">Popular Practice Areas</h3>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5" id="fl-areas">
            {[0, 1, 3, 4, 5].map((i) => {
              const a = AREAS[i];
              const [w1, w2] = a[0].split(" ");
              return (
                <button key={a[0]} type="button" className="fl-t" onClick={() => act("flarea", { n: a[0] })}>
                  <Icon name={DIR_ICONS[a[1]]} tag="i" />
                  <span>
                    {w1}
                    <br />
                    {w2}
                  </span>
                </button>
              );
            })}
          </div>
          <button className="lnk mt-5" type="button" onClick={() => act("allareas")}>
            View All Areas <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <div
        className="fl-img relative flex min-h-[20rem] items-end px-6 pb-8 md:min-h-[32rem] md:px-14"
        role="img"
        aria-label="Lawyer with a laptop overlooking a city at sunset"
      >
        <p className="font-serif text-2xl text-white md:text-3xl">Trusted by thousands</p>
      </div>
    </section>
  );
}
