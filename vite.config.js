import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Local dev talks to the PHP API + media on the dev deployment (https: plain
    // http answers with a redirect, which the proxy would hand to the browser).
    proxy: {
      '/api': { target: 'https://dev.saneamientos-pereda.com', changeOrigin: true },
      '/media': { target: 'https://dev.saneamientos-pereda.com', changeOrigin: true },
    },
  },
});
