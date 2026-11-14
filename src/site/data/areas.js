/** Practice-area data used by the pickers, directory and services lists. Icon keys refer to components/glyphs.jsx. */
export const PICK_AREAS = [["Family", "fam"], ["Criminal", "cri"], ["Corporate", "cor"], ["Property", "pro"], ["Employment", "emp"]];
export const HELP_NODES = [ // [name, icon, left%, top%, width%] — positions are % of the artwork so they sit on its spheres
  ["Family", "fam", 51, 25.8, 17.5], ["Criminal", "cri", 23, 45.8, 17.5], ["Civil", "civ", 79.1, 45.8, 17.5],
  ["Corporate", "cor", 28.5, 70.2, 18.5], ["Employment", "emp", 73, 70.2, 18.5], ["Property", "pro", 50.4, 81.5, 19],
];
export const AREAS = [["Family Law", "fam", 142], ["Criminal Law", "cri", 118], ["Civil Law", "civ", 103], ["Corporate Law", "cor", 96], ["Property Law", "pro", 87], ["Employment Law", "empBag", 64]];
export const DIR_ICONS = Object.fromEntries(AREAS.map((a) => [a[1], a[1]]));
export const LOCS = ["All India", "Delhi", "Mumbai", "Bengaluru", "Chennai", "Hyderabad", "Kolkata"];
export const SORTS = ["Top rated", "Most experienced", "Name A–Z"];
export const SERVICES = [
  ["Family Law", "fam", "Divorce, custody, alimony & more"], ["Criminal Law", "cri", "Defense, bail, criminal matters"], ["Civil Law", "civ", "Disputes, litigation, property rights"],
  ["Corporate Law", "cor", "Business formation, mergers & acquisitions"], ["Property Law", "pro", "Real estate, ownership & leasing"], ["Employment Law", "empBag", "Workplace and labor disputes"],
];
export const FAMILY_SERVICES = [["Divorce & Separation", "div"], ["Child Custody", "fam"], ["Alimony & Maintenance", "alim"], ["Adoption", "adopt"], ["Prenuptial Agreements", "prenup"]];
export const FAMILY_WHY = [["Experienced Lawyers", "exp"], ["Transparent Process", "eye"], ["Affordable Fees", "fee"], ["Dedicated Support", "ded"]];
