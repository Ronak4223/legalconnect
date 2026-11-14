export const rules = {
  required: (v) => (String(v ?? "").trim() ? "" : "This field is required"),
  name: (v) => (String(v || "").trim().length >= 3 ? (/^[A-Za-z .'\-]+$/.test(v.trim()) ? "" : "Use letters only") : "Enter your full name"),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || "").trim()) ? "" : "Enter a valid email address"),
  phone: (v) => (/^[6-9]\d{9}$/.test(String(v || "").replace(/[\s-]/g, "")) ? "" : "Enter a valid 10-digit mobile number"),
  password: (v) => {
    const s = String(v || "");
    if (s.length < 8) return "Use at least 8 characters";
    if (!/[A-Z]/.test(s) || !/[a-z]/.test(s)) return "Mix upper and lower case letters";
    if (!/\d/.test(s)) return "Include at least one number";
    return "";
  },
  match: (other, msg = "Passwords do not match") => (v) => (v === other ? "" : msg),
  barNo: (v) => (/^[A-Z]{1,3}\/\d{2,6}\/(19|20)\d{2}$/i.test(String(v || "").trim()) ? "" : "Format like D/1234/2015"),
  minLen: (n, msg) => (v) => (String(v || "").trim().length >= n ? "" : msg || `Write at least ${n} characters`),
  min: (n, msg) => (v) => (Number(v) >= n ? "" : msg || `Must be at least ${n}`),
  checked: (msg = "Please accept to continue") => (v) => (v ? "" : msg),
  nonEmptyList: (msg = "Choose at least one") => (v) => (v && v.length ? "" : msg),
};
/** validate(values, {field: [rule, rule]}) -> {field: message} (first failing rule per field). */
export function validate(values, schema) {
  const out = {};
  for (const [k, list] of Object.entries(schema)) {
    for (const r of [].concat(list)) { const m = r(values[k], values); if (m) { out[k] = m; break; } }
  }
  return out;
}
export const passwordScore = (s = "") => [s.length >= 8, /[A-Z]/.test(s) && /[a-z]/.test(s), /\d/.test(s), /[^A-Za-z0-9]/.test(s) || s.length >= 12].filter(Boolean).length;
