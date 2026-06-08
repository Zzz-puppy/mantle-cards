import { http, createConfig, createStorage, cookieStorage } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'

// Mantle Mainnet configuration
export const mantleMainnet = {
  id: 5000,
  name: 'Mantle Mainnet',
  network: 'mantle',
  nativeCurrency: {
    decimals: 18,
    name: 'Mantle',
    symbol: 'MNT',
  },
  rpcUrls: {
    default: { http: ['https://rpc.mantle.xyz'] },
    public: { http: ['https://rpc.mantle.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Mantle Explorer', url: 'https://explorer.mantle.xyz' },
  },
} as const

// Mantle Sepolia Testnet configuration
export const mantleSepolia = {
  id: 5003,
  name: 'Mantle Sepolia',
  network: 'mantle-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Mantle',
    symbol: 'MNT',
  },
  rpcUrls: {
    default: { http: ['https://rpc.sepolia.mantle.xyz'] },
    public: { http: ['https://rpc.sepolia.mantle.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Mantle Sepolia Explorer', url: 'https://sepolia.mantle.xyz' },
  },
} as const

// Define supported chains
export const supportedChains = [mantleMainnet, mantleSepolia] as const

// WalletConnect project ID from environment
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

// Create wagmi config
export const config = createConfig({
  chains: supportedChains,
  connectors: [
    injected({
      shimDisconnect: true,
    }),
    walletConnect({
      projectId: projectId || 'placeholder-project-id',
      metadata: {
        name: 'AI Trading Card Game',
        description: 'An AI-powered trading card game on Mantle Network',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://example.com',
        icons: ['https://avatars.githubusercontent.com/u/37784886'],
      },
      showQrModal: false, // We'll use our custom modal
    }),
    coinbaseWallet({
      appName: 'AI Trading Card Game',
      appLogoUrl: 'https://avatars.githubusercontent.com/u/37784886',
    }),
  ],
  transports: {
    [mantleMainnet.id]: http('https://rpc.mantle.xyz', {
      retryCount: 3,
      timeout: 10000,
    }),
    [mantleSepolia.id]: http('https://rpc.sepolia.mantle.xyz', {
      retryCount: 3,
      timeout: 10000,
    }),
  },
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
})

// Chain configurations map for easy access
export const chainConfigs = {
  [mantleMainnet.id]: {
    name: 'Mantle Mainnet',
    symbol: 'MNT',
    explorerUrl: 'https://explorer.mantle.xyz',
    isTestnet: false,
  },
  [mantleSepolia.id]: {
    name: 'Mantle Sepolia',
    symbol: 'MNT',
    explorerUrl: 'https://sepolia.mantle.xyz',
    isTestnet: true,
  },
} as const

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
