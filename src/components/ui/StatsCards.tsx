import { Card, CardContent } from './card'

interface StatsCardsProps {
  gridStats: {
    rocksPixels: number
    treesPixels: number
    waterPixels: number
    flowersPixels: number
    grassPixels: number
    sandPixels: number
    bushesPixels: number
    mushroomsPixels: number
  }
}

export function StatsCards({ gridStats }: StatsCardsProps) {
  const stats = [
    { label: 'Rochers', count: gridStats.rocksPixels, emoji: '🪨', color: 'text-gray-600' },
    { label: 'Arbres', count: gridStats.treesPixels, emoji: '🌳', color: 'text-green-600' },
    { label: 'Eau', count: gridStats.waterPixels, emoji: '🌊', color: 'text-blue-600' },
    { label: 'Fleurs', count: gridStats.flowersPixels, emoji: '🌸', color: 'text-pink-600' },
    { label: 'Herbe', count: gridStats.grassPixels, emoji: '🌱', color: 'text-green-400' },
    { label: 'Sable', count: gridStats.sandPixels, emoji: '🏖️', color: 'text-yellow-600' },
    { label: 'Buissons', count: gridStats.bushesPixels, emoji: '🌿', color: 'text-green-800' },
    { label: 'Champignons', count: gridStats.mushroomsPixels, emoji: '🍄', color: 'text-red-600' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
      {stats.map((stat) => (
        <Card key={stat.label} className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 text-center">
            <div className={`text-xl font-bold ${stat.color}`}>
              {stat.count}
            </div>
            <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
              <span>{stat.emoji}</span>
              <span className="hidden sm:inline">{stat.label}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
