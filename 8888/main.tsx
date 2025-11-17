import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ServicesProvider } from './contexts/ServicesContext'

createRoot(document.getElementById("root")!).render(
  <ServicesProvider>
    <App />
  </ServicesProvider>
)
