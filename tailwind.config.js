/** Public-site utilities. Theme values mirror shared/theme/tokens.css. The portal does not use Tailwind. */
export default {
  content: ["./index.html", "./src/site/**/*.{js,jsx}"],
  theme: { extend: { fontFamily: {
    serif: ["Lora Variable", "Lora", "Georgia", "Times New Roman", "serif"],
    sans: ["Inter Variable", "Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
  } } },
};
