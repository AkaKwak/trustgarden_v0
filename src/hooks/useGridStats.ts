// ===== HOOK POUR LES STATISTIQUES DE LA GRILLE =====

import { useCallback, useEffect } from 'react'
import { PixelType, StakingData, GridStats } from '../utils/pixelTypes'
import { APP_CONFIG } from '../config/wagmi'

// Calculer les statistiques de la grille
export const calculateGridStats = (gridData: Record<string, StakingData>): GridStats => {
  const stats: GridStats = {
    totalPixels: APP_CONFIG.GRID_SIZE * APP_CONFIG.GRID_SIZE,
    waterPixels: 0,
    treesPixels: 0,
    flowersPixels: 0,
    rocksPixels: 0,
    grassPixels: 0,
    sandPixels: 0,
    bushesPixels: 0,
    mushroomsPixels: 0,
    emptyPixels: APP_CONFIG.GRID_SIZE * APP_CONFIG.GRID_SIZE,
    totalStaked: 0n,
    waterStaked: 0n,
    treesStaked: 0n,
    flowersStaked: 0n,
    rocksStaked: 0n,
    grassStaked: 0n,
    sandStaked: 0n,
    bushesStaked: 0n,
    mushroomsStaked: 0n,
  }

  Object.values(gridData).forEach(pixel => {
    if (pixel.dominantType !== PixelType.EMPTY) {
      stats.emptyPixels--
      
      switch (pixel.dominantType) {
        case PixelType.WATER:
          stats.waterPixels++
          stats.waterStaked += pixel.water
          break
        case PixelType.TREES:
          stats.treesPixels++
          stats.treesStaked += pixel.trees
          break
        case PixelType.FLOWERS:
          stats.flowersPixels++
          stats.flowersStaked += pixel.flowers
          break
        case PixelType.ROCKS:
          stats.rocksPixels++
          stats.rocksStaked += pixel.rocks
          break
        case PixelType.GRASS:
          stats.grassPixels++
          stats.grassStaked += pixel.grass
          break
        case PixelType.SAND:
          stats.sandPixels++
          stats.sandStaked += pixel.sand
          break
        case PixelType.BUSHES:
          stats.bushesPixels++
          stats.bushesStaked += pixel.bushes
          break
        case PixelType.MUSHROOMS:
          stats.mushroomsPixels++
          stats.mushroomsStaked += pixel.mushrooms
          break
      }
      
      stats.totalStaked += pixel.total
    }
  })

  return stats
}

export function useGridStats(
  gridData: Record<string, StakingData>,
  setGridStats: (stats: GridStats) => void
) {
  // Calculer les stats quand la grille change
  const updateStats = useCallback(() => {
    const newStats = calculateGridStats(gridData)
    setGridStats(newStats)
  }, [gridData, setGridStats])

  // Mettre à jour les stats quand la grille change
  useEffect(() => {
    updateStats()
  }, [updateStats])

  return {
    updateStats,
  }
}
