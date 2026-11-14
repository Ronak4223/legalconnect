import { useSite } from "../SiteContext.jsx";

export default function Expert() {
  const { act } = useSite();
  return (
    <section
      className="ex relative flex min-h-[20rem] items-center px-6 py-14 text-white md:min-h-[28rem] md:px-14 md:pt-32"
      id="expert"
    >
      <div>
        <h2 className="font-serif text-[clamp(1.9rem,3.8vw,3.25rem)] font-normal leading-[1.1]">
          Your expertise deserves
          <br />
          the right platform.
        </h2>
        <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-white/80">
          Join LegalConnect and grow your practice with the right support.
        </p>
        <button className="pill mt-6" type="button" onClick={() => act("join")}>
          Join as a Lawyer <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
