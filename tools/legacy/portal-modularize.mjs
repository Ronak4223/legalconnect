// ONE-TIME MIGRATION: concatenated portal "parts" -> real ES modules (explicit import/export, npm React/Router, Vite assets).
import fs from "fs"; import path from "path"; import prettier from "prettier";
import { parse } from "@babel/parser"; import _t from "@babel/traverse"; const traverse = _t.default || _t;
const SRC = "/home/claude/legalconnect/lawyer-portal", OUT = "src/portal/app";
const parts = JSON.parse(fs.readFileSync(`${SRC}/tools/parts.json`, "utf8")).map(p => p.replace(/^(app\/)+/, ""));
const rawParts = JSON.parse(fs.readFileSync(`${SRC}/tools/parts.json`, "utf8"));
const read = i => fs.readFileSync(`${SRC}/src/${rawParts[i]}`, "utf8");

// ---- npm replacements for the 14 vendor names the app uses (identified from their definitions)
const VENDOR = { w: ['import w from "react";'], n: ['import * as n from "react/jsx-runtime";'], Uh: ['import { createRoot as Uh } from "react-dom/client";'],
  Jx: "HashRouter", Dx: "Routes", me: "Route", jc: "Navigate", Ux: "Outlet", P: "Link", Wx: "NavLink", Me: "useNavigate", Nt: "useLocation", Mr: "useParams", Ks: "useSearchParams" };
const vendorImport = names => { const lines = [], router = []; for (const n of names) { const v = VENDOR[n]; if (!v) throw new Error("unmapped vendor name " + n); Array.isArray(v) ? lines.push(v[0]) : router.push(`${v} as ${n}`); } if (router.length) lines.push(`import { ${router.join(", ")} } from "react-router-dom";`); return lines; };
// ---- readable names for the routed views (confirmed from the route table in App)
const RENAME = { Vy: "LoginView", Ty: "RegisterView", Py: "ForgotPasswordView", zy: "ResetPasswordView", Jy: "VerifyEmailView", Dy: "AppLayout", tv: "DashboardView", nv: "AppointmentsView", sv: "AppointmentDetailView", iv: "VerificationView", Cv: "ClientsView", Av: "ClientProfileView", Ev: "CaseDetailView", gd: "MessagesView", Mv: "ProfileView", Uv: "AvailabilityView", pv: "PaymentsView", fv: "NotificationsView", gv: "SettingsView", qv: "NotFoundView", Kv: "UiKitView", Yv: "App", jd: "RequireAuth", $t: "AuthLayout", Dv: "LoginRoute", LpEB: "ErrorBoundary", Sy: "loadState", Vr: "seedState" };

// ---- assets part replaced by real imports; code that used ASSET_BASE now uses IMG
const IMGS = ["hero-bg.jpg", "approach.jpg", "lawyer-1-avatar.jpg", "trust-1.jpg", "trust-2.jpg", "trust-3.jpg", "trust-4.jpg"];
const idn = f => "img_" + f.replace(/\.jpg$/, "").replace(/[^A-Za-z0-9]/g, "_");
const assetsModule = `/* app/00-assets.js — image assets, imported from the shared folder so Vite fingerprints and bundles them. */\n${IMGS.map(f => `import ${idn(f)} from "@shared/assets/img/${f}";`).join("\n")}\n\nexport const IMG = {\n${IMGS.map(f => `  "${f}": ${idn(f)},`).join("\n")}\n};\nexport const PORTRAIT_AVATAR = IMG["lawyer-1-avatar.jpg"]; // lawyer avatar (220x220 crop of lawyer-1.jpg)\n`;
const texts = rawParts.map((p, i) => {
  if (i === 0) return ""; if (i === 1) return "const IMG = {}; const PORTRAIT_AVATAR = '';\n";
  return read(i).replace(/ASSET_BASE\s*\+\s*"([^"]+)"/g, 'IMG["$1"]').replace(/ASSET_BASE\s*\+\s*file/g, "IMG[file]");
});
// vendor part (index 0) is parsed in full for binding resolution only
texts[0] = read(0);
let code = ""; const ranges = [];
texts.forEach((t, i) => { ranges.push([code.length, code.length + t.length]); code += t + "\n;\n"; });
const partOf = pos => ranges.findIndex(([a, b]) => pos >= a && pos < b + 3);
const ast = parse(code, { sourceType: "module" });

const needs = parts.map(() => ({})), exportsOf = parts.map(() => new Set()), edits = parts.map(() => []), vendorNeeds = parts.map(() => new Set());
traverse(ast, { Program(p) {
  for (const [name, b] of Object.entries(p.scope.bindings)) {
    const dp = partOf(b.path.node.start), nn = RENAME[name];
    const stmt = b.path.findParent(x => x.parentPath && x.parentPath.isProgram()) || b.path;
    if (nn && dp > 0) edits[dp].push([b.identifier.start, b.identifier.end, nn]);
    for (const ref of b.referencePaths) {
      const rp = partOf(ref.node.start);
      if (nn && rp > 0) { const par = ref.parent, short = par && par.type === "ObjectProperty" && par.shorthand && par.value === ref.node; edits[rp].push([ref.node.start, ref.node.end, short ? `${name}: ${nn}` : nn]); }
      if (rp === dp) continue;
      if (dp === 0) vendorNeeds[rp].add(name);
      else { exportsOf[dp].add(stmt.node.start); (needs[rp][dp] ||= new Set()).add(nn || name); }
    }
  }
  p.stop();
} });
// every exported statement must export its (possibly renamed) names; collect names per declaring part
const exportedNames = parts.map(() => new Set());
traverse(ast, { Program(p) { for (const [name, b] of Object.entries(p.scope.bindings)) { const dp = partOf(b.path.node.start); const stmt = b.path.findParent(x => x.parentPath && x.parentPath.isProgram()) || b.path; if (dp > 0 && exportsOf[dp].has(stmt.node.start)) exportedNames[dp].add(RENAME[name] || name); } p.stop(); } });
const assetsPart = 1;
for (let i = 0; i < parts.length; i++) {
  if (i === 0) continue;
  const base = ranges[i][0]; let t = texts[i];
  const ed = [...edits[i].map(([a, b, r]) => [a - base, b - base, r]), ...[...exportsOf[i]].map(s => [s - base, s - base, "export "])].sort((x, y) => y[0] - x[0]);
  for (const [a, b, r] of ed) t = t.slice(0, a) + r + t.slice(b);
  const imports = [...vendorImport([...vendorNeeds[i]])];
  for (const [dp, names] of Object.entries(needs[i])) { let rel = path.relative(path.dirname(parts[i]), parts[dp]).replace(/\\/g, "/"); if (!rel.startsWith(".")) rel = "./" + rel; imports.push(`import { ${[...names].sort().join(", ")} } from "${rel}";`); }
  const out = i === assetsPart ? assetsModule : imports.join("\n") + "\n\n" + t;
  const dest = `${OUT}/${parts[i]}`; fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, await prettier.format(out, { parser: "babel", printWidth: 110 }));
}
console.log("modules written:", parts.length - 1, "| exported names:", exportedNames.reduce((a, s) => a + s.size, 0));
console.log("entry:", parts[parts.length - 1]);
