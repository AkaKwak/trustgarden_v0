# 📋 Changelog - Signal Garden

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [Unreleased]

### Added
- Configuration complète pour le testnet Intuition
- Scripts de déploiement automatisés
- Documentation technique complète
- Guide de contribution

### Changed
- Refactorisation de la documentation
- Nettoyage des fichiers obsolètes
- Amélioration de la structure du projet

## [1.0.0] - 2025-01-XX

### Added
- **Smart Contracts**
  - PixelGarden.sol : Contrat principal avec grille 64x64
  - TrustMock.sol : Token ERC20 de test
  - Système de staking compétitif
  - Types de pixels alignés avec Intuition (SIGNAL, ATOM, TRIPLE)

- **Frontend**
  - Interface React moderne avec TypeScript
  - Grille interactive 64x64 avec React Konva
  - Intégration Wagmi v2 pour Web3
  - Design system avec TailwindCSS et Radix UI
  - Contrôles de zoom et navigation
  - Sélection visuelle des pixels avec animations

- **Configuration**
  - Support complet du testnet Intuition (Chain ID: 13579)
  - Configuration Hardhat optimisée
  - Scripts de déploiement automatisés
  - Variables d'environnement structurées

- **Fonctionnalités**
  - Connexion wallet (MetaMask, WalletConnect)
  - Staking de tokens TTRUST
  - Mise à jour temps réel de la grille
  - Interface responsive (desktop et mobile)
  - Notifications toast pour feedback utilisateur

### Technical Details
- **Stack Technique**
  - Solidity 0.8.24 avec OpenZeppelin
  - React 18 + TypeScript
  - Vite pour le build
  - Wagmi v2 + Viem pour Web3
  - React Konva pour le canvas
  - TailwindCSS pour le styling

- **Architecture**
  - Pattern Container/Layout/Feature
  - Hooks personnalisés pour la logique métier
  - Configuration modulaire
  - Tests unitaires pour les smart contracts

## [0.9.0] - 2025-01-XX

### Added
- Version initiale du projet
- Structure de base React + TypeScript
- Configuration Hardhat de base
- Smart contracts de base

### Changed
- Première implémentation de la grille
- Configuration initiale Wagmi

## [0.8.0] - 2025-01-XX

### Added
- Concept initial de Signal Garden
- Premiers smart contracts
- Interface de base

---

## 🔗 Liens

- [README.md](./README.md) - Vue d'ensemble du projet
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Guide de développement
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Guide de contribution

## 📝 Format des Entrées

### Types de Changements
- **Added** : Nouvelles fonctionnalités
- **Changed** : Changements dans les fonctionnalités existantes
- **Deprecated** : Fonctionnalités qui seront supprimées
- **Removed** : Fonctionnalités supprimées
- **Fixed** : Corrections de bugs
- **Security** : Améliorations de sécurité

### Exemples
```markdown
## [1.1.0] - 2025-01-XX

### Added
- Nouvelle fonctionnalité X
- Support pour Y

### Changed
- Amélioration de la performance Z
- Refactorisation du composant A

### Fixed
- Correction du bug B
- Résolution du problème C

### Security
- Correction de la vulnérabilité D
```

---

**🌱 Signal Garden - Évoluant avec l'écosystème Intuition**
