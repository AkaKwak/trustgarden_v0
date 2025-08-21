# Signal Garden - Structure du Codebase

## 📁 Architecture

```
src/
├── components/          # Composants React
│   ├── ui/             # Composants UI réutilisables
│   │   ├── index.ts    # Export centralisé
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── slider.tsx
│   │   ├── toaster.tsx
│   │   ├── ResponsiveGrid.tsx    # Grille responsive
│   │   ├── GridControls.tsx      # Contrôles de zoom
│   │   ├── PlantingPanel.tsx     # Panel de plantation
│   │   └── StatsCards.tsx        # Cartes de statistiques
│   └── SignalGarden.tsx          # Composant principal
├── hooks/              # Hooks React personnalisés
│   ├── index.ts        # Export centralisé
│   ├── useSignalGarden.ts  # Hook principal
│   ├── useContracts.ts     # Gestion des contrats
│   ├── useGrid.ts          # Gestion de la grille
│   └── use-toast.ts        # Notifications
├── config/             # Configuration
│   ├── wagmi.ts        # Configuration Wagmi
│   ├── abis.ts         # ABIs des contrats
│   └── constants.ts    # Constantes de l'app
├── utils/              # Utilitaires
│   └── signalTypes.ts  # Types et fonctions utilitaires
└── lib/                # Bibliothèques tierces
```

## 🎯 Principes de Design

### 1. **Séparation des Responsabilités**
- **Hooks** : Logique métier et état
- **Composants** : Rendu et interactions UI
- **Config** : Configuration et constantes
- **Utils** : Fonctions utilitaires

### 2. **Composants Modulaires**
- Chaque composant a une responsabilité unique
- Réutilisabilité maximale
- Props typées avec TypeScript

### 3. **Hooks Spécialisés**
- `useSignalGarden` : Orchestration principale
- `useContracts` : Interactions blockchain
- `useGrid` : Gestion de la grille et stats
- `useToast` : Notifications

### 4. **Configuration Centralisée**
- `wagmi.ts` : Configuration blockchain
- `abis.ts` : ABIs des contrats
- `constants.ts` : Valeurs magiques

## 🔧 Utilisation

### Imports Simplifiés
```typescript
// Hooks
import { useSignalGarden, useToast } from '../hooks'

// Composants UI
import { Button, Card, ResponsiveGrid } from './ui'

// Configuration
import { APP_CONFIG } from '../config/wagmi'
import { GRID_CONSTANTS } from '../config/constants'
```

### Ajout d'un Nouveau Composant
1. Créer le fichier dans `components/ui/`
2. Ajouter l'export dans `components/ui/index.ts`
3. Utiliser avec l'import simplifié

### Ajout d'un Nouveau Hook
1. Créer le fichier dans `hooks/`
2. Ajouter l'export dans `hooks/index.ts`
3. Utiliser avec l'import simplifié

## 🚀 Avantages

- **Maintenabilité** : Code organisé et modulaire
- **Réutilisabilité** : Composants et hooks indépendants
- **Performance** : Imports optimisés
- **Type Safety** : TypeScript strict
- **Scalabilité** : Structure extensible
