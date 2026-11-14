# LegalConnect — multi-page platform (frontend-only demo)

The single-page site is now a complete consultation platform with two journeys: **clients** seeking legal help and **lawyers** providing it.
Everything is frontend-only: no backend, no real authentication, no real payments. State lives in `localStorage` (key `lc-demo-v2`).

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Client | `ananya.desai@example.com` | `Demo@1234` |
| Lawyer | `aarav.mehta@example.com` | `Demo@1234` |

Both login pages have a **Use demo account** button. Any account you register works too. "Reset demo data" (Profile & settings → Security) restores the seed.

## Routes

**Public** (shared header/footer, smooth scrolling): `/` · `/find-lawyers` · `/lawyer/:id` · `/legal-services` · `/about` · `/contact` · `/privacy` · `/terms`
**Authentication:** `/register/user` · `/register/lawyer` · `/login/user` · `/login/lawyer` · `/forgot-password`
**Client dashboard:** `/user/dashboard` · `/user/appointments` · `/user/cases` · `/user/messages` · `/user/notifications` · `/user/payments` · `/user/profile`
**Lawyer dashboard:** `/lawyer/dashboard` · `/lawyer/profile` · `/lawyer/appointments` · `/lawyer/clients` · `/lawyer/cases` · `/lawyer/messages` · `/lawyer/earnings` · `/lawyer/notifications` · `/lawyer/settings`

Static `/lawyer/<page>` routes rank above the public profile `/lawyer/:id`. Dashboards are guarded (`RequireRole`): wrong or missing role → the matching login page. The existing `/portal` app is untouched.

## Architecture (`src/site`)

| Folder | Contents |
|---|---|
| `pages/public` `pages/auth` `pages/user` `pages/lawyer` | One component per page; `pages/shared` holds what both roles use (appointments + video room, messages, notifications, cases, invoice, booking flow, slot picker, lawyer rows) |
| `layouts/` | `PublicLayout` (header/footer), `AuthLayout` (split screen + silent video loop), `DashLayout` (role-themed sidebar, top bar, mobile bottom nav), `RequireRole` |
| `ui/` | Design-system kit: Button, Field set (text/password/phone/select/textarea/check/switch/chips/option cards/file drop), Modal/Drawer/Confirm/Menu, DataTable (stacks on phones), Calendar, Charts (area/bar/donut/sparkline, pure SVG), Tabs, Pagination, Stepper, Badges, Avatar, Toasts, Icons |
| `state/` | `store.jsx` (provider, persistence, all actions), `selectors.js` (derived data: earnings, clients, next appointment) |
| `data/` | `demo.js` (7 lawyers, clients, appointments, cases, chats, payments, 12 months of earnings — dates are relative to today), `content.js` (services, FAQs) |
| `utils/` | formatting, validation rules, image downscaling |
| `styles/app.css` | One stylesheet for the app layer. Two moods, one brand: `[data-theme=user]` light/teal, `[data-theme=lawyer]` navy/gold |

Page transitions are zone-aware: the curtain plays between areas (public ↔ auth ↔ dashboards, and in/out of Home); moving around *inside* a dashboard is instant. Lenis smooth-scroll runs only on public pages. App pages are code-split, so Home never downloads them.

## Demo interactions

* **Registration / login** with live validation (name, email, 10-digit mobile, password strength meter, confirm, terms); duplicate-email protection; wrong-password errors; redirect back to the page you came from; password reset (code `482913`).
* **Lawyer onboarding**: 4 steps (Personal → Professional → Documents → Review), draft kept in `sessionStorage`, Bar Council number format check (`D/1234/2015`), photo + document upload UI (photo is downscaled and kept locally; documents are never uploaded). New lawyers appear in the public directory with a "New" badge and get sample clients/cases to explore.
* **Directory**: search (URL-synced), area chips, city/experience/fee/language filters, 5 sorts, pagination, saved lawyers.
* **Booking**: consultation type (video/phone/in-person at 100% / 80% / 150% of the fee) → date & time from the lawyer's real weekly schedule (booked slots disappear) → demo payment (UPI / card / net banking with validation) → confirmation. Creates a pending appointment, a processing payment and notifications for both sides.
* **Cross-role flow**: book with *Aarav Mehta* as the client → sign in as Aarav → **Accept** or **Decline** → sign back in as the client and the status, payment (Paid / Refunded) and notification have changed. Other lawyers confirm themselves ~9 s after booking.
* **Appointments**: details modal, reschedule (calendar + slots), cancel/decline with reason, mark completed, join meeting (video room recreated from the supplied consultation screen), leave a review, invoices.
* **Cases**: stage timeline, key dates, documents (upload simulated), notes, lawyer can advance stages, add deadlines and open new cases; the client sees changes and a notification.
* **Messages**: shared threads between roles, unread badges, typing indicator and a simulated reply.
* **Notifications**: filter, read/unread, delete, mark all read, deep links.
* **Payments / earnings**: history with status, printable/downloadable invoice, payment methods; lawyer earnings (12-month area chart, consultation-mix donut, monthly bars, 10% platform fee, pending vs available, withdrawals).
* **Profiles & settings**: client profile + photo + preferences + security + data export; lawyer profile editor (basic, professional, practice & fees, weekly availability, live preview) — edits show up on the public profile.

## Assets from this round

Eleven supplied images (WebP, with phone variants) and the supplied video: audio stripped, generator watermark cropped, 1 s end-to-start crossfade baked into a seamless 7 s loop (`justice-loop*.mp4/.webm`), used on the sign-in screens and About hero. Three of the supplied portraits are higher-resolution versions of photos already used for Priya Sharma, Rohit Verma and Vikram Nair; they are used for those lawyers' large profile portraits.

## Tests

* `qa/react_site.py` — home page and its regression guards (44 checks).
* `qa/app_routes.py` — every route as the right role at chosen widths: errors, failed requests, broken images, overflow.
* `qa/app_flows.py` — the journeys above end to end (61 checks).
* `npm run qa:app` runs the last two against `vite preview` on port 4173.

## Limitations

* Frontend demo only: data is per-browser, cleared by "Reset demo data" or clearing site data. Passwords are hashed with a small non-cryptographic function so they are not stored as plain text — this is **not** real security.
* "Other side" behaviour (auto-confirm, chat replies) is simulated with timers.
* File uploads, downloads and the video room are simulated; no media leaves the browser.
* Google/LinkedIn sign-in, SMS/email and real payments are intentionally not implemented.
* The existing `/portal` lawyer portal is a separate vanilla-JS app and is not merged with the new React lawyer dashboard.
* Home-page copy fixes: the directory listed the female portrait in slot `p2` as "Arjun Iyer" while the People carousel called her "Meera Kapoor", and the `p4` portrait was "Sneha Kapoor" vs "Ananya Rao". Names were aligned to Meera Kapoor and Sneha Kapoor so each profile link resolves to one person. The carousel still shows its original area/experience text for Meera and Kabir.
