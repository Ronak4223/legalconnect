import { useRef } from "react";
import { SiteProvider } from "../SiteContext.jsx";
import { useSiteAnimations } from "../animation/useSiteAnimations.js";
import Dialog from "../components/Dialog.jsx";
import Cursor from "../components/Cursor.jsx";
import Hero from "../sections/Hero.jsx";
import Approach from "../sections/Approach.jsx";
import Stories from "../sections/Stories.jsx";
import JourneyCta from "../sections/JourneyCta.jsx";
import Insights from "../sections/Insights.jsx";
import Expert from "../sections/Expert.jsx";
import Problems from "../sections/Problems.jsx";
import Help from "../sections/Help.jsx";
import People from "../sections/People.jsx";
import LegalJourney from "../sections/LegalJourney.jsx";
import Trust from "../sections/Trust.jsx";
import Cases from "../sections/Cases.jsx";
import Library from "../sections/Library.jsx";
import FindLawyer from "../sections/FindLawyer.jsx";
import Lawyers from "../sections/Lawyers.jsx";
import LegalServices from "../sections/LegalServices.jsx";
import FamilyLaw from "../sections/FamilyLaw.jsx";
import Footer from "../sections/Footer.jsx";

/** The marketing page: skip link, scroll-progress bar, one <main> with every section, footer, and the shared dialog. */
export default function Home() {
  const rootRef = useRef(null);
  useSiteAnimations(rootRef);
  return (
    <SiteProvider>
      <div ref={rootRef}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-[#0d2340]">Skip to main content</a>
        <div id="scroll-progress" aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[90] h-[3px] w-full origin-left scale-x-0 bg-[#9fe0d6]" />
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero /><Approach /><Stories /><JourneyCta /><Insights /><Expert /><Problems /><Help />
          <People /><LegalJourney /><Trust /><Cases /><Library /><FindLawyer /><Lawyers /><LegalServices /><FamilyLaw />
        </main>
        <Footer />
        <Dialog />
        <Cursor />
        <div className="lc-grain" aria-hidden="true" />
      </div>
    </SiteProvider>
  );
}
