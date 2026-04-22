import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App.jsx'
import InfoSlide from './components/InfoSlide.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InfoSlide />
    <App />
  </StrictMode>,
)
