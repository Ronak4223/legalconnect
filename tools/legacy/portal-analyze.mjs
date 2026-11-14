import fs from "fs"; import { parse } from "@babel/parser"; import _t from "@babel/traverse"; const traverse = _t.default || _t;
const SRC = "/home/claude/legalconnect/lawyer-portal"; const parts = JSON.parse(fs.readFileSync(`${SRC}/tools/parts.json`, "utf8"));
let code = "", ranges = [];
for (const p of parts) { const t = fs.readFileSync(`${SRC}/src/${p}`, "utf8"); ranges.push([p, code.length, code.length + t.length]); code += t + "\n;\n"; }
const partOf = (pos) => ranges.findIndex(([, a, b]) => pos >= a && pos < b + 3);
const ast = parse(code, { sourceType: "module" });
const vend = new Map(), cross = new Map(), viol = [];
traverse(ast, { Program(path) {
  for (const [name, b] of Object.entries(path.scope.bindings)) {
    const dp = partOf(b.path.node.start);
    for (const ref of b.referencePaths) { const rp = partOf(ref.node.start); if (rp !== dp) { const k = `${parts[dp]}`; (cross.get(k) || cross.set(k, new Set()).get(k)).add(name); if (dp === 0) { const m = vend.get(name) || { n: 0, parts: new Set(), snippet: code.slice(b.path.node.start, b.path.node.start + 70).replace(/\s+/g, " ") }; m.n++; m.parts.add(parts[rp]); vend.set(name, m); } } }
    for (const cv of b.constantViolations) { if (partOf(cv.node.start) !== dp) viol.push([name, parts[dp], parts[partOf(cv.node.start)]]); }
  }
  path.stop();
} });
console.log("parts:", parts.length, "| vendor names used by app:", vend.size);
for (const [n, m] of [...vend.entries()].sort((a, b) => b[1].n - a[1].n)) console.log(n.padEnd(5), String(m.n).padStart(4), "|", m.snippet.slice(0, 66));
console.log("cross-part reassignments:", viol);
console.log("names exported per part:", [...cross.entries()].filter(([k]) => k !== parts[0]).map(([k, v]) => k.split("/").pop() + ":" + v.size).join("  "));
