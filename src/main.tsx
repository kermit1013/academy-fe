import { GoogleOAuthProvider } from '@react-oauth/google'
import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'

import './index.css'

// Layout
import AuthLayout from './layouts/AuthLayout'
import BaseLayout from './layouts/BaseLayout'

// Pages
import App from './App'
import PasswordRecoveryPage from './pages/PasswordRecoveryPage'
import RegisterPage from './pages/RegisterPage'
import SelectPage from './pages/SelectPage'
import MindMap from './pages/MindMap'
// import Dashboard from './pages/Dashboard'

import bg from '/bg.svg'

const clientId =
  '507786572152-529vtt7jtknh7d1l4512remb9estavpv.apps.googleusercontent.com'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <div
    className="relative h-screen w-screen bg-cover"
    style={{ backgroundImage: `url(${bg})` }}
  >
    <GoogleOAuthProvider clientId={clientId}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<App />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forget-pwd" element={<PasswordRecoveryPage />} />
          </Route>
          <Route path="/dashboard" element={<BaseLayout />}>
            <Route index element={<SelectPage />} />
            <Route path="mind-map" element={<MindMap />} />
          </Route>
        </Routes>
      </HashRouter>
    </GoogleOAuthProvider>
  </div>
)
