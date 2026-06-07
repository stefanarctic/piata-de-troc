import { categories } from '../data/siteData'

export default function SearchBar({ value, onChange, selectedCategory, onCategorySelect }) {
  return (
    <form
      className="search-bar"
      onSubmit={(e) => {
        e.preventDefault()
        document.getElementById('anunturi')?.scrollIntoView({ behavior: 'smooth' })
      }}
    >
      <select
        value={selectedCategory}
        onChange={(e) => onCategorySelect(e.target.value)}
        aria-label="Categorie"
      >
        <option value="">Toate categoriile</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      <input
        type="search"
        placeholder="Cauta anunturi..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Cauta anunturi"
      />
      <button type="submit" className="btn btn-primary">
        Cauta
      </button>
    </form>
  )
}
