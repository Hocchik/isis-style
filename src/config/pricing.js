export const NO_LENGTH_TECHNIQUES = [
  { id: 'manicure-tradicional-manos', name: 'Manicure tradicional (Manos)' },
  { id: 'manicure-tradicional-pies', name: 'Manicure tradicional (Pies)' },
  { id: 'gel-semipermanente-manos', name: 'Gel semipermanente (Manos)' },
  { id: 'gel-semipermanente-pies', name: 'Gel semipermanente (Pies)' },
  { id: 'rubber-gel', name: 'Rubber Gel' },
  { id: 'kapping-acrilico', name: 'Kapping de acrílico' },
  { id: 'kapping-polygel', name: 'Kapping de polygel' },
  { id: 'tecnica-hibrida', name: 'Técnica híbrida' },
]

export const MANTENIMIENTOS_TECHNIQUES = [
  { id: 'mantenimiento-acrilico', name: 'Mantenimiento de Acrílico' },
  { id: 'mantenimiento-rubber-gel', name: 'Mantenimiento de Rubber Gel' },
  { id: 'mantenimiento-builder-gel', name: 'Mantenimiento de Builder Gel' },
  { id: 'mantenimiento-polygel', name: 'Mantenimiento de Polygel' },
]

export const WITH_LENGTH_TECHNIQUES = [
  { id: 'acrilico', name: 'Acrílico' },
  { id: 'builder-gel', name: 'Builder Gel' },
  { id: 'polygel', name: 'Polygel' },
  { id: 'esculpidas-acrilico', name: 'Esculpidas en acrílico' },
  { id: 'esculpidas-polygel', name: 'Esculpidas en polygel' },
]

const DECORATION_PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=700&q=80'

export const SIMPLE_DECORATION_OPTIONS = [
  { name: 'Efecto Espejo', image: '/efecto-espejo.jpeg' },
  { name: 'Efecto Aurora', image: '/efecto-aurora.jpeg' },
  { name: 'Efecto Azúcar', image: '/efecto-azucar.jpeg' },
  { name: 'Carey', image: '/carey.jpeg' },
  { name: 'Blooming', image: '/blooming.jpeg' },
  { name: 'Polka dots', image: '/polka-dots.jpeg' },
  { name: 'Mármol', image: '/marmol.jpeg' },
  { name: 'Ojo de gato', image: '/ojo-de-gato.jpeg' },
  { name: 'Relieve', image: '/relieve.jpeg' },
  { name: '3D', image: '/3D.jpeg' },
  { name: 'Francesas (4)', image: '/francesas.jpeg' },
/*   { name: 'Nail art simple', image: DECORATION_PLACEHOLDER_IMAGE },
  { name: 'Nail art complicado', image: DECORATION_PLACEHOLDER_IMAGE }, */
  { name: 'Encapsulado', image: '/encapsulado.jpeg' },
  { name: 'Naturaleza muerta', image: '/naturaleza-muerta.jpeg' },
  { name: 'Dijes', image: '/dijes.jpeg' },
  { name: 'Baby boomer', image: DECORATION_PLACEHOLDER_IMAGE },
]

export const FULL_DESIGN_OPTIONS = [
  { name: 'Diseño de piedras', image: '/diseño-de-piedras-simples.jpeg' },
  { name: 'Diseño de piedras elaborado', image: '/diseño-de-piedras-completo.jpeg' },
/*   { name: 'Diseño completo Ojo de gato', image: DECORATION_PLACEHOLDER_IMAGE },
  { name: 'Diseño completo de francesas', image: DECORATION_PLACEHOLDER_IMAGE },
  { name: 'Diseño completo de color entero', image: DECORATION_PLACEHOLDER_IMAGE }, */
]

export const DECORATION_OPTIONS = [...SIMPLE_DECORATION_OPTIONS, ...FULL_DESIGN_OPTIONS]

