import { useState, useEffect, useRef } from 'react'
import { GRID_CONFIG } from '../components/grid/constants'

export function useStageSize() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [stageSize, setStageSize] = useState(512)
  const [optimalZoom, setOptimalZoom] = useState(100)

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const container = containerRef.current
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight
        
        // Prendre la plus grande dimension pour maximiser l'espace
        const maxSize = Math.max(containerWidth, containerHeight)
        
        // S'assurer que la taille est un multiple de la taille de la grille
        const gridSize = GRID_CONFIG.SIZE
        const pixelSize = Math.floor(maxSize / gridSize)
        const newStageSize = pixelSize * gridSize
        
        // Calculer le zoom optimal pour remplir l'espace
        const baseStageSize = GRID_CONFIG.SIZE * GRID_CONFIG.BASE_PIXEL_SIZE // 32 * 16 = 512
        const calculatedZoom = Math.round((newStageSize / baseStageSize) * 100)
        const clampedZoom = Math.max(GRID_CONFIG.MIN_ZOOM, Math.min(calculatedZoom, GRID_CONFIG.MAX_ZOOM))
        
        setStageSize(newStageSize)
        setOptimalZoom(clampedZoom)
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    
    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  return { containerRef, stageSize, optimalZoom }
}
