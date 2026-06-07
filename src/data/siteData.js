const UPLOADS = 'https://piatadetroc.ro/wp-content/uploads'

export const menus = [
  { label: 'Acasa', href: '/', active: false },
  { label: 'Anunturi', href: '/anunturi', active: false },
]

export const categories = [
  { name: 'Servicii', count: 7, icon: '/icons/categories/servicii.svg', slug: 'servicii' },
  { name: 'Antichitati', count: 2, icon: '/icons/categories/antichitati.svg', slug: 'antichitati' },
  { name: 'Imobiliare', count: 6, icon: '/icons/categories/imobiliare.svg', slug: 'imobiliare' },
  { name: 'Sport', count: 15, icon: '/icons/categories/sport.svg', slug: 'sport' },
  { name: 'Masini', count: 21, icon: '/icons/categories/masini.svg', slug: 'masini' },
  { name: 'Telefoane mobile', count: 4, icon: '/icons/categories/telefoane-mobile.svg', slug: 'telefoane-mobile' },
  { name: 'Mobilier', count: 8, icon: '/icons/categories/mobilier.svg', slug: 'mobilier' },
  { name: 'Electronice', count: 37, icon: '/icons/categories/electronice.svg', slug: 'electronice' },
  { name: 'Electrocasnice', count: 11, icon: '/icons/categories/electrocasnice.svg', slug: 'electrocasnice' },
  { name: 'Fashion', count: 13, icon: '/icons/categories/fashion.svg', slug: 'fashion' },
  { name: 'Animale', count: 9, icon: '/icons/categories/animale.svg', slug: 'animale' },
  { name: 'Carti', count: 1, icon: '/icons/categories/carti.svg', slug: 'carti' },
  { name: 'Jucarii', count: 7, icon: '/icons/categories/jucarii.svg', slug: 'jucarii' },
  { name: 'Cereale', count: 1, icon: '/icons/categories/cereale.svg', slug: 'cereale' },
]

export const locations = [
  'Argeș', 'Galați', 'Sibiu', 'Bacău', 'Giurgiu', 'Suceava', 'Bihor', 'Gorj',
  'Teleorman', 'Bistrița-Năsăud', 'Harghita', 'Timiș', 'Botoșani', 'Hunedoara',
  'Tulcea', 'Brașov', 'Ialomița', 'Vaslui', 'Brăila', 'Iași', 'Vâlcea', 'București',
  'Ilfov', 'Vrancea', 'Buzău', 'Maramureș', 'Caraș-Severin', 'Mehedinți', 'Călărași',
  'Mureș', 'Cluj', 'Neamț', 'Constanța', 'Olt', 'Covasna', 'Prahova', 'Alba',
  'Dâmbovița', 'Satu Mare', 'Arad', 'Dolj', 'Sălaj',
]

export const asset = (filename) => {
  if (filename.startsWith('http') || filename.startsWith('/')) return filename
  return `${UPLOADS}/2022/11/${filename}`
}

export const siteAssets = {
  logo: `${UPLOADS}/2024/09/cropped-1a975cab-6251-4ec6-880c-407c13db1907.jpg`,
  userAvatar: `${UPLOADS}/2024/09/38390ac22dc073779f536eb2de19d198.jpg`,
  banner: `${UPLOADS}/2023/01/banner-home.webp`,
}
