// Configuration de la grille
export const GRID_CONFIG = {
  SIZE: 32,
  BASE_PIXEL_SIZE: 20, // Plus grand pour mieux remplir l'espace
  MIN_ZOOM: 10, // 10%
  MAX_ZOOM: 500, // 500%
  DEFAULT_ZOOM: 100, // 100%
} as const

// Couleurs de la grille
export const GRID_COLORS = {
  BACKGROUND: '#f8fafc',
  BORDER: '#e5e7eb',
  SELECTED: '#3B82F6',
  EMPTY: '#F8FAFC',
} as const

// Styles de la grille
export const GRID_STYLES = {
  CONTAINER: 'w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-gray-200',
  STAGE: {
    cursor: 'grab',
    backgroundColor: GRID_COLORS.BACKGROUND,
  },
  STAGE_DRAGGING: {
    cursor: 'grabbing',
    backgroundColor: GRID_COLORS.BACKGROUND,
  },
} as const

// Breakpoints pour la responsivité
export const GRID_BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
  large: 1920,
} as const

// Calculs de taille adaptatifs
export const calculatePixelSize = (screenWidth: number, zoom: number = 1): number => {
  const availableWidth = (screenWidth * 2) / 3 - 80 // 2/3 de l'écran moins les marges
  const baseSize = availableWidth / GRID_CONFIG.SIZE
  const zoomedSize = baseSize * zoom
  return Math.max(
    GRID_CONFIG.BASE_PIXEL_SIZE * 0.5, // Min 50% de la taille de base
    Math.min(GRID_CONFIG.BASE_PIXEL_SIZE * 2, zoomedSize) // Max 200% de la taille de base
  )
}
