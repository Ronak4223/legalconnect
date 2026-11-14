# Asset manifest

All images live in `shared/assets/img/` and are referenced by **file name** from both projects. Every file is used.

| File | Size | KB | Used by | Notes |
|---|---|---|---|---|
| `approach.jpg` | 1600×900 | 121 | site, portal | Public "approach" section; portal dashboard banner |
| `columns.jpg` | 1600×892 | 108 | site |  |
| `expert.jpg` | 1399×1124 | 218 | site |  |
| `family-law-bg.jpg` | 1500×837 | 183 | site |  |
| `find-lawyer-bg.jpg` | 1330×1182 | 176 | site |  |
| `help.jpg` | 1269×1239 | 237 | site |  |
| `hero-bg.jpg` | 1672×940 | 193 | site, portal | Public hero; portal login/register side panel |
| `insights.jpg` | 1600×597 | 173 | site |  |
| `journey-path.jpg` | 1299×1211 | 239 | site |  |
| `journey.jpg` | 1600×900 | 160 | site |  |
| `lawyer-1-avatar.jpg` | 220×220 | 8 | portal | Portal account avatar (220×220 crop of lawyer-1.jpg) |
| `lawyer-1.jpg` | 1100×771 | 69 | site | Public people carousel (portal avatar is a crop of this) |
| `lawyer-2.jpg` | 1100×771 | 72 | site |  |
| `lawyer-3.jpg` | 1100×771 | 79 | site |  |
| `lawyer-4.jpg` | 1500×640 | 155 | site |  |
| `library.jpg` | 1600×900 | 234 | site |  |
| `problems.jpg` | 1500×857 | 119 | site |  |
| `q7-lawyer.jpg` | 1000×558 | 49 | site |  |
| `q8-lawyer.jpg` | 1200×669 | 95 | site |  |
| `q9-lawyer.jpg` | 1000×558 | 53 | site |  |
| `services-cta.jpg` | 1500×804 | 224 | site |  |
| `stories.jpg` | 1600×900 | 189 | site |  |
| `trust-1.jpg` | 510×467 | 50 | site, portal | Public trust card "Verified"; portal Verification gallery |
| `trust-2.jpg` | 509×467 | 48 | site, portal | Public trust card "Identity checked"; portal Verification gallery |
| `trust-3.jpg` | 509×467 | 46 | site, portal | Public trust card "Bar registered"; portal Verification gallery |
| `trust-4.jpg` | 510×467 | 55 | site, portal | Public trust card "Professionally reviewed"; portal Verification gallery |
| `trust-bg.jpg` | 1600×907 | 111 | site |  |

Total: 3464 KB across 27 files.

`shared/assets/originals/` holds the untouched `trust-1…4.jpg` as supplied (they had ~19 px white margins, and `trust-2`/`trust-4` carried slivers of neighbouring images; the files in `img/` are cropped to their content under the same names).

**Using them:** both apps import images through Vite (`import img from "@shared/assets/img/…"` or `url(…)` in CSS), so they are fingerprinted and bundled; there is no path to maintain by hand. `@shared` is an alias for `/shared` (see `vite.config.js`).