// Constantes pour l'application Signal Garden

export const GRID_CONSTANTS = {
  SIZE: 64,
  MIN_PIXEL_SIZE: 6,
  MAX_PIXEL_SIZE: 20,
  ZOOM_MULTIPLIER: 0.1,
} as const

export const SCREEN_BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
  LARGE_DESKTOP: 1920,
  ULTRA_WIDE: 2560,
} as const

export const PIXEL_SIZES = {
  [SCREEN_BREAKPOINTS.MOBILE]: 6,
  [SCREEN_BREAKPOINTS.TABLET]: 8,
  [SCREEN_BREAKPOINTS.DESKTOP]: 10,
  [SCREEN_BREAKPOINTS.LARGE_DESKTOP]: 12,
  [SCREEN_BREAKPOINTS.ULTRA_WIDE]: 16,
} as const

export const ZOOM_LEVELS = {
  MIN: 1,
  MAX: 10,
  DEFAULT: 6,
} as const

export const TOKEN_DECIMALS = 18

// Types de pixels alignés avec le smart contract PixelGarden
export const PIXEL_TYPES = {
  EMPTY: 0,    // Blanc - Pixel vide
  SIGNAL: 1,   // Rouge - Assertion simple
  ATOM: 2,     // Jaune - Donnée structurée
  TRIPLE: 3,   // Vert - Relation complexe
} as const

export const PIXEL_TYPE_NAMES = {
  [PIXEL_TYPES.EMPTY]: 'EMPTY',
  [PIXEL_TYPES.SIGNAL]: 'SIGNAL',
  [PIXEL_TYPES.ATOM]: 'ATOM',
  [PIXEL_TYPES.TRIPLE]: 'TRIPLE',
} as const

export const PIXEL_COLORS = {
  [PIXEL_TYPES.EMPTY]: '#FFFFFF',   // Blanc
  [PIXEL_TYPES.SIGNAL]: '#FF0000',  // Rouge
  [PIXEL_TYPES.ATOM]: '#FFFF00',    // Jaune
  [PIXEL_TYPES.TRIPLE]: '#00FF00',  // Vert
} as const

export const DEMO_PIXELS = [
  { x: 5, y: 5, type: PIXEL_TYPES.SIGNAL, amount: '100' },
  { x: 8, y: 8, type: PIXEL_TYPES.ATOM, amount: '150' },
  { x: 12, y: 12, type: PIXEL_TYPES.TRIPLE, amount: '200' },
] as const
