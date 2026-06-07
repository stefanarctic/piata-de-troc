import { Link } from 'react-router-dom'
import { categories, asset } from '../data/siteData'
import { useListings } from '../context/ListingsContext'

export default function CategoriesWidget() {
  const { categories: dynamicCategories } = useListings()

  const items = categories.map((cat) => ({
    ...cat,
    count: dynamicCategories.find((c) => c.name === cat.name)?.count ?? cat.count,
  }))

  return (
    <section className="categories-widget detail-card">
      <h2>Categories.</h2>
      <ul>
        {items.map((cat) => (
          <li key={cat.slug}>
            <Link to={`/anunturi?category=${encodeURIComponent(cat.name)}`}>
              <span className="cat-widget-icon">
                <img src={asset(cat.icon)} alt="" />
              </span>
              <span className="cat-widget-name">{cat.name}</span>
              <span className="cat-widget-count">{cat.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
