# 🤝 Guide de Contribution - Signal Garden

## 🎯 Bienvenue !

Merci de votre intérêt pour contribuer à Signal Garden ! Ce guide vous accompagne dans le processus de contribution.

## 📋 Avant de Commencer

### Prérequis
- **Node.js 18+**
- **npm** ou **yarn**
- **Git**
- **MetaMask** ou wallet compatible
- **Connaissance de base** : React, TypeScript, Solidity

### Configuration Initiale
```bash
# Fork et clone
git clone https://github.com/VOTRE_USERNAME/trustgarden_v0.git
cd trustgarden_v0

# Installation
npm install

# Configuration
cp env.example .env
# Éditer .env avec vos paramètres
```

## 🔄 Workflow de Contribution

### 1. Créer une Issue
Avant de commencer à coder, créez une issue pour :
- Décrire le problème ou la fonctionnalité
- Discuter de l'approche technique
- Obtenir l'approbation de l'équipe

### 2. Créer une Branche
```bash
# Baser sur la branche principale
git checkout main
git pull origin main

# Créer une branche descriptive
git checkout -b feature/nom-de-la-feature
# ou
git checkout -b fix/nom-du-bug
```

### 3. Développer
```bash
# Démarrer le serveur de développement
npm run dev

# Tester les contrats
npm run hardhat:test

# Vérifier la qualité du code
npm run lint
```

### 4. Tester
```bash
# Tests locaux
npm run hardhat:test

# Tests d'intégration
npm run intuition:setup
npm run intuition:deploy
npm run dev
# Tester manuellement l'interface
```

### 5. Commiter
```bash
# Ajouter les fichiers
git add .

# Commiter avec un message descriptif
git commit -m "feat: ajouter nouvelle fonctionnalité X"
git commit -m "fix: corriger bug dans Y"
git commit -m "docs: mettre à jour documentation Z"
```

### 6. Pousser et Créer une Pull Request
```bash
git push origin feature/nom-de-la-feature
```

## 📝 Standards de Code

