import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import App from './App'

import './index.css'
import SelectPage from './pages/SelectPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/search" element={<SelectPage />} />
    </Routes>
  </HashRouter>
)
