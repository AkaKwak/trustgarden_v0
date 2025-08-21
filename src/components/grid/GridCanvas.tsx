import { PixelType } from '../../utils/signalTypes'
import { GridCanvasProps } from './types'
import { DEFAULT_GRID_CONFIG } from './constants'
import { useGridCanvas } from '../../hooks/useGridCanvas'
import { GridContainer } from './GridContainer'
import { GridPixel } from './GridPixel'

export function GridCanvas({
  gridData,
  onPixelClick,
  selectedPixel,
  zoom: externalZoom,
  pan: externalPan,
  onPanChange,
  onZoomChange,
}: GridCanvasProps) {
  const {
    zoom,
    pan,
    pixelSize,
    gridSize,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    containerRef,
  } = useGridCanvas({
    config: {
      defaultZoom: externalZoom || 1,
    },
    onZoomChange,
  })

  // Synchroniser avec l'état externe
  const currentZoom = externalZoom !== undefined ? externalZoom : zoom
  const currentPan = externalPan !== undefined ? externalPan : pan

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Conteneur de la grille avec transformation */}
      <div
        className="w-full h-full flex justify-center items-center"
        style={{
          transform: `translate(${currentPan.x}px, ${currentPan.y}px) scale(${currentZoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        <GridContainer gridSize={gridSize} pixelSize={pixelSize}>
          {Array.from({ length: DEFAULT_GRID_CONFIG.size }, (_, y) =>
            Array.from({ length: DEFAULT_GRID_CONFIG.size }, (_, x) => {
              const key = `${x}-${y}`
              const pixelData = gridData[key] || { dominantType: PixelType.EMPTY }
              const isSelected = selectedPixel?.x === x && selectedPixel?.y === y
              
              return (
                <GridPixel
                  key={key}
                  x={x}
                  y={y}
                  pixelData={pixelData}
                  pixelSize={pixelSize}
                  isSelected={isSelected}
                  onClick={onPixelClick}
                />
              )
            })
          )}
        </GridContainer>
      </div>

      {/* Indicateur de navigation simple */}
      {isDragging && (
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg p-2 text-sm font-medium">
          🖱️ Navigation...
        </div>
      )}
    </div>
  )
}
