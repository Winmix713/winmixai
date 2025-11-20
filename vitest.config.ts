import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      thresholds: {
        statements: 40,
        branches: 30,
        functions: 35,
        lines: 40,
      },
    },
    env: {
      VITE_SUPABASE_URL: "https://api.test",
      VITE_SUPABASE_PUBLISHABLE_KEY: "test-anon-key",
      NEXT_PUBLIC_SUPABASE_URL: "https://api.test",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
    },
  },
  resolve: {
    alias: [
      { find: "@/analysis", replacement: path.resolve(__dirname, "./8888/analysis") },
      { find: "@/components/alerts", replacement: path.resolve(__dirname, "./8888/components/alerts") },
      { find: "@/components/csv", replacement: path.resolve(__dirname, "./8888/components/csv") },
      { find: "@/components/league", replacement: path.resolve(__dirname, "./8888/components/league") },
      { find: "@/contexts", replacement: path.resolve(__dirname, "./8888/contexts") },
      { find: "@/hooks/useCSVPreview", replacement: path.resolve(__dirname, "./8888/hooks/useCSVPreview.ts") },
      { find: "@/hooks/useLeagueManagement", replacement: path.resolve(__dirname, "./8888/hooks/useLeagueManagement.ts") },
      { find: "@/services", replacement: path.resolve(__dirname, "./8888/services") },
      { find: "@/types/csv.types", replacement: path.resolve(__dirname, "./8888/types/csv.types.ts") },
      { find: "@/types/sportradar", replacement: path.resolve(__dirname, "./8888/types/sportradar.ts") },
      { find: "@/utils/calculations", replacement: path.resolve(__dirname, "./8888/utils/calculations.ts") },
      { find: "@/utils/predictionEngine", replacement: path.resolve(__dirname, "./8888/utils/predictionEngine.ts") },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      {
        find: "react-flow-renderer",
        replacement: path.resolve(__dirname, "./src/vendor/react-flow-renderer.tsx"),
      },
    ],
  },
});
