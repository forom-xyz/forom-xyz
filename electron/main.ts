import { app, BrowserWindow, shell } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure:
// ├─ dist-electron/
// │  ├─ main.js       ← this file after build
// │  └─ preload.js
// └─ dist/
//    └─ index.html    ← Vite renderer build

const RENDERER_DIST = path.join(__dirname, '../dist')
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

let win: BrowserWindow | null = null

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, '../public/icon.png'),
    backgroundColor: '#0a0a0a',
    titleBarStyle: 'hiddenInset', // sleek on macOS
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  // Open external links in browser, not in Electron
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      shell.openExternal(url)
    }
    return { action: 'deny' }
  })

  if (VITE_DEV_SERVER_URL) {
    // Dev mode: load from Vite dev server
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    // Production: load built index.html
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  // On macOS, keep app in dock unless explicitly quit
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On macOS, re-create window when dock icon is clicked with no windows open
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
