import type { Card, CardRarity } from '@/types/card'
import type { WalletPortfolio } from './mantle-data'
import { generateCardAttributes, generateCardImageURL } from './card-generator'

// Mock mode toggle
let _useMockData = true

export function setMockMode(enabled: boolean): void {
  _useMockData = enabled
}

export function isMockMode(): boolean {
  return _useMockData
}

// Sample wallet portfolios for testing
export const MOCK_PORTFOLIOS: Record<string, WalletPortfolio> = {
  whale: {
    address: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    mntBalance: BigInt('10000000000000000000'), // 10 MNT
    erc20Tokens: [
      {
        address: '0x1234567890123456789012345678901234567891' as `0x${string}`,
        symbol: 'USDC',
        decimals: 6,
        balance: BigInt('5000000000'), // 5000 USDC
      },
      {
        address: '0x1234567890123456789012345678901234567892' as `0x${string}`,
        symbol: 'WETH',
        decimals: 18,
        balance: BigInt('2000000000000000000'), // 2 ETH
      },
    ],
    transactionCount: 1500,
    totalGasSpent: BigInt('5000000000000000000'), // 5 MNT gas
    totalValueUsd: 15000,
  },
  midTier: {
    address: '0x2345678901234567890123456789012345678901' as `0x${string}`,
    mntBalance: BigInt('1000000000000000000'), // 1 MNT
    erc20Tokens: [
      {
        address: '0x2345678901234567890123456789012345678902' as `0x${string}`,
        symbol: 'USDC',
        decimals: 6,
        balance: BigInt('500000000'), // 500 USDC
      },
    ],
    transactionCount: 200,
    totalGasSpent: BigInt('1000000000000000000'), // 1 MNT gas
    totalValueUsd: 1500,
  },
  small: {
    address: '0x3456789012345678901234567890123456789012' as `0x${string}`,
    mntBalance: BigInt('100000000000000000'), // 0.1 MNT
    erc20Tokens: [],
    transactionCount: 10,
    totalGasSpent: BigInt('10000000000000000'), // 0.01 MNT gas
    totalValueUsd: 50,
  },
}

// Sample cards for testing
export const MOCK_CARDS: Card[] = [
  {
    id: BigInt(1),
    name: 'Divine Oracle of Wisdom',
    rarity: 'legendary',
    attack: 85,
    defense: 90,
    specialAbility: 'Omniscient: See opponent\'s hand and counter their strongest card',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=1-legendary',
    owner: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    mintedAt: Date.now() - 86400000 * 30, // 30 days ago
    baseToken: 'MNT',
    tokenBalance: BigInt('10000000000000000000'),
    transactionCount: 1500,
  },
  {
    id: BigInt(2),
    name: 'Knight of Eternal Flame',
    rarity: 'epic',
    attack: 70,
    defense: 65,
    specialAbility: 'Phoenix Strike: Deal 50% damage and recover health',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=2-epic',
    owner: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    mintedAt: Date.now() - 86400000 * 20, // 20 days ago
    baseToken: 'MNT',
    tokenBalance: BigInt('1000000000000000000'),
    transactionCount: 200,
  },
  {
    id: BigInt(3),
    name: 'Guardian of the Void',
    rarity: 'rare',
    attack: 45,
    defense: 55,
    specialAbility: 'Void Shield: Block the next special ability',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=3-rare',
    owner: '0x2345678901234567890123456789012345678901' as `0x${string}`,
    mintedAt: Date.now() - 86400000 * 10, // 10 days ago
    baseToken: 'MNT',
    tokenBalance: BigInt('500000000000000000'),
    transactionCount: 100,
  },
  {
    id: BigInt(4),
    name: 'Apprentice of Power',
    rarity: 'common',
    attack: 20,
    defense: 25,
    specialAbility: 'Quick Strike: Attack first in battle',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=4-common',
    owner: '0x3456789012345678901234567890123456789012' as `0x${string}`,
    mintedAt: Date.now() - 86400000 * 5, // 5 days ago
    baseToken: 'MNT',
    tokenBalance: BigInt('100000000000000000'),
    transactionCount: 10,
  },
]

// Generate a mock card from portfolio
export function generateMockCard(portfolio: WalletPortfolio): Card {
  const attributes = generateCardAttributes(portfolio)
  const tokenId = BigInt(Math.floor(Math.random() * 1000000))
  
  return {
    id: tokenId,
    name: attributes.name,
    rarity: attributes.rarity,
    attack: attributes.attack,
    defense: attributes.defense,
    specialAbility: attributes.specialAbility,
    image: generateCardImageURL(Number(tokenId), attributes.rarity),
    owner: portfolio.address,
    mintedAt: Date.now(),
    baseToken: attributes.baseToken,
    tokenBalance: attributes.tokenBalance,
    transactionCount: attributes.transactionCount,
  }
}

// Get mock cards for an address
export function getMockCardsForAddress(address: `0x${string}`): Card[] {
  return MOCK_CARDS.filter(card => card.owner.toLowerCase() === address.toLowerCase())
}

// Simulate minting delay
export function simulateMintDelay(): Promise<{ hash: string; card: Card }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomPortfolio = Object.values(MOCK_PORTFOLIOS)[Math.floor(Math.random() * Object.values(MOCK_PORTFOLIOS).length)]
      const card = generateMockCard(randomPortfolio)
      const hash = `0x${Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`
      
      resolve({ hash, card })
    }, 2000) // 2 second delay
  })
}

// Mock transaction submission
export async function submitMockMintTransaction(
  portfolio: WalletPortfolio
): Promise<{ hash: string; card: Card }> {
  // Check if using mock mode
  if (!isMockMode()) {
    throw new Error('Not in mock mode')
  }

  // Simulate blockchain confirmation time
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  return simulateMintDelay()
}

// Mock wallet connection check
export function isWalletConnected(): boolean {
  if (!isMockMode()) return false
  return true
}

// Get default mock portfolio
export function getDefaultMockPortfolio(): WalletPortfolio {
  return MOCK_PORTFOLIOS.midTier
}

// Create a mock portfolio for testing
export function createMockPortfolio(params: {
  mntBalance?: bigint
  erc20Count?: number
  txCount?: number
  gasSpent?: bigint
}): WalletPortfolio {
  return {
    address: '0xMockAddress000000000000000000000000000' as `0x${string}`,
    mntBalance: params.mntBalance || BigInt('1000000000000000000'),
    erc20Tokens: Array.from({ length: params.erc20Count || 0 }, (_, i) => ({
      address: `0x${i.toString().padStart(40, '0')}` as `0x${string}`,
      symbol: `TOKEN${i}`,
      decimals: 18,
      balance: BigInt('1000000000000000000'),
    })),
    transactionCount: params.txCount || 100,
    totalGasSpent: params.gasSpent || BigInt('100000000000000000'),
    totalValueUsd: Number(params.mntBalance || BigInt('1000000000000000000')) / 1e18 * 0.5,
  }
}
