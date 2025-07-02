import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App.jsx'
import Home from './Home.jsx';
import MyNav from './MyNav.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <Routes>
        {/*Layout: <Route path="/" element={} */}
        <Route index element={<Home/>}/>
        <Route path="Dashboard" element={<App/>}/>
      </Routes>
    </StrictMode>
  </BrowserRouter>
)
