import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: [
      { find: "@/analysis", replacement: path.resolve(__dirname, "./8888/analysis") },
      { find: "@/assets/hero-background.jpg", replacement: path.resolve(__dirname, "./8888/assets/hero-background.jpg") },
      { find: "@/components/alerts", replacement: path.resolve(__dirname, "./8888/components/alerts") },
      { find: "@/components/csv", replacement: path.resolve(__dirname, "./8888/components/csv") },
      { find: "@/components/league", replacement: path.resolve(__dirname, "./8888/components/league") },
      { find: "@/components/CSVUpload", replacement: path.resolve(__dirname, "./8888/components/CSVUpload.tsx") },
      { find: "@/components/LeagueDetails", replacement: path.resolve(__dirname, "./8888/components/LeagueDetails.tsx") },
      { find: "@/components/LeagueTable", replacement: path.resolve(__dirname, "./8888/components/LeagueTable.tsx") },
      { find: "@/components/NewLeagueModal", replacement: path.resolve(__dirname, "./8888/components/NewLeagueModal.tsx") },
      { find: "@/components/PatternAnalysisPage", replacement: path.resolve(__dirname, "./8888/components/PatternAnalysisPage.tsx") },
      { find: "@/contexts", replacement: path.resolve(__dirname, "./8888/contexts") },
      { find: "@/hooks/useCSVPreview", replacement: path.resolve(__dirname, "./8888/hooks/useCSVPreview.ts") },
      { find: "@/hooks/useLeagueManagement", replacement: path.resolve(__dirname, "./8888/hooks/useLeagueManagement.ts") },
      { find: "@/services", replacement: path.resolve(__dirname, "./8888/services") },
      { find: "@/types/csv.types", replacement: path.resolve(__dirname, "./8888/types/csv.types.ts") },
      { find: "@/types/sportradar", replacement: path.resolve(__dirname, "./8888/types/sportradar.ts") },
      { find: "@/utils/calculations", replacement: path.resolve(__dirname, "./8888/utils/calculations.ts") },
      { find: "@/utils/predictionEngine", replacement: path.resolve(__dirname, "./8888/utils/predictionEngine.ts") },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      { find: "react-flow-renderer", replacement: path.resolve(__dirname, "./src/vendor/react-flow-renderer.tsx") },
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select', '@radix-ui/react-tabs'],
          'query-vendor': ['@tanstack/react-query', '@supabase/supabase-js'],
          'chart-vendor': ['recharts'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'utils-vendor': ['date-fns', 'clsx', 'tailwind-merge', 'lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
}));
