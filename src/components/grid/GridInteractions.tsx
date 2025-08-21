import { Stage } from 'react-konva'
import { useEffect, ReactNode } from 'react'

interface GridInteractionsProps {
  children: ReactNode
  stageRef: any
  isDragging: boolean
  setIsDragging: (dragging: boolean) => void
  zoom: number
  pan: { x: number; y: number }
  onPanChange: (pan: { x: number; y: number }) => void
  onZoomChange: (zoom: number) => void
}

// Composant pour gérer les interactions de la grille
export function GridInteractions({
  children,
  stageRef,
  isDragging,
  setIsDragging,
  zoom,
  pan,
  onPanChange,
  onZoomChange
}: GridInteractionsProps) {

  // Gestion du zoom avec la molette
  const handleWheel = (e: any) => {
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
  const handleMouseDown = (e: any) => {
    if (e.target === e.target.getStage()) {
      setIsDragging(true)
    }
  }

  const handleMouseMove = (e: any) => {
    if (isDragging) {
      const stage = e.target.getStage()
      const newPos = stage.position()
      onPanChange({ x: newPos.x, y: newPos.y })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Appliquer le zoom et pan depuis les props
  useEffect(() => {
    if (stageRef.current) {
      const stage = stageRef.current
      stage.scale({ x: zoom, y: zoom })
      stage.position({ x: pan.x, y: pan.y })
      stage.batchDraw()
    }
  }, [zoom, pan, stageRef])

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth * 2 / 3 - 80}
      height={window.innerHeight - 160}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {children}
    </Stage>
  )
}
