import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { TooltipProvider } from './components/ui/tooltip'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="alumni-ui-theme">
      <TooltipProvider delayDuration={200}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>,
)

