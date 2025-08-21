import { useState, useCallback, useEffect } from 'react'
import { GRID_CONFIG } from '../components/grid/constants'

export function useGridZoom(optimalZoom: number = 100) {
  // Calculer le zoom optimal basé sur la taille du conteneur
  const calculateOptimalZoom = () => {
    const stageWidth = 1432 * 0.67 // Largeur du stage
    const baseStageSize = GRID_CONFIG.SIZE * GRID_CONFIG.BASE_PIXEL_SIZE // 32 * 20 = 640
    const calculatedZoom = Math.round((stageWidth / baseStageSize) * 100)
    return Math.max(GRID_CONFIG.MIN_ZOOM, Math.min(calculatedZoom, GRID_CONFIG.MAX_ZOOM))
  }

  const [zoom, setZoom] = useState(calculateOptimalZoom())

  // Mettre à jour le zoom quand optimalZoom change
  useEffect(() => {
    setZoom(optimalZoom)
  }, [optimalZoom])

  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.2, GRID_CONFIG.MAX_ZOOM))
  }, [])

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.2, GRID_CONFIG.MIN_ZOOM))
  }, [])

  const resetZoom = useCallback(() => {
    setZoom(calculateOptimalZoom()) // Utiliser le zoom optimal calculé
  }, [])

  const setZoomLevel = useCallback((level: number) => {
    setZoom(Math.max(GRID_CONFIG.MIN_ZOOM, Math.min(level, GRID_CONFIG.MAX_ZOOM)))
  }, [])

  return {
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoomLevel,
  }
}
