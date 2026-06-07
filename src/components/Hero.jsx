import SearchBar from './SearchBar'
import Categories from './Categories'
import { siteAssets } from '../data/siteData'

export default function Hero({ searchQuery, onSearchChange, selectedCategory, onCategorySelect }) {
  return (
    <section id="acasa" className="hero" style={{ backgroundImage: `url(${siteAssets.banner})` }}>
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1>Piata de troc</h1>
        <p className="hero-subtitle">Schimbă orice lucru oricand</p>
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
        />
        <Categories
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
        />
      </div>
    </section>
  )
}
