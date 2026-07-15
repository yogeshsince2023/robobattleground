import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('framer-motion')) return 'framer-motion';
          if (id.includes('@supabase') || id.includes('supabase')) return 'supabase';
          if (id.includes('@tabler/icons-react') || id.includes('tabler-icons')) return 'tabler-icons';
          if (id.includes('react-router') || id.includes('@remix-run/router')) return 'react-router';
        }
      }
    }
  }
})
