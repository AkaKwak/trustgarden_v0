import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { PixelType } from '../../utils/signalTypes'

interface PixelTypeSelectorProps {
  onStake: (type: PixelType) => void
  isLoading: boolean
  trustAmount: string
}

// Composant pour la sélection du type de pixel
export function PixelTypeSelector({
  onStake,
  isLoading,
  trustAmount
}: PixelTypeSelectorProps) {
  const pixelTypes = [
    { type: PixelType.ROCKS, emoji: '🪨', label: 'Rocher', color: 'bg-gray-600 hover:bg-gray-700' },
    { type: PixelType.TREES, emoji: '🌳', label: 'Arbre', color: 'bg-green-600 hover:bg-green-700' },
    { type: PixelType.WATER, emoji: '🌊', label: 'Eau', color: 'bg-blue-600 hover:bg-blue-700' },
    { type: PixelType.FLOWERS, emoji: '🌸', label: 'Fleur', color: 'bg-pink-600 hover:bg-pink-700' },
    { type: PixelType.GRASS, emoji: '🌱', label: 'Herbe', color: 'bg-green-400 hover:bg-green-500' },
    { type: PixelType.SAND, emoji: '🏖️', label: 'Sable', color: 'bg-yellow-600 hover:bg-yellow-700' },
    { type: PixelType.BUSHES, emoji: '🌿', label: 'Buisson', color: 'bg-green-800 hover:bg-green-900' },
    { type: PixelType.MUSHROOMS, emoji: '🍄', label: 'Champignon', color: 'bg-red-600 hover:bg-red-700' }
  ]

  return (
    <Card className="w-full flex-1">
      <CardContent className="pt-6">
        {/* Boutons de plantation */}
        <div className="grid grid-cols-2 gap-2 h-full">
          {pixelTypes.map(({ type, emoji, label, color }) => (
            <Button
              key={type}
              onClick={() => onStake(type)}
              disabled={isLoading || !trustAmount}
              className={`${color} h-12 text-sm`}
            >
              {emoji} {label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
