import { contextBridge } from 'electron'

// Safely expose Electron APIs to the renderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform: 'win32' | 'darwin' | 'linux'
  platform: process.platform,
})
