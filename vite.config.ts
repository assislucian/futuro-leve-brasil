
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// O componentTagger foi removido temporariamente para depuração.
// import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    watch: {
      // Ignora a pasta de migrações para evitar o erro "too many open files".
      ignored: ["**/supabase/migrations/**"],
    },
  },
  plugins: [
    react(),
    // O componentTagger e a lógica de `mode` foram removidos temporariamente.
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
