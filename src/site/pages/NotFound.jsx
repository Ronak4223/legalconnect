import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <main id="main" className="grid min-h-screen place-items-center bg-[#f6f3ec] px-6 text-center text-[#0d2340]">
      <div><h1 className="font-serif text-5xl">Page not found</h1><p className="mt-3 text-[15px] text-[#0d2340]/75">That address doesn{"’"}t exist on this site.</p><Link to="/" className="lnk mt-6 inline-flex">{"←"} Back to home</Link></div>
    </main>
  );
}
