/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string
  readonly VITE_CONTRACT_ADDRESS: string
  readonly VITE_TRUST_TOKEN_ADDRESS: string
  readonly VITE_RPC_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
