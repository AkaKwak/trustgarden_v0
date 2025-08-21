import { useState, useEffect } from 'react'

interface ResponsiveStageDimensions {
  stageWidth: number
  stageHeight: number
  basePixelSize: number
}

export const useResponsiveStage = (gridSize: number): ResponsiveStageDimensions => {
  const [dimensions, setDimensions] = useState<ResponsiveStageDimensions>({
    stageWidth: 800,
    stageHeight: 600,
    basePixelSize: 20
  })

  useEffect(() => {
    const calculateDimensions = () => {
      // Utiliser les dimensions du container parent (2/3 de l'écran)
      const containerWidth = window.innerWidth * 0.67
      const containerHeight = window.innerHeight
      
      // Adapter selon le ratio de l'écran
      const screenRatio = containerWidth / containerHeight
      
      let stageWidth: number, stageHeight: number
      
      if (screenRatio > 1) {
        // Écran large (16:9, 21:9, etc.) - utiliser la largeur comme référence
        stageWidth = containerWidth
        stageHeight = containerWidth * (3/4) // Garder un ratio 4:3 pour la grille
      } else {
        // Écran portrait ou carré - utiliser la hauteur comme référence
        stageHeight = containerHeight
        stageWidth = containerHeight * (4/3) // Garder un ratio 4:3 pour la grille
      }
      
      const basePixelSize = Math.min(stageWidth, stageHeight) / gridSize
      
      setDimensions({
        stageWidth,
        stageHeight,
        basePixelSize
      })
    }

    // Calculer au montage
    calculateDimensions()
    
    // Recalculer lors du redimensionnement
    window.addEventListener('resize', calculateDimensions)
    
    return () => {
      window.removeEventListener('resize', calculateDimensions)
    }
  }, [gridSize])

  return dimensions
}
