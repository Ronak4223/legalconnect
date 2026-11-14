import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useApp } from "../../state/store.jsx";
import { AREAS, CITIES, LANGS } from "../../data/demo.js";
import { LawyerRow } from "../shared/lawyerParts.jsx";
import { Button } from "../../ui/Button.jsx";
import { SelectField } from "../../ui/Field.jsx";
import { EmptyState, Pagination } from "../../ui/Misc.jsx";
import { Drawer } from "../../ui/Overlay.jsx";
import { Ic } from "../../ui/Icons.jsx";
import { useTitle, useQueryState, useReveal } from "../../hooks.js";
import column from "@shared/assets/img/column-marble.webp";

const PER = 5;
const SORTS = [{ value: "rating", label: "Top rated" }, { value: "exp", label: "Most experienced" }, { value: "feeAsc", label: "Fee: low to high" }, { value: "feeDesc", label: "Fee: high to low" }, { value: "name", label: "Name A–Z" }];
const DEF = { q: "", area: "", city: "", exp: "", fee: "", lang: "", sort: "rating", page: "1" };

export default function FindLawyers() {
  useTitle("Find lawyers");
  const { state, session, actions } = useApp();
  const [sp, setSp] = useSearchParams();
  const [f, set] = useQueryState(sp, setSp, DEF);
  const [filters, setFilters] = useState(false);
  const rv = useReveal([]);
  const saved = (session?.role === "user" && state.saved[session.id]) || [];
  const list = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    let r = state.lawyers.filter((l) =>
      (!q || [l.name, l.city, l.tagline, ...l.areas].join(" ").toLowerCase().includes(q)) &&
      (!f.area || l.areas.includes(f.area)) && (!f.city || l.city === f.city) && (!f.exp || l.exp >= Number(f.exp)) &&
      (!f.fee || l.fee <= Number(f.fee)) && (!f.lang || l.langs.includes(f.lang)));
    const cmp = { rating: (a, b) => (b.rating - a.rating) || (b.reviews - a.reviews), exp: (a, b) => b.exp - a.exp, feeAsc: (a, b) => a.fee - b.fee, feeDesc: (a, b) => b.fee - a.fee, name: (a, b) => a.name.localeCompare(b.name) }[f.sort];
    return r.sort(cmp);
  }, [state.lawyers, f.q, f.area, f.city, f.exp, f.fee, f.lang, f.sort]);
  const pages = Math.max(1, Math.ceil(list.length / PER)), page = Math.min(Number(f.page) || 1, pages), shown = list.slice((page - 1) * PER, page * PER);
  const active = ["area", "city", "exp", "fee", "lang"].filter((k) => f[k]).length;
  const clear = () => setSp(new URLSearchParams(), { replace: true });
  const onSave = (id) => { if (session?.role !== "user") { actions.toast("Sign in as a client to save lawyers.", "err"); return; } actions.toggleSave(id); };

  const Filters = (
    <div style={{ display: "grid", gap: "1rem" }}>
      <SelectField label="City" value={f.city} onChange={(e) => set({ city: e.target.value, page: "1" })} placeholder="Any city" options={CITIES} />
      <SelectField label="Experience" value={f.exp} onChange={(e) => set({ exp: e.target.value, page: "1" })} placeholder="Any" options={[{ value: "5", label: "5+ years" }, { value: "10", label: "10+ years" }, { value: "15", label: "15+ years" }]} />
      <SelectField label="Maximum fee" value={f.fee} onChange={(e) => set({ fee: e.target.value, page: "1" })} placeholder="Any fee" options={[{ value: "2000", label: "Up to ₹2,000" }, { value: "3000", label: "Up to ₹3,000" }, { value: "4000", label: "Up to ₹4,000" }]} />
      <SelectField label="Language" value={f.lang} onChange={(e) => set({ lang: e.target.value, page: "1" })} placeholder="Any language" options={LANGS} />
      {active > 0 && <Button variant="ghost" size="sm" onClick={clear}>Clear all filters</Button>}
    </div>
  );
  return (
    <div ref={rv}>
      <section className="wrap" style={{ padding: "clamp(2.5rem,6vw,4.5rem) clamp(1.1rem,4vw,3rem) 1.5rem" }}>
        <p className="eyebrow" data-rv>Find lawyers</p>
        <h1 className="h-xl" style={{ margin: ".7rem 0 1.4rem", maxWidth: "14ch" }} data-rv>Find the right lawyer for your needs.</h1>
        <form role="search" onSubmit={(e) => e.preventDefault()} style={{ maxWidth: 640 }} data-rv>
          <div className="inp"><span className="inp-ic"><Ic n="search" size={18} /></span>
            <input className="pl" style={{ borderRadius: 999, minHeight: 56, fontSize: "1rem", paddingLeft: "3rem" }} value={f.q} onChange={(e) => set({ q: e.target.value, page: "1" })} placeholder="Search by name, practice area or city…" aria-label="Search lawyers" /></div>
        </form>
        <div className="chips" style={{ marginTop: "1.2rem" }} role="group" aria-label="Practice area" data-rv>
          <button type="button" className={`chip ${!f.area ? "on" : ""}`} aria-pressed={!f.area} onClick={() => set({ area: "", page: "1" })}>All areas</button>
          {AREAS.map((a) => <button type="button" key={a} className={`chip ${f.area === a ? "on" : ""}`} aria-pressed={f.area === a} onClick={() => set({ area: f.area === a ? "" : a, page: "1" })}>{a}</button>)}
        </div>
      </section>
      <section className="wrap find-grid">
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", paddingBottom: "1rem" }}>
            <p style={{ margin: 0 }} aria-live="polite"><b className="serif" style={{ fontSize: "1.3rem", fontWeight: 500 }}>{list.length}</b> <span className="muted">{list.length === 1 ? "lawyer" : "lawyers"} found{f.area ? ` in ${f.area}` : ""}</span></p>
            <div style={{ display: "flex", gap: ".6rem", alignItems: "end" }}>
              <Button className="show-m" variant="outline" size="sm" icon="filter" onClick={() => setFilters(true)}>Filters{active ? ` (${active})` : ""}</Button>
              <SelectField label="" aria-label="Sort by" value={f.sort} onChange={(e) => set({ sort: e.target.value })} options={SORTS} />
            </div>
          </div>
          {shown.length ? shown.map((l) => <LawyerRow key={l.id} l={l} saved={saved.includes(l.id)} onSave={onSave} />) : <EmptyState icon="search" title="No lawyers match your search" text="Try removing a filter or searching a different city or practice area."><Button variant="outline" onClick={clear}>Clear search</Button></EmptyState>}
          <div style={{ borderTop: "1px solid var(--line)" }} />
          <Pagination page={page} pages={pages} onChange={(p) => { set({ page: String(p) }); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        </div>
        <aside className="hide-m" style={{ position: "sticky", top: "6rem", display: "grid", gap: "1.4rem" }}>
          <div className="panel" style={{ padding: "1.4rem" }}><h2 className="h-md" style={{ marginBottom: "1rem" }}>Refine</h2>{Filters}</div>
          <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", minHeight: 200, color: "#fff", display: "flex", alignItems: "flex-end" }}>
            <img src={column} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} /><div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 20%,rgba(6,18,32,.85))" }} />
            <div style={{ position: "relative", padding: "1.2rem" }}><p className="h-md" style={{ margin: 0 }}>Not sure which area fits?</p><Link to="/legal-services" style={{ fontSize: ".86rem", textDecoration: "underline" }}>Browse legal services →</Link></div>
          </div>
        </aside>
      </section>
      <Drawer open={filters} onClose={() => setFilters(false)} title="Filters">{Filters}<div style={{ marginTop: "1.5rem" }}><Button onClick={() => setFilters(false)} className="btn-lg" style={{ width: "100%" }}>Show {list.length} lawyers</Button></div></Drawer>
    </div>
  );
}
