import { GridCanvas, GridPosition } from '../grid'

interface ResponsiveGridProps {
  gridData: Record<string, any>
  onPixelClick: (x: number, y: number) => void
  zoom: number
  selectedPixel: { x: number; y: number } | null
  onZoomChange?: (zoom: number) => void
}

export function ResponsiveGrid({
  gridData,
  onPixelClick,
  zoom,
  selectedPixel,
  onZoomChange
}: ResponsiveGridProps) {
  // Convertir le zoom de 1-10 vers 0.5-3 (vue complète à zoom max)
  const convertZoom = (zoomLevel: number) => {
    // zoom 1 = 0.5 (vue complète), zoom 4 = 1.33 (base), zoom 10 = 3
    if (zoomLevel === 1) return 0.5 // Vue complète
    if (zoomLevel === 4) return 1.33 // Base immuable
    if (zoomLevel > 4) {
      return 1.33 + (zoomLevel - 4) * (1.67 / 6) // Zoom au-dessus de la base
    }
    // Entre 1 et 4 (interpolation)
    return 0.5 + (zoomLevel - 1) * (0.83 / 3)
  }

  // Convertir le zoom de 0.5-3 vers 1-10
  const convertZoomBack = (zoomLevel: number) => {
    // 0.5 = 1 (vue complète), 1.33 = 4 (base), 3 = 10
    if (zoomLevel <= 0.5) return 1 // Vue complète
    if (Math.abs(zoomLevel - 1.33) < 0.1) return 4 // Base immuable
    if (zoomLevel > 1.33) {
      return Math.round(4 + (zoomLevel - 1.33) * (6 / 1.67)) // Zoom au-dessus de la base
    }
    // Entre 0.5 et 1.33 (interpolation)
    return Math.round(1 + (zoomLevel - 0.5) * (3 / 0.83))
  }

  const internalZoom = convertZoom(zoom)

  return (
    <GridCanvas
      gridData={gridData}
      onPixelClick={onPixelClick}
      selectedPixel={selectedPixel as GridPosition}
      zoom={internalZoom}
      pan={{ x: 0, y: 0 }}
      onPanChange={() => {}} // Géré en interne par GridCanvas
      onZoomChange={(newZoom) => {
        if (onZoomChange) {
          onZoomChange(convertZoomBack(newZoom))
        }
      }}
    />
  )
}
