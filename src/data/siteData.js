const UPLOADS = 'https://piatadetroc.ro/wp-content/uploads'

export const menus = [
  { label: 'Acasa', href: '/', active: false },
  { label: 'Anunturi', href: '/anunturi', active: false },
]

export const categories = [
  { name: 'Servicii', count: 7, icon: `${UPLOADS}/2022/11/servicii-icon.png`, slug: 'servicii' },
  { name: 'Antichitati', count: 2, icon: `${UPLOADS}/2022/11/antichitati-icon.png`, slug: 'antichitati' },
  { name: 'Imobiliare', count: 6, icon: `${UPLOADS}/2022/11/house.png`, slug: 'imobiliare' },
  { name: 'Sport', count: 15, icon: `${UPLOADS}/2022/11/sport-icon.png`, slug: 'sport' },
  { name: 'Masini', count: 21, icon: `${UPLOADS}/2022/11/car.png`, slug: 'masini' },
  { name: 'Telefoane mobile', count: 4, icon: `${UPLOADS}/2022/11/mobile.png`, slug: 'telefoane-mobile' },
  { name: 'Mobilier', count: 8, icon: `${UPLOADS}/2022/11/furniture.png`, slug: 'mobilier' },
  { name: 'Electronice', count: 37, icon: `${UPLOADS}/2022/11/eelectronics.png`, slug: 'electronice' },
  { name: 'Electrocasnice', count: 11, icon: `${UPLOADS}/2022/11/Customer-support.png`, slug: 'electrocasnice' },
  { name: 'Fashion', count: 13, icon: `${UPLOADS}/2022/11/Fashion0.png`, slug: 'fashion' },
  { name: 'Animale', count: 9, icon: `${UPLOADS}/2022/11/pet.png`, slug: 'animale' },
  { name: 'Carti', count: 1, icon: `${UPLOADS}/2022/11/education.png`, slug: 'carti' },
  { name: 'Jucarii', count: 7, icon: `${UPLOADS}/2022/11/Baby-Toys.png`, slug: 'jucarii' },
  { name: 'Cereale', count: 1, icon: `${UPLOADS}/2022/11/cereale.png`, slug: 'cereale' },
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
  if (filename.startsWith('http')) return filename
  return `${UPLOADS}/2022/11/${filename}`
}

export const siteAssets = {
  logo: `${UPLOADS}/2024/09/cropped-1a975cab-6251-4ec6-880c-407c13db1907.jpg`,
  userAvatar: `${UPLOADS}/2024/09/38390ac22dc073779f536eb2de19d198.jpg`,
  banner: `${UPLOADS}/2023/01/banner-home.webp`,
}
