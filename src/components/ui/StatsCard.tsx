import { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  color?: 'rock' | 'water' | 'trees' | 'flowers' | 'grass' | 'sand' | 'bushes' | 'mushrooms' | 'neutral'
  className?: string
}

export function StatsCard({ title, value, icon, color = 'neutral', className = '' }: StatsCardProps) {
  const getColorStyle = () => {
    const colors = {
      rock: 'var(--accent-rock)',
      water: 'var(--accent-water)',
      trees: 'var(--accent-trees)',
      flowers: 'var(--accent-flowers)',
      grass: 'var(--accent-grass)',
      sand: 'var(--accent-sand)',
      bushes: 'var(--accent-bushes)',
      mushrooms: 'var(--accent-mushrooms)',
      neutral: 'var(--neutral-100)'
    }
    return colors[color]
  }

  return (
    <div className="rounded-xl p-3 transition-all duration-200 hover:scale-105 hover:shadow-md" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-base" style={{ backgroundColor: getColorStyle(), boxShadow: 'var(--shadow-sm)' }}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {value}
          </p>
          <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
            {title}
          </p>
        </div>
      </div>
    </div>
  )
}
