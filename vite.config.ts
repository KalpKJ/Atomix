import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // Relative paths, so the build works at kalpkj.github.io/Atomix/ or anywhere else.
  base: './',
  plugins: [react()],
  // Three.js (about 140 kB gzipped) is its own chunk, loaded only when an element opens.
  build: { chunkSizeWarningLimit: 600 },
})
