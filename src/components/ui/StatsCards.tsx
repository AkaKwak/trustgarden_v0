import { StatsCard } from './StatsCard'

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
    { label: 'Rochers', count: gridStats.rocksPixels, icon: '🪨', color: 'rock' as const },
    { label: 'Arbres', count: gridStats.treesPixels, icon: '🌳', color: 'trees' as const },
    { label: 'Eau', count: gridStats.waterPixels, icon: '🌊', color: 'water' as const },
    { label: 'Fleurs', count: gridStats.flowersPixels, icon: '🌸', color: 'flowers' as const },
    { label: 'Herbe', count: gridStats.grassPixels, icon: '🌱', color: 'grass' as const },
    { label: 'Sable', count: gridStats.sandPixels, icon: '🏖️', color: 'sand' as const },
    { label: 'Buissons', count: gridStats.bushesPixels, icon: '🌿', color: 'bushes' as const },
    { label: 'Champignons', count: gridStats.mushroomsPixels, icon: '🍄', color: 'mushrooms' as const },
  ]

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map((stat) => (
        <StatsCard
          key={stat.label}
          title={stat.label}
          value={stat.count}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  )
}
