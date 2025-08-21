// ===== TYPES DE PIXELS =====

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
