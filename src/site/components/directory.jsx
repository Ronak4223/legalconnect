import { useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import Icon from "./Icon.jsx";
import { useSite } from "../SiteContext.jsx";
import { AREAS, LOCS, SORTS } from "../data/areas.js";
import { PER_PAGE, resultsHeading } from "../data/lawyers.js";
import { useGo } from "../hooks.js";
import { slug } from "../utils/format.js";

const FILTERS = [["area", ["All Areas", ...AREAS.map((a) => a[0])]], ["loc", LOCS], ["sort", SORTS]];
const label = (key, dir) => (key === "area" ? dir.area : key === "loc" ? (dir.loc === "All India" ? "Location" : dir.loc) : dir.sort === "Top rated" ? "Sort" : dir.sort);

/** The three dropdowns (area / location / sort). Rendered in both the search and results sections; only one menu is open at a time. */
export function DirFilters() {
  const { dir, setFilter, menu, setMenu } = useSite(), uid = useId();
  return FILTERS.map(([key, opts]) => {
    const id = uid + key, open = menu === id;
    return (
      <div className="fl-d" key={key}>
        <button type="button" className="fl-b" data-f={key} aria-haspopup="listbox" aria-expanded={open} onClick={() => setMenu(open ? null : id)}>
          <span>{label(key, dir)}</span><Icon name="chev" tag="i" />
        </button>
        <ul className="fl-m" role="listbox" hidden={!open}>
          {opts.map((o) => (<li key={o}><button type="button" role="option" data-f={key} data-v={o} aria-selected={dir[key] === o} onClick={() => setFilter(key, o)}>{o}</button></li>))}
        </ul>
      </div>
    );
  });
}

export function ResultsHeading() {
  const { dir, results } = useSite(), [a, b] = resultsHeading(dir, results.length);
  return <>{a}<br />{b}</>;
}

/** Result rows animate in/out and re-order with Motion's layout animations. */
export function ResultRows() {
  const { dir, results, openDialog } = useSite();
  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE)), page = Math.min(dir.page, pages);
  const go = useGo();
  const items = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {items.length ? items.map((x) => (
        <motion.li key={x.n} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28, ease: "easeOut" }}>
          <article className="rs-row" onClick={() => go(`/lawyer/${slug(x.n)}`)}>
            <span className="rs-av" role="img" aria-label={`Photo of ${x.n}`} style={{ backgroundImage: `var(--${x.im})`, backgroundSize: `${x.sz} auto`, backgroundPosition: x.ps }} />
            <div><h3 className="rs-n">{x.n}</h3><p className="rs-m">{x.a} {"·"} {x.y}+ years {"·"} {x.c}</p></div>
            <span className="rs-r"><b>{"★"}</b> {x.r.toFixed(1)}</span>
            <button type="button" className="rs-btn" onClick={(e) => { e.stopPropagation(); go(`/lawyer/${slug(x.n)}`); }}>View Profile {"→"}</button>
          </article>
        </motion.li>
      )) : (
        <motion.li key="none" className="text-sm text-[#0d2340]/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Try a different name, practice area or location.</motion.li>
      )}
    </AnimatePresence>
  );
}

export function Pager() {
  const { dir, results, setDir } = useSite();
  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE)), page = Math.min(dir.page, pages);
  const go = (p) => setDir((d) => ({ ...d, page: p }));
  return (<>
    <button type="button" className="pg" aria-label="Previous page" disabled={page < 2} onClick={() => go(page - 1)}><Icon name="prev" tag="i" /></button>
    {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
      <button key={n} type="button" className="pg" aria-current={n === page ? "page" : undefined} onClick={() => go(n)}>{n}</button>))}
    <button type="button" className="pg" aria-label="Next page" disabled={page >= pages} onClick={() => go(page + 1)}><Icon name="chev" tag="i" /></button>
  </>);
}
