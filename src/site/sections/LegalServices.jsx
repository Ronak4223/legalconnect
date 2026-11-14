import { useSite } from "../SiteContext.jsx";
import Icon from "../components/Icon.jsx";
import { SERVICES } from "../data/areas.js";

export default function LegalServices() {
  const { act } = useSite();
  return (
    <section className="text-[#0d2340]" id="legal-services">
      <div className="sv-top px-6 pb-8 pt-16 md:px-14 md:pt-24">
        <p className="ey">Legal services</p>
        <h2 className="hd max-w-xl">
          Comprehensive Legal
          <br />
          Services for Individuals
          <br />
          and Businesses.
        </h2>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#0d2340]/70">
          From personal matters to business needs, our verified lawyers provide clear, reliable legal support at every
          stage.
        </p>
        <ul className="mt-8 max-w-md" id="sv-list">
          {SERVICES.map(([n, ic, d]) => (
            <li key={n}>
              <button type="button" className="sv-i" onClick={() => act("svc", { n, d })}>
                <span className="sv-ic">
                  <Icon name={ic} tag="i" />
                </span>
                <span>
                  <b>{n}</b>
                  <small>{d}</small>
                </span>
                <Icon name="chev" tag="i" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="sv-cta flex min-h-[22rem] items-end px-6 pb-10 md:min-h-[32rem] md:px-14">
        <button className="pill" type="button" onClick={() => act("support")}>
          Get Legal Support <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
