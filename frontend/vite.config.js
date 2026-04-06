import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import crypto from 'crypto';

if (!globalThis.crypto) {
  globalThis.crypto = {
    getRandomValues: (arr) => crypto.randomFillSync(arr)
  };
}

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js', // Ensure this points to your PostCSS config
  },
})