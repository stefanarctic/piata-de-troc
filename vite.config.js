import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/remote': {
        target: 'https://piatadetroc.ro',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/remote/, ''),
        cookieDomainRewrite: 'localhost',
      },
    },
  },
})
