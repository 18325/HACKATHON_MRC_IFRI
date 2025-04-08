import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
    visualizer({
      filename: './dist/stats.html', // Génère un fichier HTML pour visualiser les chunks
      open: true, // Ouvre automatiquement le fichier après la build
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Sépare les dépendances principales dans des chunks distincts
          vendor: ['react', 'react-dom'],
          fullcalendar: ['@fullcalendar/core', '@fullcalendar/react', '@fullcalendar/daygrid', '@fullcalendar/timegrid'],
          apexcharts: ['apexcharts', 'react-apexcharts'],
          reactQuery: ['@tanstack/react-query'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
