import familyImg from "@shared/assets/img/family-law-bg.webp";
import throne from "@shared/assets/img/justice-throne.webp";
import stationery from "@shared/assets/img/stationery.webp";
import books from "@shared/assets/img/docs-books.webp";
import column from "@shared/assets/img/column-marble.webp";
import womanOffice from "@shared/assets/img/lawyer-woman-office.webp";

export const SERVICES = [
  { area: "Family Law", icon: "heart", img: familyImg, pos: "70% 50%", tag: "For the conversations that are hardest to have", blurb: "Divorce, custody and maintenance handled with discretion. Our family lawyers explore settlement first and litigate only when it protects you.", items: ["Divorce & separation (mutual and contested)", "Child custody & visitation", "Alimony & maintenance", "Adoption & guardianship", "Prenuptial agreements", "Domestic-relationship matters"] },
  { area: "Criminal Law", icon: "gavel", img: throne, pos: "50% 40%", tag: "When time matters and every word counts", blurb: "From first-hour advice to bail, trial and appeal. Experienced defence counsel who prepare you for each hearing and keep you informed throughout.", items: ["Bail & anticipatory bail", "FIR quashing & defence", "Economic & white-collar offences", "Cyber-crime matters", "Criminal appeals & revisions", "Cheque-bounce (Section 138)"] },
  { area: "Civil Law", icon: "scale", img: stationery, pos: "50% 55%", tag: "Disputes resolved, rights protected", blurb: "Money recovery, injunctions and contract disputes. We outline cost, timeline and realistic outcomes before you commit to a course of action.", items: ["Money recovery suits", "Injunctions & specific performance", "Contract disputes", "Tenancy & eviction", "Consumer complaints", "Defamation & civil wrongs"] },
  { area: "Corporate Law", icon: "building", img: books, pos: "50% 50%", tag: "Contracts that both sides can read in one sitting", blurb: "Founders, family businesses and growing teams get structured, practical advice on formation, funding, compliance and disputes.", items: ["Company & LLP formation", "Shareholder & investor agreements", "Mergers & acquisitions", "Compliance & governance", "IP & trademark filings", "Commercial contracts"] },
  { area: "Property Law", icon: "home", img: column, pos: "75% 50%", tag: "Know exactly what you are buying, selling or leasing", blurb: "Title checks, sale deeds, RERA complaints and lease agreements, explained in plain language with a written due-diligence summary.", items: ["Title verification & due diligence", "Sale deeds & agreements", "RERA complaints", "Lease & rent agreements", "Partition & inheritance", "Land & registration matters"] },
  { area: "Employment Law", icon: "briefcase", img: womanOffice, pos: "55% 30%", tag: "Fair treatment at work, on paper and in practice", blurb: "Wrongful termination, contracts, severance and workplace rights for employees, and compliance guidance for employers.", items: ["Wrongful termination", "Employment contracts & non-competes", "Severance & settlements", "POSH compliance", "Wage & benefit disputes", "Executive agreements"] },
];
export const SITUATIONS = [
  ["I’m going through a divorce", "Family Law"], ["I’ve been charged or arrested", "Criminal Law"], ["I’m in a dispute over money or a contract", "Civil Law"],
  ["I’m starting or running a company", "Corporate Law"], ["I’m buying, selling or renting property", "Property Law"], ["I was dismissed or underpaid at work", "Employment Law"],
];
export const FAQS = [
  { cat: "Clients", q: "How do I book a consultation?", a: "Find a lawyer, open their profile and choose Book consultation. Pick a consultation type, a date and time, then complete the (demo) payment. The lawyer confirms, and you see the status update in your dashboard." },
  { cat: "Clients", q: "Are the lawyers on LegalConnect verified?", a: "In the live product every lawyer passes identity checks, Bar Council enrolment verification and a credentials review before a profile goes live. In this demonstration all lawyers are fictional." },
  { cat: "Clients", q: "Can I change or cancel an appointment?", a: "Yes. Open the appointment in your dashboard to reschedule or cancel. Rescheduling asks the lawyer to confirm the new time; cancelling a confirmed consultation refunds your payment in this demo." },
  { cat: "Clients", q: "What types of consultation are available?", a: "Video, phone and in-person. Video is the standard fee, phone is 20% lower and in-person is 50% higher, because it takes more of the lawyer’s time." },
  { cat: "Payments", q: "How do payments work?", a: "You pay when you book. The fee is held until the lawyer confirms. If a request is declined or cancelled, it is refunded. No real payments are taken in this demonstration." },
  { cat: "Payments", q: "Can I get an invoice?", a: "Every payment has an invoice you can open and download from Payments in your dashboard." },
  { cat: "Lawyers", q: "How do I join as a lawyer?", a: "Register as a lawyer and complete the four-step onboarding: personal details, professional details, documents and review. Your Bar Council enrolment is verified before your profile is listed." },
  { cat: "Lawyers", q: "What does LegalConnect charge lawyers?", a: "In this demo the platform keeps 10% of each consultation fee. You set your own consultation fee and availability and can change them at any time." },
  { cat: "Privacy", q: "Is my information kept private?", a: "Conversations and documents are visible only to you and your lawyer. This demo stores everything in your own browser (localStorage) and sends nothing to a server." },
  { cat: "Privacy", q: "How do I delete my demo data?", a: "Go to Profile & settings → Security and choose Reset demo data. This clears everything stored in this browser." },
];
