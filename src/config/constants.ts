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

export const DEMO_PIXELS = [
  { x: 5, y: 5, type: 'ROCKS', amount: '100' },
  { x: 8, y: 8, type: 'TREES', amount: '150' },
  { x: 12, y: 12, type: 'WATER', amount: '200' },
] as const
