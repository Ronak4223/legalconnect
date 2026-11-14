# Theme

Single source of truth: [`shared/theme/tokens.css`](../shared/theme/tokens.css). Both apps import it at the top of their CSS entry (`src/site/styles/index.css`, `src/portal/styles/index.css`). Values originate from the public site (navy `#0d2340`, deep teal `#0f3f4d`, brand `#2f8f83`, mint `#9fe0d6`, ivory `#f6f3ec`, gold `#c58a2b`, ink `#050c18`); **Lora** for headings, **Inter** for body.

Added for the portal: status colours (success/warning/info/danger) and their darker *text* tones, chosen to pass AA on ivory. Danger (`#a8402f`) is the only colour not derived from an existing brand colour.

## Contrast (WCAG 2.x, computed)

| Pair | Ratio | Result |
|---|---|---|
| Body text (navy) on ivory | 14.23:1 | ✔ AA |
| Secondary text (navy 72%) on ivory | 6.07:1 | ✔ AA |
| Tertiary text (navy 70%) on ivory | 5.69:1 | ✔ AA |
| Navy 60% on ivory (old public-site hint text) | 4.17:1 | ✔ large/graphics only |
| Ivory on deep teal (primary button) | 10.31:1 | ✔ AA |
| White on danger button | 6.11:1 | ✔ AA |
| Mint on teal-900 (dark panels) | 10.44:1 | ✔ AA |
| Brand teal #2f8f83 on ivory (links/accents) | 3.52:1 | ✔ large/graphics only |
| Teal-700 #1c6b73 on ivory (links) | 5.57:1 | ✔ AA |
| Gold #c58a2b on ivory (decorative only) | 2.69:1 | ✘ below 3:1 |
| Success text #1b5e55 on ivory | 6.82:1 | ✔ AA |
| Warning text #7a5210 on ivory | 6.23:1 | ✔ AA |
| Danger text #8a3224 on ivory | 7.4:1 | ✔ AA |
| Info text #17575f on ivory | 7.39:1 | ✔ AA |
| Public muted text (ivory 74%) on ink | 9.46:1 | ✔ AA |

Notes:
- Brand teal `#2f8f83` is **3.52:1 on ivory**: use it for fills, borders and large text only. Text links use teal-700 (`#1c6b73`, 5.57:1). The portal already follows this.
- Gold is decorative (badges with dark text, stars next to a numeric rating). Do not use it alone to convey meaning.
- `--lc-text-2` (72%) and `--lc-text-3` (70%) are almost identical; left unchanged to avoid visual drift. Merge them in a deliberate pass.
- The old public hint text (`navy/60`) was 4.17:1 and failed axe; it is now `navy/70`.
