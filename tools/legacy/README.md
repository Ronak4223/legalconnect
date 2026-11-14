# Legacy migration tools (provenance only)

One-time scripts used to move the project from single-file HTML to this React/Vite codebase. They read the **old** artefacts (`public-site/index.html`, the minified portal build and its recovered parts), which are not part of this repository, so they are not meant to be re-run.

| Script | What it did |
|---|---|
| `html-to-jsx.mjs` | DOM-based HTML → JSX converter (class→className, style strings→objects, `data-a`→`onClick`, SVG attributes camel-cased) |
| `convert-site.mjs` | Applied it to the 18 public-site sections and injected React state where the old `site.js` had filled elements (carousels, directory, area picker…). Output: `src/site/sections/*.jsx`, `components/glyphs.jsx` |
| `portal-analyze.mjs` | Built the cross-file dependency graph of the portal and listed the vendor names the app used (14) |
| `portal-modularize.mjs` | Generated the portal's ES modules: `export`/`import` lines, npm React/Router instead of the inlined bundle, Vite image imports, readable names for the routed views |

After the migration the generated files are ordinary source and are edited by hand.
Re-running requires: npm i -D jsdom @babel/parser @babel/traverse (see above)
