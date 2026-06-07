import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { categories as staticCategories } from '../data/siteData'
import { useListings } from '../context/ListingsContext'

export default function ListingsSidebar() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { categories: dynamicCategories } = useListings()

  const [searchQ, setSearchQ] = useState(params.get('q') || '')
  const [location, setLocation] = useState(params.get('location') || '')
  const [category, setCategory] = useState(params.get('category') || '')

  const sidebarCategories = dynamicCategories.length
    ? staticCategories.map((cat) => ({
        ...cat,
        count: dynamicCategories.find((c) => c.name === cat.name)?.count ?? cat.count,
      }))
    : staticCategories

  const handleSearch = (e) => {
    e.preventDefault()
    const next = new URLSearchParams()
    if (searchQ.trim()) next.set('q', searchQ.trim())
    if (location.trim()) next.set('location', location.trim())
    if (category) next.set('category', category)
    navigate(`/anunturi?${next.toString()}`)
  }

  const filterByCategory = (name) => {
    const next = new URLSearchParams(params)
    if (name) next.set('category', name)
    else next.delete('category')
    navigate(`/anunturi?${next.toString()}`)
  }

  return (
    <aside className="listings-sidebar">
      <div className="sidebar-box">
        <h2>Filters</h2>
        <form onSubmit={handleSearch}>
          <label>
            Search By:
            <input
              type="search"
              placeholder="Telefoane Mobile"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
            />
          </label>
          <label>
            Search In Location:
            <input
              type="search"
              placeholder="Enter Address"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Categorie"
          >
            <option value="">Selecteaza</option>
            {sidebarCategories.map((cat) => (
              <option key={cat.slug} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-search">
            Search
          </button>
        </form>
      </div>

      <div className="sidebar-box sidebar-categories">
        <ul>
          {sidebarCategories.map((cat) => (
            <li key={cat.slug}>
              <button type="button" onClick={() => filterByCategory(cat.name)}>
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
