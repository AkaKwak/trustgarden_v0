import { Button } from './button'

interface DisplayControlsProps {
  showHeatmap: boolean
  onToggleHeatmap: () => void
}

export function DisplayControls({ showHeatmap, onToggleHeatmap }: DisplayControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Affichage</span>
      <Button
        variant={showHeatmap ? "default" : "outline"}
        size="sm"
        onClick={onToggleHeatmap}
        className="text-xs"
      >
        {showHeatmap ? '🌡️ Heatmap' : '🔲 Grille'}
      </Button>
    </div>
  )
}
