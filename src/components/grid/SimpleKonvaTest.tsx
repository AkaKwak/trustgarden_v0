import { Stage, Layer, Rect } from 'react-konva'
import { useState } from 'react'
import { PixelType, getPixelColor } from '../../utils/signalTypes'

// Données de test simples
const testData = {
  '5-5': { dominantType: PixelType.ROCKS },
  '10-10': { dominantType: PixelType.TREES },
  '15-15': { dominantType: PixelType.WATER },
}

export function SimpleKonvaTest() {
  const [selectedPixel, setSelectedPixel] = useState<string | null>(null)
  const gridSize = 32
  const pixelSize = 20
  const stageSize = gridSize * pixelSize

  const handlePixelClick = (x: number, y: number) => {
    const key = `${x}-${y}`
    setSelectedPixel(key)
    console.log(`Pixel clicked: (${x}, ${y})`)
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">🧪 Test Konva Simple - Grille {gridSize}x{gridSize}</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-4">
        <Stage width={stageSize} height={stageSize}>
          <Layer>
            {Array.from({ length: gridSize }, (_, y) =>
              Array.from({ length: gridSize }, (_, x) => {
                const key = `${x}-${y}`
                const pixelData = testData[key] || { dominantType: PixelType.EMPTY }
                const isSelected = selectedPixel === key
                const hasContent = pixelData.dominantType !== PixelType.EMPTY

                return (
                  <Rect
                    key={key}
                    x={x * pixelSize}
                    y={y * pixelSize}
                    width={pixelSize}
                    height={pixelSize}
                    fill={getPixelColor(pixelData.dominantType)}
                    stroke={hasContent ? '#fff' : '#e5e7eb'}
                    strokeWidth={hasContent ? 2 : 1}
                    onClick={() => handlePixelClick(x, y)}
                    onMouseEnter={(e) => {
                      if (hasContent) {
                        e.target.scale({ x: 1.1, y: 1.1 })
                        e.target.getStage().batchDraw()
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (hasContent) {
                        e.target.scale({ x: 1, y: 1 })
                        e.target.getStage().batchDraw()
                      }
                    }}
                    {...(isSelected && {
                      stroke: '#3B82F6',
                      strokeWidth: 3,
                      shadowBlur: 10,
                      shadowColor: '#3B82F6',
                    })}
                  />
                )
              })
            )}
          </Layer>
        </Stage>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Cliquez sur les pixels colorés pour les sélectionner
        </p>
        {selectedPixel && (
          <p className="text-sm text-blue-600 mt-2">
            Pixel sélectionné: {selectedPixel}
          </p>
        )}
      </div>
    </div>
  )
}
