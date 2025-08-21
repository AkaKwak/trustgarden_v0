# 🌱 Signal Garden

**Jardin Collaboratif sur Intuition Network**  
*Token-curated landscape où chaque pixel devient un élément de connaissance*

Un jardin collaboratif où les utilisateurs stakent des tokens TTRUST pour créer des éléments visuels sur une grille 64x64 partagée, générant automatiquement des connaissances structurées selon les concepts d'Intuition (Signals, Atoms, Triples).

## 🎯 Vision

Signal Garden transforme le concept de token-curated knowledge en une expérience visuelle intuitive. Les utilisateurs stakent des tokens TTRUST pour créer des éléments concrets qui génèrent automatiquement des connaissances structurées, créant un paysage dynamique où la valeur stakée se reflète dans la richesse des connaissances.

## 🚀 Fonctionnalités

### 🎮 Expérience Utilisateur
- **Grille Interactive 64x64** : Navigation fluide avec zoom et pan
- **4 Types de Pixels** : EMPTY, SIGNAL, ATOM, TRIPLE
- **Staking Compétitif** : Plus de stake = élément plus dominant
- **Mise à jour Temps Réel** : Événements blockchain en direct
- **Interface Moderne** : Design glassmorphism responsive

### 🔗 Intégration Blockchain
- **Support Wallet** : MetaMask et WalletConnect
- **Testnet Intuition** : Chain ID 13579
- **Token TTRUST** : ERC20 sur Intuition testnet
- **Smart Contracts** : PixelGarden.sol + TrustMock.sol

### 🎨 Interface Utilisateur
- **Sélection Visuelle** : Bordure orange avec animations
- **Contrôles Intuitifs** : Zoom, pan, sélection de pixels
- **Feedback Immédiat** : Notifications et états de chargement
- **Design Responsive** : Optimisé desktop et mobile

## 🛠 Stack Technique

### Smart Contracts
- **Solidity 0.8.24** avec OpenZeppelin
- **PixelGarden.sol** : Contrat principal (64x64 grid)
- **TrustMock.sol** : Token ERC20 de test
- **Hardhat** : Développement et déploiement

### Frontend
- **React 18** + **TypeScript**
- **Vite** : Build tool et dev server
- **Wagmi v2** + **Viem** : Web3 integration
- **React Konva** : Canvas interactif
- **TailwindCSS** + **Radix UI** : Design system

### Configuration
- **Intuition Testnet** : Chain ID 13579
- **RPC** : https://testnet.rpc.intuition.systems
- **Explorer** : https://testnet.explorer.intuition.systems/

## 📋 Prérequis

- **Node.js 18+**
- **npm** ou **yarn**
- **MetaMask** ou wallet compatible
- **Clé privée** pour le déploiement

## 🔧 Installation & Configuration

### 1. Clone & Installation

```bash
git clone https://github.com/AkaKwak/trustgarden_v0.git
cd trustgarden_v0
npm install
```

### 2. Configuration Environnement

```bash
# Copier le template d'environnement
cp env.example .env

# Éditer avec vos paramètres
nano .env
```

**Variables requises** :
```env
# Configuration Intuition Testnet
RPC_URL=https://testnet.rpc.intuition.systems
CHAIN_ID=13579

# Clé privée pour déploiement
PRIVATE_KEY=your_private_key_here

# Adresses des contrats (remplies après déploiement)
PIXEL_GARDEN_ADDRESS=
TRUST_TOKEN_ADDRESS=

# Configuration frontend
VITE_RPC_URL=https://testnet.rpc.intuition.systems
VITE_CHAIN_ID=13579
VITE_PIXEL_GARDEN_ADDRESS=
VITE_TRUST_TOKEN_ADDRESS=
```

### 3. Déploiement des Contrats

```bash
# Compiler les contrats
npm run hardhat:compile

# Déployer sur Intuition testnet
npm run intuition:deploy
```

### 4. Configuration Frontend

Après déploiement, mettre à jour `.env` avec les adresses générées :
```env
PIXEL_GARDEN_ADDRESS=0x... # Adresse PixelGarden
TRUST_TOKEN_ADDRESS=0x...  # Adresse TrustMock
VITE_PIXEL_GARDEN_ADDRESS=0x... # Même adresse
VITE_TRUST_TOKEN_ADDRESS=0x...  # Même adresse
```

### 5. Démarrage Application

```bash
# Démarrer le serveur de développement
npm run dev
```

Visiter `http://localhost:5173` pour interagir avec Signal Garden !

## 🎮 Comment Jouer

### 1. Connexion Wallet
- Cliquer "Connect Wallet" et approuver la connexion
- S'assurer que MetaMask est configuré pour le testnet Intuition

### 2. Obtenir des Tokens
- Les tokens TTRUST sont automatiquement mintés lors du déploiement
- Vérifier le solde dans le wallet

### 3. Interagir avec la Grille
- **Sélectionner un pixel** : Cliquer sur n'importe quel pixel de la grille 64x64
- **Choisir un type** : SIGNAL (rouge), ATOM (jaune), TRIPLE (vert)
- **Staker des tokens** : Entrer le montant de TTRUST à staker
- **Confirmer** : Approuver la transaction et voir la mise à jour

