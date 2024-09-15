import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
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
