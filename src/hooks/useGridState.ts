// ===== HOOK POUR L'ÉTAT DE LA GRILLE =====

import { useState, useCallback } from 'react'
import { parseUnits } from 'viem'
import { PixelType, StakingData, GridStats } from '../utils/pixelTypes'
import { APP_CONFIG } from '../config/wagmi'

// État initial des statistiques
const createInitialStats = (): GridStats => ({
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
})

// Données de démonstration
const createDemoData = (): Record<string, StakingData> => {
  const demoData: Record<string, StakingData> = {}
  
  demoData['5-5'] = {
    water: 0n, trees: 0n, flowers: 0n, rocks: parseUnits('100', 18),
    grass: 0n, sand: 0n, bushes: 0n, mushrooms: 0n,
    total: parseUnits('100', 18), dominantType: PixelType.ROCKS,
  }
  demoData['8-8'] = {
    water: 0n, trees: parseUnits('150', 18), flowers: 0n, rocks: 0n,
    grass: 0n, sand: 0n, bushes: 0n, mushrooms: 0n,
    total: parseUnits('150', 18), dominantType: PixelType.TREES,
  }
  demoData['12-12'] = {
    water: parseUnits('200', 18), trees: 0n, flowers: 0n, rocks: 0n,
    grass: 0n, sand: 0n, bushes: 0n, mushrooms: 0n,
    total: parseUnits('200', 18), dominantType: PixelType.WATER,
  }
  demoData['15-15'] = {
    water: 0n, trees: 0n, flowers: parseUnits('80', 18), rocks: 0n,
    grass: 0n, sand: 0n, bushes: 0n, mushrooms: 0n,
    total: parseUnits('80', 18), dominantType: PixelType.FLOWERS,
  }
  demoData['20-20'] = {
    water: 0n, trees: 0n, flowers: 0n, rocks: 0n,
    grass: parseUnits('120', 18), sand: 0n, bushes: 0n, mushrooms: 0n,
    total: parseUnits('120', 18), dominantType: PixelType.GRASS,
  }
  demoData['25-25'] = {
    water: 0n, trees: 0n, flowers: 0n, rocks: 0n,
    grass: 0n, sand: parseUnits('90', 18), bushes: 0n, mushrooms: 0n,
    total: parseUnits('90', 18), dominantType: PixelType.SAND,
  }
  
  return demoData
}

export function useGridState() {
  const [gridData, setGridData] = useState<Record<string, StakingData>>({})
  const [gridStats, setGridStats] = useState<GridStats>(createInitialStats())

  // Fonction pour récupérer les données d'un pixel
  const getPixel = useCallback(async (x: number, y: number): Promise<StakingData> => {
    try {
      const key = `${x}-${y}`
      return gridData[key] || {
        water: 0n,
        trees: 0n,
        flowers: 0n,
        rocks: 0n,
        grass: 0n,
        sand: 0n,
        bushes: 0n,
        mushrooms: 0n,
        total: 0n,
        dominantType: PixelType.EMPTY,
      }
    } catch (err) {
      console.error('Erreur lors de la récupération du pixel:', err)
      return {
        water: 0n,
        trees: 0n,
        flowers: 0n,
        rocks: 0n,
        grass: 0n,
        sand: 0n,
        bushes: 0n,
        mushrooms: 0n,
        total: 0n,
        dominantType: PixelType.EMPTY,
      }
    }
  }, [gridData])

  // Fonction pour mettre à jour un pixel
  const updatePixel = useCallback((x: number, y: number, pixelType: PixelType, amount: bigint) => {
    const key = `${x}-${y}`
    setGridData(prev => ({
      ...prev,
      [key]: {
        water: pixelType === PixelType.WATER ? amount : 0n,
        trees: pixelType === PixelType.TREES ? amount : 0n,
        flowers: pixelType === PixelType.FLOWERS ? amount : 0n,
        rocks: pixelType === PixelType.ROCKS ? amount : 0n,
        grass: pixelType === PixelType.GRASS ? amount : 0n,
        sand: pixelType === PixelType.SAND ? amount : 0n,
        bushes: pixelType === PixelType.BUSHES ? amount : 0n,
        mushrooms: pixelType === PixelType.MUSHROOMS ? amount : 0n,
        total: amount,
        dominantType: pixelType,
      }
    }))
  }, [])

  // Charger les données de démonstration
  const loadDemoData = useCallback(() => {
    setGridData(createDemoData())
  }, [])

  return {
    gridData,
    gridStats,
    setGridStats,
    getPixel,
    updatePixel,
    loadDemoData,
  }
}
