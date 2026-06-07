import { useNavigate } from 'react-router-dom'
import { categories, asset } from '../data/siteData'
import { useListings } from '../context/ListingsContext'

export default function Categories({ selectedCategory, onCategorySelect }) {
  const navigate = useNavigate()
  const { categories: dynamicCategories } = useListings()

  const items = categories.map((cat) => ({
    ...cat,
    count: dynamicCategories.find((c) => c.name === cat.name)?.count ?? cat.count,
  }))

  return (
    <div className="categories">
      {items.map((cat) => (
        <button
          key={cat.slug}
          type="button"
          className={`category-card ${selectedCategory === cat.name ? 'selected' : ''}`}
          onClick={() => {
            const next = selectedCategory === cat.name ? '' : cat.name
            onCategorySelect(next)
            if (next) {
              navigate(`/anunturi?category=${encodeURIComponent(next)}`)
            }
          }}
        >
          <span className="category-icon">
            <img src={asset(cat.icon)} alt="" />
          </span>
          <span className="category-name">{cat.name}</span>
          <span className="category-count">{cat.count}</span>
        </button>
      ))}
    </div>
  )
}
