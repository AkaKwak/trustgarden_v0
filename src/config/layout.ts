// Configuration du layout - VERROUILLÉ
export const LAYOUT_CONFIG = {
  // Proportions de l'écran - Optimisé pour 1432x1146
  GRID_SECTION_WIDTH: 'w-2/3', // 2/3 de l'écran pour la grille (954px)
  PANEL_SECTION_WIDTH: 'w-1/3', // 1/3 de l'écran pour le panel (478px)
  
  // Comportement de la grille
  GRID_FILL_MODE: 'maximize', // Utilise la plus grande dimension
  GRID_MAINTAIN_ASPECT: false, // Ne force pas le carré
  
  // Conteneurs - Optimisé pour 1432x1146
  GRID_CONTAINER: 'absolute left-0 top-0 w-2/3 h-full overflow-hidden', // Conteneur de la grille avec overflow caché
  GRID_CANVAS: 'w-full h-full', // Canvas de la grille simple
  
  // Panel de droite - Optimisé pour 1432x1146
  PANEL_CONTAINER: 'absolute right-0 top-0 w-1/3 h-full flex flex-col p-3 space-y-3',
  SCROLL_CONTAINER: 'flex-1 overflow-hidden',
  
  // Responsive - Optimisé pour 1432x1146
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1432, // Nouveau breakpoint pour votre résolution
} as const

// Types pour le layout
export type LayoutMode = 'desktop' | 'tablet' | 'mobile'
export type GridFillMode = 'maximize' | 'fit' | 'square'

// Fonction pour obtenir la configuration selon le mode
export function getLayoutConfig(mode: LayoutMode = 'desktop') {
  return {
    ...LAYOUT_CONFIG,
    mode,
    isMobile: mode === 'mobile',
    isTablet: mode === 'tablet',
    isDesktop: mode === 'desktop',
  }
}
