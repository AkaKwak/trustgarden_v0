import { useState, useEffect } from 'react'

// Hook pour gérer les interactions de la grille
export function useGridInteractions() {
  const [pixelSize, setPixelSize] = useState(20)
  const [isDragging, setIsDragging] = useState(false)

  // Calculer la taille des pixels basée sur le zoom
  const calculatePixelSize = (zoom: number) => {
    const screenWidth = window.innerWidth
    const availableWidth = (screenWidth * 2) / 3 - 120
    const baseSize = availableWidth / 32
    const zoomedSize = baseSize * zoom
    const finalSize = Math.max(16, Math.min(48, zoomedSize))
    setPixelSize(finalSize)
  }

  // Gestion du zoom
  const handleZoom = (e: any, onZoomChange: (zoom: number) => void, onPanChange: (pan: { x: number; y: number }) => void) => {
    e.evt.preventDefault()
    
    const stage = e.target.getStage()
    const oldScale = stage.scaleX()
    
    const pointer = stage.getPointerPosition()
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }

    const newScale = e.evt.deltaY > 0 ? oldScale * 0.9 : oldScale * 1.1
    const clampedScale = Math.max(0.5, Math.min(3, newScale))

    stage.scale({ x: clampedScale, y: clampedScale })

    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    }
    stage.position(newPos)
    stage.batchDraw()

    // Notifier les changements
    onZoomChange(clampedScale)
    onPanChange({ x: newPos.x, y: newPos.y })
  }

  // Gestion du pan
  const handlePan = (e: any, onPanChange: (pan: { x: number; y: number }) => void) => {
    if (isDragging) {
      const stage = e.target.getStage()
      const newPos = stage.position()
      onPanChange({ x: newPos.x, y: newPos.y })
    }
  }

  // Appliquer le zoom et pan
  const applyTransform = (stageRef: any, zoom: number, pan: { x: number; y: number }) => {
    if (stageRef.current) {
      const stage = stageRef.current
      stage.scale({ x: zoom, y: zoom })
      stage.position({ x: pan.x, y: pan.y })
      stage.batchDraw()
    }
  }

  return {
    pixelSize,
    isDragging,
    setIsDragging,
    calculatePixelSize,
    handleZoom,
    handlePan,
    applyTransform
  }
}
