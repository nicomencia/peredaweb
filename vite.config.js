import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Local dev talks to the PHP API + media on the dev deployment.
    proxy: {
      '/api': 'http://dev.saneamientos-pereda.com',
      '/media': 'http://dev.saneamientos-pereda.com',
    },
  },
});
