/* app/00-assets.js — image assets, imported from the shared folder so Vite fingerprints and bundles them. */
import img_hero_bg from "@shared/assets/img/hero-bg.jpg";
import img_approach from "@shared/assets/img/approach.jpg";
import img_lawyer_1_avatar from "@shared/assets/img/lawyer-1-avatar.jpg";
import img_trust_1 from "@shared/assets/img/trust-1.jpg";
import img_trust_2 from "@shared/assets/img/trust-2.jpg";
import img_trust_3 from "@shared/assets/img/trust-3.jpg";
import img_trust_4 from "@shared/assets/img/trust-4.jpg";

export const IMG = {
  "hero-bg.jpg": img_hero_bg,
  "approach.jpg": img_approach,
  "lawyer-1-avatar.jpg": img_lawyer_1_avatar,
  "trust-1.jpg": img_trust_1,
  "trust-2.jpg": img_trust_2,
  "trust-3.jpg": img_trust_3,
  "trust-4.jpg": img_trust_4,
};
export const PORTRAIT_AVATAR = IMG["lawyer-1-avatar.jpg"]; // lawyer avatar (220x220 crop of lawyer-1.jpg)
