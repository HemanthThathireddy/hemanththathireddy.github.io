// portfolio/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* Manual chunking keeps the heaviest deps in their own cacheable bundles
   and prevents Three.js from polluting the entry chunk. The lazy-loaded
   HeroScene already creates a chunk; this just ensures the dep boundaries
   are clean across the whole graph. */
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion': ['framer-motion'],
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
          'gsap': ['gsap'],
        },
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
  preview: {
    port: 4173,
  },
});
