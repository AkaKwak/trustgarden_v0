import { PixelType, getPixelColor, getPixelLabel } from '../../utils/signalTypes'
import { GridPixelProps } from './types'
import { GRID_STYLES } from './constants'

export function GridPixel({
  x,
  y,
  pixelData,
  pixelSize,
  isSelected,
  onClick,
  className = ""
}: GridPixelProps) {
  const dominantType = pixelData?.dominantType || PixelType.EMPTY
  const hasContent = dominantType !== PixelType.EMPTY

  const pixelClasses = [
    GRID_STYLES.grid.pixel,
    GRID_STYLES.grid.hover,
    hasContent ? GRID_STYLES.pixel.occupied : GRID_STYLES.pixel.empty,
    isSelected ? GRID_STYLES.grid.selected : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div
      className={pixelClasses}
      style={{
        backgroundColor: getPixelColor(dominantType),
        width: `${pixelSize}px`,
        height: `${pixelSize}px`,
        borderRadius: pixelSize > 20 ? '4px' : '2px',
      }}
      onClick={(e) => {
        e.stopPropagation() // Empêcher la propagation au conteneur
        console.log(`Click sur pixel: (${x}, ${y})`)
        onClick(x, y)
      }}
      onMouseDown={(e) => {
        e.stopPropagation() // Empêcher le pan lors du clic sur pixel
      }}
      title={`Pixel (${x}, ${y}) - ${getPixelLabel(dominantType)}`}
    />
  )
}
