import { useState, useEffect, useCallback } from 'react'
import { parseUnits } from 'viem'
import { PixelType, StakingData, GridStats, coordinateToKey } from '../utils/signalTypes'
import { APP_CONFIG } from '../config/wagmi'

export function useGrid() {
  const [gridData, setGridData] = useState<Record<string, StakingData>>({})
  const [gridStats, setGridStats] = useState<GridStats>({
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

  // Fonction pour récupérer les données d'un pixel
  const getPixel = useCallback(async (x: number, y: number): Promise<StakingData> => {
    try {
      const key = coordinateToKey(x, y)
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
    const key = coordinateToKey(x, y)
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

  // Calculer les statistiques de la grille
  const calculateStats = useCallback(() => {
    const stats = {
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
  }, [gridData])

  // Mettre à jour les stats quand la grille change
  useEffect(() => {
    setGridStats(calculateStats())
  }, [calculateStats])

  // Charger les données de démonstration
  useEffect(() => {
    const loadDemoData = () => {
      const demoData: Record<string, StakingData> = {}
      
      // Ajouter quelques pixels de démonstration
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
      
      setGridData(demoData)
    }

    loadDemoData()
  }, [])

  return {
    gridData,
    gridStats,
    getPixel,
    updatePixel,
  }
}
