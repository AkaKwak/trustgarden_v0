import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { formatUnits } from 'viem'
import { getPixelEmoji, getPixelLabel, getPixelDescription } from '../../utils/signalTypes'

interface PixelStatusDisplayProps {
  selectedPixel: { x: number; y: number } | null
  pixelData: any
}

// Composant pour afficher le statut du pixel sélectionné
export function PixelStatusDisplay({ selectedPixel, pixelData }: PixelStatusDisplayProps) {
  if (!selectedPixel) {
    return (
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-center text-lg">🌱 Signal Garden</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-600">
            <div className="text-4xl mb-4">🎯</div>
            <p className="text-sm">Cliquez sur un pixel pour commencer le staking</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full flex-shrink-0">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-center text-lg">
          Pixel ({selectedPixel.x}, {selectedPixel.y})
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* État actuel du pixel */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-3xl mb-2">
            {pixelData?.dominantType ? getPixelEmoji(pixelData.dominantType) : '⚪'}
          </div>
          <div className="font-semibold text-gray-800">
            {pixelData?.dominantType ? getPixelLabel(pixelData.dominantType) : 'Vide'}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {pixelData?.dominantType ? getPixelDescription(pixelData.dominantType) : 'Pixel disponible'}
          </div>
          {pixelData?.total && pixelData.total > 0n && (
            <div className="text-sm text-gray-500 mt-2 font-medium">
              Stake: {formatUnits(pixelData.total, 18)} TTRUST
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
