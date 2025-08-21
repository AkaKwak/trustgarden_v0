import { Button } from './button'
import { GRID_CONFIG } from '../grid/constants'

interface ZoomControlsProps {
  zoom: number
  onZoomChange: (zoom: number) => void
}

export function ZoomControls({ zoom, onZoomChange }: ZoomControlsProps) {
  const zoomIn = () => {
    const newZoom = Math.min(zoom * 1.2, GRID_CONFIG.MAX_ZOOM)
    onZoomChange(newZoom)
  }

  const zoomOut = () => {
    const newZoom = Math.max(zoom / 1.2, GRID_CONFIG.MIN_ZOOM)
    onZoomChange(newZoom)
  }

  const resetZoom = () => {
    onZoomChange(GRID_CONFIG.DEFAULT_ZOOM)
  }

  const getZoomLabel = () => {
    if (zoom === GRID_CONFIG.DEFAULT_ZOOM) return 'Base (100%)'
    if (zoom < GRID_CONFIG.DEFAULT_ZOOM) return `Zoom out (${Math.round(zoom)}%)`
    return `Zoom in (${Math.round(zoom)}%)`
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Navigation</span>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={zoomOut}
            disabled={zoom <= GRID_CONFIG.MIN_ZOOM}
            className="text-xs"
          >
            🔍−
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetZoom}
            className="text-xs"
          >
            🎯 Base
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={zoomIn}
            disabled={zoom >= GRID_CONFIG.MAX_ZOOM}
            className="text-xs"
          >
            🔍+
          </Button>
        </div>
      </div>
      
      <div className="text-center">
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {getZoomLabel()}
        </span>
      </div>
    </div>
  )
}
