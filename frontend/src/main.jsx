import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '448966911909-6t0pi4ue0fo30j618onn0n1pgluhvdsf.apps.googleusercontent.com';

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </>,
)
