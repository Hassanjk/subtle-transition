// Definition of the Project interface and the projects array
interface Project {
  id: number
  title: string
  slug: string
  description: string
  year: string
  agency: string
  url: string
  color1: { r: number, g: number, b: number }
  color2: { r: number, g: number, b: number }
  images: string[]
  thumbnail: string
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'Unisve Crafts',
    slug: 'unisve-crafts',
    description: 'Founded in 2001 to support and keep alive many traditional Venetian artisan techniques.',
    year: '2021',
    agency: 'Overpx',
    url: 'https://unisve.com',
    color1: { r: 245, g: 240, b: 235 },
    color2: { r: 230, g: 225, b: 220 },
    images: [
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1200',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800'
  },
  {
    id: 2,
    title: 'Airbag Studio',
    slug: 'airbag-studio',
    description: 'Studio focusing on designing and developing advanced and intuitive mobile ecosystems.',
    year: '2023',
    agency: 'Overpx',
    url: 'https://airbag.studio',
    color1: { r: 255, g: 200, b: 200 },
    color2: { r: 240, g: 180, b: 180 },
    images: [
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200',
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200',
      'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=1200'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800'
  },
  {
    id: 3,
    title: 'Things Agency',
    slug: 'things-agency',
    description: 'European design & innovation agency pioneering in IoT experience for humans.',
    year: '2023',
    agency: 'Things',
    url: 'https://things.agency',
    color1: { r: 180, g: 200, b: 255 },
    color2: { r: 160, g: 180, b: 240 },
    images: [
      'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=1200',
      'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=1200',
      'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=1200'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800'
  }
]
