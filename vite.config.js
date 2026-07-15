import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://therobobattleground.in',
      dynamicRoutes: [
        '/',
        '/arena',
        '/machining', 
        '/internships',
        '/verify',
        '/projects',
        '/about',
        '/contact',
      ],
      exclude: [
        '/admin',
        '/admin/*',
        '/admin/login',
        '/admin/dashboard',
        '/admin/certificates',
        '/admin/gallery',
        '/admin/enquiries',
        '/admin/applications',
        '/admin/messages',
        '/admin/machining',
        '/admin/projects',
        '/admin/clients',
      ],
      generateRobotsTxt: false
    })
  ],
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
