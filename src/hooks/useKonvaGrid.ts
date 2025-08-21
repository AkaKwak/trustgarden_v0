import { useState, useRef, useCallback } from 'react'

interface UseKonvaGridProps {
  onPixelClick: (x: number, y: number) => void
  onZoomChange: (zoom: number) => void
}

export function useKonvaGrid({ onPixelClick, onZoomChange }: UseKonvaGridProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  // Position initiale centrée dans l'espace des 2/3
  const [position, setPosition] = useState({ 
    x: 0, // Position de base
    y: 0 // Position de base
  })
  const stageRef = useRef<any>(null)

  const handlePixelClick = useCallback((x: number, y: number) => {
    if (!isDragging) {
      onPixelClick(x, y)
    }
  }, [isDragging, onPixelClick])

  const handleMouseDown = useCallback((e: any) => {
    setIsDragging(false)
    setDragStart({
      x: e.evt.clientX - position.x,
      y: e.evt.clientY - position.y,
    })
  }, [position])

  const handleMouseMove = useCallback((e: any) => {
    if (e.evt.buttons === 1) { // Clic gauche
      setIsDragging(true)
      const newX = e.evt.clientX - dragStart.x
      const newY = e.evt.clientY - dragStart.y
      
      // Permettre le drag partout sans limites
      setPosition({
        x: newX,
        y: newY,
      })
    }
  }, [dragStart])

  const handleWheel = useCallback((e: any) => {
    e.evt.preventDefault()
    
    const scaleBy = 1.1
    const stage = e.target.getStage()
    const oldScale = stage.scaleX()
    
    const pointer = stage.getPointerPosition()
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }
    
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy
    const clampedScale = Math.max(0.1, Math.min(5, newScale))
    
    stage.scale({ x: clampedScale, y: clampedScale })
    
    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    }
    stage.position(newPos)
    stage.batchDraw()
    
    // Mettre à jour le zoom
    const zoomPercent = Math.round(clampedScale * 100)
    onZoomChange(zoomPercent)
  }, [onZoomChange])

  const resetView = useCallback(() => {
    if (stageRef.current) {
      const stage = stageRef.current
      stage.scale({ x: 1, y: 1 })
      stage.position({ x: 0, y: 0 })
      stage.batchDraw()
      setPosition({ x: 0, y: 0 })
      onZoomChange(100)
    }
  }, [onZoomChange])

  return {
    isDragging,
    position,
    stageRef,
    handlePixelClick,
    handleMouseDown,
    handleMouseMove,
    handleWheel,
    resetView,
  }
}
