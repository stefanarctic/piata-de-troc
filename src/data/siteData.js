export const menus = [
  { label: 'Acasa', href: '#acasa', active: true },
  { label: 'Anunturi', href: '#anunturi' },
]

export const categories = [
  { name: 'Servicii', count: 7, icon: 'servicii-icon.png', slug: 'servicii' },
  { name: 'Antichitati', count: 2, icon: 'antichitati-icon.png', slug: 'antichitati' },
  { name: 'Imobiliare', count: 6, icon: 'house.png', slug: 'imobiliare' },
  { name: 'Sport', count: 15, icon: 'sport-icon.png', slug: 'sport' },
  { name: 'Masini', count: 21, icon: 'car.png', slug: 'masini' },
  { name: 'Telefoane mobile', count: 4, icon: 'mobile.png', slug: 'telefoane-mobile' },
  { name: 'Mobilier', count: 8, icon: 'furniture.png', slug: 'mobilier' },
  { name: 'Electronice', count: 37, icon: 'eelectronics.png', slug: 'electronice' },
  { name: 'Electrocasnice', count: 11, icon: 'Customer-support.png', slug: 'electrocasnice' },
  { name: 'Fashion', count: 13, icon: 'Fashion0.png', slug: 'fashion' },
  { name: 'Animale', count: 9, icon: 'pet.png', slug: 'animale' },
  { name: 'Carti', count: 1, icon: 'education.png', slug: 'carti' },
  { name: 'Jucarii', count: 7, icon: 'Baby-Toys.png', slug: 'jucarii' },
  { name: 'Cereale', count: 1, icon: 'cereale.png', slug: 'cereale' },
]

export const listings = [
  { id: 1, title: 'Citroën Jumper 2.5', image: 'escc_citroen-jumper-ft_6319640-1-rgddtkikj0oigh6r7duifp2tillsdq7lhhl6x4hc1k.jpg', category: 'Masini' },
  { id: 2, title: 'Wednesday Addams 4-6 yrs Halloween witch vrăjitoare gothic dark academia cosplay scary spooky creepy', image: '20250912_145436-scaled-rctq3dmoktbfpp0ercwakgsueotmx6asqvdiax7588.jpg', category: 'Fashion' },
  { id: 3, title: 'Volvo V60 D3 2011', image: 'photo_2025-07-18-19.25.29-r8y5dc3gk6hi6bw2k547oxss1yth2wdb0acl6qo1fc.jpeg', category: 'Masini' },
  { id: 4, title: 'Pat supraetajat copii', image: 'no-thumbnail.jpg', category: 'Mobilier' },
  { id: 5, title: 'Ford transit 2.2 tdci', image: 'inbound6894738421444399390-scaled-r8kedd7k2qaig2e1nv1rm8ut416epxbsnmo33qihiw.jpg', category: 'Masini' },
  { id: 6, title: 'Solar de bronzat Philips Sunmobile HB 975 Sun & Relax', image: 'IMG-20250612-WA0002-r77lnft6xeuzbmth3ovvvmjivul8vg9ap5e339y7g8.jpg', category: 'Electronice' },
  { id: 7, title: 'Mobilier Horeca – bar / cafenea / restaurant', image: 'IMG-20250612-WA0003-r77l5cf1d839tv3nrdbfdox37trvp7fb7laliis188.jpg', category: 'Mobilier' },
  { id: 8, title: 'Schimb presa Krone KR 150', image: 'inbound2058596373401524781-scaled-qwi9zc02iz557aa96e5hkyfiu9kgg8uqn42g6vt6wo.jpg', category: 'Masini' },
  { id: 9, title: 'electrician', image: 'no-thumbnail.jpg', category: 'Servicii' },
  { id: 10, title: 'Barca', image: 'inbound6898051860431267303-scaled-qs9xe56qdbkak2fsemgesk8luzrvur4zs5s6ppreig.jpg', category: 'Sport' },
  { id: 11, title: 'Barca avariata', image: 'inbound5577236896358046425-qqzurnflsaeef59eqxn8ssp49b70upmbcnq79t3rjs.jpg', category: 'Sport' },
  { id: 12, title: 'Cocosei', image: 'IMG_1057-scaled-qqx8mxm6wfi287k8h55amxeumxr0punbg2e7vpl7p4.jpeg', category: 'Animale' },
  { id: 13, title: 'Schimb teren in 23 August', image: '10422540_766207096787637_6906120752654987946_n-qqh8y8z4n0yyinbm2s86sqa5q72ypb34qehfguaa0o.jpg', category: 'Imobiliare' },
  { id: 14, title: 'Schimb Hinomoto e1804', image: 'inbound2689924809438618736-scaled-qq5yfisdlj4rq52wluc2mr3b2vsh7y8en85zulcawo.jpg', category: 'Masini' },
  { id: 15, title: 'Haine bebelusa 0-3 luni', image: 'inbound5562150607779972900-scaled-qq3agrt4lnu9xdaox0amt1ob51t7ck48nsz1rpqe60.jpg', category: 'Fashion' },
  { id: 16, title: 'Golf V', image: 'no-thumbnail.jpg', category: 'Masini' },
]

export const locations = [
  'Argeș', 'Galați', 'Sibiu', 'Bacău', 'Giurgiu', 'Suceava', 'Bihor', 'Gorj',
  'Teleorman', 'Bistrița-Năsăud', 'Harghita', 'Timiș', 'Botoșani', 'Hunedoara',
  'Tulcea', 'Brașov', 'Ialomița', 'Vaslui', 'Brăila', 'Iași', 'Vâlcea', 'București',
  'Ilfov', 'Vrancea', 'Buzău', 'Maramureș', 'Caraș-Severin', 'Mehedinți', 'Călărași',
  'Mureș', 'Cluj', 'Neamț', 'Constanța', 'Olt', 'Covasna', 'Prahova', 'Alba',
  'Dâmbovița', 'Satu Mare', 'Arad', 'Dolj', 'Sălaj',
]

export const asset = (filename) => `/assets/${filename}`
