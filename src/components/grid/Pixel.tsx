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

  return (
    <Rect
      x={x * size}
      y={y * size}
      width={size}
      height={size}
      fill={getPixelColor(pixelData.dominantType)}
      stroke={hasContent ? '#fff' : '#e5e7eb'}
      strokeWidth={hasContent ? 2 : 1}
      onClick={() => onClick(x, y)}
      onMouseEnter={(e) => {
        if (!isSelected && SELECTION_CONFIG.hover.enabled) {
          e.target.scale({ 
            x: SELECTION_CONFIG.hover.scale, 
            y: SELECTION_CONFIG.hover.scale 
          })
          e.target.getStage().batchDraw()
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected && SELECTION_CONFIG.hover.enabled) {
          e.target.scale({ x: 1, y: 1 })
          e.target.getStage().batchDraw()
        }
      }}
      cornerRadius={1}
    />
  )
}
