import { APP_CONFIG } from '../config/wagmi'

// Types pour les éléments de jardin
export enum PixelType {
  EMPTY = 0,      // Vide
  WATER = 1,      // Eau (rivières, lacs)
  TREES = 2,      // Arbres (forêts, bosquets)
  FLOWERS = 3,    // Fleurs (jardins fleuris)
  ROCKS = 4,      // Rochers (relief, montagnes)
  GRASS = 5,      // Herbe (prairies, pelouses)
  SAND = 6,       // Sable (plages, déserts)
  BUSHES = 7,     // Buissons (haies, arbustes)
  MUSHROOMS = 8,  // Champignons (zones magiques)
}

// Interface pour un pixel
export interface Pixel {
  x: number
  y: number
  type: PixelType
  stake: bigint
  lastUpdate: number
  owner?: string
}

// Interface pour les données de staking
export interface StakingData {
  water: bigint
  trees: bigint
  flowers: bigint
  rocks: bigint
  grass: bigint
  sand: bigint
  bushes: bigint
  mushrooms: bigint
  total: bigint
  dominantType: PixelType
}

// Interface pour les statistiques de la grille
export interface GridStats {
  totalPixels: number
  waterPixels: number
  treesPixels: number
  flowersPixels: number
  rocksPixels: number
  grassPixels: number
  sandPixels: number
  bushesPixels: number
  mushroomsPixels: number
  emptyPixels: number
  totalStaked: bigint
  waterStaked: bigint
  treesStaked: bigint
  flowersStaked: bigint
  rocksStaked: bigint
  grassStaked: bigint
  sandStaked: bigint
  bushesStaked: bigint
  mushroomsStaked: bigint
}

// Fonctions utilitaires
export const getPixelColor = (type: PixelType): string => {
  switch (type) {
    case PixelType.EMPTY:
      return '#F8FAFC' // Gris très clair avec transparence
    case PixelType.WATER:
      return '#0EA5E9' // Bleu océan vibrant
    case PixelType.TREES:
      return '#059669' // Vert forêt profond
    case PixelType.FLOWERS:
      return '#E91E63' // Rose magenta éclatant
    case PixelType.ROCKS:
      return '#475569' // Gris pierre élégant
    case PixelType.GRASS:
      return '#10B981' // Vert prairie frais
    case PixelType.SAND:
      return '#F97316' // Orange sable chaud
    case PixelType.BUSHES:
      return '#166534' // Vert buisson sombre
    case PixelType.MUSHROOMS:
      return '#DC2626' // Rouge champignon vif
    default:
      return '#F8FAFC'
  }
}

export const getPixelLabel = (type: PixelType): string => {
  switch (type) {
    case PixelType.EMPTY:
      return 'Vide'
    case PixelType.WATER:
      return 'Eau'
    case PixelType.TREES:
      return 'Arbre'
    case PixelType.FLOWERS:
      return 'Fleur'
    case PixelType.ROCKS:
      return 'Rocher'
    case PixelType.GRASS:
      return 'Herbe'
    case PixelType.SAND:
      return 'Sable'
    case PixelType.BUSHES:
      return 'Buisson'
    case PixelType.MUSHROOMS:
      return 'Champignon'
    default:
      return 'Vide'
  }
}

export const getPixelEmoji = (type: PixelType): string => {
  switch (type) {
    case PixelType.EMPTY:
      return '⚪'
    case PixelType.WATER:
      return '🌊'
    case PixelType.TREES:
      return '🌳'
    case PixelType.FLOWERS:
      return '🌸'
    case PixelType.ROCKS:
      return '🪨'
    case PixelType.GRASS:
      return '🌱'
    case PixelType.SAND:
      return '🏖️'
    case PixelType.BUSHES:
      return '🌿'
    case PixelType.MUSHROOMS:
      return '🍄'
    default:
      return '⚪'
  }
}

export const getPixelDescription = (type: PixelType): string => {
  switch (type) {
    case PixelType.EMPTY:
      return 'Pixel vide - disponible pour plantation'
    case PixelType.WATER:
      return 'Eau - Liquide et mouvement (rivières, lacs)'
    case PixelType.TREES:
      return 'Arbre - Végétation et vie (forêts, bosquets)'
    case PixelType.FLOWERS:
      return 'Fleur - Beauté et fragilité (jardins fleuris)'
    case PixelType.ROCKS:
      return 'Rocher - Pierre solide et stable (relief, montagnes)'
    case PixelType.GRASS:
      return 'Herbe - Couverture végétale (prairies, pelouses)'
    case PixelType.SAND:
      return 'Sable - Zone aride (plages, déserts)'
    case PixelType.BUSHES:
      return 'Buisson - Haie dense (haies, arbustes)'
    case PixelType.MUSHROOMS:
      return 'Champignon - Mystérieux et toxique (zones magiques)'
    default:
      return 'Type inconnu'
  }
}

// Fonction pour calculer le type dominant d'un pixel
export const calculateDominantType = (stakingData: StakingData): PixelType => {
  const { water, trees, flowers, rocks, grass, sand, bushes, mushrooms } = stakingData
  
  const stakes = [
    { type: PixelType.WATER, amount: water },
    { type: PixelType.TREES, amount: trees },
    { type: PixelType.FLOWERS, amount: flowers },
    { type: PixelType.ROCKS, amount: rocks },
    { type: PixelType.GRASS, amount: grass },
    { type: PixelType.SAND, amount: sand },
    { type: PixelType.BUSHES, amount: bushes },
    { type: PixelType.MUSHROOMS, amount: mushrooms }
  ]
  
  // Trouver le type avec le plus grand stake
  let dominantType = PixelType.EMPTY
  let maxStake = 0n
  
  for (const { type, amount } of stakes) {
    if (amount > maxStake) {
      maxStake = amount
      dominantType = type
    }
  }
  
  return dominantType
}

// Fonction pour calculer l'intensité de la heatmap
export const calculateHeatmapIntensity = (stakingData: StakingData): number => {
  const total = stakingData.total
  if (total === 0n) return 0
  
  // Normaliser entre 0 et 1
  const maxStake = 1000n // Valeur arbitraire pour normalisation
  const normalized = Number(total) / Number(maxStake)
  return Math.min(normalized, 1)
}

// Validation des coordonnées
export const isValidCoordinate = (x: number, y: number): boolean => {
  return x >= 0 && x < APP_CONFIG.GRID_SIZE && y >= 0 && y < APP_CONFIG.GRID_SIZE
}

// Conversion de coordonnées en clé
export const coordinateToKey = (x: number, y: number): string => {
  return `${x}-${y}`
}

// Conversion de clé en coordonnées
export const keyToCoordinate = (key: string): { x: number; y: number } => {
  const [x, y] = key.split('-').map(Number)
  return { x, y }
}
