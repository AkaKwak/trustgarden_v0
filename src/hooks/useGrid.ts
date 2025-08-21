// ===== HOOK PRINCIPAL POUR LA GRILLE =====

import { useEffect } from 'react'
import { useGridState } from './useGridState'
import { useGridStats } from './useGridStats'
import { StakingData, GridStats } from '../utils/pixelTypes'

export function useGrid() {
  const {
    gridData,
    gridStats,
    setGridStats,
    getPixel,
    updatePixel,
    loadDemoData,
  } = useGridState()

  // Utiliser le hook pour les statistiques
  useGridStats(gridData, setGridStats)

  // Charger les données de démonstration au montage
  useEffect(() => {
    loadDemoData()
  }, [loadDemoData])

  return {
    gridData,
    gridStats,
    getPixel,
    updatePixel,
  }
}
