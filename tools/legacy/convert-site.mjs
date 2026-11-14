// ONE-TIME MIGRATION: public-site/index.html (+ site.js behaviour) -> React section components.
import fs from "fs"; import path from "path"; import prettier from "prettier";
import { conv, loadDoc, parseFragment } from "./html-to-jsx.mjs";
const SRC = process.argv[2], OUT = "src/site";
const doc = loadDoc(fs.readFileSync(SRC, "utf8"));
const $ = id => doc.getElementById(id);
fs.mkdirSync(`${OUT}/sections`, { recursive: true }); fs.mkdirSync(`${OUT}/components`, { recursive: true });
const fmt = code => prettier.format(code, { parser: "babel", printWidth: 120 });

// ---------- glyphs (SVG inner markup from the old JS) ----------
const IC = {
  fam: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 14.5c3 0 6 1.8 6 5.5"/>',
  cri: '<circle cx="12" cy="8" r="3.5"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7M9 18h6"/>',
  civ: '<path d="M12 4v16M7 20h10M5 7h14M5 7l-3 6h6zM19 7l-3 6h6z"/>',
  cor: '<path d="M5 21V5l8-2v18M13 9h6v12M3 21h18M8 9h2M8 13h2M8 17h2"/>',
  pro: '<path d="M3 11 12 4l9 7M5 10v11h14V10M10 21v-6h4v6"/>',
  emp: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  empBag: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 13h18"/>',
  srch: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>', chev: '<path d="m9 6 6 6-6 6"/>', prev: '<path d="m15 6-6 6 6 6"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  div: '<circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/>', alim: '<circle cx="12" cy="12" r="9"/><path d="M9 8h6M9 11h6M11 8c3 0 4 3 0 4l4 4"/>',
  adopt: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>', prenup: '<path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5"/>',
  exp: '<circle cx="12" cy="9" r="5"/><path d="M8.5 13.5 7 21l5-2.5 5 2.5-1.5-7.5"/>', eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  fee: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.2"/>', ded: '<path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H4zM17 14h3v5h-3zM17 19c0 1.5-2 2-5 2"/>',
};
const glyphs = Object.entries(IC).map(([k, v]) => { const b = parseFragment(`<svg>${v}</svg>`).firstChild; return `  ${k}: (<>${[...b.childNodes].map(c => conv(c, {})).join("")}</>),`; }).join("\n");
fs.writeFileSync(`${OUT}/components/glyphs.jsx`, await fmt(`/* SVG glyphs shared by Icon and the practice-area pickers. Converted from the original site.js icon tables. */\nexport const GLYPHS = {\n${glyphs}\n};\n`));

