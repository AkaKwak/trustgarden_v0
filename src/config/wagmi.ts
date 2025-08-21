import { createConfig, http } from 'wagmi'
import { mainnet, sepolia, polygon, arbitrum, optimism } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'
import { intuitionTestnet } from './intuition'

// Configuration pour l'application
export const APP_CONFIG = {
  CHAIN_ID: 13579,
  RPC_URL: 'https://testnet.rpc.intuition.systems',
  EXPLORER_URL: 'https://testnet.explorer.intuition.systems/',
  TOKEN_SYMBOL: 'TTRUST',
  GRID_SIZE: 64,
  contracts: {
    trustToken: import.meta.env.VITE_TRUST_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
    pixelGarden: import.meta.env.VITE_PIXEL_GARDEN_ADDRESS || '0x0000000000000000000000000000000000000000',
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
