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
  // Ajout de cette option pour corriger "React is not defined"
  esbuild: {
    jsx: 'automatic',
  },
});
