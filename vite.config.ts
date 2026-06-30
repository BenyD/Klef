import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

// Single dev server: Vite serves the React SPA and runs the Hono Worker in the
// real workerd runtime with local emulation of bindings (D1, etc.).
export default defineConfig({
  plugins: [react(), cloudflare()],
});
