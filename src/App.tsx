import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Gallery from './gallery/Gallery'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import { ErrorBoundary } from './ErrorBoundary'
import Home from './page/Home'

function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" errorElement={<ErrorBoundary />}>
            <Route index element={<Home />} />
            <Route path="/song/*" element={<Home />} />
          </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
