# Asset inventory

Runtime assets are stored under `img/` and `video/` and imported by Vite from the site and portal source.

- Keep WebP images referenced by site data, styles, or components. `-sm.webp` variants referenced in `site.css` are used for mobile section backgrounds.
- Keep JPEG images imported by `src/portal/app/00-assets.js`; the portal still uses these files.
- Keep the desktop MP4 and WebM hero encodes, used at all viewport sizes, and the desktop/mobile MP4 and WebM variants imported by the authentication layout.
- `originals/` contains retained source copies of the trust images. These are archival and are intentionally not loaded by the app.

When pruning assets, check source imports and CSS URLs rather than relying on this document alone.
