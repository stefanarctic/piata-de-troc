import { categories, asset } from '../data/siteData'

export default function Categories({ selectedCategory, onCategorySelect }) {
  return (
    <div className="categories">
      {categories.map((cat) => (
        <button
          key={cat.slug}
          type="button"
          className={`category-card ${selectedCategory === cat.name ? 'selected' : ''}`}
          onClick={() => {
            onCategorySelect(selectedCategory === cat.name ? '' : cat.name)
            document.getElementById('anunturi')?.scrollIntoView({ behavior: 'smooth' })
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
