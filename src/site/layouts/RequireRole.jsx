import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../state/store.jsx";

/** Sends visitors who are not signed in with the right role to the matching login page. */
export function RequireRole({ role, children }) {
  const { session } = useApp(); const loc = useLocation();
  if (!session || session.role !== role) return <Navigate to={`/login/${role}`} replace state={{ from: loc.pathname, mismatch: session && session.role !== role }} />;
  return children;
}

