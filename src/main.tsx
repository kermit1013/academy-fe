import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import App from './App'

import './index.css'
import SelectPage from './pages/SelectPage'
import { GoogleOAuthProvider } from '@react-oauth/google';
const clientId = '507786572152-529vtt7jtknh7d1l4512remb9estavpv.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<GoogleOAuthProvider clientId={clientId}><App /></GoogleOAuthProvider>} />
      <Route path="/search" element={<SelectPage />} />
    </Routes>
  </HashRouter>
)
