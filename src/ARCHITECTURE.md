# Architecture Signal Garden - Structure Propre

## 🏗️ Vue d'ensemble

Cette architecture suit les principes de **séparation des responsabilités** et **limite de 100 lignes par fichier** pour maintenir un code propre et maintenable.

## 📁 Structure des dossiers

```
src/
├── components/          # Composants React
│   ├── grid/           # Composants de grille
│   ├── ui/             # Composants UI réutilisables
│   ├── features/       # Composants de fonctionnalités
│   ├── layouts/        # Composants de mise en page
│   └── containers/     # Conteneurs de composants
├── hooks/              # Hooks React personnalisés
│   ├── useGrid.ts      # Hook principal (maintenant < 100 lignes)
│   ├── useGridState.ts # Gestion de l'état de la grille
│   └── useGridStats.ts # Calcul des statistiques
├── utils/              # Utilitaires et helpers
│   ├── pixelTypes.ts   # Types TypeScript pour les pixels
│   ├── pixelUtils.ts   # Fonctions utilitaires pour les pixels
│   └── signalTypes.ts  # Exports unifiés (point d'entrée)
├── styles/             # Système CSS modulaire
│   └── colors.css      # Système de couleurs et animations
├── config/             # Configuration de l'application
└── lib/                # Bibliothèques externes
```

## 🎨 Système CSS

### Fichier principal : `src/styles/colors.css`
- **Variables CSS** : Système de design tokens complet
- **Couleurs** : Palette cohérente pour Signal Garden
- **Animations** : Animations spécifiques aux pixels et à la nature
- **Classes utilitaires** : Classes réutilisables pour les pixels

### Intégration avec Tailwind
- Utilisation de `@layer` pour organiser le CSS
- Variables CSS personnalisées intégrées
- Classes utilitaires spécifiques au projet

## 🔧 Hooks React

### Séparation des responsabilités

#### `useGrid.ts` (Principal - < 100 lignes)
```typescript
// Hook principal qui orchestre les autres hooks
export function useGrid() {
  const { gridData, gridStats, getPixel, updatePixel } = useGridState()
  useGridStats(gridData, setGridStats)
  
  return { gridData, gridStats, getPixel, updatePixel }
}
```

#### `useGridState.ts` (Gestion d'état)
- Gestion des données de la grille
- Fonctions de mise à jour des pixels
- Données de démonstration

#### `useGridStats.ts` (Calculs)
- Calcul des statistiques de la grille
- Mise à jour automatique des stats

## 📦 Utilitaires TypeScript

### `pixelTypes.ts`
```typescript
export enum PixelType {
  EMPTY = 0,
  WATER = 1,
  TREES = 2,
  // ...
}

export interface StakingData {
  water: bigint
  trees: bigint
  // ...
}
```

### `pixelUtils.ts`
```typescript
export const getPixelColor = (type: PixelType): string => { /* ... */ }
export const getPixelLabel = (type: PixelType): string => { /* ... */ }
export const calculateDominantType = (data: StakingData): PixelType => { /* ... */ }
```

### `signalTypes.ts` (Point d'entrée)
```typescript
// Ré-export de tous les types et utilitaires
export * from './pixelTypes'
export * from './pixelUtils'
```

## 🎯 Conventions de nommage

### Fichiers
- **Types** : `pixelTypes.ts`, `gridTypes.ts`
- **Utilitaires** : `pixelUtils.ts`, `gridUtils.ts`
- **Hooks** : `useGridState.ts`, `useGridStats.ts`
- **Styles** : `colors.css`, `animations.css`

### Variables CSS
- **Couleurs** : `--primary-500`, `--accent-water`
- **Espacement** : `--spacing-md`, `--spacing-lg`
- **Typographie** : `--font-size-base`, `--font-size-lg`
- **Z-index** : `--z-modal`, `--z-tooltip`

### Classes CSS
- **Layouts** : `.layout-main`, `.layout-grid`
- **Composants** : `.card`, `.btn-primary`
- **Animations** : `.animate-pixel-glow`, `.animate-water-flow`
- **Utilitaires** : `.hover-scale`, `.transition-all`

## 🔄 Flux de données

```
useGrid (Principal)
├── useGridState (État)
│   ├── gridData
│   ├── gridStats
│   └── updatePixel()
└── useGridStats (Calculs)
    └── calculateGridStats()
```

## 🚀 Avantages de cette architecture

1. **Maintenabilité** : Fichiers courts et focalisés
2. **Réutilisabilité** : Hooks et utilitaires modulaires
3. **Testabilité** : Logique séparée et isolée
4. **Performance** : Calculs optimisés et memoization
5. **Évolutivité** : Structure extensible
6. **Lisibilité** : Code organisé et documenté

## 📋 Checklist de qualité

- [x] Aucun fichier > 100 lignes
- [x] Séparation claire des responsabilités
- [x] Conventions de nommage cohérentes
- [x] Documentation des types
- [x] Système CSS modulaire
- [x] Hooks React optimisés
- [x] Pas de duplication de logique
- [x] Structure de dossiers logique
