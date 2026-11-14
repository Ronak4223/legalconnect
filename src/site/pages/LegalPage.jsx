import { Link } from "react-router-dom";
import { motion } from "motion/react";
const COPY = {
  privacy: ["Privacy Policy", "The LegalConnect privacy policy has not been published yet. It must be supplied and reviewed by legal counsel before launch."],
  terms: ["Terms of Use", "The LegalConnect terms of use have not been published yet. They must be supplied and reviewed by legal counsel before launch."],
};
/** Honest placeholders for /privacy and /terms — no invented legal text. */
export default function LegalPage({ kind }) {
  const [title, body] = COPY[kind];
  return (
    <main id="main" className="grid min-h-screen place-items-center bg-[#f6f3ec] px-6 text-[#0d2340]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-md">
        <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-[#1c6b73]">LegalConnect</p>
        <h1 className="mt-3 font-serif text-4xl">{title}</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[#0d2340]/80">{body}</p>
        <Link to="/" className="lnk mt-8 inline-flex">{"←"} Back to home</Link>
      </motion.div>
    </main>
  );
}
