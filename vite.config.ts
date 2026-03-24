import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

// Node built-ins and electron are always external for the main process
const electronExternals = [
  'electron',
  'path',
  'fs',
  'url',
  'os',
  'crypto',
  'http',
  'https',
  'stream',
  'events',
  'child_process',
]

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    electron([
      {
        // Main process entry
        entry: 'electron/main.ts',
        onstart(options) {
          options.startup()
        },
        vite: {
          build: {
            sourcemap: command === 'serve',
            minify: command !== 'serve',
            outDir: 'dist-electron',
            rollupOptions: {
              external: electronExternals,
            },
          },
        },
      },
      {
        // Preload script entry
        entry: 'electron/preload.ts',
        onstart(options) {
          options.reload()
        },
        vite: {
          build: {
            sourcemap: command === 'serve' ? 'inline' : false,
            minify: command !== 'serve',
            outDir: 'dist-electron',
            rollupOptions: {
              external: electronExternals,
              output: {
                format: 'cjs',
              },
            },
          },
        },
      },
    ]),
    renderer(),
  ],
  // Use relative base path for Electron (file:// protocol needs relative asset paths)
  base: command === 'serve' ? '/' : './',
  server: {
    allowedHosts: ['forom.prodv2.cedille.club', 'forom.etsmtl.ca'],
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-ui': ['lucide-react', 'react-modal', 'zustand'],
        },
      },
    },
  },
}))
