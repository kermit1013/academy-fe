import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import App from './App'

import './index.css'
import SelectPage from './pages/SelectPage'
import { GoogleOAuthProvider } from '@react-oauth/google'
const clientId =
  '507786572152-529vtt7jtknh7d1l4512remb9estavpv.apps.googleusercontent.com'
import AuthLayout from './layouts/AuthLayout'
import PasswordRecoveryPage from './pages/PasswordRecoveryPage'
import bg from '/bg.svg'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <div className="relative h-screen w-screen" style={{ backgroundImage: `url(${bg})` }}>
    <GoogleOAuthProvider clientId={clientId}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route
              index
              element={
                <App />
              }
            />
            <Route path="forgetPwd" element={<PasswordRecoveryPage />} />
          </Route>
          <Route path="/search" element={<SelectPage />} />
        </Routes>
      </HashRouter>
    </GoogleOAuthProvider>
  </div>
)
