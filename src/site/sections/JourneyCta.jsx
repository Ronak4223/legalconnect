import { useSite } from "../SiteContext.jsx";

export default function JourneyCta() {
  const { act } = useSite();
  return (
    <section
      className="jy relative flex min-h-[15rem] items-center px-6 py-12 text-white md:min-h-[20rem] md:px-14"
      id="journey"
    >
      <div>
        <h2 className="font-serif text-[clamp(1.9rem,3.8vw,3.25rem)] font-normal leading-[1.1]">
          Your legal journey
          <br />
          starts here.
        </h2>
        <button className="pill mt-6" type="button" onClick={() => act("find")}>
          Find a Lawyer <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
