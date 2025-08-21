import { GridConfig } from './types'

// Configuration par défaut de la grille
export const DEFAULT_GRID_CONFIG: GridConfig = {
  size: 32,
  minPixelSize: 16,
  maxPixelSize: 48,
  defaultZoom: 1.33, // Base immuable (niveau 4)
  zoomStep: 0.2,
  panSensitivity: 1.5,
}

// Styles CSS pour la grille
export const GRID_STYLES = {
  container: {
    base: "w-full h-full flex justify-center items-center overflow-hidden",
    bubble: "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl shadow-2xl border-4 border-white/20 backdrop-blur-sm p-8",
  },
  grid: {
    base: "grid gap-0 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/40",
    pixel: "transition-all duration-200 ease-out",
    selected: "ring-4 ring-blue-500 ring-offset-2 shadow-2xl z-20",
    hover: "hover:scale-105 hover:shadow-lg",
  },
  pixel: {
    empty: "bg-transparent border border-gray-200/40",
    occupied: "shadow-lg border-2 border-white/70",
  }
}

// Breakpoints pour la responsivité
export const GRID_BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
  large: 1920,
}

// Calculs de taille adaptatifs
export const calculatePixelSize = (screenWidth: number, zoom: number = 1): number => {
  const availableWidth = (screenWidth * 2) / 3 - 80 // 2/3 de l'écran moins les marges
  const baseSize = availableWidth / DEFAULT_GRID_CONFIG.size
  const zoomedSize = baseSize * zoom
  return Math.max(
    DEFAULT_GRID_CONFIG.minPixelSize,
    Math.min(DEFAULT_GRID_CONFIG.maxPixelSize, zoomedSize)
  )
}
