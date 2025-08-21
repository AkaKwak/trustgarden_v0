# 🌱 Signal Garden

**Jardin Collaboratif sur Intuition Network**  
*Token-curated landscape où chaque pixel devient un élément de jardin*

Un jardin collaboratif où les utilisateurs stakent des tokens TTRUST pour créer des éléments de jardin visuels sur une grille 64x64 partagée. Chaque pixel peut devenir de l'eau, des arbres, des fleurs, des rochers, et plus encore, créant un paysage dynamique et communautaire.

## 🎯 Vision

Signal Garden est un jardin collaboratif qui transforme le concept de token-curated knowledge en une expérience visuelle intuitive. Les utilisateurs stakent des tokens TTRUST pour créer des éléments de jardin concrets - eau, arbres, fleurs, rochers - créant un paysage dynamique où la valeur stakée se reflète dans la beauté du jardin.

## 🚀 Features

- **64x64 Jardin Grid**: Chaque pixel peut devenir un élément de jardin
- **8 Éléments Naturels**: Eau, Arbres, Fleurs, Rochers, Herbe, Sable, Buissons, Champignons
- **Staking Compétitif**: Plus de stake = élément plus dominant
- **Mise à jour Temps Réel**: Événements blockchain en direct
- **Interface Moderne**: Design glassmorphism responsive
- **Intégration Wallet**: Support MetaMask et WalletConnect
- **Couleurs Intuitives**: Bleu=Eau, Vert=Arbres, Blanc=Fleurs, Marron=Rochers

## 🛠 Tech Stack

- **Smart Contracts**: Solidity 0.8.24, OpenZeppelin
- **Frontend**: React 18, TypeScript, Vite
- **Web3**: Wagmi v2, Viem
- **UI**: TailwindCSS, Radix UI
- **Blockchain**: Intuition EVM-compatible testnet (Chain ID: 13579)
- **Token**: TTRUST (ERC20) sur Intuition testnet

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or compatible wallet
- Intuition testnet configured in wallet

## 🔧 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/AkaKwak/trustgarden_v0.git
cd trustgarden_v0
npm install
```

### 2. Environment Setup

```bash
cp env.example .env
```

Edit `.env` with your configuration:
```env
# Intuition Testnet Configuration
RPC_URL=https://api.intuition-testnet.gelato.digital
CHAIN_ID=88

# Contract Addresses (will be filled after deployment)
PIXEL_GARDEN_ADDRESS=
TRUST_TOKEN_ADDRESS=

# Deployment Account
PRIVATE_KEY=your_private_key_here

# Frontend Configuration
VITE_RPC_URL=https://api.intuition-testnet.gelato.digital
VITE_CHAIN_ID=88
VITE_PIXEL_GARDEN_ADDRESS=
VITE_TRUST_TOKEN_ADDRESS=
```

### 3. Deploy Smart Contracts

```bash
# Compile contracts
npx hardhat compile

# Deploy to Intuition testnet
npx hardhat run scripts/deploy-intuition.ts --network INTUITION_TESTNET
```

### 4. Update Environment Variables

After deployment, update your `.env` file with the contract addresses from the deployment output.

### 5. Start Frontend

```bash
npm run dev
```

Visit `http://localhost:5173` to interact with TrustGarden!

## 🎮 Comment Jouer

1. **Connecter Wallet**: Cliquer "Connect Wallet" et approuver la connexion
2. **Obtenir TTRUST**: Les tokens sont automatiquement mintés sur le testnet
3. **Sélectionner Pixel**: Cliquer sur n'importe quel pixel de la grille 64x64
4. **Choisir Élément**: Sélectionner parmi 8 éléments de jardin (eau, arbres, fleurs, etc.)
5. **Stake TRUST**: Enter the amount of TRUST tokens to stake
6. **Approve & Set**: Approve the token transfer and set the pixel
7. **Compete**: Higher stakes win! Watch the grid evolve in real-time

## 🏗 Smart Contract Architecture

### PixelGarden.sol

- **Grid**: 64x64 fixed-size pixel grid
- **States**: 14 canonical states with deterministic hashing
- **Staking**: Winner-takes-all by highest stake
- **Events**: PixelChanged events for real-time updates

### Key Functions

- `setPixel(x, y, state, amount)`: Stake TRUST tokens for a pixel state
- `getPixel(x, y)`: Get current state and stake for a pixel
- `getTopStates(x, y, k)`: Get top k states by stake for a pixel
- `getAllowedStates()`: Get list of all valid states

## 🎨 UI Components

- **Pixel Grid**: Interactive 64x64 grid with zoom controls
- **State Palette**: Radio buttons for selecting pixel states
- **Wallet Integration**: Connect/disconnect with transaction status
- **Real-time Updates**: Live blockchain event listening
- **Responsive Design**: Works on desktop and mobile

## 🔗 Blockchain Integration

- **Network**: Intuition EVM-compatible testnet (Chain ID: 88)
- **RPC**: https://api.intuition-testnet.gelato.digital
- **Explorer**: https://explorer.intuition-testnet.gelato.digital
- **Token**: TRUST (ERC20) - real token or TrustMock for development

## 🧪 Testing

### Local Testing

```bash
# Start local hardhat node
npx hardhat node

# Deploy contracts locally
npx hardhat run scripts/deploy-intuition.ts --network localhost

# Run tests
npx hardhat test
```

### Hardhat Tasks

```bash
# Set a pixel
npx hardhat set:pixel --contract 0x... --x 1 --y 1 --state "flower:red" --amount 1

# Get pixel info
npx hardhat pixel:get --contract 0x... --x 1 --y 1

# Approve TRUST tokens
npx hardhat approve:trust --contract 0x... --amount 100
```

## 🚀 Deployment

### Smart Contracts

```bash
# Deploy to Intuition testnet
npx hardhat run scripts/deploy-intuition.ts --network INTUITION_TESTNET

# Verify contracts (if supported)
npx hardhat verify --network INTUITION_TESTNET 0xCONTRACT_ADDRESS 64 64 0xTOKEN_ADDRESS
```

### Frontend

```bash
# Build for production
npm run build

# Deploy to Vercel/Netlify
npm run deploy
```

## 📊 Deliverables

- ✅ **Smart Contract**: PixelGarden.sol deployed on Intuition testnet
- ✅ **Frontend**: React app with modern UI and wallet integration
- ✅ **GitHub Repo**: Complete source code with documentation
- ✅ **Documentation**: This README with setup instructions

## 🎯 Hackathon Alignment

- **Token-Curated Knowledge**: Each pixel is an assertion curated by TRUST staking
- **Minimal & Fun**: Simple rules, engaging gameplay even with one user
- **Fast Shipping**: MVP delivered in hours, not weeks
- **Intuition Native**: Built specifically for Intuition's testnet and token model

## 🤝 Contributing

This is a hackathon submission. For questions or issues:

1. Check the [Issues](../../issues) page
2. Review the [Pull Requests](../../pulls)
3. Contact the team

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

---

**Built with ❤️ for Intuition Network Hackathon 2025**
