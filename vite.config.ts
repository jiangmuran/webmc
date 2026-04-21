import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      // `credentialless` still unlocks SharedArrayBuffer (needed for future
      // shared-memory workers in M16) while allowing user-uploaded resource
      // packs loaded via blob URLs, which M4's resource-pack sandbox relies on.
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
  preview: {
    port: 4173,
    host: true,
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => (id.includes('node_modules/three') ? 'three' : undefined),
      },
    },
  },
  worker: {
    format: 'es',
  },
});
