import { useSite } from "../SiteContext.jsx";
import Icon from "../components/Icon.jsx";
import { FAMILY_SERVICES, FAMILY_WHY } from "../data/areas.js";

export default function FamilyLaw() {
  const { act } = useSite();
  return (
    <section className="text-[#0d2340]" id="family-law">
      <div className="pa-top px-6 pb-16 pt-16 md:min-h-[34rem] md:px-14 md:pt-24">
        <div className="max-w-xl">
          <p className="ey">Practice area — Family</p>
          <h2 className="hd" style={{ fontSize: "clamp(2.6rem,6vw,5rem)" }}>
            Family Law
          </h2>
          <p className="mt-2 font-serif text-xl italic text-[#0d2340]/80">Support for what matters most.</p>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#0d2340]/70">
            Family law covers divorce, child custody, separation, family disputes and other marriage-related legal
            matters. Our verified family lawyers guide you with care, clarity and discretion.
          </p>
        </div>
      </div>
      <div className="bg-[#f6f3ec] px-6 pb-20 md:px-14">
        <div className="mx-auto max-w-[80rem]">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="font-serif text-2xl">Key Services</h3>
              <ul className="mt-4" id="pa-svc">
                {FAMILY_SERVICES.map(([n, ic]) => (
                  <li key={n}>
                    <button type="button" className="sv-i" onClick={() => act("flarea", { n: "Family Law" })}>
                      <span className="sv-ic">
                        <Icon name={ic} tag="i" />
                      </span>
                      <span>
                        <b>{n}</b>
                      </span>
                      <Icon name="chev" tag="i" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-2xl">Why Choose LegalConnect?</h3>
              <div className="mt-4 grid grid-cols-2 gap-3" id="pa-why">
                {FAMILY_WHY.map(([t, ic]) => (
                  <div key={t} className="pa-w">
                    <Icon name={ic} tag="i" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-14">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl">Related Articles</h3>
              <button className="lnk" type="button" onClick={() => act("art", { k: "all" })}>
                View All <span aria-hidden="true">→</span>
              </button>
            </div>
            <button className="pa-art mt-4" type="button" onClick={() => act("art", { k: "emp" })}>
              <span className="pa-th" role="img" aria-label="Statue of Lady Justice between stone columns" />
              <span>
                <span className="block font-serif text-xl leading-snug">Key Changes in Employment Law for 2025</span>
                <span className="mt-2 block text-xs text-[#0d2340]/70">Family Law · 5 min read</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
