import { createConfig, http } from 'wagmi'
import { mainnet, sepolia, polygon, arbitrum, optimism } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// Intuition Testnet (depuis votre hardhat.config.ts)
export const intuitionTestnet = {
  id: 88,
  name: 'Intuition Testnet',
  network: 'intuition-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://api.intuition-testnet.gelato.digital'] },
    default: { http: ['https://api.intuition-testnet.gelato.digital'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.intuition-testnet.gelato.digital' },
  },
} as const

// Configuration des chaînes supportées - Intuition Testnet en premier !
export const config = createConfig({
  chains: [intuitionTestnet, sepolia, mainnet, polygon, arbitrum, optimism],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'your-project-id',
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
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
