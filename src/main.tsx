import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Routes from './routes/index.tsx'
import { AuthContextProvider } from './contexts/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthContextProvider>
            <Routes />
        </AuthContextProvider>
    </StrictMode>,
)