// ---------- section definitions ----------
const q = n => `\${${n}}`;
const rows = {
  approach: { id: "approach", imports: ['import { GLYPHS } from "../components/glyphs.jsx";', 'import { PICK_AREAS } from "../data/areas.js";'], ctx: ["pick", "picked", "pickedMsg"],
    inject: { "ap-list": { children: `{PICK_AREAS.map(([n, ic]) => (<button key={n} type="button" className="ap-i" aria-pressed={picked === n + " Law"} onClick={() => pick(n + " Law")}><svg viewBox="0 0 24 24" aria-hidden="true">{GLYPHS[ic]}</svg><span>{n}<br />Law</span></button>))}` }, "ap-out": { children: "{pickedMsg}" } } },
  stories: { id: "stories", imports: ['import { STORIES } from "../data/stories.js";'], ctx: ["act: siteAct"], localAct: true,
    hooks: `const [i, setI] = useState(0); const [fade, setFade] = useState(false); const s = STORIES[i];
      const go = (d) => { setFade(true); setTimeout(() => { setI((v) => (v + d + STORIES.length) % STORIES.length); setFade(false); }, 300); };
      const act = (n, p) => (n === "go" ? go(+p.d) : siteAct(n, p));`,
    inject: { "st-c": { attrs: "style={{ opacity: fade ? 0 : 1 }}" }, "st-q": { children: "{`\\u201C${s.q}\\u201D`}" }, "st-av": { children: '{s.n.split(" ").map((w) => w[0]).join("")}' }, "st-n": { children: "{s.n}" }, "st-s": { children: "{s.s}" } } },
  help: { id: "help", imports: ['import { GLYPHS } from "../components/glyphs.jsx";', 'import { HELP_NODES } from "../data/areas.js";'], ctx: ["act", "setHeroQuery"],
    hooks: "const [sel, setSel] = useState(null);",
    inject: { "hp-stage": { children: `{HELP_NODES.map(([n, ic, l, t, w]) => (<button key={n} type="button" className="hp-n" aria-pressed={sel === n + " Law"} style={{ left: l + "%", top: t + "%", width: w + "%" }} onClick={() => { setSel(n + " Law"); setHeroQuery(n + " Law"); }}><svg viewBox="0 0 24 24" aria-hidden="true">{GLYPHS[ic]}</svg><span>{n}<br />Law</span></button>))}` },
      "hp-out": { children: `{sel && (<>{sel} selected.{" "}<button type="button" className="underline underline-offset-4" onClick={() => act("find")}>Find a {sel} lawyer →</button></>)}` } } },
  people: { id: "people", imports: ['import { PEOPLE } from "../data/people.js";'], ctx: ["act: siteAct"], localAct: true,
    hooks: `const [cur, setCur] = useState(0); const [fade, setFade] = useState(false); const [bio, setBio] = useState(false); const p = PEOPLE[cur];
      const num = (i) => ("0" + (i + 1)).slice(-2);
      const show = (i) => { setFade(true); setTimeout(() => { setCur((i + PEOPLE.length) % PEOPLE.length); setBio(false); setFade(false); }, 250); };
      const act = (n, d) => (n === "pgo" ? show(cur + +d.d) : n === "profile" ? setBio((b) => !b) : siteAct(n, d));`,
    inject: { pf: { attrs: "style={{ backgroundImage: `var(--p${cur + 1})`, backgroundPosition: p.pos, opacity: fade ? 0 : 1 }}" },
      "pf-n": { children: '{num(cur) + " / 0" + PEOPLE.length}' }, "pf-name": { children: "{p.name}" }, "pf-area": { children: "{p.area}" }, "pf-exp": { children: "{p.exp}" },
      "pf-bio": { classExpr: '(bio ? "" : "hidden")', removeClass: ["hidden"], children: "{p.bio}" },
      "pp-strip": { children: `{PEOPLE.map((q, i) => i === cur ? null : (<button key={q.name} type="button" className="pp-b" onClick={() => show(i)}><span>{num(i)}</span><span className="sr-only">Show {q.name}, {q.area}</span><span className="pp-t" style={{ backgroundImage: \`var(--p\${i + 1})\`, backgroundPosition: q.pos }} /></button>))}` } },
    rules: [{ match: n => n.getAttribute("data-a") === "profile", inj: { removeAttrs: ["aria-expanded"], attrs: "aria-expanded={bio}" } }] },
  "legal-journey": { id: "legal-journey", name: "LegalJourney", imports: ['import { JOURNEY } from "../data/journey.js";'], ctx: [],
    hooks: `const [on, setOn] = useState(0);
      const flag = (k) => ({ "data-done": k <= on ? "" : undefined, "data-on": k === on ? "" : undefined });
      const hover = (i) => ({ onClick: () => setOn(i), onMouseOver: () => setOn(i), onFocus: () => setOn(i) });`,
    inject: { "jn-stage": { append: `{JOURNEY.map(([t, d, l, tp, side], i) => (<div key={t} className="jn-s" style={{ left: l + "%", top: tp + "%" }} {...flag(i)} {...hover(i)}><button type="button" className="jn-c" aria-label={\`Stage \${i + 1}: \${t}\`}>{i + 1}</button><div className={"jn-t jn-" + side}><b>{t}</b>{d}</div></div>))}` },
      "jn-list": { children: `{JOURNEY.map(([t, d], i) => (<li key={t} className="jn-li" {...flag(i)} {...hover(i)}><span className="jn-n">{i + 1}</span><span><b>{t}</b><br />{d}</span></li>))}` } } },
  trust: { id: "trust", imports: ['import { useCountUp } from "../animation/useCountUp.js";'], ctx: [], hooks: "const numRef = useRef(null); useCountUp(numRef, 10000);", inject: { "tr-num": { attrs: "ref={numRef}" } } },
  cases: { id: "cases", imports: ['import { CASES } from "../data/stories.js";'], ctx: ["act: siteAct"], localAct: true,
    hooks: `const [ci, setCi] = useState(0); const [fade, setFade] = useState(false); const [playing, setPlaying] = useState(false); const c = CASES[ci];
      const goC = (i) => { setFade(true); setTimeout(() => { setCi((i + CASES.length) % CASES.length); setFade(false); }, 250); };
      useEffect(() => { if (!playing) return; const t = setInterval(() => setCi((v) => (v + 1) % CASES.length), 6000); return () => clearInterval(t); }, [playing]);
      const act = (n, d) => (n === "rgo" ? goC(ci + +d.d) : n === "rplay" ? setPlaying((p) => !p) : siteAct(n, d));`,
    inject: { rc: { removeAttrs: ["data-tone"], attrs: "data-tone={c.tone} style={{ backgroundImage: `var(--${c.img})`, backgroundPosition: c.pos, opacity: fade ? 0 : 1 }}" },
      "rc-q": { children: "{c.q}" }, "rc-av": { attrs: 'style={{ backgroundImage: `var(--${c.img})`, backgroundSize: "320%", backgroundPosition: c.av }}' }, "rc-n": { children: "{c.n}" }, "rc-r": { children: "{c.r}" },
      "rc-side": { children: `{CASES.map((s, i) => i === ci ? null : (<button key={s.n} type="button" className="rs" onClick={() => goC(i)}><span className="rs-t" style={{ backgroundImage: \`var(--\${s.img})\`, backgroundPosition: s.pos }} /><span className="rs-q">{"\\u201C" + s.q + "\\u201D"}</span><span className="rs-w"><span className="rs-a" style={{ backgroundImage: \`var(--\${s.img})\`, backgroundPosition: s.av }} /><span><b>{s.n}</b><br />{s.r}</span></span></button>))}` } },
    rules: [{ match: n => n.getAttribute("data-a") === "rplay", inj: { removeAttrs: ["aria-pressed"], attrs: "aria-pressed={playing}" } }] },
  "find-lawyer": { id: "find-lawyer", name: "FindLawyer", imports: ['import { DirFilters } from "../components/directory.jsx";', 'import { AREAS, DIR_ICONS } from "../data/areas.js";'], ctx: ["act", "submitDirSearch"],
    hooks: 'const inputRef = useRef(null); const [msg, setMsg] = useState("");',
    inject: { "fl-form": { attrs: "onSubmit={(e) => { e.preventDefault(); const m = submitDirSearch(inputRef.current.value); setMsg(m); if (m) inputRef.current.focus(); }}" },
      "fl-q": { attrs: 'ref={inputRef} onChange={() => setMsg("")}' }, "fl-out": { children: "{msg}" },
      "fl-areas": { children: `{[0, 1, 3, 4, 5].map((i) => { const a = AREAS[i]; const [w1, w2] = a[0].split(" "); return (<button key={a[0]} type="button" className="fl-t" onClick={() => act("flarea", { n: a[0] })}><Icon name={DIR_ICONS[a[1]]} tag="i" /><span>{w1}<br />{w2}</span></button>); })}` } },
    rules: [{ match: n => n.hasAttribute && n.hasAttribute("data-filters"), inj: { removeAttrs: ["data-filters"], children: "<DirFilters />" } }] },
  lawyers: { id: "lawyers", imports: ['import { DirFilters, ResultsHeading, ResultRows, Pager } from "../components/directory.jsx";'], ctx: [],
    inject: { "rs-h": { children: "<ResultsHeading />" }, "rs-list": { children: "<ResultRows />" }, "rs-pg": { children: "<Pager />" } },
    rules: [{ match: n => n.hasAttribute && n.hasAttribute("data-filters"), inj: { removeAttrs: ["data-filters"], children: "<DirFilters />" } }] },
  "legal-services": { id: "legal-services", name: "LegalServices", imports: ['import { SERVICES } from "../data/areas.js";'], ctx: ["act"],
    inject: { "sv-list": { children: `{SERVICES.map(([n, ic, d]) => (<li key={n}><button type="button" className="sv-i" onClick={() => act("svc", { n, d })}><span className="sv-ic"><Icon name={ic} tag="i" /></span><span><b>{n}</b><small>{d}</small></span><Icon name="chev" tag="i" /></button></li>))}` } } },
  "family-law": { id: "family-law", name: "FamilyLaw", imports: ['import { FAMILY_SERVICES, FAMILY_WHY } from "../data/areas.js";'], ctx: ["act"],
    inject: { "pa-svc": { children: `{FAMILY_SERVICES.map(([n, ic]) => (<li key={n}><button type="button" className="sv-i" onClick={() => act("flarea", { n: "Family Law" })}><span className="sv-ic"><Icon name={ic} tag="i" /></span><span><b>{n}</b></span><Icon name="chev" tag="i" /></button></li>))}` },
      "pa-why": { children: `{FAMILY_WHY.map(([t, ic]) => (<div key={t} className="pa-w"><Icon name={ic} tag="i" /><span>{t}</span></div>))}` } } },
  journey: { id: "journey", name: "JourneyCta" }, insights: { id: "insights" }, expert: { id: "expert" }, problems: { id: "problems" }, library: { id: "library" },
  footer: { id: "footer" },
  top: { id: "top", name: "Hero", dropClass: ["hero-rise"], imports: ['import { useHeroIntro } from "../animation/useHeroIntro.js";'], ctx: ["act", "heroQuery", "setHeroQuery", "heroInputRef", "heroMsg", "heroState", "onHeroSubmit", "menuOpen", "setMenuOpen"],
    hooks: "const rootRef = useRef(null); useHeroIntro(rootRef);",
    inject: { top: { attrs: "ref={rootRef}" }, "hero-search": { attrs: "onSubmit={onHeroSubmit}" }, "hero-q": { attrs: "ref={heroInputRef} value={heroQuery} onChange={(e) => setHeroQuery(e.target.value)}" },
      "hero-out": { attrs: "data-state={heroState}", children: "{heroMsg}" }, "hero-burger": { removeAttrs: ["aria-expanded"], attrs: "onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen}" },
      "hero-menu": { removeClass: ["hidden"], classExpr: '(menuOpen ? "" : "hidden")' } },
    rules: [{ match: n => n.tagName === "A" && n.closest && n.closest("#hero-menu"), inj: { attrs: "onClick={() => setMenuOpen(false)}" } }] },
};
const cap = s => s.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());
const names = [];
for (const [key, r] of Object.entries(rows)) {
  const el = $(r.id); if (!el) throw new Error("missing #" + r.id);
  const name = r.name || cap(r.id); names.push([name, key]);
  const ctx = { inject: r.inject || {}, rules: r.rules || [], dropClass: r.dropClass || [] };
  const body = conv(el, ctx);
  const ctxNames = [...(r.ctx || [])]; if (ctx.usesAct && !r.localAct && !ctxNames.some(n => n === "act")) ctxNames.push("act");
  const hooksUse = /\buse(State|Ref|Effect)\b/.test((r.hooks || "") + body);
  const rh = [...new Set(["useState", "useRef", "useEffect"].filter(h => (r.hooks || "").includes(h)))];
  const code = [
    rh.length ? `import { ${rh.join(", ")} } from "react";` : "",
    ctxNames.length ? 'import { useSite } from "../SiteContext.jsx";' : "",
    ctx.usesIcon || body.includes("<Icon") ? 'import Icon from "../components/Icon.jsx";' : "",
    ...(r.imports || []),
    `\nexport default function ${name}() {`,
    ctxNames.length ? `const { ${ctxNames.join(", ")} } = useSite();` : "",
    r.hooks || "",
    `return (${body});`, "}",
  ].filter(x => x !== "").join("\n");
  fs.writeFileSync(`${OUT}/sections/${name}.jsx`, await fmt(code));
}
fs.writeFileSync("/tmp/section-names.json", JSON.stringify(names));
console.log("generated:", names.map(n => n[0]).join(", "));
