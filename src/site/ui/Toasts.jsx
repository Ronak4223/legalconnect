import { useApp } from "../state/store.jsx";
import { Ic } from "./Icons.jsx";
export function Toasts() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="toasts" aria-live="polite" role="status">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}><Ic n={t.type === "err" ? "alert" : "checkC"} size={18} /><span>{t.msg}</span><button type="button" aria-label="Dismiss" onClick={() => dismissToast(t.id)}><Ic n="x" size={14} /></button></div>
      ))}
    </div>
  );
}
