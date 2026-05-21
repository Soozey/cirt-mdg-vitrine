import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tanstackStart({
      server: { entry: 'server' }
    }),
    tailwindcss(),
    tsconfigPaths(),
  ],
  esbuild: {
    jsx: 'automatic',
  },
  server: {
    host: '0.0.0.0',   // écoute sur toutes les interfaces
    port: 2220,        // tu peux changer le port si besoin
  },
});
