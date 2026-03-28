import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

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
export default defineConfig(({ command, mode }) => {
  const plugins: any[] = [react()]
  const enableElectron = mode === 'electron'

  let electronPlugin: any = null
  let rendererPlugin: any = null
  if (enableElectron) {
    try {
      electronPlugin = require('vite-plugin-electron').default
      rendererPlugin = require('vite-plugin-electron-renderer').default
    } catch (err) {
      console.warn('Electron plugins not available, skipping electron bundling:', err)
    }
  }

  if (enableElectron && electronPlugin && rendererPlugin) {
    plugins.push(
      electronPlugin([
        {
          // Main process entry
          entry: 'electron/main.ts',
          onstart(options: { startup: () => void }) {
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
          onstart(options: { reload: () => void }) {
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
      ])
    )

    plugins.push(rendererPlugin())
  }

  return {
    plugins,
    // Use relative base path for Electron (file:// protocol needs relative asset paths)
    base: enableElectron && command !== 'serve' ? './' : '/',
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
  }
})
