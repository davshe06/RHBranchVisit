import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The app is served from https://davshe06.github.io/RHBranchVisit/, so every
// emitted asset URL needs that prefix. `npm run dev` serves from / instead.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/RHBranchVisit/' : '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
}));
