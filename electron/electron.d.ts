// Type declarations for Electron preload API exposed via contextBridge
interface ElectronAPI {
  platform: 'win32' | 'darwin' | 'linux' | string
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export {}