### 4. Compétition
- Plus de stake = élément plus dominant
- Observer la grille évoluer en temps réel
- Vérifier les transactions sur l'explorateur

## 🏗 Architecture

### Smart Contracts

#### PixelGarden.sol
```solidity
// Types de pixels alignés avec Intuition
enum PixelType {
    EMPTY,    // 0 - Blanc - Pixel vide
    SIGNAL,   // 1 - Rouge - Assertion simple
    ATOM,     // 2 - Jaune - Donnée structurée
    TRIPLE    // 3 - Vert - Relation complexe
}

// Fonctions principales
function setPixel(uint32 x, uint32 y, uint8 pixelType, uint256 amount)
function getPixel(uint32 x, uint32 y) returns (pixelType, stakes...)
function getGridStats() returns (statistics...)
```

#### TrustMock.sol
```solidity
// Token ERC20 de test
contract TrustMock is ERC20 {
    function mint(address to, uint256 amount) external
}
```

### Frontend

#### Structure des Composants
```
src/
├── components/
│   ├── containers/
│   │   └── SignalGardenContainer.tsx    # Logique métier
│   ├── layouts/
│   │   └── SignalGardenLayout.tsx       # Structure UI
│   ├── features/
│   │   ├── PixelStatusDisplay.tsx       # Affichage statut
│   │   ├── PixelTypeSelector.tsx        # Sélecteur type
│   │   ├── StakingForm.tsx              # Formulaire staking
│   │   └── TrustBalanceDisplay.tsx      # Affichage balance
│   ├── grid/
│   │   ├── KonvaGrid.tsx                # Grille interactive
│   │   ├── PixelSelection.tsx           # Sélection pixels
│   │   └── GridInteractions.tsx         # Interactions
│   └── ui/
│       ├── AppHeader.tsx                # En-tête
│       ├── StatsCard.tsx                # Cartes stats
│       └── ZoomControls.tsx             # Contrôles zoom
├── hooks/
│   ├── useSignalGarden.ts               # Hook principal
│   ├── useKonvaGrid.ts                  # Logique grille
│   └── useGridZoom.ts                   # Gestion zoom
└── config/
    ├── intuition.ts                     # Configuration Intuition
    ├── wagmi.ts                         # Configuration Wagmi
    └── constants.ts                     # Constantes
```

#### Hooks Principaux
- **useSignalGarden** : Logique métier et interactions blockchain
- **useKonvaGrid** : Gestion de la grille interactive
- **useGridZoom** : Contrôles de zoom et navigation
- **useSignalGardenState** : État local de l'interface

## 🧪 Tests & Développement

### Tests Locaux
```bash
# Démarrer un nœud local
npm run hardhat:node

# Déployer localement
npm run hardhat:deploy

# Lancer les tests
npm run hardhat:test
```

### Configuration Automatique
```bash
# Configuration automatique du testnet
npm run intuition:setup

# Vérifier la connectivité réseau
npm run intuition:setup
```

### Scripts Disponibles
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

## 🔍 Vérification & Déploiement

### Vérification des Contrats
```bash
# Vérifier sur l'explorateur Intuition
npx hardhat verify --network intuition 0xCONTRACT_ADDRESS 64 64 0xTOKEN_ADDRESS
```

### Déploiement Production
```bash
# Build de production
npm run build

# Déployer sur Vercel/Netlify
npm run deploy
```

## 🌐 URLs Importantes

- **Application** : http://localhost:5173
- **Testnet RPC** : https://testnet.rpc.intuition.systems
- **Explorer** : https://testnet.explorer.intuition.systems/
- **Documentation Intuition** : https://docs.intuition.systems

## 🐛 Dépannage

### Problèmes de Connectivité
```bash
# Vérifier la configuration réseau
npm run intuition:setup

# Tester la connectivité RPC
curl -X POST https://testnet.rpc.intuition.systems \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### Problèmes de Déploiement
1. Vérifier la clé privée dans `.env`
2. S'assurer d'avoir des fonds sur le testnet
3. Vérifier la connectivité RPC

### Problèmes Frontend
1. Vérifier les variables d'environnement VITE_*
2. S'assurer que MetaMask est configuré pour Intuition
3. Vérifier la console pour les erreurs

## 📊 Métriques & Statistiques

### Grille
- **Taille** : 64x64 pixels (4096 pixels total)
- **Types** : 4 types (EMPTY, SIGNAL, ATOM, TRIPLE)
- **Staking** : Winner-takes-all par pixel

### Performance
- **Rendu** : React Konva pour performance optimale
- **Zoom** : 1x à 10x avec calculs dynamiques
- **Responsive** : Optimisé pour 1432x1146 et mobile

## 🤝 Contribution

Ce projet est une soumission hackathon. Pour questions ou problèmes :

1. Vérifier les [Issues](../../issues)
2. Consulter les [Pull Requests](../../pulls)
3. Contacter l'équipe

## 📄 Licence

MIT License - voir [LICENSE](LICENSE) pour détails

---

**🌱 Construit avec ❤️ pour l'écosystème Intuition Network**
