import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './ErrorBoundary'
import Home from './page/Home'
import NotFound from './page/NotFound'
import { Suspense } from 'react'
import { ThemeProvider, createTheme } from '@mui/material'

const theme = createTheme()

function App() {

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" errorElement={<ErrorBoundary />}>
            <Route index element={<Suspense fallback={null}><Home /></Suspense>} />
            <Route path="/song/:slug" element={<Suspense fallback={null}><Home /></Suspense>} />
            <Route path="*" element={<Suspense fallback={null}><NotFound /></Suspense>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