export const CARE_OPTIONS = [
  {
    id: 'change-shape',
    kind: 'change-shape',
    name: 'Cambio de forma',
    description: 'Ajuste de forma de la uña.',
  },
  {
    id: 'retiro-acrilico',
    kind: 'retiro',
    value: 'acrilico',
    name: 'Retiro Acrílico',
    description: 'Retiro de sistema acrílico.',
  },
  {
    id: 'retiro-gel',
    kind: 'retiro',
    value: 'gel',
    name: 'Retiro Gel',
    description: 'Retiro de sistema en gel.',
  },
  {
    id: 'retiro-gel-semipermanente',
    kind: 'retiro',
    value: 'gel-semipermanente',
    name: 'Retiro Gel semipermanente',
    description: 'Retiro de sistema en gel semipermanente.',
  },
  {
    id: 'reposicion-acrilico',
    kind: 'reposicion',
    value: 'acrilico',
    name: 'Reposición Acrílico',
    description: 'Reposición por una en sistema acrílico.',
  },
  {
    id: 'reposicion-polygel',
    kind: 'reposicion',
    value: 'polygel',
    name: 'Reposición Polygel',
    description: 'Reposición por una en sistema polygel.',
  },
  {
    id: 'reposicion-builder-gel',
    kind: 'reposicion',
    value: 'builder-gel',
    name: 'Reposición Builder Gel',
    description: 'Reposición por una en sistema Builder Gel.',
  }

]

export const PRICE_TABLES = {
  PRICES_NO_LENGTH: {
    'Manicure tradicional (Manos)': 20,
    'Manicure tradicional (Pies)': 30,
    'Gel semipermanente (Manos)': 35,
    'Gel semipermanente (Pies)': 60,
    'Rubber Gel': 50,
    'Kapping de acrílico': 40,
    'Kapping de polygel': 45,
    'Técnica híbrida': 60,
    'Mantenimiento de Acrílico': 45,
    'Mantenimiento de Rubber Gel': 35,
    'Mantenimiento de Builder Gel': 55,
    'Mantenimiento de Polygel': 55,
  },
  PRICES_WITH_LENGTH: {
    'Acrílico': { 1: 60, 2: 60, 3: 70, 4: 80, 5: 90, 6: 100 },
    'Builder Gel': { 1: 70, 2: 70, 3: 70 },
    'Polygel': { 1: 70, 2: 70, 3: 80, 4: 90, 5: 100, 6: 110 },
    'Esculpidas en acrílico': { 1: 70, 2: 70, 3: 80, 4: 90, 5: 100, 6: 110 },
    'Esculpidas en polygel': { 1: 80, 2: 80, 3: 90, 4: 100, 5: 110, 6: 120 },
  },
  DECORATION_PRICES: {
    'Efecto Espejo': 3,
    'Efecto Aurora': 3,
    'Efecto Azúcar': 3,
    'Carey': 15,
    'Blooming': 5,
    'Polka dots': 5,
    'Mármol': 5,
    'Ojo de gato': 5,
    'Relieve': 10,
    '3D': 10,
    'Francesas (4)': 10,
    'Nail art simple': 10,
    'Nail art complicado': 20,
    'Encapsulado': 5,
    'Naturaleza muerta': 5,
    'Dijes': 15,
    'Baby boomer': 10,
    'Diseño de piedras': 10,
    'Diseño de piedras elaborado': 20,
    'Diseño completo Ojo de gato': 20,
    'Diseño completo de francesas': 15,
    'Diseño completo de color entero': 10,
  },
  CHANGE_SHAPE_PRICE: 10,
  RETIRO_PRICES: {
    none: 0,
    'acrilico': 20,
    'gel': 15,
    'gel-semipermanente': 10,
  },
  REPOSICION_PRICES: {
    none: 0,
    'acrilico': 6,
    'polygel': 7,
    'builder-gel': 70,
  },
  NON_COMBINABLE_DECORATIONS: {
    'Espejo': [],
    'Aurora': [],
    'Azúcar': [],
    'Carey': [],
    'Blooming': [],
    'Polka dots': [],
    'Mármol': [],
    'Ojo de gato': [],
    'Relieve': [],
    '3D': [],
    'Francesas (4)': [],
    'Nail art simple': [],
    'Nail art complicado': [],
    'Encapsulado': [],
    'Naturaleza muerta': [],
    'Dijes': [],
    'Baby boomer': [],
    'Diseño de piedras': [],
    'Diseño de piedras elaborado': [],
    'Diseño completo Ojo de gato': [],
    'Diseño completo de francesas': [],
    'Diseño completo de color entero': [],
  },
}
