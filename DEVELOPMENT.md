# 🛠 Guide de Développement - Signal Garden

## 📋 Vue d'ensemble Technique

Ce guide détaille l'architecture technique, les patterns de développement et les bonnes pratiques pour contribuer à Signal Garden.

## 🏗 Architecture Technique

### Stack Complet
```
Signal Garden
├── Smart Contracts (Solidity 0.8.24)
│   ├── PixelGarden.sol (64x64 grid, staking logic)
│   └── TrustMock.sol (ERC20 test token)
├── Frontend (React 18 + TypeScript)
│   ├── Wagmi v2 (Web3 integration)
│   ├── React Konva (Canvas rendering)
│   └── TailwindCSS (Styling)
└── Infrastructure
    ├── Hardhat (Development & deployment)
    ├── Vite (Build tool)
    └── Intuition Testnet (Chain ID: 13579)
```

### Patterns d'Architecture

#### 1. Container Pattern
```typescript
// src/components/containers/SignalGardenContainer.tsx
export function SignalGardenContainer() {
  // Logique métier + État global
  const { gridData, stakePixel, approveTokens } = useSignalGarden()
  
  return <SignalGardenLayout {...props} />
}
```

#### 2. Layout Pattern
```typescript
// src/components/layouts/SignalGardenLayout.tsx
export function SignalGardenLayout() {
  // Structure UI + Composition
  return (
    <div>
      <AppHeader />
      <GridContainer />
      <ControlPanel />
    </div>
  )
}
```

#### 3. Feature Pattern
```typescript
// src/components/features/PixelTypeSelector.tsx
export function PixelTypeSelector() {
  // Fonctionnalité spécifique
  return <RadioGroup options={PIXEL_TYPES} />
}
```

#### 4. Hook Pattern
```typescript
// src/hooks/useSignalGarden.ts
export function useSignalGarden() {
  // Logique métier réutilisable
  return { gridData, stakePixel, approveTokens }
}
```

## 🔧 Configuration de Développement

### Variables d'Environnement
```env
# Développement
NODE_ENV=development
VITE_DEBUG=true

# Blockchain
RPC_URL=https://testnet.rpc.intuition.systems
CHAIN_ID=13579
PRIVATE_KEY=your_private_key_here

# Contrats
PIXEL_GARDEN_ADDRESS=0x...
TRUST_TOKEN_ADDRESS=0x...

# Frontend
VITE_RPC_URL=https://testnet.rpc.intuition.systems
VITE_CHAIN_ID=13579
VITE_PIXEL_GARDEN_ADDRESS=0x...
VITE_TRUST_TOKEN_ADDRESS=0x...
```

### Scripts de Développement
```bash
# Développement
npm run dev                    # Serveur de développement
npm run build                  # Build de production
npm run preview                # Prévisualisation build

# Smart Contracts
npm run hardhat:compile        # Compilation contrats
npm run hardhat:deploy         # Déploiement local
npm run intuition:deploy       # Déploiement testnet
npm run hardhat:test           # Tests contrats

# Configuration
npm run intuition:setup        # Configuration automatique
```

## 🎨 Système de Design

### Couleurs
```css
/* src/styles/colors.css */
:root {
  --pixel-empty: #FFFFFF;    /* Blanc */
  --pixel-signal: #FF0000;   /* Rouge */
  --pixel-atom: #FFFF00;     /* Jaune */
  --pixel-triple: #00FF00;   /* Vert */
  
  --selection-border: #FF6B35; /* Orange vif */
  --selection-shadow: rgba(255, 107, 53, 0.3);
}
```

### Composants UI
```typescript
// src/components/ui/
├── button.tsx           # Boutons avec variants
├── card.tsx            # Cartes avec ombres
├── input.tsx           # Champs de saisie
├── radio-group.tsx     # Groupes de boutons radio
├── slider.tsx          # Curseurs
├── tooltip.tsx         # Infobulles
└── toaster.tsx         # Notifications toast
```

### Responsive Design
```typescript
// src/config/layout.ts
export const SCREEN_BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
  LARGE_DESKTOP: 1920,
  ULTRA_WIDE: 2560,
}

export const PIXEL_SIZES = {
  [SCREEN_BREAKPOINTS.MOBILE]: 6,
  [SCREEN_BREAKPOINTS.TABLET]: 8,
  [SCREEN_BREAKPOINTS.DESKTOP]: 10,
  [SCREEN_BREAKPOINTS.LARGE_DESKTOP]: 12,
  [SCREEN_BREAKPOINTS.ULTRA_WIDE]: 16,
}
```

## 🎮 Système de Grille

### Configuration Konva
```typescript
// src/components/grid/KonvaGrid.tsx
export function KonvaGrid() {
  const { stageSize, pixelSize } = useResponsiveStage()
  const { zoom, pan } = useGridZoom()
  
  return (
    <Stage width={stageSize.width} height={stageSize.height}>
      <Layer>
        {pixels.map(pixel => (
          <Pixel key={`${pixel.x}-${pixel.y}`} {...pixel} />
        ))}
      </Layer>
    </Stage>
  )
}
```

