import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Input } from './input'
import { Label } from './label'
import { formatUnits } from 'viem'
import { PixelType, getPixelEmoji, getPixelLabel, getPixelDescription } from '../../utils/signalTypes'

interface PlantingPanelProps {
  selectedPixel: { x: number; y: number } | null
  onStake: (type: PixelType) => void
  trustAmount: string
  setTrustAmount: (amount: string) => void
  isLoading: boolean
  trustBalance: bigint
  allowance: bigint
  onApprove: () => void
  pixelData: any
}

export function PlantingPanel({
  selectedPixel,
  onStake,
  trustAmount,
  setTrustAmount,
  isLoading,
  trustBalance,
  allowance,
  onApprove,
  pixelData
}: PlantingPanelProps) {
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

  const needsApproval = allowance < parseFloat(trustAmount || '0')

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-center text-lg">
          Pixel ({selectedPixel.x}, {selectedPixel.y})
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
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

        {/* Montant */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">Montant TTRUST</Label>
          <Input
            id="amount"
            type="number"
            value={trustAmount}
            onChange={(e) => setTrustAmount(e.target.value)}
            placeholder="0.0"
            className="text-center"
          />
        </div>

        {/* Boutons de plantation */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          <Button
            onClick={() => onStake(PixelType.ROCKS)}
            disabled={isLoading || !trustAmount}
            className="bg-gray-600 hover:bg-gray-700 h-12 text-sm"
          >
            🪨 Rocher
          </Button>
          <Button
            onClick={() => onStake(PixelType.TREES)}
            disabled={isLoading || !trustAmount}
            className="bg-green-600 hover:bg-green-700 h-12 text-sm"
          >
            🌳 Arbre
          </Button>
          <Button
            onClick={() => onStake(PixelType.WATER)}
            disabled={isLoading || !trustAmount}
            className="bg-blue-600 hover:bg-blue-700 h-12 text-sm"
          >
            🌊 Eau
          </Button>
          <Button
            onClick={() => onStake(PixelType.FLOWERS)}
            disabled={isLoading || !trustAmount}
            className="bg-pink-600 hover:bg-pink-700 h-12 text-sm"
          >
            🌸 Fleur
          </Button>
          <Button
            onClick={() => onStake(PixelType.GRASS)}
            disabled={isLoading || !trustAmount}
            className="bg-green-400 hover:bg-green-500 h-12 text-sm"
          >
            🌱 Herbe
          </Button>
          <Button
            onClick={() => onStake(PixelType.SAND)}
            disabled={isLoading || !trustAmount}
            className="bg-yellow-600 hover:bg-yellow-700 h-12 text-sm"
          >
            🏖️ Sable
          </Button>
          <Button
            onClick={() => onStake(PixelType.BUSHES)}
            disabled={isLoading || !trustAmount}
            className="bg-green-800 hover:bg-green-900 h-12 text-sm"
          >
            🌿 Buisson
          </Button>
          <Button
            onClick={() => onStake(PixelType.MUSHROOMS)}
            disabled={isLoading || !trustAmount}
            className="bg-red-600 hover:bg-red-700 h-12 text-sm"
          >
            🍄 Champignon
          </Button>
        </div>

        {/* Bouton d'approbation si nécessaire */}
        {needsApproval && (
          <Button
            onClick={onApprove}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Approuver TTRUST
          </Button>
        )}

        {/* Solde */}
        <div className="text-center text-sm text-gray-500 pt-2 border-t">
          Solde: {formatUnits(trustBalance, 18)} TTRUST
        </div>
      </CardContent>
    </Card>
  )
}
