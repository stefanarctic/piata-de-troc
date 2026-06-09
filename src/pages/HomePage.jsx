import { useState } from 'react'
import Hero from '../components/Hero'
import ListingsGrid from '../components/ListingsGrid'
import Locations from '../components/Locations'
import { useListings } from '../context/ListingsContext'

export default function HomePage() {
  const { latestListings, latestLoading } = useListings()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  return (
    <>
      <Hero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      <ListingsGrid
        listings={latestListings}
        loading={latestLoading}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        title="Ultimele anunturi"
        subtitle="Vezi cele mai noi, alege acum ceea ce iti doresti"
      />
      <Locations />
    </>
  )
}
