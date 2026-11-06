import { createRoot } from 'react-dom/client'
import '@fontsource-variable/anybody/standard.css'
import '@fontsource-variable/anybody/standard-italic.css'
import '@fontsource-variable/doto/index.css'
import '@fontsource-variable/hanken-grotesk/index.css'
import './styles.css'
import { App } from './App'

const v = import.meta.env.VITE_VARIANT
if (v) document.documentElement.dataset.variant = v
if (v === 'monument') await import('./variants/monument.css')
if (v === 'backpage') await import('./variants/backpage.css')
if (v === 'broadcast') await import('./variants/broadcast.css')

createRoot(document.getElementById('root')!).render(<App />)
