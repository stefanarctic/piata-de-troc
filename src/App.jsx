import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ListingsProvider } from './context/ListingsContext'
import SiteLayout from './components/SiteLayout'
import HomePage from './pages/HomePage'
import ListingsPage from './pages/ListingsPage'
import ListingDetailPage from './pages/ListingDetailPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <ListingsProvider>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="anunturi" element={<ListingsPage />} />
            <Route path="listings" element={<Navigate to="/anunturi" replace />} />
            <Route path="listings/:slug" element={<ListingDetailPage />} />
          </Route>
        </Routes>
      </ListingsProvider>
    </BrowserRouter>
  )
}

export default App
