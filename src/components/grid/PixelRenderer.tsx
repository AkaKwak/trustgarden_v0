import { Layer, Rect } from 'react-konva'
import { PixelType, getPixelColor } from '../../utils/signalTypes'

interface PixelRendererProps {
  gridData: Record<string, any>
  pixelSize: number
  selectedPixel: { x: number; y: number } | null
  onPixelClick: (x: number, y: number) => void
}

// Composant pour le rendu des pixels
export function PixelRenderer({
  gridData,
  pixelSize,
  selectedPixel,
  onPixelClick
}: PixelRendererProps) {
  return (
    <Layer>
      {/* Grille de pixels */}
      {Array.from({ length: 32 }, (_, y) =>
        Array.from({ length: 32 }, (_, x) => {
          const key = `${x}-${y}`
          const pixelData = gridData[key] || { dominantType: PixelType.EMPTY }
          const isSelected = selectedPixel?.x === x && selectedPixel?.y === y
          const dominantType = pixelData?.dominantType || PixelType.EMPTY
          const hasContent = dominantType !== PixelType.EMPTY

          return (
            <Rect
              key={key}
              x={x * pixelSize}
              y={y * pixelSize}
              width={pixelSize}
              height={pixelSize}
              fill={getPixelColor(dominantType)}
              stroke={hasContent ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.1)'}
              strokeWidth={hasContent ? 2 : 1}
              cornerRadius={pixelSize > 20 ? 2 : 0}
              onClick={() => {
                console.log(`Click sur pixel: (${x}, ${y})`)
                onPixelClick(x, y)
              }}
              onMouseEnter={(e) => {
                const target = e.target
                target.scale({ x: 1.05, y: 1.05 })
                target.shadowBlur(10)
                target.shadowColor('rgba(0,0,0,0.3)')
                e.target.getStage().batchDraw()
              }}
              onMouseLeave={(e) => {
                const target = e.target
                target.scale({ x: 1, y: 1 })
                target.shadowBlur(0)
                e.target.getStage().batchDraw()
              }}
              {...(isSelected && {
                stroke: '#3B82F6',
                strokeWidth: 3,
                shadowBlur: 15,
                shadowColor: '#3B82F6',
              })}
            />
          )
        })
      )}
    </Layer>
  )
}
