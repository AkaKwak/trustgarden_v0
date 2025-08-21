import { Stage, Layer, Group } from 'react-konva'
import { PixelType, getPixelLabel } from '../../utils/signalTypes'
import { useKonvaGrid, useResponsiveStage } from '../../hooks'
import { Pixel } from './Pixel'
import { PixelSelection } from './PixelSelection'
import { PixelIndicator } from './PixelIndicator'
import { GRID_CONFIG } from './constants'
import { LAYOUT_CONFIG } from '../../config/layout'

interface KonvaGridProps {
  gridData: Record<string, any>
  onPixelClick: (x: number, y: number) => void
  zoom: number
  selectedPixel: { x: number; y: number } | null
  onZoomChange: (zoom: number) => void
}

export function KonvaGrid({ 
  gridData, 
  onPixelClick, 
  zoom, 
  selectedPixel, 
  onZoomChange 
}: KonvaGridProps) {
  const {
    isDragging,
    position,
    stageRef,
    handlePixelClick,
    handleMouseDown,
    handleMouseMove,
    handleWheel,
  } = useKonvaGrid({ onPixelClick, onZoomChange })
  
  // Utiliser le hook responsive pour les dimensions
  const { stageWidth, stageHeight, basePixelSize } = useResponsiveStage(GRID_CONFIG.SIZE)

  // Obtenir le type du pixel sélectionné
  const selectedPixelData = selectedPixel 
    ? gridData[`${selectedPixel.x}-${selectedPixel.y}`] || { dominantType: PixelType.EMPTY }
    : null

  return (
    <Stage
      ref={stageRef}
      width={stageWidth}
      height={stageHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      draggable={false}
      style={{ 
        cursor: isDragging ? 'grabbing' : 'grab',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <Layer>
        <Group
          x={position.x}
          y={position.y}
          scaleX={zoom / 100}
          scaleY={zoom / 100}
        >
          {/* Rendu des pixels */}
          {Array.from({ length: GRID_CONFIG.SIZE }, (_, y) =>
            Array.from({ length: GRID_CONFIG.SIZE }, (_, x) => {
              const key = `${x}-${y}`
              const pixelData = gridData[key] || { dominantType: PixelType.EMPTY }
              const isSelected = selectedPixel?.x === x && selectedPixel?.y === y

              return (
                <Pixel
                  key={key}
                  x={x}
                  y={y}
                  size={basePixelSize}
                  pixelData={pixelData}
                  isSelected={isSelected}
                  onClick={handlePixelClick}
                />
              )
            })
          )}
          
          {/* Rendu de la sélection par-dessus les pixels */}
          {selectedPixel && (
            <PixelSelection
              x={selectedPixel.x}
              y={selectedPixel.y}
              size={basePixelSize}
              isSelected={true}
            />
          )}
          
          {/* Indicateur de position */}
          {selectedPixel && selectedPixelData && (
            <PixelIndicator
              x={selectedPixel.x}
              y={selectedPixel.y}
              size={basePixelSize}
              pixelType={getPixelLabel(selectedPixelData.dominantType)}
              isVisible={true}
            />
          )}
        </Group>
      </Layer>
    </Stage>
  )
}