### Interactions
```typescript
// src/hooks/useGridInteractions.ts
export function useGridInteractions() {
  const handlePixelClick = (x: number, y: number) => {
    // Logique de sélection
  }
  
  const handleZoom = (delta: number) => {
    // Logique de zoom
  }
  
  const handlePan = (x: number, y: number) => {
    // Logique de navigation
  }
  
  return { handlePixelClick, handleZoom, handlePan }
}
```

## 🔗 Intégration Blockchain

### Configuration Wagmi
```typescript
// src/config/wagmi.ts
export const config = createConfig({
  chains: [intuitionTestnet, sepolia, mainnet],
  connectors: [injected(), metaMask(), walletConnect()],
  transports: {
    [intuitionTestnet.id]: http(),
  },
})
```

### Hooks Web3
```typescript
// src/hooks/useSignalGarden.ts
export function useSignalGarden() {
  const { address, isConnected } = useAccount()
  const { data: pixelGardenContract } = useContract({
    address: PIXEL_GARDEN_ADDRESS,
    abi: PixelGardenABI,
  })
  
  const stakePixel = useWriteContract({
    address: PIXEL_GARDEN_ADDRESS,
    abi: PixelGardenABI,
    functionName: 'setPixel',
  })
  
  return { stakePixel, pixelGardenContract }
}
```

## 🧪 Tests

### Tests Smart Contracts
```bash
# Tests unitaires
npm run hardhat:test

# Tests avec coverage
npx hardhat coverage

# Tests de gas
npx hardhat test --gas
```

### Tests Frontend
```bash
# Tests unitaires (si configurés)
npm test

# Tests E2E (si configurés)
npm run test:e2e
```

### Tests d'Intégration
```bash
# Test complet du flux
npm run intuition:setup
npm run intuition:deploy
npm run dev
# Tester manuellement l'interface
```

## 🔍 Debugging

### Smart Contracts
```bash
# Logs de déploiement
npx hardhat run scripts/deploy-intuition.ts --network intuition --verbose

# Debug d'une transaction
npx hardhat console --network intuition
> const contract = await ethers.getContractAt("PixelGarden", "0x...")
> await contract.getPixel(0, 0)
```

### Frontend
```typescript
// Debug des hooks
const { data, error, isLoading } = useSignalGarden()
console.log('Signal Garden State:', { data, error, isLoading })

// Debug des interactions
const handlePixelClick = (x: number, y: number) => {
  console.log('Pixel clicked:', { x, y })
  // Logique...
}
```

### Performance
```bash
# Analyse du bundle
npm run build
npx vite-bundle-analyzer dist

# Profiling React
# Installer React DevTools Profiler
```

## 📦 Build & Déploiement

### Build de Production
```bash
# Build optimisé
npm run build

# Vérifier le build
npm run preview

# Analyser le bundle
npx vite-bundle-analyzer dist
```

### Déploiement Smart Contracts
```bash
# Déploiement testnet
npm run intuition:deploy

# Vérification
npx hardhat verify --network intuition 0xCONTRACT_ADDRESS 64 64 0xTOKEN_ADDRESS

# Migration (si nécessaire)
npx hardhat run scripts/migrate.ts --network intuition
```

### Déploiement Frontend
```bash
# Build
npm run build

# Déploiement Vercel
vercel --prod

# Déploiement Netlify
netlify deploy --prod
```

## 🐛 Dépannage

### Problèmes Courants

#### 1. Erreurs de Compilation
```bash
# Nettoyer le cache
rm -rf node_modules package-lock.json
npm install

# Recompiler les contrats
npm run hardhat:compile
```

#### 2. Erreurs de Connexion
```bash
# Vérifier la connectivité
npm run intuition:setup

# Tester le RPC
curl -X POST https://testnet.rpc.intuition.systems \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

#### 3. Erreurs de Déploiement
```bash
# Vérifier la clé privée
echo $PRIVATE_KEY | wc -c  # Doit être 66 (0x + 64 chars)

# Vérifier le solde
npx hardhat console --network intuition
> const [signer] = await ethers.getSigners()
> await signer.getBalance()
```

#### 4. Erreurs Frontend
```bash
# Vérifier les variables d'environnement
echo $VITE_PIXEL_GARDEN_ADDRESS
echo $VITE_TRUST_TOKEN_ADDRESS

# Nettoyer le cache Vite
rm -rf node_modules/.vite
npm run dev
```

## 📚 Ressources

### Documentation
- [Intuition Network](https://docs.intuition.systems)
- [Wagmi v2](https://wagmi.sh)
- [React Konva](https://konvajs.org/docs/react)
- [TailwindCSS](https://tailwindcss.com/docs)

### Outils de Développement
- [Hardhat](https://hardhat.org/docs)
- [Vite](https://vitejs.dev/guide)
- [TypeScript](https://www.typescriptlang.org/docs)

### Standards
- [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- [React Best Practices](https://react.dev/learn)
- [TypeScript Guidelines](https://github.com/microsoft/TypeScript/wiki/Coding-guidelines)

---

**🛠 Prêt pour le développement !**
