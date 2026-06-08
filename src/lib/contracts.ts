import { mantleMainnet, mantleSepolia } from './wagmi-config'

// Contract addresses
export const CONTRACT_ADDRESSES = {
  [mantleMainnet.id]: {
    MantleCards: '0x0000000000000000000000000000000000000000', // Placeholder - needs deployment
  },
  [mantleSepolia.id]: {
    MantleCards: '0x0000000000000000000000000000000000000000', // Placeholder - needs deployment
  },
} as const

// ABI definitions
export const MANTLE_CARDS_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'name', type: 'string' },
      { name: 'rarity', type: 'uint8' },
      { name: 'attack', type: 'uint256' },
      { name: 'defense', type: 'uint256' },
      { name: 'specialAbility', type: 'string' },
      { name: 'imageURI', type: 'string' },
      { name: 'baseToken', type: 'string' },
      { name: 'tokenBalance', type: 'uint256' },
      { name: 'transactionCount', type: 'uint256' },
    ],
    name: 'mintCard',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getCardAttributes',
    outputs: [
      { name: 'name', type: 'string' },
      { name: 'rarity', type: 'uint8' },
      { name: 'attack', type: 'uint256' },
      { name: 'defense', type: 'uint256' },
      { name: 'specialAbility', type: 'string' },
      { name: 'imageURI', type: 'string' },
      { name: 'baseToken', type: 'string' },
      { name: 'tokenBalance', type: 'uint256' },
      { name: 'transactionCount', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getUserCards',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'imageURI', type: 'string' },
    ],
    name: 'setCardImage',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getCardImage',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalMinted',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'exists',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'rarity', type: 'uint8' }],
    name: 'getRarityString',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'attack', type: 'uint256' },
      { name: 'defense', type: 'uint256' },
      { name: 'specialAbility', type: 'string' },
    ],
    name: 'updateCardAttributes',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'tokenId', type: 'uint256' },
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: false, name: 'name', type: 'string' },
      { indexed: false, name: 'rarity', type: 'uint8' },
      { indexed: false, name: 'attack', type: 'uint256' },
      { indexed: false, name: 'defense', type: 'uint256' },
      { indexed: false, name: 'specialAbility', type: 'string' },
    ],
    name: 'CardMinted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'tokenId', type: 'uint256' },
      { indexed: false, name: 'imageURI', type: 'string' },
    ],
    name: 'CardImageUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'tokenId', type: 'uint256' },
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
    ],
    name: 'CardTransferred',
    type: 'event',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// Rarity mapping
export const RARITY_VALUES = {
  common: 0,
  rare: 1,
  epic: 2,
  legendary: 3,
} as const

export const RARITY_STRINGS = ['common', 'rare', 'epic', 'legendary'] as const

// Contract function signatures
export const CONTRACT_FUNCTIONS = {
  MINT_CARD: 'mintCard',
  GET_CARD_ATTRIBUTES: 'getCardAttributes',
  GET_USER_CARDS: 'getUserCards',
  SET_CARD_IMAGE: 'setCardImage',
  GET_CARD_IMAGE: 'getCardImage',
  GET_TOTAL_MINTED: 'getTotalMinted',
  EXISTS: 'exists',
  GET_RARITY_STRING: 'getRarityString',
  UPDATE_CARD_ATTRIBUTES: 'updateCardAttributes',
} as const

// Get contract address by chain ID
export function getContractAddress(chainId: number): `0x${string}` {
  const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!addresses?.MantleCards) {
    throw new Error(`Contract not configured for chain ID: ${chainId}`)
  }
  return addresses.MantleCards
}

// Check if contract is deployed on chain
export function isContractDeployed(chainId: number): boolean {
  const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!addresses?.MantleCards) return false
  return addresses.MantleCards !== '0x0000000000000000000000000000000000000000'
}
