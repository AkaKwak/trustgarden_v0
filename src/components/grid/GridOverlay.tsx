import { Layer, Rect } from 'react-konva'

interface GridOverlayProps {
  selectedPixel: { x: number; y: number } | null
  pixelSize: number
}

// Composant pour les overlays de la grille (sélection, etc.)
export function GridOverlay({ selectedPixel, pixelSize }: GridOverlayProps) {
  if (!selectedPixel) return null

  return (
    <Layer>
      {/* Overlay de sélection */}
      <Rect
        x={selectedPixel.x * pixelSize - 2}
        y={selectedPixel.y * pixelSize - 2}
        width={pixelSize + 4}
        height={pixelSize + 4}
        stroke="#3B82F6"
        strokeWidth={2}
        fill="transparent"
        dash={[5, 5]}
        opacity={0.8}
      />
      
      {/* Indicateur de position */}
      <Rect
        x={selectedPixel.x * pixelSize + pixelSize / 4}
        y={selectedPixel.y * pixelSize + pixelSize / 4}
        width={pixelSize / 2}
        height={pixelSize / 2}
        fill="#3B82F6"
        opacity={0.3}
        cornerRadius={2}
      />
    </Layer>
  )
}
