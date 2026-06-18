import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        homepage: resolve(__dirname, 'homepage.html'),
        movieDetail: resolve(__dirname, 'movie-detail.html'),
        account: resolve(__dirname, 'account.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
})
