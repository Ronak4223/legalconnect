// Small DOM-based HTML -> JSX converter used for the one-time migration of the static public-site markup.
import { JSDOM } from "jsdom";
const INLINE = new Set(["a", "span", "b", "i", "em", "strong", "small", "button", "label", "svg", "img", "sup", "sub", "u", "br", "input", "select", "textarea", "code"]);
const VOID = new Set(["img", "input", "br", "hr", "meta", "link"]);
const ATTR = { class: "className", for: "htmlFor", tabindex: "tabIndex", novalidate: "noValidate", fetchpriority: "fetchPriority", crossorigin: "crossOrigin", autocomplete: "autoComplete", maxlength: "maxLength", readonly: "readOnly", inputmode: "inputMode", srcset: "srcSet", colspan: "colSpan", rowspan: "rowSpan", datetime: "dateTime" };
const BOOL = new Set(["hidden", "required", "disabled", "open", "novalidate", "checked", "selected", "multiple", "autofocus", "readonly"]);
const camel = s => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const attrName = n => ATTR[n] || (n.startsWith("aria-") || n.startsWith("data-") ? n : n === "xlink:href" ? "xlinkHref" : n.includes("-") ? camel(n) : n);
const lit = v => JSON.stringify(v);

function styleObj(css) {
  const o = {}; let depth = 0, cur = "", parts = [];
  for (const ch of css) { if (ch === "(") depth++; if (ch === ")") depth--; if (ch === ";" && !depth) { parts.push(cur); cur = ""; } else cur += ch; }
  parts.push(cur);
  for (const p of parts) { const i = p.indexOf(":"); if (i < 0) continue; const k = p.slice(0, i).trim(), v = p.slice(i + 1).trim(); if (!k) continue; o[k.startsWith("--") ? k : camel(k)] = v; }
  return JSON.stringify(o);
}
function text(node) {
  const t = node.nodeValue.replace(/\s+/g, " ");
  const inl = x => x && ((x.nodeType === 3 && x.nodeValue.trim()) || (x.nodeType === 1 && INLINE.has(x.tagName.toLowerCase())));
  if (!t.trim()) return inl(node.previousSibling) && inl(node.nextSibling) ? '{" "}' : "";
  return /[{}<>&"\\]/.test(t) ? `{${lit(t)}}` : t;
}

export function conv(node, ctx) {
  if (node.nodeType === 3) return text(node);
  if (node.nodeType !== 1) return "";
  const tag = node.tagName.toLowerCase(), id = node.id;
  const inj = Object.assign({}, (ctx.inject && ctx.inject[id]) || {});
  const extraAttrs = [], rm = [];
  for (const r of ctx.rules || []) if (r.match(node)) { const i = r.inj || {}; if (i.attrs) extraAttrs.push(i.attrs); if (i.removeAttrs) rm.push(...i.removeAttrs); for (const k of ["children", "append", "classExpr", "removeClass"]) if (i[k] !== undefined) inj[k] = i[k]; }
  if (inj.attrs) extraAttrs.push(inj.attrs); if (inj.removeAttrs) rm.push(...inj.removeAttrs);
  const hasAct = node.hasAttribute("data-a");
  const classes = (node.getAttribute("class") || "").split(/\s+/).filter(Boolean).filter(c => !(inj.removeClass || []).includes(c) && !(ctx.dropClass || []).includes(c));
  const attrs = [];
  const payload = {};
  for (const { name, value } of [...node.attributes]) {
    if (name === "class" || name === "data-ic") continue;
    if (name === "data-a") continue;
    if (hasAct && name.startsWith("data-")) { payload[name.slice(5)] = value; continue; }
    if (rm.includes(name)) continue;
    if (name === "style") { attrs.push(`style={${styleObj(value)}}`); continue; }
    const n = attrName(name);
    if (BOOL.has(name) && value === "") { attrs.push(n); continue; }
    attrs.push(`${n}=${lit(value)}`);
  }
  if (inj.classExpr) attrs.unshift(`className={\`${classes.join(" ")} \${${inj.classExpr}}\`.trim()}`);
  else if (classes.length) attrs.unshift(`className=${lit(classes.join(" "))}`);
  if (hasAct) {
    ctx.usesAct = true;
    const name = node.getAttribute("data-a"), p = Object.keys(payload).length ? `, ${JSON.stringify(payload)}` : "";
    attrs.push(`onClick={() => act(${lit(name)}${p})}`);
  }
  attrs.push(...extraAttrs);
  const a = attrs.length ? " " + attrs.join(" ") : "";
  if (node.hasAttribute("data-ic")) { ctx.usesIcon = true; return `<Icon name=${lit(node.getAttribute("data-ic"))} tag=${lit(tag)}${a} />`; }
  let inner = inj.children !== undefined ? inj.children : [...node.childNodes].map(c => conv(c, ctx)).join("");
  if (inj.append) inner += inj.append;
  if (VOID.has(tag) || (!inner && !(tag === "svg" || tag === "path"))) return `<${tag}${a} />`;
  if (!inner) return `<${tag}${a} />`;
  return `<${tag}${a}>${inner}</${tag}>`;
}
export function parseFragment(html) { return new JSDOM(`<body>${html}</body>`).window.document.body; }
export function loadDoc(html) { return new JSDOM(html).window.document; }
