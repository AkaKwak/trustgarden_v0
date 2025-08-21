import { createConfig, http } from 'wagmi'
import { mainnet, sepolia, polygon, arbitrum, optimism } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// Intuition Testnet Configuration
export const intuitionTestnet = {
  id: 13579,
  name: 'Intuition Testnet',
  network: 'intuition-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Testnet TRUST',
    symbol: 'TTRUST',
  },
  rpcUrls: {
    public: { 
      http: [
        import.meta.env.VITE_RPC_URL || 'https://testnet.rpc.intuition.systems'
      ] 
    },
    default: { 
      http: [
        import.meta.env.VITE_RPC_URL || 'https://testnet.rpc.intuition.systems'
      ] 
    },
  },
  blockExplorers: {
    default: { 
      name: 'IntuitionScan (Testnet)', 
      url: 'https://testnet.explorer.intuition.systems/' 
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 1,
    },
    // Adresses des contrats (à mettre à jour après déploiement)
    trustToken: {
      address: '0x0000000000000000000000000000000000000000',
    },
    pixelGarden: {
      address: '0x0000000000000000000000000000000000000000',
    },
  },
} as const

// Configuration pour l'application
export const APP_CONFIG = {
  CHAIN_ID: 13579,
  RPC_URL: 'https://testnet.rpc.intuition.systems',
  EXPLORER_URL: 'https://testnet.explorer.intuition.systems/',
  TOKEN_SYMBOL: 'TTRUST',
  GRID_SIZE: 64,
  contracts: {
    trustToken: '0x0000000000000000000000000000000000000000',
    pixelGarden: '0x0000000000000000000000000000000000000000',
  },
}

// Configuration des chaînes supportées - Intuition Testnet en premier !
export const config = createConfig({
  chains: [intuitionTestnet, sepolia, mainnet, polygon, arbitrum, optimism],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '1234567890abcdef1234567890abcdef',
    }),
  ],
  transports: {
    [intuitionTestnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
  },
  ssr: false, // Disable SSR for better compatibility
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
