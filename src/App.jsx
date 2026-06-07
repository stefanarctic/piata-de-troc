import { useEffect, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import ListingsGrid from './components/ListingsGrid'
import Locations from './components/Locations'
import Footer from './components/Footer'
import { listings } from './data/siteData'
import './App.css'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="app">
      <Header />
      <main>
        <Hero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
        <ListingsGrid
          listings={listings}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />
        <Locations />
      </main>
      <Footer />
      {showTop && (
        <button
          type="button"
          className="back-to-top"
          aria-label="Inapoi sus"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑
        </button>
      )}
    </div>
  )
}

export default App
