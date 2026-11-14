import { AREAS } from "./areas.js";
/** Demo directory. Fictional people. im = image variable (see styles/site.css), sz/ps = avatar crop. */
export const LAWYERS = [
  { n: "Aarav Mehta", a: "Corporate Law", r: 4.8, y: 12, c: "Delhi", im: "p1", sz: "300%", ps: "47% 20%" },
  { n: "Priya Sharma", a: "Family Law", r: 4.7, y: 9, c: "Mumbai", im: "q9", sz: "230%", ps: "50% 18%" },
  { n: "Rohit Verma", a: "Criminal Law", r: 4.6, y: 15, c: "Delhi", im: "q8", sz: "480%", ps: "42% 20%" },
  { n: "Sneha Kapoor", a: "Property Law", r: 4.5, y: 10, c: "Bengaluru", im: "p4", sz: "470%", ps: "50% 18%" },
  { n: "Kabir Malhotra", a: "Civil Law", r: 4.5, y: 11, c: "Mumbai", im: "p3", sz: "300%", ps: "46% 20%" },
  { n: "Vikram Nair", a: "Employment Law", r: 4.4, y: 8, c: "Hyderabad", im: "q7", sz: "220%", ps: "50% 20%" },
  { n: "Meera Kapoor", a: "Corporate Law", r: 4.4, y: 10, c: "Chennai", im: "p2", sz: "300%", ps: "49% 20%" },
];
export const PER_PAGE = 4;
export const INITIAL_DIR = { area: "Family Law", loc: "All India", sort: "Top rated", q: "", page: 1 };

export function filterLawyers(dir) {
  const q = dir.q.toLowerCase();
  const list = LAWYERS.filter((x) => !q || (x.n + " " + x.a).toLowerCase().includes(q));
  list.sort((a, b) => {
    let m = (a.a === dir.area ? 0 : 1) - (b.a === dir.area ? 0 : 1); if (m) return m;
    m = (a.c === dir.loc ? 0 : 1) - (b.c === dir.loc ? 0 : 1); if (m) return m;
    if (dir.sort === "Most experienced") return b.y - a.y;
    if (dir.sort === "Name A–Z") return a.n.localeCompare(b.n);
    return b.r - a.r;
  });
  return list;
}
/** Heading text for the results block. NOTE: the "610" and per-area counts are marketing placeholders (see docs/ISSUES.md P7). */
export function resultsHeading(dir, n) {
  const where = dir.loc === "All India" ? "India" : dir.loc;
  if (dir.q) return [n ? `${n} lawyers found for` : "No lawyers found for", `“${dir.q}”`];
  if (dir.area === "All Areas") return ["610 lawyers found across", `all areas in ${where}`];
  return [`${AREAS.find((x) => x[0] === dir.area)[2]} lawyers found for`, `${dir.area} in ${where}`];
}
/** Interprets a free-text search the way the original page did (area / city keywords, else name search). */
export function interpretSearch(v, dir) {
  const lv = v.toLowerCase(), next = { ...dir };
  const hit = AREAS.find((a) => lv.includes(a[0].split(" ")[0].toLowerCase()));
  const loc = ["Delhi", "Mumbai", "Bengaluru", "Chennai", "Hyderabad", "Kolkata"].find((c) => lv.includes(c.toLowerCase()));
  if (loc) next.loc = loc;
  if (hit) { next.area = hit[0]; next.q = ""; } else if (loc) next.q = ""; else next.q = v;
  return next;
}
