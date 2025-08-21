import { PixelType } from '../../utils/signalTypes'

// Types pour la grille
export interface GridPosition {
  x: number
  y: number
}

export interface GridPixelData {
  dominantType: PixelType
  stakeAmount?: bigint
  owner?: string
}

export interface GridState {
  data: Record<string, GridPixelData>
  selectedPixel: GridPosition | null
  zoom: number
  pan: { x: number; y: number }
}

// Props pour les composants
export interface GridContainerProps {
  children: React.ReactNode
  gridSize: number
  pixelSize: number
  className?: string
}

export interface GridPixelProps {
  x: number
  y: number
  pixelData: GridPixelData
  pixelSize: number
  isSelected: boolean
  onClick: (x: number, y: number) => void
  className?: string
}

export interface GridCanvasProps {
  gridData: Record<string, GridPixelData>
  onPixelClick: (x: number, y: number) => void
  selectedPixel: GridPosition | null
  zoom: number
  pan: { x: number; y: number }
  onPanChange: (pan: { x: number; y: number }) => void
  onZoomChange: (zoom: number) => void
}

// Configuration de la grille
export interface GridConfig {
  size: number // 32x32
  minPixelSize: number
  maxPixelSize: number
  defaultZoom: number
  zoomStep: number
  panSensitivity: number
}
