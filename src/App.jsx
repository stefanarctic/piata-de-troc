import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ListingsProvider } from './context/ListingsContext'
import { UserProvider } from './context/UserContext'
import SiteLayout from './components/SiteLayout'
import ProfileLayout from './components/ProfileLayout'
import HomePage from './pages/HomePage'
import ListingsPage from './pages/ListingsPage'
import ListingDetailPage from './pages/ListingDetailPage'
import ProfileDashboardPage from './pages/ProfileDashboardPage'
import ProfileListingsPage from './pages/ProfileListingsPage'
import ProfileEditPage from './pages/ProfileEditPage'
import AuthorProfilePage from './pages/AuthorProfilePage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <ListingsProvider>
        <UserProvider>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route index element={<HomePage />} />
              <Route path="anunturi" element={<ListingsPage />} />
              <Route path="listings" element={<Navigate to="/anunturi" replace />} />
              <Route path="listings/:slug" element={<ListingDetailPage />} />
              <Route path="utilizator/:slug" element={<AuthorProfilePage />} />
              <Route path="cont" element={<ProfileLayout />}>
                <Route index element={<ProfileDashboardPage />} />
                <Route path="anunturi" element={<ProfileListingsPage />} />
                <Route path="profil" element={<ProfileEditPage />} />
              </Route>
            </Route>
          </Routes>
        </UserProvider>
      </ListingsProvider>
    </BrowserRouter>
  )
}

export default App
