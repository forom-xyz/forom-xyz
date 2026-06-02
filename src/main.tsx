import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Modal from 'react-modal'
import './index.css'
import { AppRouter } from './router/AppRouter'

// Set the app element for react-modal accessibility
Modal.setAppElement('#root')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
