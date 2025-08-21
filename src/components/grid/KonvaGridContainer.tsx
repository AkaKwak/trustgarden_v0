import { useRef, useEffect } from 'react'
import { useGridInteractions } from '../../hooks/useGridInteractions'
import { PixelRenderer } from './PixelRenderer'
import { GridInteractions } from './GridInteractions'
import { GridOverlay } from './GridOverlay'

interface KonvaGridContainerProps {
  gridData: Record<string, any>
  onPixelClick: (x: number, y: number) => void
  selectedPixel: { x: number; y: number } | null
  zoom: number
  pan: { x: number; y: number }
  onPanChange: (pan: { x: number; y: number }) => void
  onZoomChange: (zoom: number) => void
}

// Container pour la grille Konva - Logique métier
export function KonvaGridContainer({
  gridData,
  onPixelClick,
  selectedPixel,
  zoom,
  pan,
  onPanChange,
  onZoomChange
}: KonvaGridContainerProps) {
  const stageRef = useRef<any>(null)
  const {
    pixelSize,
    isDragging,
    setIsDragging,
    calculatePixelSize
  } = useGridInteractions()

  // Calculer la taille des pixels basée sur le zoom
  useEffect(() => {
    calculatePixelSize(zoom)
  }, [zoom, calculatePixelSize])

  const gridSize = 32 * pixelSize

  // Props pour les sous-composants
  const pixelRendererProps = {
    gridData,
    pixelSize,
    selectedPixel,
    onPixelClick
  }

  const gridInteractionsProps = {
    stageRef,
    isDragging,
    setIsDragging,
    zoom,
    pan,
    onPanChange,
    onZoomChange
  }

  const gridOverlayProps = {
    selectedPixel,
    pixelSize
  }

  return (
    <div className="w-full h-full flex justify-center items-center overflow-hidden">
      <GridInteractions {...gridInteractionsProps}>
        <PixelRenderer {...pixelRendererProps} />
        <GridOverlay {...gridOverlayProps} />
      </GridInteractions>
    </div>
  )
}
