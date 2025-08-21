import { ZoomControls } from './ZoomControls'
import { DisplayControls } from './DisplayControls'

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
  return (
    <div className="space-y-4">
      <ZoomControls zoom={zoom} onZoomChange={onZoomChange} />
      
      <div className="border-t pt-4">
        <DisplayControls 
          showHeatmap={showHeatmap} 
          onToggleHeatmap={onToggleHeatmap} 
        />
      </div>
    </div>
  )
}
