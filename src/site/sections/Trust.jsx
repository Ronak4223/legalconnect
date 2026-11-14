import img_trust_1 from "@shared/assets/img/trust-1.webp";
import img_trust_2 from "@shared/assets/img/trust-2.webp";
import img_trust_3 from "@shared/assets/img/trust-3.webp";
import img_trust_4 from "@shared/assets/img/trust-4.webp";
import { useRef } from "react";
import { useCountUp } from "../animation/useCountUp.js";

export default function Trust() {
  const numRef = useRef(null);
  useCountUp(numRef, 10000);
  return (
    <section className="tr relative overflow-hidden px-6 py-16 text-[#0d2340] md:px-14 md:py-24" id="trust">
      <div className="mx-auto max-w-[80rem]">
        <h2 className="font-serif text-[clamp(2.2rem,5vw,4.5rem)] font-normal uppercase leading-[1.05] tracking-[.005em]">
          <span className="mb-1 block text-[.5em] tracking-[.14em]">Trust</span>Isn’t a number.
        </h2>
        <p className="mt-4 max-w-sm text-sm text-[#0d2340]/75 md:text-base">
          It’s a process. A promise. A higher standard.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-3 md:mt-28 md:grid-cols-4 md:gap-5">
          <article className="tr-c">
            <img
              src={img_trust_1}
              width="509"
              height="467"
              alt="LegalConnect verified lawyer certificate"
              loading="lazy"
            />
            <h3>Verified</h3>
            <p>Background and credentials checked</p>
          </article>
          <article className="tr-c">
            <img
              src={img_trust_2}
              width="509"
              height="467"
              alt="LegalConnect lawyer ID badge"
              loading="lazy"
            />
            <h3>Identity checked</h3>
            <p>Government ID and profile verified</p>
          </article>
          <article className="tr-c">
            <img
              src={img_trust_3}
              width="509"
              height="467"
              alt="Stack of LegalConnect lawyer profile cards"
              loading="lazy"
            />
            <h3>Bar registered</h3>
            <p>Active bar membership confirmed</p>
          </article>
          <article className="tr-c">
            <img
              src={img_trust_4}
              width="509"
              height="467"
              alt="Gold LegalConnect seal on marble"
              loading="lazy"
            />
            <h3>Professionally reviewed</h3>
            <p>Ratings, experience and client feedback</p>
          </article>
        </div>
        <div className="mt-12 flex flex-col items-center gap-6 md:mt-16 md:flex-row md:items-end md:justify-between">
          <div className="text-center md:ml-[24%]">
            <p className="font-serif text-[clamp(3rem,6.4vw,5.75rem)] leading-none" id="tr-num" ref={numRef}>
              10,000+
            </p>
            <p className="mt-2 text-sm text-[#0d2340]/75 md:text-base">verified legal professionals</p>
          </div>
          <a
            className="inline-flex items-center gap-2 border-b border-[#0d2340]/30 pb-0.5 text-sm transition-all hover:gap-3 hover:border-[#0d2340]"
            href="#legal-journey"
          >
            Learn more <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
