import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Project site is served at /Portfolio/ until the repo becomes a user site.
// The deploy workflow sets VITE_BASE; local dev defaults to /.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss()],
})
