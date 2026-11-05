import { createRoot } from 'react-dom/client'
import '@fontsource-variable/anybody/standard.css'
import '@fontsource-variable/anybody/standard-italic.css'
import '@fontsource-variable/doto/index.css'
import '@fontsource-variable/hanken-grotesk/index.css'
import './styles.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(<App />)
