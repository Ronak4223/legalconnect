import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { transitionTo } from "./animation/transition.js";
import { useSmoothScroll } from "./animation/SmoothScroll.jsx";
import { INITIAL_DIR, filterLawyers, interpretSearch } from "./data/lawyers.js";
import { AREAS } from "./data/areas.js";

/**
 * Cross-section state + actions for the home page. Replaces the old `data-a` click dispatcher:
 * sections call `act("name", payload)`, local carousels keep their own state.
 */
const SiteContext = createContext(null);
export const useSite = () => useContext(SiteContext);

export function SiteProvider({ children }) {
  const navigate = useNavigate();
  const { scrollTo, stop, start } = useSmoothScroll();

  /* hero search + mobile menu */
  const heroInputRef = useRef(null);
  const [heroQuery, setHeroQueryRaw] = useState("");
  const [heroMsg, setHeroMsg] = useState("");
  const [heroState, setHeroState] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const setHeroQuery = useCallback((v) => { setHeroQueryRaw(v); setHeroState((s) => (s === "error" ? "" : s)); setHeroMsg((m) => m && m.startsWith("Enter") ? "" : m); }, []);
  const onHeroSubmit = (e) => {
    e.preventDefault();
    const v = heroQuery.trim();
    if (!v) { setHeroState("error"); setHeroMsg("Enter a lawyer, practice area or location to search."); heroInputRef.current?.focus(); return; }
    setHeroState("ok"); setHeroMsg("Searching for: " + v + "…");
  };

  /* practice-area picker (approach section) */
  const [picked, setPicked] = useState(null);
  const pickedMsg = picked ? `${picked} selected. Press Find a Lawyer to search.` : "";
  const pick = useCallback((name) => { setPicked(name); setHeroQuery(name); }, [setHeroQuery]);

  /* dialog */
  const [dialog, setDialog] = useState(null); // { key, data }
  const openDialog = useCallback((key, data) => setDialog({ key, data }), []);
  const closeDialog = useCallback(() => setDialog(null), []);
  useEffect(() => { dialog ? stop() : start(); }, [dialog, stop, start]);

  /* directory */
  const [dir, setDir] = useState(INITIAL_DIR);
  const results = useMemo(() => filterLawyers(dir), [dir]);
  const [menu, setMenu] = useState(null); // id of the open filter dropdown
  useEffect(() => {
    const onDoc = (e) => { if (!e.target.closest(".fl-d")) setMenu(null); };
    const onKey = (e) => { if (e.key === "Escape") setMenu(null); };
    document.addEventListener("click", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("click", onDoc); document.removeEventListener("keydown", onKey); };
  }, []);

  const goTo = useCallback((id) => { scrollTo(id); window.history.replaceState(null, "", id); }, [scrollTo]);
  const toResults = useCallback((patch) => { setDir((d) => ({ ...d, ...patch, page: 1 })); goTo("#lawyers"); }, [goTo]);
  const setFilter = useCallback((key, value) => { setDir((d) => ({ ...d, [key]: value, q: "", page: 1 })); setMenu(null); }, []);
  const submitDirSearch = useCallback((value) => {
    const v = value.trim();
    if (!v) return "Enter a name, practice area or location to search.";
    setDir((d) => ({ ...interpretSearch(v, d), page: 1 })); goTo("#lawyers");
    return "";
  }, [goTo]);

  const find = useCallback(() => {
    scrollTo("#hero-search", { center: true });
    setTimeout(() => {
      const input = heroInputRef.current; input?.focus({ preventScroll: true });
      if (input?.value.trim()) document.getElementById("hero-search")?.requestSubmit();
    }, 650);
  }, [scrollTo]);

  const act = useCallback((name, d = {}) => {
    switch (name) {
      case "login": transitionTo("/login/user", navigate); break;
      case "join": transitionTo("/register/lawyer", navigate); break;
      case "areas": case "article": openDialog(name); break;
      case "close": closeDialog(); break;
      case "find": find(); break;
      case "chip": pick(d.n); closeDialog(); find(); break;
      case "insights": {
        const c = document.getElementById("ins-card"); if (!c) break;
        scrollTo(c, { center: true }); c.classList.add("pulse"); setTimeout(() => c.classList.remove("pulse"), 1800); break;
      }
      case "art": closeDialog(); openDialog(d.k); break;
      case "flarea": closeDialog(); toResults({ area: d.n, q: "" }); break;
      case "allareas": transitionTo("/legal-services", navigate); break;
      case "support": goTo("#find-lawyer"); setTimeout(() => document.getElementById("fl-q")?.focus({ preventScroll: true }), 700); break;
      case "svc": d.n === "Family Law" ? goTo("#family-law") : openDialog("svc", d); break;
      case "legal": d.k === "social" ? openDialog("social") : transitionTo("/" + d.k, navigate); break;
      default: break;
    }
  }, [openDialog, closeDialog, find, pick, scrollTo, toResults, goTo, navigate]);

  const value = {
    act, goTo, areas: AREAS,
    heroInputRef, heroQuery, setHeroQuery, heroMsg, heroState, onHeroSubmit, menuOpen, setMenuOpen,
    picked, pick, pickedMsg,
    dialog, openDialog, closeDialog,
    dir, setDir, results, setFilter, submitDirSearch, menu, setMenu,
  };
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
