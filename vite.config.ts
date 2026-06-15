import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Inline plugin to resolve the virtual module "tanstack-start-injected-head-scripts:v"
// which is imported by @tanstack/start-server-core but not yet defined in the Vite plugin in some versions.
const virtualHeadScriptsPlugin = () => {
  const virtualModuleId = 'tanstack-start-injected-head-scripts:v';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'virtual-head-scripts-plugin',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return 'export const injectedHeadScripts = undefined;';
      }
    },
  };
};

export default defineConfig({
  css: {
    transformer: "lightningcss",
    lightningcss: {
      targets: {
        chrome: (90 << 16),
        firefox: (90 << 16),
        safari: (14 << 16),
        ios_saf: (14 << 16),
      },
    },
  },
  build: {
    cssMinify: "lightningcss",
  },
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    virtualHeadScriptsPlugin(),
    tanstackStart({
      server: {
        // Use Node.js preset for Docker deployment
        preset: "node-server",
        allowedHosts: ["cirt-mdg.soozey.com", "localhost", "127.0.0.1"]

      },
    }),
    react(),
  ],
    server: {
    host: "0.0.0.0", // écoute sur toutes les interfaces réseau
    port: 2220,
    allowedHosts: true
  }
});
