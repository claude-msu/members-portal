import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import { parse } from "dotenv";

// Load .env.vercel and .env.supabase so your partitioned files are included.
// Contributors can keep using a single .env.local; order: Vite env → .env.vercel → .env.supabase.
function loadPartitionedEnv(envDir: string): Record<string, string> {
  const vercelPath = path.resolve(envDir, ".env.vercel");
  const supabasePath = path.resolve(envDir, ".env.supabase");
  const vercel = fs.existsSync(vercelPath)
    ? parse(fs.readFileSync(vercelPath, "utf-8")) || {}
    : {};
  const supabase = fs.existsSync(supabasePath)
    ? parse(fs.readFileSync(supabasePath, "utf-8")) || {}
    : {};
  return { ...vercel, ...supabase };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const envDir = process.cwd();
  const baseEnv = loadEnv(mode, envDir, "");
  const partitioned = loadPartitionedEnv(envDir);
  const env = { ...baseEnv, ...partitioned };

  const define = Object.fromEntries(
    Object.entries(env)
      .filter(([key]) => key.startsWith("VITE_"))
      .map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)])
  );

  return {
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define,
  };
});
