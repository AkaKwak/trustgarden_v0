// ===== COMPOSANT PIXEL ÉLÉGANT =====

import { Rect } from 'react-konva'
import { PixelType, getPixelColor } from '../../utils/signalTypes'
import { SELECTION_CONFIG } from './selectionConfig'

interface PixelProps {
  x: number
  y: number
  size: number
  pixelData: { dominantType: PixelType }
  isSelected: boolean
  onClick: (x: number, y: number) => void
}

export function Pixel({ 
  x, 
  y, 
  size, 
  pixelData, 
  isSelected, 
  onClick 
}: PixelProps) {
  const hasContent = pixelData.dominantType !== PixelType.EMPTY
  const pixelColor = getPixelColor(pixelData.dominantType)

  return (
    <Rect
      x={x * size}
      y={y * size}
      width={size}
      height={size}
      fill={pixelColor}
      stroke={hasContent ? '#ffffff' : '#e5e7eb'}
      strokeWidth={hasContent ? 1.5 : 1}
      onClick={() => onClick(x, y)}
      onMouseEnter={(e) => {
        if (!isSelected && SELECTION_CONFIG.hover.enabled) {
          e.target.scale({ 
            x: SELECTION_CONFIG.hover.scale, 
            y: SELECTION_CONFIG.hover.scale 
          })
          e.target.shadowBlur(SELECTION_CONFIG.hover.shadowBlur)
          e.target.shadowColor('#0ea5e9')
          e.target.shadowOpacity(0.2)
          e.target.getStage().batchDraw()
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected && SELECTION_CONFIG.hover.enabled) {
          e.target.scale({ x: 1, y: 1 })
          e.target.shadowBlur(0)
          e.target.shadowOpacity(0)
          e.target.getStage().batchDraw()
        }
      }}
      cornerRadius={SELECTION_CONFIG.dimensions.cornerRadius}
      listening={true}
    />
  )
}
