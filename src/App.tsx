import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './ErrorBoundary'
import Home from './page/Home'
import NotFound from './page/NotFound'
import { Suspense } from 'react'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" errorElement={<ErrorBoundary />}>
          <Route index element={<Suspense fallback={null}><Home /></Suspense>} />
          <Route path="/song/*" element={<Suspense fallback={null}><Home /></Suspense>} />
          <Route path="*" element={<Suspense fallback={null}><NotFound /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
