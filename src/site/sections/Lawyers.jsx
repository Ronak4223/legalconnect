import Icon from "../components/Icon.jsx";
import { DirFilters, ResultsHeading, ResultRows, Pager } from "../components/directory.jsx";

export default function Lawyers() {
  return (
    <section className="bg-[#f4f1ea] px-6 py-16 text-[#0d2340] md:px-14 md:py-20" id="lawyers">
      <div className="mx-auto max-w-[80rem]">
        <div className="rs-head rounded-2xl p-6 md:min-h-[17rem] md:p-10">
          <p className="ey">Lawyer results</p>
          <h2 className="hd max-w-md" id="rs-h" aria-live="polite">
            <ResultsHeading />
          </h2>
        </div>
        <div className="fl-f mt-5">
          <DirFilters />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
          <ol className="grid content-start gap-3" id="rs-list">
            <ResultRows />
          </ol>
          <aside className="grid content-start gap-4">
            <div className="rs-why">
              <h3 className="font-serif text-xl">Why choose us?</h3>
              <ul className="mt-4 grid gap-3 text-sm">
                <li>
                  <Icon name="check" tag="span" />
                  Proven track record
                </li>
                <li>
                  <Icon name="check" tag="span" />
                  Case-focused approach
                </li>
                <li>
                  <Icon name="check" tag="span" />
                  Transparent communication
                </li>
                <li>
                  <Icon name="check" tag="span" />
                  Trusted professional experts
                </li>
              </ul>
            </div>
            <div
              className="rs-pic min-h-[12rem] rounded-2xl"
              role="img"
              aria-label="Sunlit lobby with marble columns"
            />
          </aside>
        </div>
        <nav className="mt-8 flex items-center justify-center gap-2" id="rs-pg" aria-label="Pagination">
          <Pager />
        </nav>
      </div>
    </section>
  );
}
