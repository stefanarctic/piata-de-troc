import { useNavigate } from 'react-router-dom'
import { categories } from '../data/siteData'

export default function SearchBar({ value, onChange, selectedCategory, onCategorySelect }) {
  const navigate = useNavigate()

  return (
    <form
      className="search-bar"
      onSubmit={(e) => {
        e.preventDefault()
        const params = new URLSearchParams()
        if (value.trim()) params.set('q', value.trim())
        if (selectedCategory) params.set('category', selectedCategory)
        navigate(`/anunturi?${params.toString()}`)
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
