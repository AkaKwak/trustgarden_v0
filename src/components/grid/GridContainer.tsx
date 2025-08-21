import React from 'react'
import { KonvaGrid } from './KonvaGrid'
import { GRID_CONFIG } from './constants'

interface GridContainerProps {
  gridData: Record<string, any>
  onPixelClick: (x: number, y: number) => void
  zoom: number
  selectedPixel: { x: number; y: number } | null
  onZoomChange: (zoom: number) => void
}

export function GridContainer({
  gridData,
  onPixelClick,
  zoom,
  selectedPixel,
  onZoomChange
}: GridContainerProps) {
  return (
    <KonvaGrid
      gridData={gridData}
      onPixelClick={onPixelClick}
      zoom={zoom}
      selectedPixel={selectedPixel}
      onZoomChange={onZoomChange}
    />
  )
}
