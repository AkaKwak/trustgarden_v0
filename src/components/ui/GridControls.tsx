import { Button } from './button'
import { Slider } from './slider'

interface GridControlsProps {
  zoom: number
  onZoomChange: (zoom: number) => void
  showHeatmap: boolean
  onToggleHeatmap: () => void
}

export function GridControls({ 
  zoom, 
  onZoomChange, 
  showHeatmap, 
  onToggleHeatmap 
}: GridControlsProps) {
  const handleResetZoom = () => {
    onZoomChange(4) // Reset à la base immuable
  }

  const handleFullView = () => {
    onZoomChange(1) // Vue complète temporaire
  }

  return (
    <div className="space-y-4">
      {/* Contrôles de zoom simplifiés */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Navigation de la Carte</span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullView}
              className="text-xs"
            >
              🔍 Vue complète
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetZoom}
              className="text-xs"
            >
              🎯 Base
            </Button>
          </div>
        </div>
        
        <div className="text-center">
          <span className="text-xs text-gray-500">
            {zoom === 1 && '🔍 Vue complète (Tous les pixels)'}
            {zoom === 4 && '🎯 Vue de base (Écran fixe)'}
            {zoom > 4 && `🔍 Zoom: ${Math.round((zoom / 4) * 100)}%`}
            {zoom > 1 && zoom < 4 && `🔍 Zoom: ${Math.round((zoom / 4) * 100)}%`}
          </span>
        </div>
      </div>

      {/* Séparateur */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Affichage</span>
          <Button
            variant={showHeatmap ? "default" : "outline"}
            size="sm"
            onClick={onToggleHeatmap}
            className="text-xs"
          >
            {showHeatmap ? '🌡️ Heatmap' : '🔲 Grille'}
          </Button>
        </div>
      </div>
    </div>
  )
}
