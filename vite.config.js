import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
const r = (p) => resolve(fileURLToPath(new URL(".", import.meta.url)), p);

// Two entry points, one build: the public site (/) and the lawyer portal (/portal/).
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@shared": r("shared"), "@site": r("src/site"), "@portal": r("src/portal") } },
  build: {
    rollupOptions: {
      input: { site: r("index.html"), portal: r("portal/index.html") },
      output: { manualChunks: { react: ["react", "react-dom", "react-router-dom"], gsap: ["gsap", "gsap/ScrollTrigger", "gsap/SplitText", "@gsap/react", "lenis"], motion: ["motion/react"] } },
    },
  },
  server: { fs: { allow: [r(".")] } },
});
