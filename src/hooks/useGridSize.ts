import { useState, useEffect } from 'react'

interface UseGridSizeOptions {
  gridSize: number
  zoom: number
  screenRatio: number
  minPixelSize: number
  maxPixelSize: number
}

export function useGridSize({
  gridSize = 32,
  zoom = 1,
  screenRatio = 2/3,
  minPixelSize = 20,
  maxPixelSize = 35
}: Partial<UseGridSizeOptions> = {}) {
  const [pixelSize, setPixelSize] = useState(minPixelSize)

  useEffect(() => {
    const calculatePixelSize = () => {
      const screenWidth = window.innerWidth
      const availableWidth = (screenWidth * screenRatio) - 120
      const baseSize = availableWidth / gridSize
      const zoomedSize = baseSize * (1 + (zoom - 1) * 0.1)
      const finalSize = Math.max(minPixelSize, Math.min(maxPixelSize, zoomedSize))
      setPixelSize(finalSize)
    }

    calculatePixelSize()

    // Recalculer lors du redimensionnement de la fenêtre
    const handleResize = () => calculatePixelSize()
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [gridSize, zoom, screenRatio, minPixelSize, maxPixelSize])

  return {
    pixelSize,
    gridSize: gridSize * pixelSize
  }
}