### Messages de Commit
Utilisez le format [Conventional Commits](https://www.conventionalcommits.org/) :

```bash
# Types de commit
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage
refactor: refactorisation
test: ajout de tests
chore: tâches de maintenance

# Exemples
feat: ajouter système de zoom à la grille
fix: corriger erreur de connexion wallet
docs: mettre à jour README avec nouvelles instructions
```

### TypeScript
```typescript
// Types explicites
interface PixelData {
  x: number
  y: number
  type: PixelType
  stake: bigint
}

// Fonctions typées
function handlePixelClick(x: number, y: number): void {
  // Logique...
}

// Hooks typés
export function usePixelData(x: number, y: number): PixelData | null {
  // Logique...
}
```

### Solidity
```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title PixelGarden
 * @dev Description détaillée du contrat
 */
contract PixelGarden {
    // Variables avec commentaires
    uint32 public immutable width;  // Largeur de la grille
    
    // Événements descriptifs
    event PixelStaked(
        uint32 indexed x,
        uint32 indexed y,
        PixelType indexed pixelType,
        uint256 amount,
        address actor
    );
    
    // Fonctions avec documentation NatSpec
    /**
     * @dev Stake des tokens pour un pixel
     * @param x Coordonnée X
     * @param y Coordonnée Y
     * @param pixelType Type de pixel
     * @param amount Montant à staker
     */
    function setPixel(uint32 x, uint32 y, uint8 pixelType, uint256 amount) external {
        // Logique...
    }
}
```

### React Components
```typescript
// Composants fonctionnels avec TypeScript
interface PixelProps {
  x: number
  y: number
  type: PixelType
  onClick: (x: number, y: number) => void
}

export function Pixel({ x, y, type, onClick }: PixelProps) {
  const handleClick = useCallback(() => {
    onClick(x, y)
  }, [x, y, onClick])
  
  return (
    <div 
      className={`pixel pixel-${type}`}
      onClick={handleClick}
    />
  )
}
```

## 🧪 Tests

### Tests Smart Contracts
```solidity
// test/PixelGarden.test.ts
describe("PixelGarden", function () {
  let pixelGarden: PixelGarden
  let trustToken: TrustMock
  let owner: SignerWithAddress
  let user: SignerWithAddress
  
  beforeEach(async function () {
    [owner, user] = await ethers.getSigners()
    
    const TrustMock = await ethers.getContractFactory("TrustMock")
    trustToken = await TrustMock.deploy()
    
    const PixelGarden = await ethers.getContractFactory("PixelGarden")
    pixelGarden = await PixelGarden.deploy(64, 64, trustToken.address)
  })
  
  it("should set pixel correctly", async function () {
    // Test logique...
  })
})
```

### Tests Frontend
```typescript
// src/components/__tests__/Pixel.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Pixel } from '../Pixel'

describe('Pixel Component', () => {
  it('renders with correct type', () => {
    render(<Pixel x={0} y={0} type="SIGNAL" onClick={jest.fn()} />)
    expect(screen.getByTestId('pixel')).toHaveClass('pixel-SIGNAL')
  })
  
  it('calls onClick when clicked', () => {
    const onClick = jest.fn()
    render(<Pixel x={0} y={0} type="SIGNAL" onClick={onClick} />)
    
    fireEvent.click(screen.getByTestId('pixel'))
    expect(onClick).toHaveBeenCalledWith(0, 0)
  })
})
```

## 🔍 Code Review

### Checklist de Review
- [ ] Le code suit les standards de style
- [ ] Les tests passent
- [ ] La documentation est mise à jour
- [ ] Les changements sont testés manuellement
- [ ] Les performances ne sont pas dégradées
- [ ] La sécurité est prise en compte

### Processus de Review
1. **Auto-review** : Vérifiez votre code avant de soumettre
2. **Tests** : Assurez-vous que tous les tests passent
3. **Documentation** : Mettez à jour la documentation si nécessaire
4. **Soumission** : Créez une Pull Request avec description détaillée

## 🚀 Déploiement

### Tests de Déploiement
```bash
# Test sur testnet
npm run intuition:deploy

# Vérifier les contrats
npx hardhat verify --network intuition 0xCONTRACT_ADDRESS 64 64 0xTOKEN_ADDRESS

# Tester l'application
npm run dev
# Tester manuellement toutes les fonctionnalités
```

### Déploiement Production
```bash
# Build de production
npm run build

# Tests de build
npm run preview

# Déploiement (selon la plateforme)
vercel --prod
# ou
netlify deploy --prod
```

## 🐛 Reporting de Bugs

### Template de Bug Report
```markdown
## Description
Description claire du problème

## Étapes pour Reproduire
1. Aller à '...'
2. Cliquer sur '...'
3. Voir l'erreur

## Comportement Attendu
Ce qui devrait se passer

## Comportement Actuel
Ce qui se passe actuellement

## Environnement
- OS: [ex: Windows 10]
- Browser: [ex: Chrome 120]
- Wallet: [ex: MetaMask 11.0]
- Network: [ex: Intuition Testnet]

## Logs
```
// Logs d'erreur si disponibles
```

## Screenshots
Ajouter des captures d'écran si pertinent
```

## 💡 Suggestions de Fonctionnalités

### Template de Feature Request
```markdown
## Description
Description claire de la fonctionnalité souhaitée

## Problème Résolu
Comment cette fonctionnalité résout un problème

## Solution Proposée
Description de la solution technique

## Alternatives Considérées
Autres solutions possibles

## Informations Supplémentaires
Contexte, exemples, etc.
```

## 📚 Ressources

### Documentation
- [README.md](./README.md) - Vue d'ensemble du projet
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Guide de développement technique
- [Intuition Network Docs](https://docs.intuition.systems)

### Outils
- [Hardhat](https://hardhat.org/docs) - Framework de développement
- [Wagmi](https://wagmi.sh) - Hooks React pour Ethereum
- [React Konva](https://konvajs.org/docs/react) - Canvas React

### Communauté
- [Issues GitHub](../../issues) - Discussions et bugs
- [Pull Requests](../../pulls) - Contributions
- [Discussions](../../discussions) - Questions générales

## 🎉 Merci !

Votre contribution aide à faire de Signal Garden un projet meilleur. Merci de votre temps et de votre expertise !

---

**🤝 Ensemble, construisons l'écosystème Intuition !**
