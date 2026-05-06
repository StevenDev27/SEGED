import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MainRoute } from './routes/MainRoute.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <BrowserRouter>
      <MainRoute />
    </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)
